# GitUncover IntelliJ Integration

This directory contains the IntelliJ IDEA integration for GitUncover.

## How to Create an IntelliJ Plugin

1. **Set up the IntelliJ Plugin Development Environment**:
   - Install IntelliJ IDEA Community Edition or Ultimate Edition
   - Install the Plugin DevKit plugin

2. **Create a New Plugin Project**:
   - Open IntelliJ IDEA
   - Select "File" > "New" > "Project..."
   - Choose "IntelliJ Platform Plugin" and click "Next"
   - Enter "GitUncover" as the project name and click "Finish"

3. **Add Dependencies**:
   - Add the necessary dependencies to your `build.gradle` file
   - Include the GitUncover core library

4. **Implement the Plugin**:
   - Create an action to analyze selected code
   - Use the GitUncover core API to analyze code
   - Display the analysis results in a tool window

5. **Build and Test**:
   - Build the plugin using Gradle
   - Test the plugin in a sandbox environment

6. **Deploy**:
   - Package the plugin as a `.zip` file
   - Publish to the JetBrains Plugin Repository

## Core API Usage

```java
// Example usage of GitUncover core API
// You'll need to create a wrapper for the Node.js API

public class GitUncoverAction extends AnAction {
    @Override
    public void actionPerformed(AnActionEvent e) {
        // Get the selected code
        Editor editor = e.getData(PlatformDataKeys.EDITOR);
        SelectionModel selectionModel = editor.getSelectionModel();
        String selectedText = selectionModel.getSelectedText();
        
        // Get the file path
        VirtualFile virtualFile = e.getData(PlatformDataKeys.VIRTUAL_FILE);
        String filePath = virtualFile.getPath();
        
        // Get the line range
        int startLine = editor.getDocument().getLineNumber(selectionModel.getSelectionStart()) + 1;
        int endLine = editor.getDocument().getLineNumber(selectionModel.getSelectionEnd()) + 1;
        
        // Call GitUncover core API
        // You'll need to implement a bridge to the Node.js API
        GitUncoverResult result = GitUncoverAnalyzer.analyze(filePath, startLine, endLine);
        
        // Display the result
        showResult(result);
    }
}
```

## Resources

- [IntelliJ Platform Plugin SDK Documentation](https://plugins.jetbrains.com/docs/intellij/plugin-development.html)
- [IntelliJ Platform SDK DevGuide](https://jetbrains.org/intellij/sdk/docs/index.html)