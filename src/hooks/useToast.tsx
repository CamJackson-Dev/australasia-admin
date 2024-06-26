import { toast } from "react-hot-toast";

type ToastType = "success" | "error" | "loading";

const useToast = () => {
    const notify = (type: ToastType, msg: string) => {
        return toast[type](msg);
    };

    return notify;
};

export default useToast;
