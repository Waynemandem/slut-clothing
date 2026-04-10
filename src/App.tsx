// src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import Layout from "./layouts/Layout";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import About from "./pages/About";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import IntroAnimation from "./components/IntroAnimation";
import { useIntroAnimation } from "./hooks/useIntroAnimation";
import { type JSX } from "react";

// AppInner sits INSIDE AppProvider so hooks like useIntroAnimation
// can safely access context. BrowserRouter also lives here.
function AppInner(): JSX.Element {
  const { showIntro, handleComplete } = useIntroAnimation();
  return (
    <>
      {showIntro && <IntroAnimation onComplete={handleComplete} />}
      <BrowserRouter>
        <Routes>
          <Route path="/"              element={<Layout><Home /></Layout>} />
          <Route path="/shop"          element={<Layout><Shop /></Layout>} />
          <Route path="/product/:slug" element={<Layout><ProductDetail /></Layout>} />
          <Route path="/about"         element={<Layout><About /></Layout>} />
          <Route path="/login"         element={<Login />} />
          <Route path="/admin"         element={<Admin />} />
          <Route path="*"              element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default function App(): JSX.Element {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  );
}