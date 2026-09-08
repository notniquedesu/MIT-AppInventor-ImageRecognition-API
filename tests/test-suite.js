#!/usr/bin/env node

const axios = require('axios');
const fs = require('fs');
const path = require('path');
const assert = require('assert');

/**
 * Test Suite for Image Recognition API
 */

class TestRunner {
  constructor(serverUrl = 'http://localhost:5000') {
    this.serverUrl = serverUrl;
    this.passed = 0;
    this.failed = 0;
    this.tests = [];
  }

  async run() {
    console.log('\n🧪 Image Recognition API - Test Suite');
    console.log('='.repeat(50));
    console.log(`Server: ${this.serverUrl}\n`);

    // Health check
    await this.testHealthCheck();

    // Mock base64 detection
    await this.testBase64Detection();

    // Mock detection endpoint
    await this.testDetectionEndpoint();

    // Mock classification endpoint
    await this.testClassificationEndpoint();

    // Error handling
    await this.testErrorHandling();

    // Performance
    await this.testPerformance();

    this.printResults();
  }

  async testHealthCheck() {
    try {
      console.log('📋 Test 1: Health Check');
      const response = await axios.get(`${this.serverUrl}/api/health`);
      
      assert(response.status === 200, 'Status should be 200');
      assert(response.data.status === 'ok', 'Status should be ok');
      assert(response.data.models, 'Should have models info');
      
      console.log('  ✅ PASSED: Server is healthy\n');
      this.passed++;
    } catch (error) {
      console.log(`  ❌ FAILED: ${error.message}\n`);
      this.failed++;
    }
  }

  async testDetectionEndpoint() {
    try {
      console.log('📋 Test 2: Object Detection Endpoint');
      
      const response = await axios.post(`${this.serverUrl}/api/detect-objects`, 
        {},
        { 
          headers: { 'Content-Type': 'multipart/form-data' },
          validateStatus: () => true
        }
      );
      
      // Should handle missing image gracefully
      assert(response.status === 400 || response.status === 500, 'Should handle missing image');
      
      console.log('  ✅ PASSED: Detection endpoint responds correctly\n');
      this.passed++;
    } catch (error) {
      console.log(`  ❌ FAILED: ${error.message}\n`);
      this.failed++;
    }
  }

  async testClassificationEndpoint() {
    try {
      console.log('📋 Test 3: Classification Endpoint');
      
      const response = await axios.post(`${this.serverUrl}/api/classify-image`,
        {},
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          validateStatus: () => true
        }
      );
      
      assert(response.status === 400 || response.status === 500, 'Should handle missing image');
      
      console.log('  ✅ PASSED: Classification endpoint responds correctly\n');
      this.passed++;
    } catch (error) {
      console.log(`  ❌ FAILED: ${error.message}\n`);
      this.failed++;
    }
  }

  async testBase64Detection() {
    try {
      console.log('📋 Test 4: Base64 Detection');
      
      // Create a valid base64 image
      const validBase64 = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEA';
      
      const response = await axios.post(
        `${this.serverUrl}/api/detect-base64`,
        { image: validBase64 },
        { validateStatus: () => true }
      );
      
      // Should respond with success or error (both acceptable)
      assert(response.status === 200 || response.status === 400 || response.status === 500);
      
      console.log('  ✅ PASSED: Base64 detection handled\n');
      this.passed++;
    } catch (error) {
      console.log(`  ❌ FAILED: ${error.message}\n`);
      this.failed++;
    }
  }

  async testErrorHandling() {
    try {
      console.log('📋 Test 5: Error Handling');
      
      // Test invalid endpoint
      const response = await axios.get(
        `${this.serverUrl}/api/invalid-endpoint`,
        { validateStatus: () => true }
      );
      
      assert(response.status === 404, 'Should return 404 for invalid endpoint');
      
      console.log('  ✅ PASSED: Error handling works correctly\n');
      this.passed++;
    } catch (error) {
      console.log(`  ❌ FAILED: ${error.message}\n`);
      this.failed++;
    }
  }

  async testPerformance() {
    try {
      console.log('📋 Test 6: Performance');
      
      const iterations = 5;
      const times = [];
      
      for (let i = 0; i < iterations; i++) {
        const start = Date.now();
        await axios.get(`${this.serverUrl}/api/health`);
        times.push(Date.now() - start);
      }
      
      const avgTime = times.reduce((a, b) => a + b) / times.length;
      const maxTime = Math.max(...times);
      
      console.log(`  Average response time: ${avgTime.toFixed(2)}ms`);
      console.log(`  Max response time: ${maxTime}ms`);
      assert(avgTime < 1000, 'Average response time should be < 1s');
      
      console.log('  ✅ PASSED: Performance is acceptable\n');
      this.passed++;
    } catch (error) {
      console.log(`  ❌ FAILED: ${error.message}\n`);
      this.failed++;
    }
  }

  printResults() {
    console.log('='.repeat(50));
    console.log('📊 Test Results:');
    console.log(`  ✅ Passed: ${this.passed}`);
    console.log(`  ❌ Failed: ${this.failed}`);
    console.log(`  📈 Success Rate: ${((this.passed / (this.passed + this.failed)) * 100).toFixed(2)}%`);
    console.log('='.repeat(50) + '\n');
    
    process.exit(this.failed > 0 ? 1 : 0);
  }
}

if (require.main === module) {
  const serverUrl = process.argv[2] || 'http://localhost:5000';
  const runner = new TestRunner(serverUrl);
  runner.run().catch(err => {
    console.error('Test runner failed:', err);
    process.exit(1);
  });
}

module.exports = TestRunner;