interface CodeHighlightProps {
  code: string;
  className?: string;
}

type Token = { type: 'code' | 'string' | 'comment'; content: string };

function tokenize(code: string): Token[] {
  const tokens: Token[] = [];
  let remaining = code;

  while (remaining.length > 0) {
    // Check for single-line comment
    const commentMatch = remaining.match(/^(\/\/.*?)(\n|$)/);
    if (commentMatch) {
      tokens.push({ type: 'comment', content: commentMatch[1] });
      remaining = remaining.slice(commentMatch[1].length);
      continue;
    }

    // Check for strings (single, double, template)
    const stringMatch = remaining.match(/^('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*`)/);
    if (stringMatch) {
      tokens.push({ type: 'string', content: stringMatch[1] });
      remaining = remaining.slice(stringMatch[1].length);
      continue;
    }

    // Find next special token
    const nextSpecial = remaining.search(/\/\/|'|"|`/);
    if (nextSpecial === -1) {
      tokens.push({ type: 'code', content: remaining });
      break;
    } else if (nextSpecial === 0) {
      // Single char that didn't match patterns above
      tokens.push({ type: 'code', content: remaining[0] });
      remaining = remaining.slice(1);
    } else {
      tokens.push({ type: 'code', content: remaining.slice(0, nextSpecial) });
      remaining = remaining.slice(nextSpecial);
    }
  }

  return tokens;
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function highlightCodeToken(code: string): string {
  let result = escapeHtml(code);

  // Keywords
  const keywords = [
    'const', 'let', 'var', 'function', 'return', 'import', 'export',
    'from', 'default', 'if', 'else', 'async', 'await', 'new', 'typeof',
    'true', 'false', 'null', 'undefined', 'type'
  ];
  const keywordRegex = new RegExp(`\\b(${keywords.join('|')})\\b`, 'g');
  result = result.replace(keywordRegex, '<span class="code-keyword">$1</span>');

  // Numbers
  result = result.replace(/\b(\d+)\b/g, '<span class="code-number">$1</span>');

  // Types (PascalCase)
  result = result.replace(/\b([A-Z][a-zA-Z0-9]*)\b/g, '<span class="code-type">$1</span>');

  // Function calls
  result = result.replace(/\b([a-z][a-zA-Z0-9]*)\s*\(/g, '<span class="code-function">$1</span>(');

  return result;
}

function highlightCode(code: string): string {
  const tokens = tokenize(code);

  return tokens.map(token => {
    switch (token.type) {
      case 'comment':
        return `<span class="code-comment">${escapeHtml(token.content)}</span>`;
      case 'string':
        return `<span class="code-string">${escapeHtml(token.content)}</span>`;
      case 'code':
        return highlightCodeToken(token.content);
    }
  }).join('');
}

export function CodeHighlight({ code, className = '' }: CodeHighlightProps) {
  const highlighted = highlightCode(code);

  return (
    <pre className={`overflow-x-auto text-sm leading-relaxed ${className}`}>
      <code
        className="block"
        dangerouslySetInnerHTML={{ __html: highlighted }}
      />
    </pre>
  );
}
