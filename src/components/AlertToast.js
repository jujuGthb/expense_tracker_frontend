import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";

export default function AlertToast({ trigger, message }) {
  useEffect(() => {
    if (trigger && message) {
      toast.warning(message, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
      });
    }
  }, [trigger, message]);

  return <ToastContainer />;
}
