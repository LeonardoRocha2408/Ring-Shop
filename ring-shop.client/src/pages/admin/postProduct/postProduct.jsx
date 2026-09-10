import { useState, useRef, useEffect } from "react";
import { ImagePlus, X } from "lucide-react";
import "./postProduct.css";

export default function PostProduct() {
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [type, setType] = useState("");
    const [productTypes, setProductTypes] = useState([]);
    const [loadingTypes, setLoadingTypes] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);

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
                setLoadingTypes(false);
            }
        }

        fetchProductTypes();
    }, []);

    function handleImageChange(e) {
        const file = e.target.files[0];
        if (!file) return;

        setImage(file);
        setPreview(URL.createObjectURL(file));
    }

    function handleRemoveImage() {
        setImage(null);
        setPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    }

    function handleDrop(e) {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith("image/")) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    }

    function handlePriceChange(e) {
        const value = e.target.value.replace(/[^0-9.,]/g, "");
        setPrice(value);
    }

    async function postProduct(formData) {
        const API_URL = import.meta.env.VITE_API_URL;

        const response = await fetch(`${API_URL}/post-product`, {
            method: "POST",
            credentials: "include",
            body: formData
        });

        if (!response.ok) {
            throw new Error("Não foi possível publicar o produto.");
        }

        return response.json();
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);
        setSubmitting(true);

        try {
            const formData = new FormData();
            formData.append("name", name);
            formData.append("price", price.replace(",", "."));
            formData.append("type", type);
            if (image) formData.append("picture", image);

            await postProduct(formData);

            setName("");
            setPrice("");
            setType("");
            handleRemoveImage();
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <form className="product-form" onSubmit={handleSubmit}>
            <label
                className={`image-drop ${preview ? "has-image" : ""}`}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
            >
                {preview ? (
                    <>
                        <img src={preview} alt="Preview do produto" />
                        <button
                            type="button"
                            className="remove-image"
                            onClick={handleRemoveImage}
                        >
                            <X size={16} />
                        </button>
                    </>
                ) : (
                    <div className="drop-placeholder">
                        <ImagePlus size={32} />
                        <span>Clique ou arraste uma imagem</span>
                        <span className="drop-hint">PNG, JPG até 5MB</span>
                    </div>
                )}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    hidden
                />
            </label>

            <div className="field">
                <label htmlFor="product-name">Nome do produto</label>
                <input
                    id="product-name"
                    type="text"
                    placeholder="Ex: Aliança Coleção Brilho Eterno"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </div>

            <div className="field">
                <label htmlFor="product-type">Categoria</label>
                <select
                    id="product-type"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    disabled={loadingTypes}
                    required
                >
                    <option value="" disabled>
                        {loadingTypes ? "Carregando categorias..." : "Selecione uma categoria"}
                    </option>
                    {productTypes.map((option) => (
                        <option key={option.id ?? option.value} value={option.value ?? option.name}>
                            {option.label ?? option.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="field">
                <label htmlFor="product-price">Preço</label>
                <div className="price-input">
                    <span className="currency">R$</span>
                    <input
                        id="product-price"
                        type="text"
                        inputMode="decimal"
                        placeholder="0,00"
                        value={price}
                        onChange={handlePriceChange}
                        required
                    />
                </div>
            </div>

            {error && <p className="form-error">{error}</p>}

            <button type="submit" className="submit-button" disabled={submitting}>
                {submitting ? "Publicando..." : "Publicar produto"}
            </button>
        </form>
    );
}