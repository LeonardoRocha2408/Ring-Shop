import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ShowProductsLayout from "../../components/carousel/productsLayout/showProductsLayout";
import "./productsLayout.css";

export default function ProductsLayout() {
    const [searchParams] = useSearchParams();
    const type = searchParams.get("type");

    const [products, setProducts] = useState([]);
    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        async function fetchProducts() {
            try {
                console.log("useEffect rodou, type =", type);
                const url = type ?`${API_URL}/products?type=${type}` : `${API_URL}/products`;
                const response = await fetch(url);

                if (!response.ok) {
                    return;
                }

                const data = await response.json();
                setProducts(data);
            }
            catch (error) {
                alert(error);
            }
        }
        fetchProducts();
    }, [type]);

    return (
        <div className="products-container">
            {products.map((product) => (
                <ShowProductsLayout product={product} key={product.id} />
            ))}
        </div>
    );
}