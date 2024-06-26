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
                    <h2 className={"text-black font-[500] text-center text-lg"}>
                        Admin
                    </h2>
                    <Input
                        value={details.username}
                        onChange={(e) => onChange(e, "username")}
                        id="username"
                        className="w-80"
                        placeholder="Username"
                        // variant="outlined"
                        style={{ fontFamily: "Poppins" }}
                    />
                    <Input
                        value={details.password}
                        onChange={(e) => onChange(e, "password")}
                        type="password"
                        id="outlined-basic"
                        placeholder="Password"
                        // variant="outlined"
                        style={{ fontFamily: "Poppins" }}
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
