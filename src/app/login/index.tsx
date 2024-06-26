import { useContext, useState } from "react";
import style from "../admin.module.css";
import { AdminContext } from "@/context/AdminContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const AdminLogin = () => {
    const { updateSession } = useContext(AdminContext);
    const [details, setDetails] = useState({ username: "", password: "" });
    const [incorrect, setIncorrect] = useState(false);

    const onChange = (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
        setDetails({ ...details, [key]: e.target.value });
    };

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (
            details.username == process.env.NEXT_PUBLIC_ADMIN_UID &&
            details.password == process.env.NEXT_PUBLIC_ADMIN_PASS
        ) {
            // console.log(updateSession);
            updateSession();
        } else {
            setIncorrect(true);
        }
    };

    return (
        <div className={style["login-page"]}>
            <form onSubmit={submit}>
                <div className={style["login-container"]}>
                    <h2 className={" font-[600] text-center text-xl"}>
                        Admin
                    </h2>
                    <Input
                        value={details.username}
                        onChange={(e) => onChange(e, "username")}
                        id="username"
                        className="w-80 h-[44px] border-2 border-[var(--businessInput)]"
                        placeholder="Username"
                        // variant="outlined"
                    />
                    <Input
                        value={details.password}
                        onChange={(e) => onChange(e, "password")}
                        type="password"
                        id="password"
                        className="w-80 h-[44px] border-2 border-[var(--businessInput)]"
                        placeholder="Password"
                        // variant="outlined"
                    />
                    {incorrect && (
                        <p style={{ color: "red" }}>Incorrect Credentials</p>
                    )}
                    <Button type="submit" variant="default">
                        Log in
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default AdminLogin;
