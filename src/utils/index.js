import toast from "react-hot-toast";

export const successToast = (message) => {
  toast.success(message, {
    position: "bottom-center",
    duration: 500,
  });
};

export const errorToast = (message) => {
  toast.error(message, {
    position: "bottom-center",
    duration: 500,
  });
};
