import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function ProductList({ onAddToCart }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:9090/api/products")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Fehler beim Laden der Produkte");
        }
        return response.json();
      })
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p className="info-text">Produkte werden geladen...</p>;
  }

  if (error) {
    return <p className="info-text error">Fehler: {error}</p>;
  }

  return (
    <div>
      <div className="page-header">
        <h2>Produkte</h2>
        <p className="subheading">
          Wähle deine Artikel und lege sie in den Warenkorb.
        </p>
      </div>

      {products.length === 0 ? (
        <p className="info-text">Keine Produkte gefunden.</p>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <article key={product.id} className="product-card">
              <div className="product-card-inner">
                <Link
                  to={`/products/${product.id}`}
                  className="product-image-wrap"
                >
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="product-image"
                    />
                  ) : (
                    <div className="product-placeholder">Kein Bild</div>
                  )}
                </Link>

                <div className="product-body">
                  <h3 className="product-title">
                    <Link to={`/products/${product.id}`}>{product.name}</Link>
                  </h3>
                  <p className="product-description">
                    {product.description || "Keine Beschreibung verfügbar."}
                  </p>
                </div>

                <div className="product-footer">
                  <span className="product-price">
                    {Number(product.price).toFixed(2)} €
                  </span>
                  <div className="product-actions">
                    <button
                      className="btn btn-primary"
                      onClick={() => onAddToCart(product)}
                    >
                      In den Warenkorb
                    </button>
                    <Link
                      to={`/products/${product.id}`}
                      className="btn btn-secondary"
                    >
                      Details
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
