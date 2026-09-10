import { Link } from "react-router-dom";
import adminLinks from "./adminLinks";
import "./admin.css";

export default function Admin() {
    return (
        <div className="admin-panel">
            <h2>Painel administrativo</h2>
            <p className="admin-subtitle">Para onde você quer ir?</p>

            <div className="admin-grid">
                {adminLinks.map((link) => {
                    const Icon = link.icon;
                    return (
                        <Link className="admin-card" to={link.to} key={link.id}>
                            <Icon size={28} className="admin-card-icon" />
                            <span>{link.label}</span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}