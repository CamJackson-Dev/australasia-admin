import { useContext, useState } from "react";
import style from "../admin.module.css";
import { SessionContext } from "@/context/SessionContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { adminLogin } from "@/utils/firebase/auth";
import useToast from "@/hooks/useToast";
import CircularProgress from "@/components/ui/loading";

const AdminLogin = () => {
    const notify = useToast();
    const { updateSession } = useContext(SessionContext);
    const [details, setDetails] = useState({ email: "", password: "" });
    const [incorrect, setIncorrect] = useState(false);
    const [checking, setChecking] = useState(false);

    const onChange = (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
        setDetails({ ...details, [key]: e.target.value });
    };

    const submit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setChecking(true);
        try {
            const cred = await adminLogin({
                email: details.email,
                password: details.password,
            });
            updateSession();
            setChecking(false);
        } catch (e) {
            setIncorrect(true);
            notify("error", e.message);
            setChecking(false);
        }
        // if (
        //     details.email == process.env.NEXT_PUBLIC_ADMIN_UID &&
        //     details.password == process.env.NEXT_PUBLIC_ADMIN_PASS
        // ) {
        //     updateSession();
        // } else {
        //     setIncorrect(true);
        // }
    };

    return (
        <div className={style["login-page"]}>
            <form onSubmit={submit}>
                <div className={style["login-container"]}>
                    <h2 className={" font-[600] text-center text-xl"}>Admin</h2>
                    <Input
                        value={details.email}
                        onChange={(e) => onChange(e, "email")}
                        id="email"
                        className="w-80 h-[44px] border-2 border-[var(--businessInput)]"
                        placeholder="Email"
                    />
                    <Input
                        value={details.password}
                        onChange={(e) => onChange(e, "password")}
                        type="password"
                        id="password"
                        className="w-80 h-[44px] border-2 border-[var(--businessInput)]"
                        placeholder="Password"
                    />
                    {incorrect && (
                        <p className="text-red-400">Incorrect Credentials</p>
                    )}
                    <Button
                        className="flex item-center gap-2"
                        type="submit"
                        variant="default"
                    >
                        <p>Log in</p>
                        {checking && <CircularProgress width={20} />}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default AdminLogin;
