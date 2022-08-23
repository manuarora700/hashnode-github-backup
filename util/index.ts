import toast from "react-hot-toast";

export const showSuccess = (message: any) => {
  toast.success(message || "Update Successful");
};

export const showError = (message: any) => {
  toast.error(message || "Update Unsuccessful");
};
