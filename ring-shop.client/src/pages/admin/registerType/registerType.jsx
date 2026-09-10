import { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import "./registerType.css";

export default function ManageProductTypes() {
    const [productTypes, setProductTypes] = useState([]);
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchProductTypes() {
            const API_URL = import.meta.env.VITE_API_URL;

            try {
                const response = await fetch(`${API_URL}/product-types`, {
                    credentials: "include"
                });

                if (!response.ok) throw new Error("Não foi possível carregar as categorias.");

                const data = await response.json();
                setProductTypes(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchProductTypes();
    }, []);

    

    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);
        setSubmitting(true);

        const API_URL = import.meta.env.VITE_API_URL;

        try {
            const response = await fetch(`${API_URL}/register-product-type`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name
                })
            });

            if (!response.ok) throw new Error("Não foi possível criar a categoria.");

            const newType = await response.json();
            setProductTypes((prev) => [...prev, newType]);
            setName("");
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    }

    async function handleDelete(id) {
        const confirmed = window.confirm("Tem certeza que deseja excluir esta categoria?");
        if (!confirmed) return;

        setError(null);
        setDeletingId(id);

        const API_URL = import.meta.env.VITE_API_URL;

        try {
            const response = await fetch(`${API_URL}/delete-product-type/${id}`, {
                method: "DELETE",
                credentials: "include"
            });

            if (!response.ok) throw new Error("Não foi possível excluir a categoria.");

            setProductTypes((prev) => prev.filter((t) => t.id !== id));
        } catch (err) {
            setError(err.message);
        } finally {
            setDeletingId(null);
        }
    }

    return (
        <div className="manage-types">
            <h2>Categorias de produto</h2>
            <p className="manage-types-subtitle">Adicione ou remova categorias</p>

            <form className="type-form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Ex: Alianças, Pulseiras, Colares..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <button type="submit" disabled={submitting}>
                    {submitting ? "Adicionando..." : "Adicionar"}
                </button>
            </form>

            {error && <p className="form-error">{error}</p>}

            {loading ? (
                <p className="loading-text">Carregando categorias...</p>
            ) : (
                <div className="type-list">
                    {productTypes.length === 0 && (
                        <p className="empty-text">Nenhuma categoria cadastrada ainda.</p>
                    )}

                    {productTypes.map((type) => (
                        <div className="type-row" key={type.id}>
                            <span>{type.name}</span>
                            <button
                                type="button"
                                className="delete-type-button"
                                onClick={() => handleDelete(type.id)}
                                disabled={deletingId === type.id}
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}