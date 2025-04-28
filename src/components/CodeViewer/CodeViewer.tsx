import React, { useState } from 'react';
import { Highlight } from 'prism-react-renderer';
import { CopyToClipboard } from 'react-copy-to-clipboard';
// import { default as defaultTheme } from 'prism-react-renderer';

interface CodeViewerProps {
  code: string;
  language: string;
}

export const CodeViewer: React.FC<CodeViewerProps> = ({ code, language }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="code-viewer">
      <div className="code-toolbar">
        <span className="language-tag">{language}</span>
        <CopyToClipboard text={code} onCopy={handleCopy}>
          <button>{copied ? 'Copied!' : 'Copy'}</button>
        </CopyToClipboard>
      </div>
      <Highlight
        code={code.trim()}
        language={language}
      >
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre className={className} style={style}>
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line })}>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token })} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </div>
  );
};