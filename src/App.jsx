import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import Home from "./pages/Home";

// These pages will be built in subsequent steps:
// import Shop from "./pages/Shop";
// import ProductDetail from "./pages/ProductDetail";
// import Cart from "./pages/Cart";
// import Login from "./pages/Login";
// import Account from "./pages/Account";
// import Admin from "./pages/Admin";

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
                <Home />
            }
          />
          {/* Add more routes here as pages are built */}
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}