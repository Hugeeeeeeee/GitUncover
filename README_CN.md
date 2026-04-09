# GitUncover

> 停止指责，开始理解。

<div align="right">
  <a href="README.md" style="display: inline-block; padding: 8px 16px; background-color: #f5f5f5; border: 1px solid #ddd; border-radius: 4px; text-decoration: none; color: #333; font-size: 16px; font-weight: 500;">English</a>
</div>

<div align="center">
  <h1 style="font-size: 48px; margin: 0;">🕵️ GitUncover</h1>
  <p style="font-size: 20px; color: #666; margin: 10px 0 30px 0;">停止指责，开始理解。</p>
  <a href="https://github.com/Hugeeeeeeee/GitUncover/stargazers"><img src="https://img.shields.io/github/stars/Hugeeeeeeee/GitUncover" alt="GitHub stars"></a>
  <a href="https://github.com/Hugeeeeeeee/GitUncover/issues"><img src="https://img.shields.io/github/issues/Hugeeeeeeee/GitUncover" alt="GitHub issues"></a>
  <a href="https://github.com/Hugeeeeeeee/GitUncover/blob/main/LICENSE"><img src="https://img.shields.io/github/license/Hugeeeeeeee/GitUncover" alt="GitHub license"></a>
  <a href="https://github.com/Hugeeeeeeee/GitUncover/forks"><img src="https://img.shields.io/github/forks/Hugeeeeeeee/GitUncover" alt="GitHub forks"></a>
</div>

## 🌟 核心概念

"不仅告诉你哪里错了，还告诉你谁埋的雷，以及为什么埋的"。

GitUncover是一个AI驱动的工具，超越了传统的git blame功能，提供代码决策背后的上下文和理解，帮助开发者自信地导航遗留代码库。

## 🚀 功能特性

### 深度挖掘分析
- 分析代码的历史上下文
- 追踪代码变更的整个生命周期
- 理解代码决策背后的"为什么"

### 关联分析
- 连接GitHub issues和PRs
- 提供相关讨论的上下文
- 显示谁写了什么以及为什么

### "防背锅"模式
- 为重构生成全面的报告
- 在进行更改前记录代码推理
- 避免意外的副作用

### 多IDE支持
- VS Code（完全支持）
- IntelliJ IDEA（开发中）
- Sublime Text（开发中）
- Atom（开发中）

### 智能缓存
- 减少重复分析
- 提高性能
- 节省API成本

### 多种输出格式
- 终端的文本格式
- 自动化的JSON格式
- IDE扩展的丰富UI

### 配置系统
- 通过配置文件自定义设置
- 环境变量支持
- 轻松重置为默认值

## 📖 使用场景

### 1. 遗留代码理解
当你继承一个包含复杂或令人困惑代码的项目时，GitUncover帮助你理解：
- 谁写了代码
- 何时以及为什么写的
- 它解决了什么问题
- 它如何随时间演变

### 2. 代码审查增强
在代码审查期间，GitUncover提供：
- 拟议变更的上下文
- 现有代码的历史视角
- 修改的潜在风险
- 改进建议

### 3. 重构安全
在重构之前，GitUncover：
- 记录当前状态和推理
- 识别潜在依赖
- 提供防止破坏变更的安全网
- 生成前后分析

## 🛠️ 安装

### 先决条件
- Node.js 16.0或更高版本
- Git
- OpenAI API密钥（用于AI分析）
- GitHub令牌（可选，用于GitHub集成）

### 快速开始

```bash
# 克隆仓库
git clone https://github.com/yourusername/GitUncover.git

# 安装依赖
cd GitUncover
npm install

# 设置环境变量
export OPENAI_API_KEY=your_api_key
export GITHUB_TOKEN=your_github_token (可选)

# 开始使用GitUncover
gituncover --help
```

## 📚 使用方法

### 终端

```bash
# 分析文件中的代码
gituncover analyze path/to/file.js --lines 10-20

# 分析整个文件
gituncover analyze path/to/file.js

# 以JSON格式输出
gituncover analyze path/to/file.js --format json

# 显示GitUncover信息
gituncover info

# 管理配置
gituncover config --list  # 显示当前配置
gituncover config --reset # 重置为默认配置
```

### IDE集成

#### VS Code
1. 安装GitUncover扩展
2. 选择代码并右键
3. 选择"GitUncover: 分析这段代码"
4. 查看交互式分析结果

#### 其他IDE
查看[IDE集成](https://github.com/Hugeeeeeeee/GitUncover/tree/main/ide-integrations)目录获取设置说明。

## 🎨 演示

<div align="center">
  <div style="background-color: #f5f5f5; border-radius: 8px; padding: 30px; max-width: 600px; margin: 0 auto;">
    <h3 style="color: #3498db; margin-top: 0;">🕵️ GitUncover 分析演示</h3>
    <div style="background-color: #2d2d2d; color: #f8f8f2; padding: 15px; border-radius: 4px; font-family: 'Courier New', monospace; text-align: left; margin: 20px 0;">
      <pre style="margin: 0;">分析的代码:
function calculateTotal(prices) {
  let total = 0;
  for (let i = 0; i < prices.length; i++) {
    total += prices[i];
  }
  return total;
}

Blame 信息:
Line 1: John Doe (2026-04-01)
Commit: abc1234
Message: Add calculateTotal function

AI 分析:
这个函数计算价格数组的总和。
它使用简单的 for 循环遍历数组。

建议:
- 考虑使用 Array.reduce() 使代码更简洁
- 在循环中缓存 array.length 以提高性能</pre>
    </div>
    <p style="color: #666; margin-bottom: 0;">具有历史上下文和 AI 洞察的交互式分析</p>
  </div>
</div>

## 🤝 贡献

我们欢迎社区的贡献！以下是你可以帮助的方式：

1. **给项目加星** ⭐
2. **分叉仓库** 🍴
3. **提交问题** 报告错误和功能请求
4. **创建拉取请求** 进行改进
5. **分享项目** 给你的网络

## 🌟 为什么选择GitUncover？

- **情感共鸣**：将指责转化为理解
- **实用价值**：节省导航遗留代码的时间
- **开发者友好**：直观的界面和清晰的输出
- **AI驱动**：利用尖端的语言模型
- **可扩展**：支持多种IDE和使用场景

## 📄 许可证

GitUncover采用MIT许可证 - 详见[LICENSE](LICENSE)文件。

## 🙏 致谢

- 使用[OpenAI](https://openai.com/)构建
- 使用[simple-git](https://github.com/steveukx/git-js)
- 灵感来自导航遗留代码库的痛苦

---

<div align="center">
  <h3>准备好停止指责，开始理解了吗？</h3>
  <p>给这个仓库加星 ⭐ 并加入GitUncover社区！</p>
  <a href="https://github.com/Hugeeeeeeee/GitUncover/stargazers" style="display: inline-block; padding: 12px 24px; background-color: #3498db; color: white; border-radius: 4px; text-decoration: none; font-weight: bold;">在GitHub上加星</a>
</div>