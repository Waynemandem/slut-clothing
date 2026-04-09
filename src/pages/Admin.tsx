// src/pages/Admin.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Admin dashboard — add, edit, delete products.
// Protected: redirects to /login if not authenticated or not admin.
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useEffect, useCallback, type JSX } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Pencil, Trash2, X, Loader2, Check, PackageSearch } from "lucide-react";
import { useApp } from "@/context/AppContext";
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "@/services/productService";
import type { Product } from "@/types";

// ── Helpers ───────────────────────────────────────────────────────────────────
const formatPrice = (pence: number) => `$${(pence / 100).toFixed(2)}`;

const EMPTY_FORM = {
  name: "",
  description: "",
  price: "",
  category: "",
  sizes: "",
  images: "",
  stock: "",
  is_featured: false,
  is_new: false,
  is_sale: false,
  slug: "",
  compare_price: "",
};

type FormData = typeof EMPTY_FORM;

// ── Product Form Modal ────────────────────────────────────────────────────────
function ProductFormModal({
  product,
  onClose,
  onSave,
}: {
  product: Product | null; // null = creating new
  onClose: () => void;
  onSave: () => void;
}) {
  const [form, setForm] = useState<FormData>(() => {
    if (!product) return EMPTY_FORM;
    return {
      name: product.name,
      description: product.description ?? "",
      price: String(product.price / 100),
      category: product.category ?? "",
      sizes: product.sizes.join(", "),
      images: product.images.join(", "),
      stock: String(product.stock),
      is_featured: product.is_featured,
      is_new: product.is_new,
      is_sale: product.is_sale,
      slug: product.slug ?? "",
      compare_price: product.compare_price ? String(product.compare_price / 100) : "",
    };
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (key: keyof FormData, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  // Auto-generate slug from name
  const handleNameChange = (name: string) => {
    set("name", name);
    if (!product) {
      set(
        "slug",
        name
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, "")
          .trim()
          .replace(/\s+/g, "-")
      );
    }
  };

  const handleSave = async () => {
    setError(null);
    if (!form.name.trim()) return setError("Name is required.");
    if (!form.price || isNaN(Number(form.price))) return setError("Valid price is required.");
    if (!form.category.trim()) return setError("Category is required.");
    if (!form.slug.trim()) return setError("Slug is required.");

    const payload = {
      name: form.name.trim(),
      description: form.description.trim() || null,
      price: Math.round(Number(form.price) * 100),
      compare_price: form.compare_price ? Math.round(Number(form.compare_price) * 100) : null,
      category: form.category.trim(),
      sizes: form.sizes.split(",").map((s) => s.trim()).filter(Boolean),
      images: form.images.split(",").map((s) => s.trim()).filter(Boolean),
      stock: parseInt(form.stock) || 0,
      is_featured: form.is_featured,
      is_new: form.is_new,
      is_sale: form.is_sale,
      slug: form.slug.trim(),
    };

    setLoading(true);
    const result = product
      ? await updateProduct(product.id, payload)
      : await createProduct(payload);
    setLoading(false);

    if (result.error) {
      setError(result.error);
    } else {
      onSave();
      onClose();
    }
  };

  const Field = ({
    label,
    name,
    type = "text",
    placeholder,
    hint,
  }: {
    label: string;
    name: keyof FormData;
    type?: string;
    placeholder?: string;
    hint?: string;
  }) => (
    <div>
      <label className="block text-[11px] font-bold tracking-widest uppercase mb-1.5">
        {label}
      </label>
      {type === "textarea" ? (
        <textarea
          value={form[name] as string}
          onChange={(e) => set(name, e.target.value)}
          placeholder={placeholder}
          rows={3}
          className="w-full border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:border-black transition-colors resize-none"
        />
      ) : (
        <input
          type={type}
          value={form[name] as string}
          onChange={(e) => set(name, e.target.value)}
          placeholder={placeholder}
          className="w-full h-10 border border-neutral-300 px-3 text-sm focus:outline-none focus:border-black transition-colors"
        />
      )}
      {hint && <p className="text-[11px] text-neutral-400 mt-1">{hint}</p>}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200">
          <h2 className="font-bebas text-2xl tracking-wide">
            {product ? "Edit Product" : "New Product"}
          </h2>
          <button onClick={onClose} className="text-neutral-400 hover:text-black transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-6 py-6 space-y-5">
          {error && (
            <div className="px-4 py-3 bg-red-50 border border-red-200 text-red-600 text-xs">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="sm:col-span-2">
              <Field label="Product Name" name="name" placeholder="SLUT Core Tee Black" />
            </div>
            <Field
              label="Slug"
              name="slug"
              placeholder="slut-core-tee-black"
              hint="Auto-generated from name. Used in URL."
            />
            <Field label="Category" name="category" placeholder="t-shirts" />
            <Field label="Price ($)" name="price" type="number" placeholder="49.99" />
            <Field
              label="Compare Price ($)"
              name="compare_price"
              type="number"
              placeholder="69.99 (optional)"
              hint="Shows as strikethrough when set."
            />
            <Field label="Stock" name="stock" type="number" placeholder="50" />
            <Field
              label="Sizes"
              name="sizes"
              placeholder="XS, S, M, L, XL"
              hint="Comma-separated"
            />
            <div className="sm:col-span-2">
              <Field
                label="Image URLs"
                name="images"
                placeholder="https://..., https://..."
                hint="Comma-separated. First image is main."
              />
            </div>
            <div className="sm:col-span-2">
              <Field
                label="Description"
                name="description"
                type="textarea"
                placeholder="Product description..."
              />
            </div>
          </div>

          {/* Toggles */}
          <div>
            <p className="text-[11px] font-bold tracking-widest uppercase mb-3">Flags</p>
            <div className="flex flex-wrap gap-3">
              {(["is_featured", "is_new", "is_sale"] as const).map((flag) => (
                <button
                  key={flag}
                  onClick={() => set(flag, !form[flag])}
                  className={`flex items-center gap-2 px-4 h-9 border text-xs font-medium tracking-wider uppercase transition-all ${
                    form[flag]
                      ? "border-black bg-black text-white"
                      : "border-neutral-300 text-neutral-500 hover:border-black"
                  }`}
                >
                  {form[flag] && <Check size={12} />}
                  {flag === "is_featured" && "Featured"}
                  {flag === "is_new" && "New Arrival"}
                  {flag === "is_sale" && "On Sale"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-neutral-200 flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="h-10 px-6 border border-neutral-300 text-xs font-bold tracking-widest uppercase hover:border-black transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="h-10 px-6 bg-black text-white text-xs font-bold tracking-widest uppercase flex items-center gap-2 hover:bg-neutral-800 transition-colors disabled:opacity-50"
          >
            {loading ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
            {product ? "Save Changes" : "Create Product"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Delete Confirm Modal ──────────────────────────────────────────────────────
function DeleteConfirmModal({
  product,
  onClose,
  onConfirm,
}: {
  product: Product;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    await deleteProduct(product.id);
    setLoading(false);
    onConfirm();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-sm p-8">
        <h2 className="font-bebas text-2xl tracking-wide mb-2">Delete Product?</h2>
        <p className="text-sm text-neutral-600 mb-6">
          <span className="font-semibold">{product.name}</span> will be permanently deleted.
          This cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 h-10 border border-neutral-300 text-xs font-bold tracking-widest uppercase hover:border-black transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="flex-1 h-10 bg-red-600 text-white text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-2 hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {loading ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Admin Page ───────────────────────────────────────────────────────────
export default function Admin(): JSX.Element {
  const navigate = useNavigate();
  const { user, isAdmin } = useApp();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null | "new">(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

  // ── Auth guard ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!user) navigate("/login", { replace: true });
    else if (user && !isAdmin) navigate("/", { replace: true });
  }, [user, isAdmin, navigate]);

  // ── Load products ───────────────────────────────────────────────────────
  const loadProducts = useCallback(async () => {
    setLoading(true);
    const { data } = await fetchProducts();
    setProducts(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // ── Stats ───────────────────────────────────────────────────────────────
  const totalStock = products.reduce((s, p) => s + p.stock, 0);
  const featuredCount = products.filter((p) => p.is_featured).length;
  const outOfStockCount = products.filter((p) => p.stock === 0).length;

  if (!user || !isAdmin) return <></>;

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-black text-white px-6 md:px-10 py-6">
        <div className="max-w-screen-xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="font-bebas text-3xl tracking-widest">Admin Dashboard</h1>
            <p className="text-neutral-400 text-xs tracking-widest uppercase mt-0.5">
              Product Management
            </p>
          </div>
          <button
            onClick={() => setEditingProduct("new")}
            className="flex items-center gap-2 h-10 px-5 bg-white text-black text-xs font-bold tracking-widest uppercase hover:bg-neutral-100 transition-colors"
          >
            <Plus size={14} />
            Add Product
          </button>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-6 md:px-10 py-8">
        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Products", value: products.length },
            { label: "Total Stock", value: totalStock },
            { label: "Featured", value: featuredCount },
            { label: "Out of Stock", value: outOfStockCount, alert: outOfStockCount > 0 },
          ].map(({ label, value, alert }) => (
            <div key={label} className="bg-white border border-neutral-200 px-5 py-4">
              <p className="text-[11px] tracking-widest uppercase text-neutral-400 mb-1">{label}</p>
              <p className={`font-bebas text-3xl tracking-wide ${alert ? "text-red-600" : "text-black"}`}>
                {value}
              </p>
            </div>
          ))}
        </div>

        {/* Products table */}
        <div className="bg-white border border-neutral-200">
          <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
            <h2 className="text-xs font-bold tracking-widest uppercase">All Products</h2>
            <span className="text-xs text-neutral-400">{products.length} items</span>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 size={20} className="animate-spin text-neutral-300" />
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-neutral-400">
              <PackageSearch size={32} strokeWidth={1} />
              <p className="text-sm">No products yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-100">
                    {["Product", "Category", "Price", "Stock", "Flags", "Actions"].map((h) => (
                      <th
                        key={h}
                        className="px-6 py-3 text-left text-[11px] font-bold tracking-widest uppercase text-neutral-400"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr
                      key={product.id}
                      className="border-b border-neutral-50 hover:bg-neutral-50 transition-colors"
                    >
                      {/* Product */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-neutral-100 overflow-hidden flex-shrink-0">
                            {product.images[0] && (
                              <img
                                src={product.images[0]}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-sm leading-tight">{product.name}</p>
                            <p className="text-[11px] text-neutral-400 mt-0.5">{product.slug}</p>
                          </div>
                        </div>
                      </td>
                      {/* Category */}
                      <td className="px-6 py-4">
                        <span className="text-xs capitalize text-neutral-600">
                          {product.category}
                        </span>
                      </td>
                      {/* Price */}
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium">{formatPrice(product.price)}</span>
                        {product.compare_price && (
                          <span className="text-xs text-neutral-400 line-through ml-2">
                            {formatPrice(product.compare_price)}
                          </span>
                        )}
                      </td>
                      {/* Stock */}
                      <td className="px-6 py-4">
                        <span
                          className={`text-xs font-medium ${
                            product.stock === 0
                              ? "text-red-500"
                              : product.stock < 10
                              ? "text-amber-500"
                              : "text-green-600"
                          }`}
                        >
                          {product.stock === 0 ? "Out of stock" : `${product.stock} units`}
                        </span>
                      </td>
                      {/* Flags */}
                      <td className="px-6 py-4">
                        <div className="flex gap-1 flex-wrap">
                          {product.is_featured && (
                            <span className="text-[9px] font-bold tracking-wider uppercase bg-black text-white px-1.5 py-0.5">
                              Featured
                            </span>
                          )}
                          {product.is_new && (
                            <span className="text-[9px] font-bold tracking-wider uppercase bg-blue-600 text-white px-1.5 py-0.5">
                              New
                            </span>
                          )}
                          {product.is_sale && (
                            <span className="text-[9px] font-bold tracking-wider uppercase bg-red-600 text-white px-1.5 py-0.5">
                              Sale
                            </span>
                          )}
                        </div>
                      </td>
                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setEditingProduct(product)}
                            className="w-8 h-8 flex items-center justify-center border border-neutral-200 text-neutral-500 hover:border-black hover:text-black transition-colors"
                          >
                            <Pencil size={13} />
                          </button>
                          <button
                            onClick={() => setDeletingProduct(product)}
                            className="w-8 h-8 flex items-center justify-center border border-neutral-200 text-neutral-500 hover:border-red-500 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {editingProduct !== null && (
        <ProductFormModal
          product={editingProduct === "new" ? null : editingProduct}
          onClose={() => setEditingProduct(null)}
          onSave={loadProducts}
        />
      )}
      {deletingProduct && (
        <DeleteConfirmModal
          product={deletingProduct}
          onClose={() => setDeletingProduct(null)}
          onConfirm={loadProducts}
        />
      )}
    </div>
  );
}