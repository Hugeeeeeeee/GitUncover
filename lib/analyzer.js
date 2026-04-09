const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const simpleGit = require('simple-git');
const axios = require('axios');
const OpenAI = require('openai');
const { getConfig } = require('./config');

// Load configuration
const config = getConfig();

// GitHub API configuration
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_API_URL = config.github.apiUrl;

// Cache configuration
const CACHE_DIR = config.cache.directory;
const CACHE_TTL = config.cache.ttl;

// Ensure cache directory exists
if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
}

// Initialize OpenAI client (only when API key is present)
let openai = null;
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });
}

// Main function to analyze code
async function analyzeCode(filePath, lines) {
  try {
    // 1. Check if file exists
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    // 2. Generate cache key
    const cacheKey = generateCacheKey(filePath, lines);

    // 3. Check cache
    const cachedResult = readCache(cacheKey);
    if (cachedResult) {
      console.log('Using cached analysis result');
      return cachedResult;
    }

    // 4. Read file content
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const fileLines = fileContent.split('\n');

    // 5. Determine code range to analyze
    let targetCode = fileContent;
    if (lines && lines.length === 2) {
      const [start, end] = lines;
      if (start > 0 && end <= fileLines.length) {
        targetCode = fileLines.slice(start - 1, end).join('\n');
      }
    }

    // 6. Get code history using git blame
    const git = simpleGit(path.dirname(filePath));
    const blameResult = await git.raw(['blame', filePath]);

    // 7. Extract key blame information
    const blameInfo = extractBlameInfo(blameResult, lines);

    // 8. Get GitHub related information
    let githubInfo = null;
    try {
      // Extract commit messages
      const commitMessages = blameInfo.map(info => info.summary);
      
      // Extract issue and PR numbers
      const { issues, prs } = extractIssueAndPRNumbers(commitMessages);
      
      if (issues.length > 0 || prs.length > 0) {
        // Get repository information
        const repoInfo = await getRepositoryInfo(path.dirname(filePath));
        
        if (repoInfo) {
          githubInfo = {
            repository: repoInfo,
            issues: [],
            prs: []
          };
          
          // Get issue information
          for (const issueNumber of issues) {
            const issue = await getGitHubIssue(repoInfo.owner, repoInfo.repo, issueNumber);
            if (issue) {
              githubInfo.issues.push({ number: issueNumber, ...issue });
            }
          }
          
          // Get PR information
          for (const prNumber of prs) {
            const pr = await getGitHubPR(repoInfo.owner, repoInfo.repo, prNumber);
            if (pr) {
              githubInfo.prs.push({ number: prNumber, ...pr });
            }
          }
        }
      }
    } catch (githubError) {
      console.error('Error getting GitHub info:', githubError);
    }

    // 9. Analyze code meaning
    const codeAnalysis = await analyzeCodeMeaning(targetCode, blameInfo, githubInfo);

    // 10. Analyze code evolution
    let codeEvolution = null;
    try {
      codeEvolution = await analyzeCodeEvolution(filePath, git);
    } catch (evolutionError) {
      console.error('Error analyzing code evolution:', evolutionError);
    }

    // 11. Combine results
    const result = {
      code: targetCode,
      analysis: codeAnalysis,
      blameInfo: blameInfo,
      githubInfo: githubInfo,
      codeEvolution: codeEvolution,
      recommendations: generateRecommendations(codeAnalysis, blameInfo, targetCode),
      cachedAt: new Date().toISOString()
    };

    // 11. Write to cache
    writeCache(cacheKey, result);

    return result;
  } catch (error) {
    console.error('Error in analyzeCode:', error);
    throw error;
  }
}

// Extract blame information
function extractBlameInfo(blameResult, lines) {
  const blameInfo = [];
  
  try {
    // Parse raw blame result
    if (blameResult) {
      const blameLines = blameResult.split('\n');
      let currentLine = 1;
      
      // Determine line range to analyze
      const startLine = lines && lines.length === 2 ? lines[0] : 1;
      const endLine = lines && lines.length === 2 ? lines[1] : blameLines.length;
      
      // Extract blame information for specified range
      for (const line of blameLines) {
        if (currentLine >= startLine && currentLine <= endLine) {
          // Parse blame line format: <commit> <author> <date> <line content>
          const match = line.match(/^([0-9a-f]+)\s+\(([^)]+)\s+([0-9\-\s:]+)\s+\d+\)\s*(.*)$/);
          if (match) {
            const [, commit, author, dateStr, summary] = match;
            const info = {
              line: currentLine,
              author: author.trim() || 'Unknown',
              date: new Date(dateStr).toLocaleString() || 'Unknown',
              commit: commit || 'Unknown',
              summary: summary.trim() || 'No commit message'
            };
            blameInfo.push(info);
          }
        }
        currentLine++;
      }
    }
  } catch (error) {
    console.error('Error extracting blame info:', error);
  }
  
  return blameInfo;
}

// Analyze code meaning
async function analyzeCodeMeaning(code, blameInfo = [], githubInfo = null) {
  try {
    // Check if OpenAI client is initialized
    if (!openai) {
      return 'Error: OpenAI API key not configured. Please set the OPENAI_API_KEY environment variable.';
    }

    // Build system prompt
    const systemPrompt = `You are GitUncover, an AI-powered code analysis assistant. Your goal is to help developers understand code by providing detailed analysis of what the code does, why it was written that way, and potential issues or improvements.

When analyzing code, consider:
1. What the code does functionally
2. The intent behind the code
3. Potential issues or bugs
4. Code quality and maintainability
5. Historical context if provided

Provide clear, concise explanations that help developers understand the code without blaming the original author.`;

    // Build user prompt with code and context information
    let userPrompt = `Analyze the following code:\n\n${code}`;

    // Add blame information as context
    if (blameInfo.length > 0) {
      userPrompt += '\n\nHistorical context from git blame:';
      blameInfo.forEach(info => {
        userPrompt += `\n- Line ${info.line}: Written by ${info.author} on ${info.date} (Commit: ${info.commit.substring(0, 7)})\n  Message: ${info.summary}`;
      });
    }

    // Add GitHub information as context
    if (githubInfo) {
      userPrompt += '\n\nRelated GitHub information:';
      if (githubInfo.issues && githubInfo.issues.length > 0) {
        userPrompt += '\nIssues:';
        githubInfo.issues.forEach(issue => {
          userPrompt += `\n- #${issue.number}: ${issue.title} (${issue.state})\n  ${issue.url}`;
        });
      }
      if (githubInfo.prs && githubInfo.prs.length > 0) {
        userPrompt += '\nPull Requests:';
        githubInfo.prs.forEach(pr => {
          userPrompt += `\n- #${pr.number}: ${pr.title} (${pr.state})\n  ${pr.url}`;
        });
      }
    }

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: config.openai.model,
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: userPrompt
        }
      ],
      temperature: config.openai.temperature,
      max_tokens: config.openai.maxTokens,
      top_p: 0.95
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error analyzing code meaning:', error);
    return 'Error analyzing code meaning. Please check your OpenAI API key.';
  }
}

// Extract issue and PR numbers from commit messages
function extractIssueAndPRNumbers(commitMessages) {
  const issues = [];
  const prs = [];
  
  commitMessages.forEach(message => {
    // Match issue numbers in format #123
    const issueMatches = message.match(/#(\d+)/g);
    if (issueMatches) {
      issueMatches.forEach(match => {
        const issueNumber = match.substring(1);
        if (!issues.includes(issueNumber)) {
          issues.push(issueNumber);
        }
      });
    }
    
    // Match PR numbers in format PR #123
    const prMatches = message.match(/PR #(\d+)/gi);
    if (prMatches) {
      prMatches.forEach(match => {
        const prNumber = match.match(/\d+/)[0];
        if (!prs.includes(prNumber)) {
          prs.push(prNumber);
        }
      });
    }
  });
  
  return { issues, prs };
}

// Get GitHub repository information
async function getRepositoryInfo(repoPath) {
  try {
    const git = simpleGit(repoPath);
    const remotes = await git.getRemotes(true);
    
    for (const remote of remotes) {
      if (remote.name === 'origin') {
        // Extract owner and repo from remote URL
        const url = remote.refs.fetch;
        const match = url.match(/github\.com[:/]([^/]+)\/([^/.]+)/i);
        if (match) {
          return {
            owner: match[1],
            repo: match[2].replace(/\.git$/, '')
          };
        }
      }
    }
  } catch (error) {
    console.error('Error getting repository info:', error);
  }
  return null;
}

// Get GitHub issue information
async function getGitHubIssue(owner, repo, issueNumber) {
  if (!GITHUB_TOKEN) {
    return null;
  }
  
  try {
    const response = await axios.get(`${GITHUB_API_URL}/repos/${owner}/${repo}/issues/${issueNumber}`, {
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });
    
    return {
      title: response.data.title,
      body: response.data.body,
      state: response.data.state,
      url: response.data.html_url
    };
  } catch (error) {
    console.error(`Error getting issue #${issueNumber}:`, error);
    return null;
  }
}

// Get GitHub PR information
async function getGitHubPR(owner, repo, prNumber) {
  if (!GITHUB_TOKEN) {
    return null;
  }
  
  try {
    const response = await axios.get(`${GITHUB_API_URL}/repos/${owner}/${repo}/pulls/${prNumber}`, {
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });
    
    return {
      title: response.data.title,
      body: response.data.body,
      state: response.data.state,
      url: response.data.html_url
    };
  } catch (error) {
    console.error(`Error getting PR #${prNumber}:`, error);
    return null;
  }
}

// Generate recommendations
function generateRecommendations(codeAnalysis, blameInfo, code) {
  // Generate specific recommendations based on analysis results
  const recommendations = [
    'Review the code carefully before making changes',
    'Check if there are any related issues or PRs',
    'Consider writing tests before refactoring'
  ];
  
  // Add code quality recommendations
  const qualityIssues = analyzeCodeQuality(code);
  if (qualityIssues.length > 0) {
    recommendations.push(...qualityIssues);
  }
  
  // Add performance recommendations
  const performanceIssues = analyzePerformance(code);
  if (performanceIssues.length > 0) {
    recommendations.push(...performanceIssues);
  }
  
  // Add security recommendations
  const securityIssues = analyzeSecurity(code);
  if (securityIssues.length > 0) {
    recommendations.push(...securityIssues);
  }
  
  return recommendations;
}

// Analyze code quality
function analyzeCodeQuality(code) {
  const issues = [];
  
  // Check for long lines
  const lines = code.split('\n');
  const longLines = lines.filter((line, index) => line.length > 80);
  if (longLines.length > 0) {
    issues.push(`Consider breaking long lines (${longLines.length} lines exceed 80 characters)`);
  }
  
  // Check for duplicate code
  if (hasDuplicateCode(code)) {
    issues.push('Check for duplicate code that could be refactored');
  }
  
  // Check for complex functions
  if (hasComplexFunctions(code)) {
    issues.push('Consider refactoring complex functions to improve maintainability');
  }
  
  return issues;
}

// Check for duplicate code
function hasDuplicateCode(code) {
  // Simple duplicate code detection
  const lines = code.split('\n');
  const seenLines = new Set();
  const duplicates = new Set();
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    if (trimmedLine && trimmedLine.length > 10) {
      if (seenLines.has(trimmedLine)) {
        duplicates.add(trimmedLine);
      } else {
        seenLines.add(trimmedLine);
      }
    }
  }
  
  return duplicates.size > 0;
}

// Check for complex functions
function hasComplexFunctions(code) {
  // Simple complexity check based on line count
  const functions = code.match(/function\s+\w+\s*\([^)]*\)\s*{[\s\S]*?}/g) || [];
  const complexFunctions = functions.filter(func => {
    const lines = func.split('\n');
    return lines.length > 30;
  });
  
  return complexFunctions.length > 0;
}

// Analyze performance issues
function analyzePerformance(code) {
  const issues = [];
  
  // Check for potential performance issues
  if (code.includes('for (let i = 0; i < array.length; i++)')) {
    issues.push('Consider caching array.length in loops for better performance');
  }
  
  if (code.includes('JSON.parse(JSON.stringify(')) {
    issues.push('Consider using a more efficient deep clone method for large objects');
  }
  
  if (code.includes('eval(')) {
    issues.push('Avoid using eval() for security and performance reasons');
  }
  
  return issues;
}

// Analyze security issues
function analyzeSecurity(code) {
  const issues = [];
  
  // Check for common security issues
  if (code.includes('innerHTML =')) {
    issues.push('Consider using textContent instead of innerHTML to prevent XSS');
  }
  
  if (code.includes('localStorage.setItem(')) {
    issues.push('Be cautious when storing sensitive data in localStorage');
  }
  
  if (code.includes('new Function(')) {
    issues.push('Avoid using new Function() for security reasons');
  }
  
  return issues;
}

// Analyze code evolution
async function analyzeCodeEvolution(filePath, git) {
  try {
    const log = await git.log({
      file: filePath,
      maxCount: 20
    });
    
    const evolution = {
      totalCommits: log.total,
      recentCommits: log.all.slice(0, 5).map(commit => ({
        hash: commit.hash,
        author: commit.author_name,
        date: commit.date,
        message: commit.message
      })),
      mostFrequentAuthor: getMostFrequentAuthor(log.all)
    };
    
    return evolution;
  } catch (error) {
    console.error('Error analyzing code evolution:', error);
    return null;
  }
}

// Get most frequent author
function getMostFrequentAuthor(commits) {
  const authorCounts = {};
  
  commits.forEach(commit => {
    const author = commit.author_name;
    authorCounts[author] = (authorCounts[author] || 0) + 1;
  });
  
  let mostFrequent = null;
  let maxCount = 0;
  
  for (const [author, count] of Object.entries(authorCounts)) {
    if (count > maxCount) {
      mostFrequent = author;
      maxCount = count;
    }
  }
  
  return mostFrequent;
}

// Generate cache key
function generateCacheKey(filePath, lines) {
  const key = `${filePath}:${lines ? lines.join('-') : 'all'}`;
  return crypto.createHash('md5').update(key).digest('hex');
}

// Check if cache is valid
function isCacheValid(cachePath) {
  if (!fs.existsSync(cachePath)) {
    return false;
  }
  
  const stats = fs.statSync(cachePath);
  const now = Date.now();
  return (now - stats.mtime.getTime()) < CACHE_TTL;
}

// Read cache
function readCache(cacheKey) {
  const cachePath = path.join(CACHE_DIR, `${cacheKey}.json`);
  if (isCacheValid(cachePath)) {
    try {
      const content = fs.readFileSync(cachePath, 'utf8');
      return JSON.parse(content);
    } catch (error) {
      console.error('Error reading cache:', error);
    }
  }
  return null;
}

// Write cache
function writeCache(cacheKey, data) {
  const cachePath = path.join(CACHE_DIR, `${cacheKey}.json`);
  try {
    fs.writeFileSync(cachePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing cache:', error);
  }
}

module.exports = {
  analyzeCode
};