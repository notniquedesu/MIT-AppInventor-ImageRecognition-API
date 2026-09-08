#!/usr/bin/env node

/**
 * Extension Generator - Creates .aix file with dependencies
 */

const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

class ExtensionGenerator {
  constructor(config = {}) {
    this.config = {
      name: 'ImageRecognition',
      packageName: 'com.example.imagerecognition',
      version: '1.0.0',
      minSdk: 21,
      targetSdk: 32,
      ...config
    };
  }

  async generateAIX(outputPath = './dist') {
    if (!fs.existsSync(outputPath)) {
      fs.mkdirSync(outputPath, { recursive: true });
    }

    const aixFile = path.join(outputPath, `${this.config.name}.aix`);
    return new Promise((resolve, reject) => {
      const output = fs.createWriteStream(aixFile);
      const archive = archiver('zip', { zlib: { level: 9 } });

      output.on('close', () => resolve(aixFile));
      archive.on('error', reject);
      archive.pipe(output);

      // Add required files
      this._addExtensionFiles(archive);
      this._addDependencies(archive);
      this._addLibraries(archive);

      archive.finalize();
    });
  }

  _addExtensionFiles(archive) {
    const files = [
      {
        name: 'classinfo.json',
        content: this._getClassInfo()
      },
      {
        name: 'AndroidManifest.xml',
        content: this._getManifest()
      },
      {
        name: 'version.json',
        content: this._getVersionInfo()
      }
    ];

    files.forEach(file => {
      archive.append(file.content, { name: file.name });
    });
  }

  _addDependencies(archive) {
    const deps = [
      'androidx.appcompat:appcompat:1.5.1',
      'org.json:json:20230227',
      'androidx.annotation:annotation:1.5.0'
    ];

    archive.append(JSON.stringify(deps, null, 2), { name: 'dependencies.json' });
  }

  _addLibraries(archive) {
    const libDir = path.join(__dirname, '../libs');
    if (fs.existsSync(libDir)) {
      archive.directory(libDir, 'libs');
    }
  }

  _getClassInfo() {
    return JSON.stringify({
      package: this.config.packageName,
      name: this.config.name,
      version: this.config.version,
      minSdkVersion: this.config.minSdk,
      targetSdkVersion: this.config.targetSdk,
      permissions: [
        'android.permission.INTERNET',
        'android.permission.READ_EXTERNAL_STORAGE',
        'android.permission.WRITE_EXTERNAL_STORAGE',
        'android.permission.CAMERA'
      ]
    }, null, 2);
  }

  _getManifest() {
    return `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="${this.config.packageName}">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
    <uses-permission android:name="android.permission.CAMERA" />

</manifest>`;
  }

  _getVersionInfo() {
    return JSON.stringify({
      version: this.config.version,
      name: this.config.name,
      package: this.config.packageName,
      minSdk: this.config.minSdk,
      targetSdk: this.config.targetSdk,
      buildTime: new Date().toISOString()
    }, null, 2);
  }
}

if (require.main === module) {
  const generator = new ExtensionGenerator();
  generator.generateAIX('./dist')
    .then(path => console.log(`Extension created: ${path}`))
    .catch(err => console.error(`Failed: ${err.message}`));
}

module.exports = ExtensionGenerator;