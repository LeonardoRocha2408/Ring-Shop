import { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import "./deleteProduct.css";

async function deleteProduct(id) {
    const API_URL = import.meta.env.VITE_API_URL;

    const response = await fetch(`${API_URL}/delete-product/${id}`, {
        method: "DELETE",
        credentials: "include"
    });

    if (!response.ok) {
        throw new Error("Não foi possível excluir o produto.");
    }
}

export default function ManageProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchProducts() {
            const API_URL = import.meta.env.VITE_API_URL;

            try {
                const response = await fetch(`${API_URL}/products`, {
                    credentials: "include"
                });

                if (!response.ok) throw new Error("Não foi possível carregar os produtos.");

                const data = await response.json();
                setProducts(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchProducts();
    }, []);

    async function handleDelete(id) {
        const confirmed = window.confirm("Tem certeza que deseja excluir este produto?");
        if (!confirmed) return;

        setError(null);
        setDeletingId(id);

        try {
            await deleteProduct(id);
            setProducts((prev) => prev.filter((p) => p.id !== id));
        } catch (err) {
            setError(err.message);
        } finally {
            setDeletingId(null);
        }
    }

    if (loading) return <p>Carregando produtos...</p>;

    return (
        <div className="manage-products">
            <h2>Gerenciar produtos</h2>
            {error && <p className="form-error">{error}</p>}

            <div className="product-list">
                {products.map((product) => (
                    <div className="product-row" key={product.id}>
                        <img src={product.pictureUrl} alt={product.name} />
                        <span className="product-name">{product.name}</span>
                        <span className="product-price">R$ {product.price.toFixed(2)}</span>
                        <button
                            type="button"
                            className="delete-button"
                            onClick={() => handleDelete(product.id)}
                            disabled={deletingId === product.id}
                        >
                            <Trash2 size={18} />
                            {deletingId === product.id ? "Excluindo..." : "Excluir"}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}