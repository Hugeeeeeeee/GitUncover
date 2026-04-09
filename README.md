# GitUncover

> Stop blaming, start understanding.

<div align="center">
  <img src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=GitUncover%20logo%20with%20magnifying%20glass%20and%20git%20icon&image_size=square" alt="GitUncover" width="300" height="300">
  <br>
  <br>
  <a href="https://github.com/Hugeeeeeeee/GitUncover/stargazers"><img src="https://img.shields.io/github/stars/Hugeeeeeeee/GitUncover" alt="GitHub stars"></a>
  <a href="https://github.com/Hugeeeeeeee/GitUncover/issues"><img src="https://img.shields.io/github/issues/Hugeeeeeeee/GitUncover" alt="GitHub issues"></a>
  <a href="https://github.com/Hugeeeeeeee/GitUncover/blob/main/LICENSE"><img src="https://img.shields.io/github/license/Hugeeeeeeee/GitUncover" alt="GitHub license"></a>
  <a href="https://github.com/Hugeeeeeeee/GitUncover/forks"><img src="https://img.shields.io/github/forks/Hugeeeeeeee/GitUncover" alt="GitHub forks"></a>
</div>

## 🌟 Core Concept

"Not only tell you what's wrong, but also who planted the mine and why."

GitUncover is an AI-powered tool that goes beyond traditional git blame by providing context and understanding behind code decisions, helping developers navigate legacy codebases with confidence. It combines git history analysis, GitHub integration, and AI-powered code analysis to provide a comprehensive view of code evolution and intent.

## 🚀 Features

### Deep Dive Analysis
- Analyze code with historical context
- Trace the entire lifecycle of code changes
- Understand the "why" behind code decisions

### Correlation Analysis
- Connect with GitHub issues and PRs
- Provide context from related discussions
- Show who wrote what and why

### "Cover Your Back" Mode
- Generate comprehensive reports for refactoring
- Document code reasoning before making changes
- Avoid unintended side effects

### Code Quality Analysis
- Detect long lines and complex functions
- Identify duplicate code patterns
- Provide refactoring suggestions

### Performance Analysis
- Detect potential performance bottlenecks
- Identify inefficient code patterns
- Suggest performance improvements

### Security Analysis
- Detect common security vulnerabilities
- Identify insecure coding practices
- Provide security best practices

### Code Evolution Analysis
- Track code changes over time
- Identify most frequent contributors
- View recent commit history

### Multi-IDE Support
- VS Code (fully supported)
- IntelliJ IDEA (in development)
- Sublime Text (in development)
- Atom (in development)

### Smart Caching
- Reduce duplicate analysis
- Improve performance
- Save API costs

### Multiple Output Formats
- Text format for terminal
- JSON format for automation
- Rich UI for IDE extensions

### Configuration System
- Customizable settings via config file
- Environment variable support
- Easy reset to defaults

## 📖 Use Cases

### 1. Legacy Code Understanding
When you inherit a project with complex or confusing code, GitUncover helps you understand:
- Who wrote the code
- When and why it was written
- What issues it was solving
- How it evolved over time

### 2. Code Review Enhancement
During code reviews, GitUncover provides:
- Context for proposed changes
- Historical perspective on existing code
- Potential risks of modifications
- Suggestions for improvements

### 3. Refactoring Safety
Before refactoring, GitUncover:
- Documents the current state and reasoning
- Identifies potential dependencies
- Provides a safety net against breaking changes
- Generates before-and-after analysis

## 🛠️ Installation

### Prerequisites
- Node.js 16.0 or higher
- Git
- OpenAI API key (for AI analysis)
- GitHub token (optional, for GitHub integration)

### Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/GitUncover.git

# Install dependencies
cd GitUncover
npm install

# Set up environment variables
export OPENAI_API_KEY=your_api_key
export GITHUB_TOKEN=your_github_token (optional)

# Start using GitUncover
gituncover --help
```

## 📚 Usage

### Terminal

```bash
# Analyze code in a file with detailed analysis
gituncover analyze path/to/file.js --lines 10-20

# Analyze entire file
gituncover analyze path/to/file.js

# Output in JSON format for automation
gituncover analyze path/to/file.js --format json

# Show GitUncover information
gituncover info

# Manage configuration
gituncover config --list  # Show current configuration
gituncover config --reset # Reset to default configuration
```

### Example Output

```bash
====================================
GitUncover Analysis Result
====================================

ANALYZED CODE:
------------------------------------
function calculateTotal(prices) {
  let total = 0;
  for (let i = 0; i < prices.length; i++) {
    total += prices[i];
  }
  return total;
}
------------------------------------

CODE ANALYSIS:
------------------------------------
This function calculates the total sum of an array of prices. It iterates through each element in the prices array and adds it to the total variable, then returns the final total.

The function is straightforward and correctly implements the desired functionality. It uses a simple for loop to iterate through the array and accumulate the sum.
------------------------------------

BLAME INFORMATION:
------------------------------------
Line 1: John Doe (4/1/2026, 10:30:00 AM)
  Commit: abc1234
  Message: Add calculateTotal function

Line 2: John Doe (4/1/2026, 10:30:00 AM)
  Commit: abc1234
  Message: Add calculateTotal function

Line 3: John Doe (4/1/2026, 10:30:00 AM)
  Commit: abc1234
  Message: Add calculateTotal function

Line 4: John Doe (4/1/2026, 10:30:00 AM)
  Commit: abc1234
  Message: Add calculateTotal function

Line 5: John Doe (4/1/2026, 10:30:00 AM)
  Commit: abc1234
  Message: Add calculateTotal function

Line 6: John Doe (4/1/2026, 10:30:00 AM)
  Commit: abc1234
  Message: Add calculateTotal function
------------------------------------

CODE EVOLUTION:
------------------------------------
Total Commits: 5
Most Frequent Author: John Doe

Recent Commits:
- abc1234 by John Doe on 4/1/2026, 10:30:00 AM
  Message: Add calculateTotal function
- def5678 by Jane Smith on 3/31/2026, 2:15:00 PM
  Message: Update pricing logic
- ghi9012 by John Doe on 3/30/2026, 9:45:00 AM
  Message: Add price validation
------------------------------------

RECOMMENDATIONS:
------------------------------------
1. Review the code carefully before making changes
2. Check if there are any related issues or PRs
3. Consider writing tests before refactoring
4. Consider caching array.length in loops for better performance
5. This function could be simplified using Array.reduce() for more concise code
------------------------------------
```

### IDE Integration

#### VS Code
1. Install the GitUncover extension
2. Select code and right-click
3. Choose "GitUncover: Analyze This Code"
4. View the interactive analysis

#### Other IDEs
Check the [IDE Integrations](https://github.com/Hugeeeeeeee/GitUncover/tree/main/ide-integrations) directory for setup instructions.

## 🎨 Demo

<div align="center">
  <img src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=GitUncover%20demo%20interface%20with%20code%20analysis%20results&image_size=landscape_16_9" alt="GitUncover Demo" width="600">
</div>

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

1. **Star the project** ⭐
2. **Fork the repository** 🍴
3. **Submit issues** for bugs and feature requests
4. **Create pull requests** with improvements
5. **Share the project** with your network

## 🌟 Why GitUncover?

- **Emotional Resonance**: Turns blame into understanding
- **Practical Value**: Saves time when navigating legacy code
- **Developer Friendly**: Intuitive interface and clear output
- **AI-Powered**: Leverages cutting-edge language models
- **Extensible**: Supports multiple IDEs and use cases
- **Comprehensive Analysis**: Provides code quality, performance, and security insights
- **Historical Context**: Tracks code evolution over time
- **Customizable**: Flexible configuration system
- **Efficient**: Smart caching for better performance
- **Open Source**: Community-driven development

## 📄 License

GitUncover is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgements

- Built with [OpenAI](https://openai.com/)
- Uses [simple-git](https://github.com/steveukx/git-js)
- Inspired by the pain of navigating legacy codebases

---

<div align="center">
  <h3>Ready to stop blaming and start understanding?</h3>
  <p>Star ⭐ this repository and join the GitUncover community!</p>
  <a href="https://github.com/Hugeeeeeeee/GitUncover/stargazers" style="display: inline-block; padding: 12px 24px; background-color: #3498db; color: white; border-radius: 4px; text-decoration: none; font-weight: bold;">Star on GitHub</a>
</div>
