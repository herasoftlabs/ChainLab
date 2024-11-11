// src/components/dashboard/FileTreeView.tsx

import { FolderIcon, FileIcon, ChevronDownIcon, ChevronRightIcon } from "lucide-react";
import React, { useState } from "react";

interface FileTreeItem {
  name: string;
  type: 'file' | 'directory';
  children?: FileTreeItem[];
}

interface FileTreeViewProps {
  data: FileTreeItem[];
  level?: number;
}

export const FileTreeView: React.FC<FileTreeViewProps> = ({ data, level = 0 }) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleItem = (name: string) => {
    const newExpanded = new Set(expandedItems);
    if (expandedItems.has(name)) {
      newExpanded.delete(name);
    } else {
      newExpanded.add(name);
    }
    setExpandedItems(newExpanded);
  };

  return (
    <div className="pl-4">
      {data.map((item) => (
        <div key={item.name} className="select-none">
          <div 
            className={`flex items-center gap-1 py-1 hover:bg-secondary/50 rounded px-2 cursor-pointer transition-colors`}
            onClick={() => item.type === 'directory' && toggleItem(item.name)}
          >
            <div className="flex items-center gap-2 min-w-0">
              {item.type === 'directory' && (
                <span className="w-4 h-4 flex items-center justify-center">
                  {expandedItems.has(item.name) ? (
                    <ChevronDownIcon className="w-3 h-3" />
                  ) : (
                    <ChevronRightIcon className="w-3 h-3" />
                  )}
                </span>
              )}
              {item.type === 'directory' ? (
                <FolderIcon className="w-4 h-4 text-yellow-500 flex-shrink-0" />
              ) : (
                <FileIcon className="w-4 h-4 text-blue-500 ml-4 flex-shrink-0" />
              )}
              <span className="text-sm truncate">{item.name}</span>
            </div>
          </div>
          {item.type === 'directory' && 
           item.children && 
           expandedItems.has(item.name) && (
            <div className="ml-4 border-l border-gray-200 dark:border-gray-700">
              <FileTreeView data={item.children} level={level + 1} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};