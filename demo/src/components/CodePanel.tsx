import { useState } from 'react';
import type { DemoConfig } from './types';
import { CodeHighlight } from './CodeHighlight';
import {
  generateInstallCode,
  generateSetupCode,
  generateCustomComponentsCode,
  generateThemeCode,
  generateFormCode,
} from './codeGenerator';

interface CodeSectionProps {
  title: string;
  code: string;
  defaultOpen?: boolean;
}

function CodeSection({ title, code, defaultOpen = true }: CodeSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between px-3 py-2 bg-gray-800/50 sticky top-0 cursor-pointer hover:bg-gray-800"
      >
        <div className="flex items-center gap-1.5 text-xs font-medium text-gray-300">
          <span className={`text-[10px] transition-transform ${isOpen ? 'rotate-90' : ''}`}>▶</span>
          {title}
        </div>
        <button
          onClick={handleCopy}
          className="text-[10px] px-2 py-1 rounded bg-gray-700 hover:bg-gray-600 text-gray-300 transition-colors"
        >
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>
      {isOpen && (
        <div className="px-3 py-2">
          <CodeHighlight code={code} />
        </div>
      )}
    </div>
  );
}

function DoneSection() {
  return (
    <div className="px-3 py-4 text-center">
      <div className="text-lg mb-1">🎉</div>
      <div className="text-xs font-medium text-gray-300">You're all set!</div>
      <div className="text-[10px] text-gray-500 mt-1">Your form is ready to use</div>
    </div>
  );
}

interface CodePanelProps {
  config: DemoConfig;
}

export function CodePanel({ config }: CodePanelProps) {
  return (
    <div className="bg-gray-900 text-gray-100 h-full overflow-y-auto flex flex-col">
      <div className="px-3 py-2 border-b border-gray-700/50 bg-gray-800 flex-shrink-0">
        <h2 className="text-sm font-semibold">Developer Preview</h2>
        <p className="text-[11px] text-gray-500">Code to reproduce this form</p>
      </div>

      <div className="flex-1 overflow-y-auto divide-y divide-gray-800">
        <CodeSection title="0. Install dependencies" code={generateInstallCode()} defaultOpen={false} />
        <CodeSection title="1a. Quick setup" code={generateSetupCode()} defaultOpen={false} />
        <CodeSection title="1b. With custom components (optional)" code={generateCustomComponentsCode()} defaultOpen={false} />
        <CodeSection title="2. Custom theme (optional)" code={generateThemeCode()} defaultOpen={false} />
        <CodeSection title="3. Use SnowForm" code={generateFormCode(config)} />
        <DoneSection />
      </div>
    </div>
  );
}
