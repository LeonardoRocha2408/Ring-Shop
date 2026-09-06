import { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../auth-layout";
import "../layout.css";

async function sendData(email, password, API_URL) {
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                Email: email,
                Password: password
            })
        })
        if (!response.ok) {
            const messageError = await response.text();
            return { sucess: false, message: messageError }
        }

        return {
            sucess: true, message: "Logado com sucesso!"
        }

    }
    catch (error) {
        alert(error);
    }
}

export function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(""); 
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault()
        const API_URL = import.meta.env.VITE_API_URL;
        const result = await sendData(email, password, API_URL)

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

              <span>{error}</span>

              <button className="send-data" type="submit"> Iniciar sessão </button>

              <p>Ainda não tem uma conta? <Link className="link" to="/register">Cadastre-se</Link></p>
          </form>
      </AuthLayout>
  );
}