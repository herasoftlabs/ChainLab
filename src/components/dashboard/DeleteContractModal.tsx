// src/components/dashboard/DeleteContractModal.tsx

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
  } from "@/components/ui/alert-dialog";
  
  interface DeleteContractModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    contractName: string;
  }
  
  export const DeleteContractModal: React.FC<DeleteContractModalProps> = ({
    open,
    onOpenChange,
    onConfirm,
    contractName,
  }) => {
    return (
      <AlertDialog open={open} onOpenChange={onOpenChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Contract'ı Sil</AlertDialogTitle>
            <AlertDialogDescription>
              <span className="font-medium text-destructive">{contractName}</span> isimli contract'ı silmek istediğinize emin misiniz?
              Bu işlem geri alınamaz ve contract dosyası kalıcı olarak silinecektir.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>İptal</AlertDialogCancel>
            <AlertDialogAction
              onClick={onConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Sil
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  };