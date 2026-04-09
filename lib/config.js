const fs = require('fs');
const path = require('path');

// Configuration file paths
const CONFIG_DIR = path.join(require('os').homedir(), '.gituncover');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');

// Ensure config directory exists
if (!fs.existsSync(CONFIG_DIR)) {
  fs.mkdirSync(CONFIG_DIR, { recursive: true });
}

// Default configuration
const defaultConfig = {
  // OpenAI configuration
  openai: {
    model: 'gpt-3.5-turbo',
    temperature: 0.3,
    maxTokens: 1000
  },
  // Cache configuration
  cache: {
    enabled: true,
    ttl: 24 * 60 * 60 * 1000, // 24 hours
    directory: path.join(CONFIG_DIR, 'cache')
  },
  // GitHub configuration
  github: {
    enabled: true,
    apiUrl: 'https://api.github.com'
  },
  // Output configuration
  output: {
    format: 'text',
    verbose: false,
    colors: true
  },
  // Analysis configuration
  analysis: {
    deepDive: true,
    correlation: true,
    recommendations: true
  }
};

// Read configuration
function readConfig() {
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      const configContent = fs.readFileSync(CONFIG_FILE, 'utf8');
      return JSON.parse(configContent);
    }
  } catch (error) {
    console.error('Error reading config file:', error);
  }
  return defaultConfig;
}

// Write configuration
function writeConfig(config) {
  try {
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing config file:', error);
    return false;
  }
}

// Get configuration
function getConfig() {
  const userConfig = readConfig();
  return { ...defaultConfig, ...userConfig };
}

// Update configuration
function updateConfig(updates) {
  const currentConfig = getConfig();
  const newConfig = { ...currentConfig, ...updates };
  return writeConfig(newConfig);
}

module.exports = {
  getConfig,
  updateConfig,
  readConfig,
  writeConfig,
  defaultConfig
};