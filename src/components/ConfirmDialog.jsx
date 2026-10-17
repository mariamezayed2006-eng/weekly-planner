import { useEffect, useRef } from "react";

export default function ConfirmDialog({
  title,
  message,
  confirmLabel = "Confirm",
  onConfirm,
  onCancel,
}) {
  const cancelRef = useRef(null);

  useEffect(() => {
    cancelRef.current?.focus();
    const onKey = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onCancel();
      }
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onCancel]);

  return (
    <div
      className="overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div
        className="dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        aria-describedby="dialog-msg"
      >
        <h3 id="dialog-title" className="dialog__title">
          {title}
        </h3>
        <p id="dialog-msg" className="dialog__msg">
          {message}
        </p>
        <div className="dialog__actions">
          <button type="button" ref={cancelRef} className="btn" onClick={onCancel}>
            Cancel
          </button>
          <button type="button" className="btn btn--primary" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
