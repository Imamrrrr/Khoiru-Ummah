import React, { ReactNode, useCallback, useRef } from 'react';
// components
import { Button } from '/src/components/button';

// ----------------------------------------------------------------------

interface DialogConfirmProps {
  label: ReactNode;
  title?: string;
  action: () => void;
}

// ----------------------------------------------------------------------

const DialogConfirm: React.FC<DialogConfirmProps> = ({ label, title, action }) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const handleOpenDialog = useCallback(() => {
    dialogRef.current?.showModal();
  }, []);

  const handleCloseDialog = useCallback(() => {
    dialogRef.current?.close();
  }, []);

  const handleClickConfirm = useCallback(async () => {
    await action();
    dialogRef.current?.close();
  }, [action]);

  return (
    <>
      <Button type="button" variant="gost" onClick={handleOpenDialog}>
        {label}
      </Button>

      <dialog ref={dialogRef} className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="text-lg font-semibold">{title || 'Confirm Dialog'}</h3>

          <div className="modal-action">
            <Button onClick={handleClickConfirm}>Konfirmasi</Button>

            <Button onClick={handleCloseDialog} className="bg-neutral-400 hover:bg-neutral-400/80">
              Keluar
            </Button>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default DialogConfirm;
