import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/Login";
import HomePage from "./pages/Home";

//if no auth redirect to login page
function ProtectedLayout({ children }: { children: React.ReactNode }) {
  //simple token check, in a real app might be necessary to validate the token
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" />;
  return (
    <>
      {/*Navbar will go here, if adding one */}
      {children}
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
          <Route path="/home"element={
              <ProtectedLayout>
                <HomePage />
              </ProtectedLayout>
            }
          />
          <Route path="*" element={<Navigate to="/home" />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}