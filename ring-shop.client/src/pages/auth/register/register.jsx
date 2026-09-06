import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, Eye, EyeOff, XCircle, CheckCircle } from "lucide-react";
import validationPassword from "../../../hooks/validationPassword/validationPassword"
import AuthLayout from "../auth-layout";
import "../layout.css";


async function sendData(name, email, password, API_URL) {
    try {
        const response = await fetch(`${API_URL}/create-account`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                Name: name,
                Email: email,
                Password: password
            })
        })
        if (!response.ok) {
            const messageError = await response.text();
            return { sucess: false, message: messageError }
        }

        return {
            sucess: true, message: "Conta criada com sucesso!"
        }

    }
    catch (error) {
        alert(error);
    }
}
   
export function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const validation = validationPassword(password);

    async function handleSubmit(e) {
        e.preventDefault()
        const API_URL = import.meta.env.VITE_API_URL;
        const result = await sendData(name, email, password, API_URL)

        if (result.sucess) {
            navigate("/");
        }
        else {
            setError(result.message);
        }
    }

    return (
        <AuthLayout>
            <form className="auth-form" onSubmit={handleSubmit}>
                <h2>Crie sua conta</h2>

                <div className="organizes-input">
                    <div className="label-wrapper">
                        <label htmlFor="name"> <User size={18} /> </label>
                    </div>
                    <input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        type="name"
                        placeholder="Digite seu nome" />
                </div>

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

                <div className="validation_password">
                    <p>{validation.hasMinLength ? <CheckCircle size={15} color="green" /> : <XCircle size={15} color="red" />} Pelo menos 8 caracteres</p>

                    <p>{validation.hasUpperCase ? <CheckCircle size={15} color="green" /> : <XCircle size={15} color="red" />} Pelo menos uma letra maiúscula</p>

                    <p>{validation.hasLowerCase ? <CheckCircle size={15} color="green" /> : <XCircle size={15} color="red" />} Pelo menos uma letra minúscula</p>

                    <p>{validation.hasNumber ? <CheckCircle size={15} color="green" /> : <XCircle size={15} color="red" />} Pelo menos um número</p>

                    <p>{validation.hasSpecialCharacter ? <CheckCircle size={15} color="green" /> : <XCircle size={15} color="red" />} Pelo menos um caracter especial</p>
                </div>
                <span>{error}</span>
                <button className="send-data" type="submit"> Iniciar sessão </button>

                <p>Já tem uma conta? <Link className="link" to="/login">Entre</Link></p>
            </form>
        </AuthLayout>
    );
}