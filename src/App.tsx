// src/App.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Root of the application.
// Declares all routes and wraps everything in AppProvider.
//
// TO ADD A NEW PAGE:
//   1. Create the page file in src/pages/
//   2. Import it here
//   3. Add a <Route> inside <Routes>
// ─────────────────────────────────────────────────────────────────────────────
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import Layout from "./layout/Layout.tsx";   // ← add this
import Home from "./pages/Home";
import Shop from "./pages/Shop";



// Uncomment as you build each page:
// import ProductDetail from "./pages/ProductDetail";
// import Cart          from "./pages/Cart";
// import Login         from "./pages/Login";
// import Account       from "./pages/Account";
// import Admin         from "./pages/Admin";

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/"      element={<Layout><Home /></Layout>} />
          <Route path="/shop"  element={<Layout><Shop /></Layout>} />

          {/* Add routes here as pages are built:
          <Route path="/product/:id" element={<Layout><ProductDetail /></Layout>} />
          <Route path="/cart"        element={<Layout><Cart /></Layout>} />
          <Route path="/login"       element={<Layout><Login /></Layout>} />
          <Route path="/account"     element={<Layout><Account /></Layout>} />
          <Route path="/admin"       element={<Layout><Admin /></Layout>} />
          */}
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}