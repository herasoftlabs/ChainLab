// components/ui/Modal.tsx

import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string; // Yeni description prop'u
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, description, children }) => {
  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" />
        <DialogPrimitive.Content
          className={cn(
            'fixed top-1/2 left-1/2 max-h-[90vh] w-[95vw] max-w-6xl -translate-x-1/2 -translate-y-1/2 rounded-md bg-white p-6 shadow-lg focus:outline-none'
          )}
        >
          <div className="flex items-center justify-between">
            {title && <DialogPrimitive.Title className="text-lg font-medium">{title}</DialogPrimitive.Title>}
            <DialogPrimitive.Close asChild>
              <button
                aria-label="Close"
                className="rounded-full p-1 text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <X className="h-5 w-5" />
              </button>
            </DialogPrimitive.Close>
          </div>
          {description && (
            <DialogPrimitive.Description className="mt-2 text-sm text-gray-500">
              {description}
            </DialogPrimitive.Description>
          )}
          <div className="mt-4">{children}</div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};

export default Modal;
