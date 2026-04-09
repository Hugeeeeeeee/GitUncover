# GitUncover Atom Integration

This directory contains the Atom editor integration for GitUncover.

## How to Create an Atom Plugin

1. **Set up the Atom Plugin Development Environment**:
   - Install Atom
   - Install the `apm` (Atom Package Manager) command line tool

2. **Create a New Package**:
   - Open a terminal
   - Run `apm init`
   - Follow the prompts to create a new package named "gituncover"

3. **Implement the Plugin**:
   - Edit the `lib/gituncover.js` file to implement the core functionality
   - Add a command to analyze selected code
   - Use the GitUncover core API to analyze code
   - Display the analysis results in a new pane

4. **Add a Key Binding**:
   - Edit the `keymaps/gituncover.cson` file to add a key binding

5. **Test the Plugin**:
   - Run `apm link` to link the package to Atom
   - Open Atom and test the plugin

## Core API Usage

```javascript
// Example usage of GitUncover core API
// lib/gituncover.js

'use babel';

import { CompositeDisposable } from 'atom';
const { execSync } = require('child_process');
const path = require('path');

export default {
  subscriptions: null,

  activate(state) {
    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'gituncover:analyze': () => this.analyze()
    }));
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  serialize() {
    return {
      gituncoverViewState: this.gituncoverView.serialize()
    };
  },

  analyze() {
    const editor = atom.workspace.getActiveTextEditor();
    if (!editor) {
      atom.notifications.addError('No active editor found');
      return;
    }

    const selection = editor.getSelectedText();
    if (!selection) {
      atom.notifications.addError('Please select some code to analyze');
      return;
    }

    const filePath = editor.getPath();
    if (!filePath) {
      atom.notifications.addError('Please save the file first');
      return;
    }

    const startLine = editor.getCursorBufferPosition().row + 1;
    const endLine = editor.getSelectedBufferRange().end.row + 1;

    try {
      // Call GitUncover core API
      const gituncoverPath = path.join(__dirname, '../../../bin/gituncover.js');
      const result = execSync(
        `node "${gituncoverPath}" analyze "${filePath}" --lines ${startLine}-${endLine} --format json`,
        { encoding: 'utf8' }
      );

      const analysisResult = JSON.parse(result);
      this.showResult(analysisResult);
    } catch (error) {
      atom.notifications.addError(`Error analyzing code: ${error.message}`);
    }
  },

  showResult(result) {
    // Create a new pane for the analysis result
    const textEditor = atom.workspace.open();
    textEditor.then(editor => {
      editor.setGrammar(atom.grammars.grammarForScopeName('source.gfm'));
      editor.setTitle('GitUncover Analysis');

      let content = '# GitUncover Analysis\n\n';

      content += `## Analyzed Code\n\`\`\`\n${result.code}\n\`\`\`\n\n`;
      content += `## Code Analysis\n${result.analysis}\n\n`;

      if (result.blameInfo && result.blameInfo.length > 0) {
        content += '## Blame Information\n';
        result.blameInfo.forEach(info => {
          content += `- Line ${info.line}: ${info.author} (${info.date})\n`;
          content += `  Commit: ${info.commit.substring(0, 7)}\n`;
          content += `  Message: ${info.summary}\n\n`;
        });
      }

      if (result.githubInfo) {
        content += '## GitHub Information\n';
        if (result.githubInfo.repository) {
          content += `Repository: ${result.githubInfo.repository.owner}/${result.githubInfo.repository.repo}\n\n`;
        }
        if (result.githubInfo.issues && result.githubInfo.issues.length > 0) {
          content += 'Issues:\n';
          result.githubInfo.issues.forEach(issue => {
            content += `- #${issue.number}: ${issue.title} (${issue.state})\n`;
            content += `  URL: ${issue.url}\n\n`;
          });
        }
        if (result.githubInfo.prs && result.githubInfo.prs.length > 0) {
          content += 'Pull Requests:\n';
          result.githubInfo.prs.forEach(pr => {
            content += `- #${pr.number}: ${pr.title} (${pr.state})\n`;
            content += `  URL: ${pr.url}\n\n`;
          });
        }
      }

      if (result.recommendations && result.recommendations.length > 0) {
        content += '## Recommendations\n';
        result.recommendations.forEach((rec, index) => {
          content += `${index + 1}. ${rec}\n`;
        });
      }

      editor.setText(content);
    });
  }
};

// keymaps/gituncover.cson
// '.editor':
//   'ctrl-alt-g': 'gituncover:analyze'

// package.json
// {
//   "name": "gituncover",
//   "main": "./lib/gituncover",
//   "version": "0.1.0",
//   "description": "AI-powered git blame with context",
//   "activationCommands": {
//     "atom-workspace": [
//       "gituncover:analyze"
//     ]
//   }
// }
```

## Resources

- [Atom Package Development Documentation](https://flight-manual.atom.io/hacking-atom/)
- [Atom API Documentation](https://atom.io/docs/api/latest/)