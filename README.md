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
- ✅ Deploy SessionStart hook for automatic loading
- ✅ Ready to use

### 3. Automatic Memory Loading

**Every new conversation, memories load automatically!** ✨

The SessionStart hook triggers on session start and instructs the AI to call `load_session`, loading:
- Your identity and role
- Preferences and habits
- Project context
- All triggered memories

**No manual action needed** - just start chatting!

---

## How It Works

**First Time Setup (Automatic)**:
1. You add MCP server to config and restart
2. MCP detects it's the first run
3. Auto-deploys:
   - `/init-memory` skill to `~/.claude/commands/`
   - SessionStart hook script to `~/.claude/hooks/session-start.py`
   - Hook configuration to `~/.claude/settings.json`
4. Done!

**Every Session After**:
- New conversation starts
- SessionStart hook runs automatically
- Hook outputs `hookSpecificOutput` with instruction
- AI receives context: "call load_session immediately"
- Memories load seamlessly
- AI greets you with proper context

**Inspired by**: [Trellis](https://github.com/mindfold-ai/Trellis) - proven SessionStart hook pattern

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
| `init(namespace, target?, includeHook?)` | **【首次安装】** 手动部署 skill 和 hook 到指定环境（通常自动完成，无需手动调用） |
| `reset_init()` | **【测试/重置】** 重置自动初始化标记，允许下次重新部署 |

### Auto-Initialization (Default Behavior)

**First run**: MCP server automatically detects your environment and deploys configuration.

**What gets deployed**:
- Skill file: `~/.claude/commands/init-memory.md` (or equivalent for your AI)
- Hook script: `~/.claude/hooks/session-start.py`
- Hook config: `~/.claude/settings.json` with SessionStart hook
- Marker file: `~/.xmszm-memory/.auto-init-done` (prevents re-initialization)

**Manual override**: Use `init()` tool if you need to:
- Deploy to a different namespace
- Deploy to specific environments only
- Re-deploy after changing settings
- Deploy without hooks (`includeHook: false`)

### Usage Pattern

**Every new conversation**:
1. SessionStart hook runs automatically
2. AI receives instruction to call `load_session`
3. All triggered memories are loaded
4. AI responds with proper context

**No manual action needed!** ✨

### Tool Details

#### `init` - Manual Deployment (Optional)

```typescript
// Auto-detect and deploy to current environment (with hooks)
init({ namespace: "xmszm" })

// Deploy to all detected environments
init({ namespace: "xmszm", target: "all" })

// Deploy without auto-loading hook (manual /init-memory only)
init({ namespace: "xmszm", includeHook: false })

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
