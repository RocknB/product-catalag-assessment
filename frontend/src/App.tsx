import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import LoginPage from "./pages/Login";
import HomePage from "./pages/Home";
import ProductsPage from "./pages/Products";

//if no auth redirect to login page
function ProtectedLayout() {
  //simple token check, in a real app might be necessary to validate the token
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" />;
  return (
    <>
      {/*Navbar will go here, if adding one */}
      <Outlet />
    </>
  );
}

// Global responsive container wrapper
function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 lg:px-4 lg:py-6">
      <div className="mx-auto lg:max-w-4xl lg:rounded-lg lg:bg-white lg:shadow-lg">
        <div className="lg:p-8">
          {children}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<ProtectedLayout />}>
            <Route path="/home" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/home" />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}