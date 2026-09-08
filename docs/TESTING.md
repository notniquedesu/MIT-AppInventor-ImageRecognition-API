# Testing Guide

## Unit Tests

### Run All Tests

```bash
cd tests
npm install
npm test
```

### Test Coverage

- ✅ Health check endpoint
- ✅ Detection endpoint error handling
- ✅ Classification endpoint error handling
- ✅ Base64 image processing
- ✅ Error handling for invalid requests
- ✅ Performance metrics

### Expected Output

```
🧪 Image Recognition API - Test Suite
==================================================
Server: http://localhost:5000

📋 Test 1: Health Check
  ✅ PASSED: Server is healthy

📋 Test 2: Object Detection Endpoint
  ✅ PASSED: Detection endpoint responds correctly

... (more tests)

📊 Test Results:
  ✅ Passed: 6
  ❌ Failed: 0
  📈 Success Rate: 100.00%
```

## Integration Tests

### Run Integration Tests

```bash
cd tests
npm run test:integration
```

Tests the full workflow:
1. Server connection
2. Model loading
3. Object detection with real image
4. Image classification
5. API client functionality

## Continuous Integration

### GitHub Actions

Create `.github/workflows/test.yml`:

```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: 18
      - run: cd backend && npm install
      - run: npm start &
      - run: sleep 10
      - run: cd tests && npm install && npm test
```

## Mock Testing

### Start Mock Server

```bash
cd scripts
npm install
npm run mock-server
```

Runs on port 5001 with simulated responses.

### Test Against Mock

```bash
cd tests
node test-suite.js http://localhost:5001
```

## Performance Benchmarking

### Run Benchmark

```bash
node benchmark.js [server-url] [iterations]
```

Example:
```bash
node benchmark.js http://localhost:5000 20
```

Output:
```
📊 Performance Benchmark
========================
Server: http://localhost:5000
Iterations: 20

Average Response Time: 245.50ms
Min Response Time: 180ms
Max Response Time: 450ms
Standard Deviation: 65.30ms
Requests/Second: 4.08
```

## Load Testing

### Using Apache Bench

```bash
# 1000 requests with 10 concurrent connections
ab -n 1000 -c 10 http://localhost:5000/api/health
```

### Using Artillery

```bash
npm install -g artillery
artillery quick --count 100 --num 10 http://localhost:5000/api/health
```

## Debugging

### Enable Debug Logging

```bash
DEBUG=* npm test
```

### Check Server Logs

```bash
# Terminal 1: Start server with debug
DEBUG=express:* npm start

# Terminal 2: Run tests
cd tests && npm test
```

### Test Individual Endpoints

```bash
# Health check
curl http://localhost:5000/api/health

# With verbose output
curl -v http://localhost:5000/api/health

# POST with timing
curl -w "@curl-format.txt" -o /dev/null -s -X POST \
  http://localhost:5000/api/health
```

## Troubleshooting

### Server Connection Error

**Error**: `Error: connect ECONNREFUSED 127.0.0.1:5000`

**Solution**:
```bash
# Start backend server first
cd backend
npm install
npm start

# Wait 5 seconds for models to load
# Then run tests in another terminal
cd tests
npm test
```

### Test Timeout

**Error**: `Error: timeout of 5000ms exceeded`

**Solution**:
- Increase timeout in test file
- Ensure server has adequate resources
- Check network connectivity
- Verify no firewall blocking

### Image Not Found

**Error**: `ENOENT: no such file or directory`

**Solution**:
```bash
# Create test image directory
mkdir -p test-images

# Add a test image
cp ~/Downloads/sample.jpg test-images/
```

## Best Practices

1. **Always start backend first**
   ```bash
   cd backend && npm start &
   sleep 5
   cd ../tests && npm test
   ```

2. **Use mock server for quick tests**
   ```bash
   npm run mock-server &
   sleep 2
   npm test
   ```

3. **Clean up processes**
   ```bash
   pkill -f "node"
   ```

4. **Monitor resources**
   ```bash
   watch -n 1 'ps aux | grep node'
   ```

5. **Log test results**
   ```bash
   npm test > test-results.txt 2>&1
   ```

## CI/CD Integration

### Travis CI

`.travis.yml`:
```yaml
language: node_js
node_js:
  - 18
script:
  - cd backend && npm install
  - npm start &
  - sleep 10
  - cd ../tests && npm install && npm test
```

### GitLab CI

`.gitlab-ci.yml`:
```yaml
test:
  image: node:18
  script:
    - cd backend && npm install && npm start &
    - sleep 10
    - cd ../tests && npm install && npm test
```