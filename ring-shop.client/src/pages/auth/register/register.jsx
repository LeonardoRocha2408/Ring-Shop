import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import AuthLayout from "../auth-layout";
import "../layout.css";

export function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    return (
        <AuthLayout>
            <form className="auth-form">
                <h2>Bem-vindo de volta</h2>
                <div className="organizes-input">
                    <div className="label-wrapper">
                        <label htmlFor="email"> <Mail size={18} /> </label>
                    </div>
                    <input
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        placeholder="Digite seu email" />
                </div>


                <div className="organizes-input">
                    <div className="label-wrapper">
                        <label htmlFor="password"> <Lock size={18} /> </label>
                    </div>
                    <input
                        id="password" type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Digite sua senha" />

                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="show-password">
                        {showPassword ? <Eye size={15} /> : <EyeOff size={15} />}
                    </button>

                </div>

                <div className="organizes-input">
                    <div className="label-wrapper">
                        <label htmlFor="confirm-password"> <Lock size={18} /> </label>
                    </div>
                    <input
                        id="confirm-password" type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirme sua senha" />

                    <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="show-password">
                        {showConfirmPassword ? <Eye size={15} /> : <EyeOff size={15} />}
                    </button>

                </div>

                <button className="send-data" type="submit"> Iniciar sessão </button>

                <p>Já tem uma conta? <Link className="link" to="/login">Entre</Link></p>
            </form>
        </AuthLayout>
    );
}