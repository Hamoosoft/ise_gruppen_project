import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

export default function ProductDetail({ onAddToCart }) {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:9090/api/products/${id}`)
      .then((response) => {
        if (response.status === 404) {
          throw new Error("Produkt nicht gefunden");
        }
        if (!response.ok) {
          throw new Error("Fehler beim Laden des Produkts");
        }
        return response.json();
      })
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <p className="info-text">Produkt wird geladen...</p>;
  }

  if (error) {
    return (
      <div>
        <p className="info-text error">Fehler: {error}</p>
        <Link to="/" className="link-inline">
          ← Zurück zur Produktliste
        </Link>
      </div>
    );
  }

  if (!product) {
    return (
      <div>
        <p className="info-text">Kein Produkt gefunden.</p>
        <Link to="/" className="link-inline">
          ← Zurück zur Produktliste
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link to="/" className="link-inline">
        ← Zurück zur Produktliste
      </Link>

      <div className="product-detail">
        <div className="product-detail-image">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="product-image-large"
            />
          ) : (
            <div className="product-placeholder large">Kein Bild</div>
          )}
        </div>

        <div className="product-detail-info">
          <h1>{product.name}</h1>
          <p className="product-detail-description">
            {product.description || "Keine Beschreibung verfügbar."}
          </p>

          <p className="product-detail-price">
            Preis:{" "}
            <strong>{Number(product.price).toFixed(2)} €</strong>
          </p>

          <button
            className="btn btn-primary"
            onClick={() => onAddToCart(product)}
          >
            In den Warenkorb
          </button>
        </div>
      </div>
    </div>
  );
}
