# Contributing Guide

Thank you for your interest in contributing! Here's how to get started.

## 🛠️ Development Setup

```bash
# Clone and setup
git clone https://github.com/notniquedesu/MIT-AppInventor-ImageRecognition-API.git
cd MIT-AppInventor-ImageRecognition-API

# Install dependencies
cd backend && npm install
cd ../scripts && npm install
cd ../tests && npm install
cd ..

# Start development
cd backend
npm run dev
```

## 📋 Contribution Types

### 🐛 Bug Reports

1. Check existing issues first
2. Provide clear reproduction steps
3. Include error messages and logs
4. Mention your environment (OS, Node version, etc.)

### ✨ Feature Requests

1. Describe the feature clearly
2. Explain the use case
3. Suggest implementation approach
4. Consider backwards compatibility

### 📝 Documentation

1. Improve existing docs
2. Add examples
3. Fix typos and errors
4. Add translations

### 💻 Code Contributions

1. Fork the repository
2. Create feature branch: `git checkout -b feature/my-feature`
3. Make changes
4. Run tests: `npm test`
5. Commit: `git commit -am 'Add feature'`
6. Push: `git push origin feature/my-feature`
7. Create Pull Request

## ✅ Code Standards

### JavaScript Style

```javascript
// Use const by default
const value = 42;

// Use async/await
async function fetchData() {
  try {
    const result = await api.call();
    return result;
  } catch (error) {
    log.error(error);
    throw error;
  }
}

// Add JSDoc comments
/**
 * Processes image data
 * @param {string} imagePath - Path to image file
 * @returns {Promise<Object>} Detection results
 */
async function processImage(imagePath) {
  // implementation
}
```

### Commit Messages

```
feat: Add new feature
fix: Fix bug in component
docs: Update documentation
test: Add test cases
refactor: Refactor code
style: Fix formatting
chore: Update dependencies
```

## 🧪 Testing Requirements

Before submitting:

```bash
# Run all tests
npm test

# Run specific test
npm test test-suite.js

# Run with coverage
npm run test:coverage
```

## 📦 Pull Request Process

1. Update documentation
2. Add/update tests
3. Update CHANGELOG.md
4. Ensure CI passes
5. Request review
6. Address feedback

## 🎯 Areas for Contribution

- [ ] Improve performance
- [ ] Add more ML models
- [ ] Improve error messages
- [ ] Add new backend adapters
- [ ] Improve documentation
- [ ] Add language support
- [ ] Create tutorials
- [ ] Report and fix bugs

## 📞 Code Review

Expect feedback on:
- Code quality
- Performance
- Documentation
- Test coverage
- Backwards compatibility

## 🎓 Learning Resources

- [TensorFlow.js Guide](https://js.tensorflow.org/)
- [COCO-SSD Model](https://github.com/tensorflow/tfjs-models/tree/master/coco-ssd)
- [MIT App Inventor Extensions](http://appinventor.mit.edu/explore/)
- [Express.js Documentation](https://expressjs.com/)

## ❓ Questions?

Open an issue or start a discussion!

## 📜 License

By contributing, you agree your code will be licensed under MIT License.

Thank you for contributing! 🙌