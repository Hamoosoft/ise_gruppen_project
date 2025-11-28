import { useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import ProductList from "./pages/ProductList.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import CartPage from "./pages/CartPage.jsx";

function App() {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);

      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [
          ...prevItems,
          {
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
          },
        ];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.id !== productId)
    );
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      return removeFromCart(productId);
    }

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const totalItemsCount = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  return (
    <div className="app-root">
      <header className="app-header">
        <nav className="navbar">
          <div className="navbar-left">
            <Link to="/" className="navbar-brand">
              CampusShop
            </Link>
          </div>
          <div className="navbar-right">
            <Link to="/" className="nav-link">
              Produkte
            </Link>
            <Link to="/cart" className="nav-link nav-cart">
              🧺 Warenkorb
              {totalItemsCount > 0 && (
                <span className="cart-badge">{totalItemsCount}</span>
              )}
            </Link>
          </div>
        </nav>

        <div className="hero">
          <div className="container">
            <div className="hero-content">
              <h1>Dein Campus-Shop</h1>
              <p>
                Einfaches Demo-Projekt für euren ISE Online-Shop:
                Produkte ansehen, in den Warenkorb legen und bestellen.
              </p>
              <Link to="/" className="btn btn-primary">
                Produkte entdecken
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="main-content">
        <div className="container">
          <Routes>
            <Route
              path="/"
              element={<ProductList onAddToCart={addToCart} />}
            />
            <Route
              path="/products/:id"
              element={<ProductDetail onAddToCart={addToCart} />}
            />
            <Route
              path="/cart"
              element={
                <CartPage
                  cartItems={cartItems}
                  removeFromCart={removeFromCart}
                  updateQuantity={updateQuantity}
                />
              }
            />
          </Routes>
        </div>
      </main>

      <footer className="footer">
        <p>© {new Date().getFullYear()} CampusShop – Demo-Projekt</p>
      </footer>
    </div>
  );
}

export default App;
