import { Link } from "react-router-dom";

export default function CartPage({
  cartItems,
  removeFromCart,
  updateQuantity,
}) {
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      alert("Dein Warenkorb ist leer.");
      return;
    }

    const customerName = prompt("Bitte deinen Namen eingeben:");
    const customerEmail = prompt("Bitte deine E-Mail eingeben:");

    if (!customerName || !customerEmail) {
      alert("Name und E-Mail sind erforderlich.");
      return;
    }

    const orderRequest = {
      customerName,
      customerEmail,
      items: cartItems.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
      })),
    };

    try {
      const response = await fetch("http://localhost:9090/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderRequest),
      });

      if (!response.ok) {
        throw new Error("Fehler beim Absenden der Bestellung");
      }

      const data = await response.json();
      alert("Bestellung erfolgreich! Bestellnummer: " + data.id);
      // optional: hier den Warenkorb leeren
    } catch (err) {
      alert("Fehler: " + err.message);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h2>Warenkorb</h2>
        <p className="subheading">
          Prüfe deine Artikel und gehe zur Kasse.
        </p>
      </div>

      {cartItems.length === 0 ? (
        <div className="card empty-cart">
          <p>Dein Warenkorb ist momentan leer.</p>
          <Link to="/" className="btn btn-primary">
            Produkte ansehen
          </Link>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item-card">
                <div className="cart-item-main">
                  <h3>{item.name}</h3>
                  <p className="cart-item-price">
                    Einzelpreis: {Number(item.price).toFixed(2)} €
                  </p>

                  <div className="cart-qty-controls">
                    <button
                      className="btn btn-icon"
                      onClick={() =>
                        updateQuantity(item.id, item.quantity - 1)
                      }
                    >
                      −
                    </button>
                    <span className="cart-qty">
                      {item.quantity}
                    </span>
                    <button
                      className="btn btn-icon"
                      onClick={() =>
                        updateQuantity(item.id, item.quantity + 1)
                      }
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="cart-item-sidebar">
                  <p className="cart-item-subtotal">
                    Zwischensumme:{" "}
                    <strong>
                      {(Number(item.price) * item.quantity).toFixed(2)} €
                    </strong>
                  </p>
                  <button
                    className="btn btn-secondary"
                    onClick={() => removeFromCart(item.id)}
                  >
                    Entfernen
                  </button>
                </div>
              </div>
            ))}
          </div>

          <aside className="cart-summary">
            <div className="card">
              <h3>Bestellübersicht</h3>
              <p>
                Artikel insgesamt:{" "}
                <strong>
                  {cartItems.reduce(
                    (sum, item) => sum + item.quantity,
                    0
                  )}
                </strong>
              </p>
              <p className="cart-summary-total">
                Gesamt:{" "}
                <strong>{totalPrice.toFixed(2)} €</strong>
              </p>

              <button
                className="btn btn-primary btn-block"
                onClick={handleCheckout}
              >
                Zur Kasse
              </button>

              <Link
                to="/"
                className="btn btn-link btn-block cart-back-link"
              >
                ← Weiter einkaufen
              </Link>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
