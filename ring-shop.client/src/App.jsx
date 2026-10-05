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
import ProductsLayout from "./pages/products/productsLayout";
import AuthProvider from "./hooks/authUser/authContext";
import PostProduct from "./pages/admin/postProduct/postProduct";
import ManageProducts from "./pages/admin/deleteProduct/deleteProduct";
import ManageProductTypes from "./pages/admin/registerType/registerType";
import Admin from "./pages/admin/admin";
import BuyProduct from "./pages/buyProduct/buyProduct";

const routesWithoutHeader = ["/login", "/register", "/change-password"];
const routesWithoutFooter = ["/post-product"];
export default function App() {
    const location = useLocation();
    const hideHeader = routesWithoutHeader.includes(location.pathname);
    const hideFooter = routesWithoutFooter.includes(location.pathname);

    return (
        <>
            <AuthProvider>
                {!hideHeader && <Header />}
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/change-password" element={<ChangePassword />} />
                    <Route path="/warranty" element={<Warranty />} />

                    <Route path="/products" element={<ProductsLayout />} />
                    <Route path="/products/:id" element={<BuyProduct />} />

                    <Route path="/admin" element={<Admin />} />
                    <Route path="/post-product" element={<PostProduct />} />
                    <Route path="/manage-products" element={<ManageProducts />} />
                    <Route path="/manage-type" element={<ManageProductTypes />} />
                </Routes>
            </AuthProvider>
            {!hideFooter && <Footer />}
        </>
    );
}