import { spawn } from "child_process";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

async function test() {
  const child = spawn("node", [join(__dirname, "dist/index.js")], {
    stdio: ["pipe", "pipe", "inherit"],
  });

  // MCP uses JSON-RPC over stdin/stdout
  let buffer = "";
  let msgId = 1;

  function send(method, params = {}) {
    const id = msgId++;
    const msg = JSON.stringify({ jsonrpc: "2.0", id, method, params }) + "\n";
    child.stdin.write(msg);
    return id;
  }

  function waitForResponse(id) {
    return new Promise((resolve) => {
      function onData(data) {
        buffer += data.toString();
        const lines = buffer.split("\n");
        for (const line of lines.slice(0, -1)) {
          if (!line.trim()) continue;
          try {
            const resp = JSON.parse(line);
            if (resp.id === id) {
              buffer = lines[lines.length - 1];
              resolve(resp);
              return;
            }
          } catch {}
        }
        // Keep waiting if we haven't found the response
      }
      child.stdout.on("data", onData);
      setTimeout(() => {
        child.stdout.removeListener("data", onData);
        child.kill();
        resolve(null);
      }, 5000);
    });
  }

  // Initialize
  send("initialize", {
    protocolVersion: "2024-11-05",
    capabilities: {},
    clientInfo: { name: "test", version: "1.0" },
  });
  const initResp = await waitForResponse(1);
  console.log("初始化:", initResp ? "OK" : "失败");

  // Send initialized notification
  child.stdin.write(JSON.stringify({ jsonrpc: "2.0", method: "notifications/initialized" }) + "\n");

  // List tools
  send("tools/list");
  const listResp = await waitForResponse(2);
  if (listResp?.result?.tools) {
    console.log(`\n工具列表 (${listResp.result.tools.length} 个):`);
    for (const t of listResp.result.tools) {
      console.log(`  → ${t.name}`);
    }
  }

  // Save a memory
  send("tools/call", {
    name: "save",
    arguments: {
      namespace: "admin",
      key: "test/hello",
      content: "世界你好",
      disclosure: "当测试时",
    },
  });
  const saveResp = await waitForResponse(3);
  console.log(`\n保存: ${saveResp?.result?.content?.[0]?.text}`);

  // Read it back
  send("tools/call", {
    name: "read",
    arguments: { namespace: "admin", key: "test/hello" },
  });
  const readResp = await waitForResponse(4);
  console.log(`读取: ${readResp?.result?.content?.[0]?.text}`);

  child.kill();
  process.exit(0);
}

test().catch(console.error);
