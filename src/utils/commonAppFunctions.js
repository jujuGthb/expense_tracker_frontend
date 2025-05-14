import Swal from "sweetalert2";
import "./AlertDialog.css"; // Custom styles

export const AlertDialog = ({ open, message, severity, onClose }) => {
  if (open) {
    Swal.fire({
      icon: severity === "error" ? "error" : "success",
      title: severity === "error" ? "Oops!" : "Great!",
      html: `<div class="custom-alert-content">${message}</div>`,
      showCancelButton: false,
      confirmButtonText: "Close",
      customClass: {
        popup: "custom-alert-popup",
        title: "custom-alert-title",
        confirmButton: "custom-alert-confirm-button",
      },
    }).then(() => {
      onClose();
    });
  }

  return null;
};
