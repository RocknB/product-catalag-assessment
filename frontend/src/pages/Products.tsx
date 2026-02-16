import { useEffect, useState, useMemo, useReducer } from "react";
import { Link } from "react-router-dom";
import { type Product, type Category, type ProductRequest } from "../types";
import { productService, categoryService } from "../services";
import { Button } from "../components";
import { getErrorMessage } from "../utils";

type FormAction =
    | { type: "SET_FIELD"; field: keyof ProductRequest; value: string | number }
    | { type: "CLEAR"; payload: ProductRequest };

function formReducer(state: ProductRequest, action: FormAction): ProductRequest {
    switch (action.type) {
        case "SET_FIELD":
            return { ...state, [action.field]: action.value };
        case "CLEAR":
            return action.payload;
        default:
            return state;
    }
}

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [formData, dispatch] = useReducer(formReducer, {
        name: "",
        description: "",
        price: 0,
        categoryId: 0,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadProducts();
        loadCategories();
    }, []);

    const loadProducts = async () => {
        try {
            setLoading(true);
            const data = await productService.getAll();
            setProducts(data);
        } catch (err: unknown) {
            setError(getErrorMessage(err, "Failed to load products"));
        } finally {
            setLoading(false);
        }
    };

    const loadCategories = async () => {
        try {
            const data = await categoryService.getAll();
            setCategories(data);
        } catch (err: unknown) {
            console.error("Failed to load categories", err);
        }
    };

    // Memo might not be needed at this scale but would make sense with a large volume of products
    const filteredProducts = useMemo(() => {
        if (!searchKeyword.trim()) {
            return products;
        }

        const keyword = searchKeyword.toLowerCase();
        return products.filter(
            (product) =>
                product.name?.toLowerCase().includes(keyword) ||
                product.description?.toLowerCase().includes(keyword) ||
                product.categoryName?.toLowerCase().includes(keyword)
        );
    }, [products, searchKeyword]);

    const handleFieldChange = (field: keyof ProductRequest) => {
        return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
            let value: string | number = e.target.value;
            if (field === "price") {
                value = parseFloat(e.target.value);
            } else if (field === "categoryId") {
                value = parseInt(e.target.value);
            }
            dispatch({ type: "SET_FIELD", field, value });
        };
    };

    // Modal to add new products
    const openAddModal = () => {
        setEditingProduct(null);
        dispatch({
            type: "CLEAR",
            payload: {
                name: "",
                description: "",
                price: 0,
                categoryId: categories.length > 0 ? categories[0].id : 0,
            },
        });
        setError(null);
        setIsModalOpen(true);
    };

    // Similar to adding a new product but prefills with the row values
    const openEditModal = (product: Product) => {
        setEditingProduct(product);
        dispatch({
            type: "CLEAR",
            payload: {
                name: product.name,
                description: product.description,
                price: product.price,
                categoryId: product.categoryId,
            },
        });
        setError(null);
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            if (editingProduct) {
                await productService.update(editingProduct.id, formData);
            } else {
                await productService.create(formData);
            }
            setIsModalOpen(false);
            loadProducts();
            setError(null);
        } catch (err: unknown) {
            setError(getErrorMessage(err, "Failed to save the product"));
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to remove this product?")) {
            return;
        }

        try {
            setLoading(true);
            await productService.delete(id);
            loadProducts();
            setError(null);
        } catch (err: unknown) {
            setError(getErrorMessage(err, "Failed to delete the product"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4">
            <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-2xl font-bold">Manage Products</h1>
                    <Link to="/home">
                        <Button variant="grey">Back to Home</Button>
                    </Link>
                </div>

                <div className="flex gap-2 mb-4">
                    <input
                        type="text"
                        placeholder="Search by name, category, or description"
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                        className="input-field flex-1"/>
                    <Button
                        onClick={() => setSearchKeyword("")}
                        variant="grey">
                        Clear
                    </Button>
                </div>

                <Button onClick={openAddModal} className="w-full mt-6">
                    Add Product
                </Button>
            </div>

            {loading && <div className="text-center py-4">Loading...</div>}

            {!loading && filteredProducts.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                    No products found
                </div>
            )}

            {!loading && filteredProducts.length > 0 && (
                <div className="overflow-x-auto">
                    {/* Using a standard html table but could use a library or custom table component depending on the project requisites. */}
                    <table className="min-w-full bg-white border border-gray-300">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-4 py-2 border-b text-left">Name</th>
                                <th className="px-4 py-2 border-b text-left">Description</th>
                                <th className="px-4 py-2 border-b text-left">Price</th>
                                <th className="px-4 py-2 border-b text-left">Category</th>
                                <th className="px-4 py-2 border-b text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.map((product) => (
                                <tr key={product.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-2 border-b">{product.name}</td>
                                    <td className="px-4 py-2 border-b">
                                        {product.description || "-"}
                                    </td>
                                    <td className="px-4 py-2 border-b">
                                        {product.price.toFixed(2)}
                                    </td>
                                    <td className="px-4 py-2 border-b">
                                        {product.categoryName}
                                    </td>
                                    <td className="px-4 py-2 border-b">
                                        <div className="flex gap-2">
                                            <Button
                                                onClick={() => openEditModal(product)}
                                                variant="primary"
                                                className="text-sm">
                                                Edit
                                            </Button>
                                            <Button
                                                onClick={() => handleDelete(product.id)}
                                                variant="grey"
                                                className="bg-transparent! px-2! py-1!"
                                                title="Remove product">
                                                🗑️
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
                        <h2 className="text-xl font-bold mb-4">
                            {editingProduct ? "Edit Product" : "Add Product"}
                        </h2>
                        
                        {error && (
                            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                                {error}
                            </div>
                        )}
                        
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">
                                    Name *
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={handleFieldChange("name")}
                                    required
                                    className="input-field"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">
                                    Description
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={handleFieldChange("description")}
                                    rows={3}
                                    className="input-field"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">
                                    Price *
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    value={formData.price}
                                    onChange={handleFieldChange("price")}
                                    required
                                    className="input-field"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">
                                    Category *
                                </label>
                                <select
                                    value={formData.categoryId}
                                    onChange={handleFieldChange("categoryId")}
                                    required
                                    className="input-field">
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex justify-end gap-2">
                                <Button
                                    type="button"
                                    onClick={() => {
                                        setIsModalOpen(false);
                                        setError(null);
                                    }}
                                    variant="grey">
                                    Cancel
                                </Button>
                                <Button type="submit" variant="primary" disabled={loading}>
                                    {loading ? "Saving..." : "Save"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
