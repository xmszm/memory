# memory

Personal MCP memory server. Multi-user, file-backed, cross-platform.

Each user gets an isolated namespace. Memories persist across sessions within the namespace.

## Quick Start

### 1. Install MCP Server

```bash
# Add to your MCP client config (claude.json, cursor settings, etc.)
{
  "mcpServers": {
    "xmszm-memory": {
      "command": "npx",
      "args": ["-y", "@xmszm/memory"]
    }
  }
}
```

### 2. Restart Your AI Environment

**That's it!** 🎉

On first run, the MCP server will:
- ✅ Auto-detect your AI environment (Claude Code / Cursor / Windsurf / Cline)
- ✅ Deploy `/init-memory` skill
- ✅ Ready to use

### 3. Load Memories

Every new conversation, simply type:

```
/init-memory
```

Or just say: **"Please load my memories"**

---

## How It Works

**First Time Setup (Automatic)**:
1. You add MCP server to config and restart
2. MCP detects it's the first run
3. Auto-deploys `/init-memory` skill to your environment
4. Done!

**Every Session After**:
- Start a new conversation
- Type `/init-memory` or say "load my memories"
- Your identity, preferences, and context are loaded
- AI greets you with proper context

---

## Usage

### Requirements

- Node.js >= 18 (if installed via npm)
- No installation needed if using `npx`

### stdio mode (for MCP clients)

```bash
npx -y @xmszm/memory
```

### SSE mode (HTTP server, background service)

```bash
npx -y @xmszm/memory sse
npx -y @xmszm/memory sse 3000
```

### Hermes Configuration

```json
{
  "mcpServers": {
    "xmszm-memory": {
      "command": "npx",
      "args": ["-y", "@xmszm/memory"]
    }
  }
}
```

### Claude Code Configuration (claude.json)

```json
{
  "mcpServers": {
    "xmszm-memory": {
      "command": "npx",
      "args": ["-y", "@xmszm/memory"]
    }
  }
}
```

### Cursor / Windsurf / Any MCP Client

Most MCP-compatible clients accept the same format:

```json
{
  "mcpServers": {
    "xmszm-memory": {
      "command": "npx",
      "args": ["-y", "@xmszm/memory"]
    }
  }
}
```

## Tools

| Tool | Description |
|------|-------------|
| `load_session(namespace)` | **【会话启动】** 一次性加载所有触发记忆的完整内容 |
| `save(namespace, key, content, disclosure?)` | Save a memory |
| `read(namespace, key)` | Read a memory |
| `search(namespace, query)` | Search memories by keyword |
| `delete(namespace, key)` | Delete a memory |
| `get_triggered(namespace)` | 返回所有带触发条件的记忆（只返回 key + disclosure，不返回 content） |
| `list_namespaces()` | List all users |
| `init(namespace, target?)` | **【首次安装】** 手动部署 skill 到指定环境（通常自动完成，无需手动调用） |
| `reset_init()` | **【测试/重置】** 重置自动初始化标记，允许下次重新部署 |

### Auto-Initialization (Default Behavior)

**First run**: MCP server automatically detects your environment and deploys `/init-memory` skill.

**What gets deployed**:
- Skill file: `~/.claude/commands/init-memory.md` (or equivalent for your AI)
- Marker file: `~/.xmszm-memory/.auto-init-done` (prevents re-initialization)

**Manual override**: Use `init()` tool if you need to:
- Deploy to a different namespace
- Deploy to specific environments only
- Re-deploy after changing settings

### Usage Pattern

**Every new conversation**:
1. Type `/init-memory` or say "load my memories"
2. AI calls `load_session(namespace="your-name")`
3. All triggered memories are loaded
4. AI responds with proper context

**Why not automatic?**
Due to technical limitations in Claude Code hooks, automatic loading on conversation start is not possible. But `/init-memory` is quick and easy!

### Tool Details

#### `init` - Manual Deployment (Optional)

```typescript
// Auto-detect and deploy to current environment
init({ namespace: "xmszm" })

// Deploy to all detected environments
init({ namespace: "xmszm", target: "all" })

// Supported environments: claude-code, cursor, windsurf, cline
```

## Data

Stored in `~/.xmszm/memory/` as one JSON file per namespace.

```bash
# View all your memories
cat ~/.xmszm/memory/admin.json
```

## License

MIT

Built from the design philosophy of [Nocturne Memory](https://github.com/Dataojitori/nocturne_memory) by NeuronActivation.
