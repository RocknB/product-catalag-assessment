import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { productService } from "../services";
import { Card, Button } from "../components";

export default function HomePage() {
  const username = localStorage.getItem("username");
  const [productCount, setProductCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const loadProductCount = async () => {
    try {
      const count = await productService.getCount();
      setProductCount(count);
    } catch (err) {
      console.error("Failed to load product count", err);
    } finally {
      setLoading(false);
    }
  };

    loadProductCount();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Product Catalog Home</h1>
      <p className="text-lg mb-8">Hi, {username}!</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Card title="Total Products">
          {/* In here, we could use lazy/Suspense to optimize the initial load of the page in the client side, depending on the complexity of the application */}
          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : (
            <p className="text-4xl font-bold text-green-900" data-testid="product-count">{productCount}</p>
          )}
        </Card>
      </div>

      <div className="mt-6">
        <Link to="/products">
          <Button variant="primary" className="px-6 py-3 text-base">
            Manage Products
          </Button>
        </Link>
      </div>
    </div>
  );
}