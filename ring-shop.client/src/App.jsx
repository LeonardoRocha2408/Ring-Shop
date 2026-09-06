import { Routes, Route } from "react-router-dom";
import { Home } from "./pages/home/Home";
import { Login } from "./pages/auth/login/login";
import { ChangePassword } from "./pages/auth/changePassword/changePassword";
import { Register } from "./pages/auth/register/register";
import { useLocation } from "react-router-dom";
import Header from "./components/header/header"
import Footer from "./components/footer/footer";
import Warranty from "./pages/warranty/warranty";
import "./App.css";
import AuthProvider from "./hooks/authUser/authContext";

const routesWithoutHeader = ["/login", "/register", "/change-password"];
export default function App() {
    const location = useLocation();
    const hideHeader = routesWithoutHeader.includes(location.pathname);

    return (
        <>
            {!hideHeader && <Header />}
            <AuthProvider>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/change-password" element={<ChangePassword />} />
                    <Route path="/warranty" element={<Warranty />} />
                </Routes>
            </AuthProvider>
            <Footer />
        </>
    );
}