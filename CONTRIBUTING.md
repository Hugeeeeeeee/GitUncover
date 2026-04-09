# Contributing to GitUncover

Thank you for considering contributing to GitUncover! We welcome contributions from the community to help make this project better.

## How to Contribute

### 1. Star the Project ⭐
Show your support by starring the repository on GitHub.

### 2. Fork the Repository 🍴
Create your own fork of the repository to work on changes.

### 3. Clone Your Fork
```bash
git clone https://github.com/yourusername/GitUncover.git
cd GitUncover
```

### 4. Create a Branch
Create a new branch for your feature or bug fix:
```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

### 5. Make Changes
Make your changes to the codebase. Please ensure your code follows the project's coding style and conventions.

### 6. Test Your Changes
Test your changes to ensure they work as expected and don't break existing functionality.

### 7. Commit Your Changes
Commit your changes with a clear and descriptive commit message:
```bash
git add .
git commit -m "Add: your descriptive commit message"
```

### 8. Push to Your Fork
Push your changes to your fork:
```bash
git push origin feature/your-feature-name
```

### 9. Create a Pull Request
Create a pull request from your fork to the main repository. Please include:
- A clear title
- A detailed description of the changes
- Any relevant issue numbers

## Code of Conduct

We expect all contributors to adhere to our code of conduct:

- Be respectful and inclusive
- Use welcoming and inclusive language
- Respect differing viewpoints and experiences
- Gracefully accept constructive criticism
- Focus on what's best for the community

## Reporting Issues

If you find a bug or have a feature request, please open an issue on GitHub. When reporting issues, please include:

- A clear title and description
- Steps to reproduce the issue
- Expected behavior
- Actual behavior
- Environment information (Node.js version, OS, etc.)

## Development Setup

### Prerequisites
- Node.js 16.0 or higher
- Git
- OpenAI API key (for testing AI features)

### Installation
```bash
# Install dependencies
npm install

# Set up environment variables
export OPENAI_API_KEY=your_api_key
export GITHUB_TOKEN=your_github_token (optional)
```

### Running Tests
```bash
# Run tests
npm test
```

## Project Structure

- `bin/` - Command-line tools
- `lib/` - Core functionality
- `ide-integrations/` - IDE extensions
- `example.js` - Example file for demonstration

## License

By contributing to GitUncover, you agree that your contributions will be licensed under the MIT License.

---

Thank you for your contributions! Together, we can make GitUncover a powerful tool for developers everywhere.

<div align="center">
  <h3>Happy Contributing! 🎉</h3>
</div>