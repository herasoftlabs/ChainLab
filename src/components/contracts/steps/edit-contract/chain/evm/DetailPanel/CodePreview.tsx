// components/contracts/steps/edit-contract/chain/evm/DetailPanel/CodePreview.tsx

import React from 'react';
/* import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'; */
import { DraggableComponent } from '@/types/evm/contractTypes';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import { toast } from 'react-toastify';
/* import { generateComponentCode } from '@/utils/chain-specific/componentGenerator'; */

interface Props {
  component: DraggableComponent;
}

export const CodePreview: React.FC<Props> = ({ component }) => {
 
  const [copied, setCopied] = React.useState(false);

 /*  const code = generateComponentCode(component.type, component); */

  const handleCopy = async () => {
   /*  await navigator.clipboard.writeText(code); */
    setCopied(true);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopied(false), 1000);
  };

  return (
    <div className="rounded-lg border bg-muted">
      <div className="flex items-center justify-between px-4 py-2 border-b">
        <h3 className="text-sm font-medium">Solidity Code</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="h-8 w-8 p-0"
        >
          {copied ? (
            <Check className="h-4 w-4" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      </div>
      {/* <SyntaxHighlighter
        language="solidity"
        style={vscDarkPlus}
        customStyle={{
          margin: 0,
          borderRadius: '0 0 0.5rem 0.5rem',
        }}
      >
      </SyntaxHighlighter> */}
      {/*   {code} */}
    </div>
  );
};