export default function ModalWindow({
  modal,
  modalState,
  children,
}: {
  children: React.ReactNode;
  modal: boolean;
  modalState: (bool: boolean) => void;
}) {
  const handleModalClose = () => {
    modalState(false);
  };

  return (
    <dialog className={`modal ${modal ? "modal-open" : ""}`}>
      <div className="modal-box">
        {children}
        <div className="modal-action">
          <form method="dialog">
            <button className="btn" onClick={() => handleModalClose()}>
              Close
            </button>
          </form>
        </div>
      </div>
    </dialog>
  );
}
