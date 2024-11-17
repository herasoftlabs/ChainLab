// components/contracts/steps/edit-contract/chain/evm/DetailPanel/Functions/FunctionBody.tsx
import React from 'react';
import Editor from '@monaco-editor/react';
import { Card } from '@/components/ui/card';
import { BodyContent } from '@/types/evm/contractTypes';
import * as monaco from 'monaco-editor';


interface FunctionBodyProps {
    body?: BodyContent;
    onChange: (body: BodyContent) => void;
    contractData?: {
      events?: Array<{
        name: string;
        parameters: Array<{
          name: string;
          type: string;
          indexed?: boolean;
        }>;
      }>;
      stateVariables?: Array<{
        name: string;
        type: string;
      }>;
      modifiers?: Array<{
        name: string;
        parameters?: Array<{
          name: string;
          type: string;
        }>;
      }>;
      mappings?: Array<{
        name: string;
        keyType: string;
        valueType: string;
      }>;
      functions?: Array<{
        name: string;
        parameters: Array<{
          name: string;
          type: string;
        }>;
      }>;
    };
  }


  export const FunctionBody: React.FC<FunctionBodyProps> = ({ body, onChange, contractData }) => {
    
    const handleEditorChange = (value: string | undefined) => {
      onChange({ content: value || '' });
    };
  
    const editorOptions: monaco.editor.IStandaloneEditorConstructionOptions = {
      minimap: { enabled: false },
      fontSize: 12,
      lineHeight: 18,
      padding: { top: 8, bottom: 8 },
      scrollBeyondLastLine: false,
      folding: true,
      lineNumbers: 'off' as const,
      renderLineHighlight: 'all',
      suggestOnTriggerCharacters: true,
      formatOnPaste: true,
      formatOnType: true,
      automaticLayout: true,
      wordWrap: 'on',
      scrollbar: {
        vertical: 'auto',
        horizontal: 'auto',
      },
      fixedOverflowWidgets: true,
      overviewRulerBorder: false,
      overviewRulerLanes: 0,
      hideCursorInOverviewRuler: true,
      renderWhitespace: 'none',
      guides: {
        indentation: true,
        bracketPairs: true,
      },
      quickSuggestions: true,
      snippetSuggestions: 'top',
      tabSize: 4,
      bracketPairColorization: {
        enabled: true,
      },
    };

    const solidityConfig = {
      keywords: [
        'contract', 'library', 'interface', 'function', 'modifier',
        'event', 'struct', 'enum', 'mapping', 'address', 'bool',
        'string', 'bytes', 'uint', 'int', 'if', 'else', 'for',
        'while', 'do', 'break', 'continue', 'return', 'emit',
        'public', 'private', 'internal', 'external', 'pure',
        'view', 'payable', 'storage', 'memory', 'calldata',
        'require', 'revert', 'assert', 'this', 'super'
      ],
      operators: [
        '=', '>', '<', '!', '~', '?', ':',
        '==', '<=', '>=', '!=', '&&', '||', '++', '--',
        '+', '-', '*', '/', '&', '|', '^', '%', '<<',
        '>>', '>>>', '+=', '-=', '*=', '/=', '&=', '|=',
        '^=', '%=', '<<=', '>>=', '>>>='
      ],
      symbols: /[=><!~?:&|+\-*\/\^%]+/,
    };
  
    const createCompletionItems = (
        model: monaco.editor.ITextModel,
        position: monaco.Position
      ): monaco.languages.ProviderResult<monaco.languages.CompletionList> => {
        const word = model.getWordUntilPosition(position);
        const range: monaco.IRange = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn
        };
      
        const suggestions: monaco.languages.CompletionItem[] = [
          // Base control structors
          {
            label: 'if',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: 'if (${1:condition}) {\n\t${2}\n}',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'If statement',
            range
          },
          {
            label: 'ifelse',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: 'if (${1:condition}) {\n\t${2}\n} else {\n\t${3}\n}',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'If-else statement',
            range
          },
          {
            label: 'for',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: 'for (uint ${1:i} = 0; ${1:i} < ${2:length}; ${1:i}++) {\n\t${3}\n}',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'For loop',
            range
          },
          {
            label: 'while',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: 'while (${1:condition}) {\n\t${2}\n}',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'While loop',
            range
          },
      
          // Security controls
          {
            label: 'require',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: 'require(${1:condition}, "${2:error message}");',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Add a require statement',
            range
          },
          {
            label: 'revert',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: 'revert("${1:error message}");',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Revert the transaction',
            range
          },
      
          // SafeMath actions
          {
            label: 'safeAdd',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: '${1:number1}.add(${2:number2})',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'SafeMath addition',
            range
          },
          {
            label: 'safeSub',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: '${1:number1}.sub(${2:number2})',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'SafeMath subtraction',
            range
          },

          // Contract values
          {
            label: 'msg.sender',
            kind: monaco.languages.CompletionItemKind.Variable,
            insertText: 'msg.sender',
            documentation: 'Address of the message sender',
            range
          },
          {
            label: 'msg.value',
            kind: monaco.languages.CompletionItemKind.Variable,
            insertText: 'msg.value',
            documentation: 'Amount of ETH sent with the message',
            range
          },
        ];
      
        // Event
        contractData?.events?.forEach(event => {
          const paramsList = event.parameters
            .map(p => `${p.name}${p.indexed ? ' indexed' : ''}: ${p.type}`)
            .join(', ');
          
          suggestions.push({
            label: `emit ${event.name}`,
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: `emit ${event.name}(${
              event.parameters.map((_, i) => `\${${i + 1}}`).join(', ')
            });`,
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: {
              value: `Event signature:\n\`\`\`solidity\nevent ${event.name}(${paramsList})\n\`\`\``
            },
            range
          });
        });
      
        // Modifier
        contractData?.modifiers?.forEach(modifier => {
          const params = modifier.parameters
            ? modifier.parameters.map((_, i) => `\${${i + 1}}`).join(', ')
            : '';
          
          suggestions.push({
            label: modifier.name,
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: `${modifier.name}(${params})`,
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: `Apply ${modifier.name} modifier`,
            range
          });
        });
      
        // State variable
        contractData?.stateVariables?.forEach(variable => {
          suggestions.push({
            label: variable.name,
            kind: monaco.languages.CompletionItemKind.Field,
            insertText: variable.name,
            documentation: `State variable of type ${variable.type}`,
            range
          });
        });
      
        // Mapping
        contractData?.mappings?.forEach(mapping => {
          suggestions.push({
            label: `${mapping.name}[]`,
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: `${mapping.name}[\${1:key}]`,
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: `Mapping from ${mapping.keyType} to ${mapping.valueType}`,
            range
          });
        });
      
        // Function
        contractData?.functions?.forEach(func => {
          if (func.name !== 'constructor') {
            const paramsList = func.parameters
              .map((p, i) => `\${${i + 1}:${p.name}}`)
              .join(', ');
            
            suggestions.push({
              label: `${func.name}()`,
              kind: monaco.languages.CompletionItemKind.Function,
              insertText: `${func.name}(${paramsList})`,
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: `Call function ${func.name}`,
              range
            });
          }
        });
      
        return { suggestions };
    };


    return (
      <Card className="rounded-lg overflow-hidden">
        <Editor
          height="300px"
          defaultLanguage="solidity"
          theme="vs-dark"
          value={body?.content || ''}
          onChange={handleEditorChange}
          options={editorOptions}
          className="mx-auto"
          beforeMount={(monaco) => {
            monaco.languages.register({ id: 'solidity' });
            monaco.languages.setMonarchTokensProvider('solidity', {
              keywords: solidityConfig.keywords,
              operators: solidityConfig.operators,
              symbols: solidityConfig.symbols,
              tokenizer: {
                root: [
                  [/[a-zA-Z_]\w*/, {
                    cases: {
                      '@keywords': 'keyword',
                      '@default': 'identifier'
                    }
                  }],
                  [/[{}()\[\]]/, '@brackets'],
                  [/@symbols/, {
                    cases: {
                      '@operators': 'operator',
                      '@default': ''
                    }
                  }],
                  [/\d+/, 'number'],
                  [/"([^"\\]|\\.)*$/, 'string.invalid'],
                  [/"/, { token: 'string.quote', bracket: '@open', next: '@string' }],
                  [/\/\/.*$/, 'comment'],
                  [/\/\*/, 'comment', '@comment'],
                ],
                string: [
                  [/[^\\"]+/, 'string'],
                  [/"/, { token: 'string.quote', bracket: '@close', next: '@pop' }]
                ],
                comment: [
                  [/[^\/*]+/, 'comment'],
                  [/\*\//, 'comment', '@pop'],
                  [/[\/*]/, 'comment']
                ]
              }
            });
  
            monaco.languages.registerCompletionItemProvider('solidity', {
              provideCompletionItems: createCompletionItems
            });
  
            monaco.editor.defineTheme('solidity-dark', {
              base: 'vs-dark',
              inherit: true,
              rules: [
                { token: 'keyword', foreground: '569CD6', fontStyle: 'bold' },
                { token: 'comment', foreground: '608B4E', fontStyle: 'italic' },
                { token: 'string', foreground: 'CE9178' },
                { token: 'number', foreground: 'B5CEA8' },
                { token: 'operator', foreground: 'D4D4D4' },
              ],
              colors: {
                'editor.background': '#1E1E1E',
                'editor.foreground': '#D4D4D4',
                'editor.lineHighlightBackground': '#2D2D2D',
                'editorCursor.foreground': '#AEAFAD',
                'editor.selectionBackground': '#264F78',
                'editor.inactiveSelectionBackground': '#3A3D41',
              }
            });
  
            monaco.editor.setTheme('solidity-dark');
          }}
        />
      </Card>
    );
  };