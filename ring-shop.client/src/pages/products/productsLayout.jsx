/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ShowProductsLayout from "../../components/carousel/productsLayout/showProductsLayout";
import "./productsLayout.css";

export default function ProductsLayout() {
    const [searchParams] = useSearchParams();
    const type = searchParams.get("type");

    const [products, setProducts] = useState(null);
    const API_URL = import.meta.env.VITE_API_URL;
    useEffect(() => {
        async function fetchProducts() {
            try {
                const response = await fetch(`${API_URL}/products?type${type}`)
                if (!response.ok) {
                    return;
                }
                return setProducts(await response.json());
            }
            catch (error) {
                alert(error);
            }
        }
        fetchProducts();
    }, [type]);

  return (
      <div className="products-container">
          {products.map((product) => {
              <ShowProductsLayout product={product} />
          }) }
      </div>
  );
}