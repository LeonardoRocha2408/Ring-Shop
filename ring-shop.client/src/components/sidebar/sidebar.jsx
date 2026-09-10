import { NavLink } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import navLinks from "../header/nav-links";
import "./sidebar.css";

export default function Sidebar({ isOpen, onClose }) {
    return (
        <div className={`overlay ${isOpen ? "visible" : ""}`}>
            <aside className={`sidebar ${isOpen ? "open" : ""}`}>

              <div className="title-close">
                  <span> Entrar </span>
                  <button onClick={onClose}> X </button>
              </div>

              <nav className="nav-links">

                    {navLinks.map((item) => (
                        <NavLink className="link nav" to={item.type ? `${item.to}?type=${item.type}` : item.to} key={item.id}>
                            {item.label}
                            {item.hasDropdown && <ChevronDown size={15} className="nav-icon" />}
                        </NavLink>
                  ))}

              </nav>
          </aside>
        </div>
  );
}
