# GitUncover Sublime Text Integration

This directory contains the Sublime Text integration for GitUncover.

## How to Create a Sublime Text Plugin

1. **Set up the Sublime Text Plugin Development Environment**:
   - Install Sublime Text 3 or 4
   - Install Package Control

2. **Create a New Plugin**:
   - Open Sublime Text
   - Select "Tools" > "Developer" > "New Plugin..."
   - Save the file as `GitUncover.py` in your Packages directory

3. **Implement the Plugin**:
   - Create a command to analyze selected code
   - Use the GitUncover core API to analyze code
   - Display the analysis results in a new view

4. **Add a Key Binding**:
   - Open "Preferences" > "Key Bindings"
   - Add a key binding for the GitUncover command

5. **Test the Plugin**:
   - Save the plugin files
   - Test the plugin by selecting code and running the command

## Core API Usage

```python
# Example usage of GitUncover core API
# You'll need to create a wrapper for the Node.js API

import sublime
import sublime_plugin
import subprocess
import json

class GitUncoverCommand(sublime_plugin.TextCommand):
    def run(self, edit):
        # Get the selected code
        selection = self.view.sel()[0]
        if selection.empty():
            sublime.message_dialog("Please select some code to analyze")
            return
        
        # Get the file path
        file_path = self.view.file_name()
        if not file_path:
            sublime.message_dialog("Please save the file first")
            return
        
        # Get the line range
        start_line = self.view.rowcol(selection.begin())[0] + 1
        end_line = self.view.rowcol(selection.end())[0] + 1
        
        # Call GitUncover core API
        # You'll need to implement a bridge to the Node.js API
        result = self.analyze_code(file_path, start_line, end_line)
        
        # Display the result
        self.show_result(result)
    
    def analyze_code(self, file_path, start_line, end_line):
        # Example implementation using subprocess to call GitUncover CLI
        try:
            import os
            gituncover_path = os.path.join(os.path.dirname(__file__), "../../bin/gituncover.js")
            cmd = ["node", gituncover_path, "analyze", file_path, "--lines", f"{start_line}-{end_line}", "--format", "json"]
            output = subprocess.check_output(cmd, stderr=subprocess.STDOUT, text=True)
            return json.loads(output)
        except Exception as e:
            return {"error": str(e)}
    
    def show_result(self, result):
        # Create a new view to display the result
        new_view = self.view.window().new_file()
        new_view.set_name("GitUncover Analysis")
        
        # Format the result
        if "error" in result:
            content = f"Error: {result['error']}"
        else:
            content = f"# GitUncover Analysis\n\n"
            content += f"## Analyzed Code\n```\n{result.get('code', '')}\n```\n\n"
            content += f"## Code Analysis\n{result.get('analysis', '')}\n\n"
            
            if result.get('blameInfo'):
                content += "## Blame Information\n"
                for info in result['blameInfo']:
                    content += f"- Line {info['line']}: {info['author']} ({info['date']})\n"
                    content += f"  Commit: {info['commit'][:7]}\n"
                    content += f"  Message: {info['summary']}\n\n"
            
            if result.get('githubInfo'):
                content += "## GitHub Information\n"
                if result['githubInfo'].get('repository'):
                    repo = result['githubInfo']['repository']
                    content += f"Repository: {repo['owner']}/{repo['repo']}\n\n"
                if result['githubInfo'].get('issues'):
                    content += "Issues:\n"
                    for issue in result['githubInfo']['issues']:
                        content += f"- #{issue['number']}: {issue['title']} ({issue['state']})\n"
                        content += f"  URL: {issue['url']}\n\n"
                if result['githubInfo'].get('prs'):
                    content += "Pull Requests:\n"
                    for pr in result['githubInfo']['prs']:
                        content += f"- #{pr['number']}: {pr['title']} ({pr['state']})\n"
                        content += f"  URL: {pr['url']}\n\n"
            
            if result.get('recommendations'):
                content += "## Recommendations\n"
                for i, rec in enumerate(result['recommendations'], 1):
                    content += f"{i}. {rec}\n"
        
        # Insert the content
        new_view.run_command('insert', {'characters': content})
        new_view.set_syntax_file('Packages/Markdown/Markdown.sublime-syntax')

# Add to Default.sublime-commands
# {
#     "caption": "GitUncover: Analyze Selected Code",
#     "command": "git_uncover"
# }

# Add to Default.sublime-keymap
# {
#     "keys": ["ctrl+alt+g"],
#     "command": "git_uncover"
# }
```

## Resources

- [Sublime Text Plugin API Documentation](https://www.sublimetext.com/docs/api_reference.html)
- [Sublime Text Package Development](https://packagecontrol.io/docs/developers)