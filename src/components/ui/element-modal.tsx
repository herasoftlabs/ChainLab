import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  tabs?: { label: string; content: React.ReactNode }[]; // Tab yapısı dinamik olacak
  activeTabIndex?: number; // Başlangıçta hangi tab'ın açık olacağını belirlemek için
  setActiveTabIndex?: (index: number) => void; // Tab değişikliği için callback
  
}

const ElementModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  tabs = [], // varsayılan boş tablar
  activeTabIndex = 0, // varsayılan olarak ilk tab açık
  setActiveTabIndex = () => {}, // varsayılan olarak boş
  
}) => {
  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" />
        
        <DialogPrimitive.Content
          className={cn(
            `fixed top-1/2 left-1/2 h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-md bg-white  shadow-lg focus:outline-none flex`
          )}
        >
          <div className="w-2/3 flex flex-col p-6">
            <div className="flex items-center justify-between mb-4">
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

            {/* Dinamik Tab'lar */}
            <div>
              <div className="mb-4 border-b">
                {tabs.map((tab, index) => (
                  <button
                    key={index}
                    className={`ml-4 px-4 py-2 ${index === activeTabIndex ? 'border-b-4 border-blue-500 font-semibold' : ''}`}
                    onClick={() => setActiveTabIndex(index)}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Seçili tab içeriği */}
              <div className="flex-grow">{tabs[activeTabIndex]?.content}</div>
            </div>
          </div>

          {/* Sağda Preview Paneli */}
          <div className="w-1/3 bg-gray-100 p-6 rounded-r-lg flex flex-col justify-between relative">
            {children}
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};

export default ElementModal;
