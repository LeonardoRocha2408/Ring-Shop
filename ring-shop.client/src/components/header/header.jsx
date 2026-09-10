import { useState } from "react";
import { Link } from "react-router-dom";
import { AnnouncementBar } from "./announcement-bar";
import { ChevronDown } from "lucide-react";
import Sidebar from "../sidebar/sidebar"
import navLinks from "./nav-links";
import "./header.css";
import useAuth from "../../hooks/authUser/useAuth";


function NavigationBar() {
    return (
        <nav className="navi-bar">
            {navLinks.map((item) => (
                <Link className="link nav" to={item.type ? `${item.to}?type=${item.type}` : item.to} key={item.id}>
                    {item.label}
                    {item.hasDropdown && <ChevronDown size={15} className="nav-icon" /> }
                </Link>
            ))}
        </nav>
    );
}


export default function Header() {
    const { user, loading } = useAuth();
    const [isOpen, setIsOpen] = useState(false);

    const [search, setSearch] = useState("");


    return (
        <header className="header">

            <AnnouncementBar className="announcement-bar" />

            
            <div className="brand-search">

                <img src="public/images/open-sidebar-button.png" onClick={() => setIsOpen(true)} className="open-sidebar"/>

                <img src="images/logo.png" className="website-logo" />

                <div className="search">
                    <input
                        placeholder="Buscar"
                        id="search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)} />
                    <label htmlFor="search" className="button-search"> <img src="images/lupa.png" /></label>
                </div>

                {!loading && !user && (
                    <div className="user-features">
                        <img src="images/user.png" />
                        <span> <Link className="link" to="/register">Cadastre-se</Link> |  <Link className="link" to="/login">Fazer login</Link></span>
                    </div>
                )}

                {!loading && user && (
                    <div className="user-features">
                        <img src="images/user.png" />
                        <span>{user.name}</span>
                    </div>
                )}
            </div>
            <NavigationBar />
            <Sidebar isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </header>
    );
}
