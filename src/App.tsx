// src/App.tsx
// Root of the application. Declares all routes and wraps everything in AppProvider.
// TO ADD A NEW PAGE: create in src/pages/, import here, add a <Route> inside <Routes>
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import Layout from "./layouts/Layout";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import About from "./pages/About";
import { JSX } from "react";

// Uncomment as you build each page:
// import ProductDetail from "./pages/ProductDetail";
// import Cart          from "./pages/Cart";
// import Login         from "./pages/Login";
// import Account       from "./pages/Account";
// import Admin         from "./pages/Admin";

export default function App(): JSX.Element {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/"      element={<Layout><Home /></Layout>} />
          <Route path="/shop"  element={<Layout><Shop /></Layout>} />
          <Route path="/product/:slug" element={<ProductDetail />} />
          <Route path="/about" element={<Layout><About /></Layout>} />

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