import React, { useState } from 'react';
import { CodePreview } from './CodePreview';
import './CodeDebugger.css';

interface DebuggerProps {
  code: string;
  language: string;
  onDebug: (debugInfo: DebugInfo) => void;
  onRefactor: (refactoredCode: string) => void;
}

export interface DebugInfo {
  issues: DebugIssue[];
  suggestions: string[];
}

export interface DebugIssue {
  line: number;
  column?: number;
  message: string;
  severity: 'error' | 'warning' | 'info';
  fix?: string;
}

export const CodeDebugger: React.FC<DebuggerProps> = ({
  code,
  language,
  onDebug,
  onRefactor,
}) => {
  const [issues, setIssues] = useState<DebugIssue[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refactoredCode, setRefactoredCode] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Example debug issues for demonstration
  const exampleIssues: DebugIssue[] = [
    {
      line: 5,
      column: 10,
      message: 'Variable \'count\' is used before being defined',
      severity: 'error',
      fix: 'Initialize \'count\' with a default value: const count = 0;'
    },
    {
      line: 12,
      message: 'Function \'calculateTotal\' is complex (cyclomatic complexity: 15)',
      severity: 'warning',
      fix: 'Consider breaking this function into smaller, more focused functions'
    },
    {
      line: 24,
      message: 'Unused variable \'temp\'',
      severity: 'info',
      fix: 'Remove the unused variable'
    }
  ];

  // Example refactoring suggestions
  const exampleSuggestions = [
    'Extract the calculation logic into a separate function',
    'Use destructuring for props to improve readability',
    'Consider using React.memo for performance improvement',
    'Replace imperative logic with declarative approach',
  ];

  const simulateDebug = () => {
    setIsLoading(true);
    // Simulate API call to debug service
    setTimeout(() => {
      setIssues(exampleIssues);
      setSuggestions(exampleSuggestions);
      onDebug({
        issues: exampleIssues,
        suggestions: exampleSuggestions
      });
      setIsLoading(false);
    }, 1500);
  };

  const simulateRefactor = () => {
    setIsLoading(true);
    // Simulate API call to refactor service
    setTimeout(() => {
      // Example refactored code - in a real implementation, this would be from an API
      const refactored = code
        .replace(/function /g, 'const ')
        .replace(/\) {/g, ') => {')
        .replace(/var /g, 'const ');
      
      setRefactoredCode(refactored);
      onRefactor(refactored);
      setIsLoading(false);
    }, 2000);
  };

  // Function to get CSS class for severity
  const getSeverityClass = (severity: string): string => {
    return `severity-${severity}`;
  };

  const getBadgeClass = (severity: string): string => {
    return `badge-${severity}`;
  };

  return (
    <div className="debug-container">
      <div className="debug-header">
        <div className="debug-title">Code Debugger & Refactor</div>
        <div className="debug-action-group">
          <button 
            className={`debug-button debug-button-blue ${isLoading ? 'debug-button-blue-disabled' : ''}`}
            disabled={isLoading}
            onClick={simulateDebug}
          >
            {isLoading ? 'Analyzing...' : 'Debug Code'}
          </button>
          <button 
            className={`debug-button debug-button-purple ${isLoading ? 'debug-button-purple-disabled' : ''}`}
            disabled={isLoading}
            onClick={simulateRefactor}
          >
            {isLoading ? 'Processing...' : 'Suggest Refactoring'}
          </button>
        </div>
      </div>

      {issues.length > 0 && (
        <div className="debug-issues">
          <div className="debug-issues-title">
            Found {issues.length} issues:
          </div>
          {issues.map((issue, index) => (
            <div 
              key={index} 
              className={`debug-issue ${getSeverityClass(issue.severity)}`}
            >
              <div className="debug-issue-header">
                <span className={`debug-issue-badge ${getBadgeClass(issue.severity)}`}>
                  {issue.severity}
                </span>
                <span className="debug-issue-location">
                  Line {issue.line}{issue.column ? `:${issue.column}` : ''}
                </span>
              </div>
              <div className="debug-issue-message">
                {issue.message}
              </div>
              {issue.fix && (
                <div className="debug-issue-fix">
                  Suggestion: {issue.fix}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {suggestions.length > 0 && (
        <div>
          <button 
            className={`debug-suggestions-header ${showSuggestions ? 'debug-suggestions-header-open' : ''}`}
            onClick={() => setShowSuggestions(!showSuggestions)}
          >
            <span>Refactoring Suggestions</span>
            <span>{showSuggestions ? '▲' : '▼'}</span>
          </button>
          
          {showSuggestions && (
            <div className="debug-suggestions-content">
              {suggestions.map((suggestion, index) => (
                <div 
                  key={index} 
                  className="debug-suggestion"
                >
                  {suggestion}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {refactoredCode && (
        <div className="debug-refactored">
          <div className="debug-section-title">
            Refactored Code:
          </div>
          <CodePreview
            code={refactoredCode}
            language={language}
            explanation="This is a refactored version of your code with improvements in modern syntax, readability, and code organization."
          />
        </div>
      )}

      <div className="debug-original">
        <div className="debug-section-title">
          Original Code:
        </div>
        <CodePreview
          code={code}
          language={language}
        />
      </div>
    </div>
  );
};

// Utility component to show diff between original and refactored code
export const CodeDiff: React.FC<{
  original: string;
  refactored: string;
  language: string;
}> = ({ original, refactored, language }) => {
  // This is a simplified diff view - a real implementation would use a diff library
  return (
    <div className="debug-diff">
      <div className="debug-section-title">
        Code Differences:
      </div>
      <div className="debug-diff-container">
        <div className="debug-diff-panel">
          <div className="debug-diff-title debug-diff-title-original">
            Original
          </div>
          <CodePreview code={original} language={language} />
        </div>
        <div className="debug-diff-panel">
          <div className="debug-diff-title debug-diff-title-refactored">
            Refactored
          </div>
          <CodePreview code={refactored} language={language} />
        </div>
      </div>
    </div>
  );
};
