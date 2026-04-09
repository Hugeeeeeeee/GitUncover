#!/usr/bin/env node

const { program } = require('commander');
const path = require('path');
const { analyzeCode } = require('../lib/analyzer');

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
};

program
  .version('0.1.0')
  .description('GitUncover - AI-powered git blame with context');

program
  .command('analyze <file>')
  .description('Analyze code in a file')
  .option('--lines <range>', 'Specify line range (e.g., 10-20)')
  .option('--format <format>', 'Output format (text, json)', 'text')
  .option('--verbose', 'Show detailed output', false)
  .action(async (file, options) => {
    try {
      const filePath = path.resolve(file);
      const lines = options.lines ? options.lines.split('-').map(Number) : undefined;
      
      console.log(`${colors.cyan}Analyzing code...${colors.reset}`);
      const result = await analyzeCode(filePath, lines);
      
      if (options.format === 'json') {
        console.log(JSON.stringify(result, null, 2));
      } else {
        // Text format output with colors
        console.log(`\n${colors.blue}====================================${colors.reset}`);
        console.log(`${colors.blue}${colors.white}GitUncover Analysis Result${colors.reset}`);
        console.log(`${colors.blue}====================================${colors.reset}\n`);
        
        // Display analyzed code
        console.log(`${colors.green}ANALYZED CODE:${colors.reset}`);
        console.log(`${colors.green}------------------------------------${colors.reset}`);
        console.log(result.code);
        console.log(`${colors.green}------------------------------------${colors.reset}\n`);
        
        // Display code analysis
        console.log(`${colors.magenta}CODE ANALYSIS:${colors.reset}`);
        console.log(`${colors.magenta}------------------------------------${colors.reset}`);
        console.log(result.analysis);
        console.log(`${colors.magenta}------------------------------------${colors.reset}\n`);
        
        // Display blame information
        if (result.blameInfo && result.blameInfo.length > 0) {
          console.log(`${colors.yellow}BLAME INFORMATION:${colors.reset}`);
          console.log(`${colors.yellow}------------------------------------${colors.reset}`);
          result.blameInfo.forEach(info => {
            console.log(`${colors.yellow}Line ${info.line}:${colors.reset} ${info.author} (${info.date})`);
            console.log(`  ${colors.yellow}Commit:${colors.reset} ${info.commit.substring(0, 7)}`);
            console.log(`  ${colors.yellow}Message:${colors.reset} ${info.summary}`);
            console.log('');
          });
          console.log(`${colors.yellow}------------------------------------${colors.reset}\n`);
        }
        
        // Display GitHub information
        if (result.githubInfo) {
          console.log(`${colors.blue}GITHUB INFORMATION:${colors.reset}`);
          console.log(`${colors.blue}------------------------------------${colors.reset}`);
          if (result.githubInfo.repository) {
            console.log(`${colors.blue}Repository:${colors.reset} ${result.githubInfo.repository.owner}/${result.githubInfo.repository.repo}`);
          }
          if (result.githubInfo.issues && result.githubInfo.issues.length > 0) {
            console.log(`\n${colors.blue}Issues:${colors.reset}`);
            result.githubInfo.issues.forEach(issue => {
              console.log(`- #${issue.number}: ${issue.title} (${issue.state})`);
              console.log(`  URL: ${issue.url}`);
            });
          }
          if (result.githubInfo.prs && result.githubInfo.prs.length > 0) {
            console.log(`\n${colors.blue}Pull Requests:${colors.reset}`);
            result.githubInfo.prs.forEach(pr => {
              console.log(`- #${pr.number}: ${pr.title} (${pr.state})`);
              console.log(`  URL: ${pr.url}`);
            });
          }
          console.log(`${colors.blue}------------------------------------${colors.reset}\n`);
        }
        
        // Display code evolution information
        if (result.codeEvolution) {
          console.log(`${colors.cyan}CODE EVOLUTION:${colors.reset}`);
          console.log(`${colors.cyan}------------------------------------${colors.reset}`);
          console.log(`${colors.cyan}Total Commits:${colors.reset} ${result.codeEvolution.totalCommits}`);
          if (result.codeEvolution.mostFrequentAuthor) {
            console.log(`${colors.cyan}Most Frequent Author:${colors.reset} ${result.codeEvolution.mostFrequentAuthor}`);
          }
          if (result.codeEvolution.recentCommits && result.codeEvolution.recentCommits.length > 0) {
            console.log(`\n${colors.cyan}Recent Commits:${colors.reset}`);
            result.codeEvolution.recentCommits.forEach(commit => {
              console.log(`- ${commit.hash.substring(0, 7)} by ${commit.author} on ${commit.date}`);
              console.log(`  Message: ${commit.message}`);
            });
          }
          console.log(`${colors.cyan}------------------------------------${colors.reset}\n`);
        }
        
        // Display recommendations
        if (result.recommendations && result.recommendations.length > 0) {
          console.log(`${colors.green}RECOMMENDATIONS:${colors.reset}`);
          console.log(`${colors.green}------------------------------------${colors.reset}`);
          result.recommendations.forEach((rec, index) => {
            console.log(`${index + 1}. ${rec}`);
          });
          console.log(`${colors.green}------------------------------------${colors.reset}`);
        }
      }
    } catch (error) {
      console.error(`${colors.red}Error analyzing code:${colors.reset} ${error.message}`);
      console.log(`${colors.yellow}Hint:${colors.reset} Make sure you have Git installed and the file is in a Git repository`);
    }
  });

program
  .command('info')
  .description('Show GitUncover information')
  .action(() => {
    console.log('GitUncover - AI-powered git blame with context');
    console.log('Version: 0.1.0');
    console.log('Slogan: Stop blaming, start understanding.');
    console.log('\nFeatures:');
    console.log('- Deep Dive: Analyze code with historical context');
    console.log('- Correlation Analysis: Connect with GitHub issues and PRs');
    console.log('- "Cover Your Back" Mode: Generate reports for refactoring');
    console.log('\nUsage:');
    console.log('  gituncover analyze <file> [options]');
    console.log('  gituncover info');
    console.log('  gituncover config [options]');
  });

program
  .command('config')
  .description('Manage GitUncover configuration')
  .option('--list', 'Show current configuration', false)
  .option('--reset', 'Reset to default configuration', false)
  .action((options) => {
    const { getConfig, updateConfig, defaultConfig } = require('../lib/config');
    
    if (options.list) {
      const config = getConfig();
      console.log('Current GitUncover Configuration:');
      console.log(JSON.stringify(config, null, 2));
    } else if (options.reset) {
      updateConfig(defaultConfig);
      console.log('Configuration reset to defaults');
    } else {
      console.log('GitUncover Configuration');
      console.log('Usage: gituncover config [options]');
      console.log('Options:');
      console.log('  --list    Show current configuration');
      console.log('  --reset   Reset to default configuration');
    }
  });

program.parse(process.argv);