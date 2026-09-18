import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ShowProductsLayout from "../../components/carousel/productsLayout/showProductsLayout";
import "./productsLayout.css";

export default function ProductsLayout() {
    const [searchParams] = useSearchParams();
    const type = searchParams.get("type");

    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);

    const API_URL = import.meta.env.VITE_API_URL;

    const productsPerPage = 20;

    useEffect(() => {
        async function fetchProducts() {
            try {
                console.log("useEffect rodou, type =", type);

                const url = type
                    ? `${API_URL}/products?type=${type}`
                    : `${API_URL}/products`;

                const response = await fetch(url);

                if (!response.ok) {
                    return;
                }

                const data = await response.json();

                setProducts(data);
                setCurrentPage(1);
            }
            catch (error) {
                alert(error);
            }
        }

        fetchProducts();
    }, [type]);

    const totalPages = Math.ceil(products.length / productsPerPage);

    const firstProductIndex = (currentPage - 1) * productsPerPage;
    const lastProductIndex = firstProductIndex + productsPerPage;

    const productsToShow = products.slice(
        firstProductIndex,
        lastProductIndex
    );

    return (
        <div className="products-container">

            {productsToShow.map((product) => (
                <ShowProductsLayout
                    product={product}
                    key={product.id}
                />
            ))}

            {totalPages > 1 && (
                <div className="pagination">

                    <button
                        onClick={() =>
                            setCurrentPage((page) => page - 1)
                        }
                        disabled={currentPage === 1}
                    >
                        Anterior
                    </button>

                    <span>
                        Página {currentPage} de {totalPages}
                    </span>

                    <button
                        onClick={() =>
                            setCurrentPage((page) => page + 1)
                        }
                        disabled={currentPage === totalPages}
                    >
                        Próxima
                    </button>

                </div>
            )}

        </div>
    );
}