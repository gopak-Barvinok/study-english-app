export default function ModalWindow({
  modal,
  modalState,
  children,
  className = "",
}: {
  children: React.ReactNode;
  modal: boolean;
  modalState: (bool: boolean) => void;
  className?: string;
}) {
  return (
    <dialog className={`modal modal-bottom sm:modal-middle ${modal ? "modal-open" : ""}`}>
      <div className={`modal-box bg-base-200 border border-base-300 rounded-2xl shadow-2xl ${className}`}>
        {children}
        <div className="modal-action mt-6">
          <form method="dialog">
            <button
              className="btn btn-ghost btn-sm rounded-xl text-base-content/60 hover:text-base-content transition-colors duration-200"
              onClick={() => modalState(false)}
            >
              Close
            </button>
          </form>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop" onClick={() => modalState(false)}>
        <button>close</button>
      </form>
    </dialog>
  );
}
