import { NavLink } from "react-router-dom";
import navLinks from "../header/nav-links"
import "./sidebar.css"

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
                      <NavLink to={item.to} key={item.id} onClick>
                          {item.label}
                      </NavLink>
                  ))}

              </nav>
          </aside>
        </div>
  );
}
