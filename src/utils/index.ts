import toast from "react-hot-toast";

export const successToast = (message: any) => {
  toast.success(message, {
    position: "bottom-center",
  });
};

export const errorToast = (message: any) => {
  toast.error(message, {
    position: "bottom-center",
  });
};
