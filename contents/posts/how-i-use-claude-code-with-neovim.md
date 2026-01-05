---
title: How I Use Claude Code with NeoVim
description: I created an MCP which allows Claude Code to see my NeoVim context and reflect changes.
new_slug: using-claude-code-with-neovim
published: true
tags:
- dev
- tips
published_at: 1736121600000
---

<video src="/videos/posts/nvim-mcp.mp4" autoplay controls loop muted></video>

I use Claude Code a lot. Mostly as an assistant, rather than an agent (ie. a turn-by-turn approach rather than letting it run amok).

I run a tmux window with split panes for each project. One pane runs NeoVim. The other has multiple splits running Claude Code, dev server, test watcher, etc.

I often want to say things like "Address the FIXME comments in this file" or "Explain the function implementation in line 432" to Claude Code based on the current file I've opened in Vim. However, it isn't aware of my Vim session. So I have to spell out the exact file path or let it waste a few cycles grepping for the file I want to edit. This is annoying.

One evening during the Christmas break, I asked Claude Code "How can I get paths of all currently active Vim buffers?"

After a few rounds of "Reticulating...", I learned that NeoVim provides an [RPC API](https://neovim.io/doc/user/api.html) to interact with each instance. By default, it [creates a socket to listen](https://neovim.io/doc/user/starting.html#startup) at startup. You can run `echo v:servername` in the current NeoVim session to get the socket path.

Once you know the socket path, you can interact with the instance using the RPC API. For example, to get its current working directory:

```
nvim --server "/path/to/socket" --remote-expr "getcwd()"
```

Claude Code came up with a bash script that prints out nvim instances running in the current working directory and their buffer paths.

This was a good start. Next, I needed to make Claude Code aware of this context. After reading about Claude Code's hooks, MCP, and plugins—MCP felt like the way to go.

Claude Code implemented a fully working MCP server with tests in JavaScript. It uses the [NeoVim JS client](https://www.npmjs.com/package/neovim).

It provides the following resources and tools:

### Resources (Auto-available Context)

- **`nvim://current-buffer`** - Currently active buffer with path and content
- **`nvim://open-buffers`** - List of all open buffers with metadata

### Tools (Claude Can Invoke)

- **`list_nvim_buffers()`** - List all open buffers in nvim instances running in current directory
- **`get_current_buffer()`** - Get the currently active buffer
- **`get_buffer_content(path)`** - Get content of a specific buffer by path
- **`update_buffer(path, content)`** - Update buffer content directly in nvim (changes appear immediately!)
- **`open_file(path)`** - Open a file in nvim (useful after creating new files)
- **`reload_buffer(path)`** - Reload a buffer from disk
- **`reload_all_buffers()`** - Check and reload all buffers that changed on disk

I published the [MCP server to npm](https://www.npmjs.com/package/nvim-mcp-server). Then I installed it:

```
claude mcp add --transport stdio nvim -- npx nvim-mcp-server
```

In a new Claude Code session, I asked "implement the TODO comment in the file I'm editing". It requested permission for the `get_current_buffer` tool, correctly identified the file I was working on, and proceeded to do its magic.

This quality of life improvement has made my Claude Code sessions extremely productive. I hadn't known much about NeoVim's RPC API or written an MCP server before, yet landed on a fully working solution in a few hours.

I have only tested it with NeoVim 0.11+ on MacOS (15 and 26). You can probably get it to work in other environments as well. PRs are welcome: https://github.com/laktek/nvim-mcp-server
