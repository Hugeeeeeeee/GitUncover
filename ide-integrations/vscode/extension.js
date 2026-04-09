const vscode = require('vscode');
const path = require('path');
const { analyzeCode } = require('../../lib/analyzer');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  console.log('GitUncover extension activated');

  let disposable = vscode.commands.registerCommand('gituncover.analyze', async function () {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showErrorMessage('No active editor found');
      return;
    }

    const selection = editor.selection;
    if (selection.isEmpty) {
      vscode.window.showErrorMessage('Please select some code to analyze');
      return;
    }

    const document = editor.document;
    const filePath = document.fileName;
    const startLine = selection.start.line + 1;
    const endLine = selection.end.line + 1;

    try {
      const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
      statusBarItem.text = '$(sync~spin) GitUncover: Analyzing...';
      statusBarItem.show();

      const result = await analyzeCode(filePath, [startLine, endLine]);
      
      statusBarItem.hide();
      statusBarItem.dispose();
      
      // Display analysis results in a webview panel
      const panel = vscode.window.createWebviewPanel(
        'gituncover',
        'GitUncover Analysis',
        vscode.ViewColumn.Beside,
        {
          enableScripts: true,
          retainContextWhenHidden: true
        }
      );

      panel.webview.html = getWebviewContent(result);
      
      // Handle webview messages
      panel.webview.onDidReceiveMessage(message => {
        switch (message.command) {
          case 'close':
            panel.dispose();
            break;
          case 'copy':
            vscode.env.clipboard.writeText(message.text);
            vscode.window.showInformationMessage('Copied to clipboard');
            break;
          case 'export':
            vscode.window.showInformationMessage('Report exported as JSON');
            break;
        }
      });
    } catch (error) {
      vscode.window.showErrorMessage(`Error analyzing code: ${error.message}`);
    }
  });

  context.subscriptions.push(disposable);
}

function getWebviewContent(result) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>GitUncover Analysis</title>
      <style>
        body { 
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
          padding: 16px; 
          margin: 0;
          background-color: #f5f5f5;
          color: #333;
        }
        .container { 
          max-width: 1000px; 
          margin: 0 auto; 
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          padding: 24px;
        }
        h1 { 
          color: #2c3e50; 
          margin-top: 0;
          border-bottom: 2px solid #3498db;
          padding-bottom: 12px;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        h1::before {
          content: '🔍';
          font-size: 24px;
        }
        h2 { 
          color: #34495e; 
          margin-top: 24px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 12px;
          background-color: #f8f9fa;
          border-radius: 4px;
          transition: all 0.3s ease;
        }
        h2:hover {
          background-color: #e9ecef;
        }
        h2::after {
          content: '▼';
          font-size: 12px;
          transition: transform 0.3s ease;
        }
        h2.collapsed::after {
          transform: rotate(-90deg);
        }
        .section { 
          margin: 16px 0;
          border-radius: 4px;
          overflow: hidden;
          border: 1px solid #e0e0e0;
        }
        .section-content {
          padding: 16px;
          background-color: #f9f9f9;
        }
        .code-block {
          background-color: #2d2d2d;
          color: #f8f8f2;
          padding: 16px;
          border-radius: 4px;
          font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
          font-size: 14px;
          line-height: 1.5;
          overflow-x: auto;
          white-space: pre-wrap;
        }
        .analysis {
          line-height: 1.6;
          padding: 12px;
          background-color: #f8f9fa;
          border-radius: 4px;
        }
        .blame-info {
          background-color: #e8f4f8;
          border-radius: 4px;
        }
        .blame-item {
          padding: 12px;
          border-bottom: 1px solid #d0e6f0;
          transition: background-color 0.2s ease;
        }
        .blame-item:hover {
          background-color: #d6ebf2;
        }
        .blame-item:last-child {
          border-bottom: none;
        }
        .blame-item strong {
          color: #2c3e50;
        }
        .github-info {
          background-color: #f0f4f8;
          border-radius: 4px;
        }
        .github-item {
          padding: 12px;
          border-bottom: 1px solid #e0e7ee;
          transition: background-color 0.2s ease;
        }
        .github-item:hover {
          background-color: #e6ebf0;
        }
        .github-item:last-child {
          border-bottom: none;
        }
        .github-item a {
          color: #3498db;
          text-decoration: none;
          font-weight: 500;
        }
        .github-item a:hover {
          text-decoration: underline;
        }
        .recommendations {
          background-color: #f8f4e8;
          border-radius: 4px;
        }
        ul {
          margin: 8px 0;
          padding-left: 24px;
        }
        li {
          margin: 8px 0;
          padding-left: 8px;
          border-left: 3px solid #f39c12;
        }
        .actions {
          display: flex;
          gap: 12px;
          margin-top: 24px;
          padding-top: 16px;
          border-top: 1px solid #e0e0e0;
          flex-wrap: wrap;
        }
        button {
          background-color: #3498db;
          color: white;
          border: none;
          padding: 10px 16px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        button:hover {
          background-color: #2980b9;
          transform: translateY(-1px);
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        button.secondary {
          background-color: #95a5a6;
        }
        button.secondary:hover {
          background-color: #7f8c8d;
        }
        button.copy::before {
          content: '📋';
        }
        button.export::before {
          content: '💾';
        }
        button.close::before {
          content: '✕';
        }
        .loading {
          display: inline-block;
          width: 20px;
          height: 20px;
          border: 3px solid rgba(52, 152, 219, 0.3);
          border-radius: 50%;
          border-top-color: #3498db;
          animation: spin 1s ease-in-out infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .notification {
          position: fixed;
          top: 20px;
          right: 20px;
          background-color: #27ae60;
          color: white;
          padding: 12px 24px;
          border-radius: 4px;
          z-index: 1000;
          animation: slideIn 0.3s ease;
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        }
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(100%); opacity: 0; }
        }
        .badge {
          display: inline-block;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
          margin-left: 8px;
        }
        .badge-info {
          background-color: #3498db;
          color: white;
        }
        .badge-success {
          background-color: #27ae60;
          color: white;
        }
        .badge-warning {
          background-color: #f39c12;
          color: white;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>GitUncover Analysis</h1>
        
        <!-- Analyzed Code Section -->
        <div class="section">
          <h2 onclick="toggleSection(this)">Analyzed Code <span class="badge badge-info">Code</span></h2>
          <div class="section-content">
            <div class="code-block">${result.code.replace(/\n/g, '<br>').replace(/ /g, '&nbsp;')}</div>
          </div>
        </div>
        
        <!-- Code Analysis Section -->
        <div class="section">
          <h2 onclick="toggleSection(this)">Code Analysis <span class="badge badge-success">AI</span></h2>
          <div class="section-content">
            <div class="analysis">${result.analysis.replace(/\n/g, '<br>')}</div>
          </div>
        </div>
        
        <!-- Blame Information Section -->
        <div class="section">
          <h2 onclick="toggleSection(this)">Blame Information <span class="badge badge-warning">Git</span></h2>
          <div class="section-content blame-info">
            ${result.blameInfo && result.blameInfo.length > 0 ? 
              result.blameInfo.map(info => `
                <div class="blame-item">
                  <strong>Line ${info.line}:</strong> ${info.author} (${info.date})<br>
                  <strong>Commit:</strong> ${info.commit.substring(0, 7)}<br>
                  <strong>Message:</strong> ${info.summary}
                </div>
              `).join('') : 
              '<p style="text-align: center; color: #666;">No blame information available</p>'}
          </div>
        </div>
        
        <!-- GitHub Information Section -->
        ${result.githubInfo ? `
          <div class="section">
            <h2 onclick="toggleSection(this)">GitHub Information <span class="badge badge-info">GitHub</span></h2>
            <div class="section-content github-info">
              ${result.githubInfo.repository ? 
                `<div class="github-item">
                  <strong>Repository:</strong> ${result.githubInfo.repository.owner}/${result.githubInfo.repository.repo}
                </div>` : 
                ''}
              ${result.githubInfo.issues && result.githubInfo.issues.length > 0 ? 
                result.githubInfo.issues.map(issue => `
                  <div class="github-item">
                    <strong>Issue #${issue.number}:</strong> ${issue.title} (${issue.state})<br>
                    <a href="${issue.url}" target="_blank">View on GitHub</a>
                  </div>
                `).join('') : 
                ''}
              ${result.githubInfo.prs && result.githubInfo.prs.length > 0 ? 
                result.githubInfo.prs.map(pr => `
                  <div class="github-item">
                    <strong>PR #${pr.number}:</strong> ${pr.title} (${pr.state})<br>
                    <a href="${pr.url}" target="_blank">View on GitHub</a>
                  </div>
                `).join('') : 
                ''}
            </div>
          </div>
        ` : ''}
        
        <!-- Code Evolution Section -->
        ${result.codeEvolution ? `
          <div class="section">
            <h2 onclick="toggleSection(this)">Code Evolution <span class="badge badge-success">History</span></h2>
            <div class="section-content">
              <div class="github-info">
                <div class="github-item">
                  <strong>Total Commits:</strong> ${result.codeEvolution.totalCommits}
                </div>
                ${result.codeEvolution.mostFrequentAuthor ? `
                  <div class="github-item">
                    <strong>Most Frequent Author:</strong> ${result.codeEvolution.mostFrequentAuthor}
                  </div>
                ` : ''}
                ${result.codeEvolution.recentCommits && result.codeEvolution.recentCommits.length > 0 ? `
                  <div class="github-item">
                    <strong>Recent Commits:</strong>
                    <ul>
                      ${result.codeEvolution.recentCommits.map(commit => `
                        <li>
                          ${commit.hash.substring(0, 7)} by ${commit.author} on ${commit.date}<br>
                          <small>Message: ${commit.message}</small>
                        </li>
                      `).join('')}
                    </ul>
                  </div>
                ` : ''}
              </div>
            </div>
          </div>
        ` : ''}
        
        <!-- Recommendations Section -->
        <div class="section">
          <h2 onclick="toggleSection(this)">Recommendations <span class="badge badge-warning">Tips</span></h2>
          <div class="section-content recommendations">
            <ul>
              ${result.recommendations && result.recommendations.length > 0 ? 
                result.recommendations.map(rec => `<li>${rec}</li>`).join('') : 
                '<li>No recommendations available</li>'}
            </ul>
          </div>
        </div>
        
        <!-- Actions Section -->
        <div class="actions">
          <button class="copy" onclick="copyAnalysis()">Copy Analysis</button>
          <button class="export" onclick="exportReport()">Export Report</button>
          <button class="secondary close" onclick="closePanel()">Close</button>
        </div>
      </div>
      
      <script>
        // Toggle section visibility
        function toggleSection(element) {
          element.classList.toggle('collapsed');
          const content = element.nextElementSibling;
          if (content.style.display === 'none') {
            content.style.display = 'block';
          } else {
            content.style.display = 'none';
          }
        }
        
        // Copy analysis to clipboard
        function copyAnalysis() {
          const analysis = document.querySelector('.analysis').textContent;
          navigator.clipboard.writeText(analysis).then(() => {
            showNotification('Analysis copied to clipboard');
            // Send message to extension
            window.parent.postMessage({ command: 'copy', text: analysis }, '*');
          });
        }
        
        // Export report as JSON
        function exportReport() {
          const report = ${JSON.stringify(result)};
          const dataStr = JSON.stringify(report, null, 2);
          const dataBlob = new Blob([dataStr], {type: 'application/json'});
          const url = URL.createObjectURL(dataBlob);
          const link = document.createElement('a');
          link.href = url;
          link.download = 'gituncover-report.json';
          link.click();
          URL.revokeObjectURL(url);
          showNotification('Report exported as JSON');
          // Send message to extension
          window.parent.postMessage({ command: 'export' }, '*');
        }
        
        // Close panel
        function closePanel() {
          window.parent.postMessage({ command: 'close' }, '*');
        }
        
        // Show notification
        function showNotification(message) {
          const notification = document.createElement('div');
          notification.className = 'notification';
          notification.textContent = message;
          document.body.appendChild(notification);
          setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
          }, 3000);
        }
      </script>
    </body>
    </html>
  `;
}

function deactivate() {}

module.exports = {
  activate,
  deactivate
};