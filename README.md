# pr-story

[![CI](https://github.com/niuxinhuai/pr-story/actions/workflows/ci.yml/badge.svg)](https://github.com/niuxinhuai/pr-story/actions/workflows/ci.yml)

Turn an unstructured git diff into a concise PR story with risk notes and verification suggestions.

把零散的 git diff 转成适合 reviewer 快速阅读的 PR 导读、风险提示和验证建议。

## English

### Install

```bash
npm install -g pr-story
```

For local development:

```bash
npm install
npm link
pr-story --help
```

### Usage

Run it in a git repository before opening or reviewing a PR.

```bash
pr-story
pr-story --base main
pr-story --staged --json
```

### Status

This is an MVP designed to be useful immediately and easy to extend. It has no runtime dependencies and targets Node.js 18+.

### Test

```bash
npm test
```

## 中文

### 安装

```bash
npm install -g pr-story
```

本地开发：

```bash
npm install
npm link
pr-story --help
```

### 用法

在 Git 仓库中运行，用于创建 PR 前或代码评审前快速理解改动。

```bash
pr-story
pr-story --base main
pr-story --staged --json
```

### 当前状态

这是一个可以直接使用的 MVP，重点是小、清晰、容易二次开发。运行时无第三方依赖，要求 Node.js 18+。

### 测试

```bash
npm test
```

## License

MIT
