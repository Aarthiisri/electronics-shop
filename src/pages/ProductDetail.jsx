import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import Loader from "../components/Loader";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cart, dispatch } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImg, setSelectedImg] = useState(0);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <Loader />;
  if (!product) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-400">Product not found!</p>
    </div>
  );

  const inCart = cart.some(i => i.id === product.id);
  const wishlisted = isWishlisted(product.id);

  function handleAdd() {
    dispatch({ type: "ADD", payload: product });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  // DummyJSON has images array
  const images = product.images || [product.thumbnail];

  return (
    <div className="min-h-screen bg-gray-100 p-3 md:p-5">
      <button onClick={() => navigate(-1)}
        className="mb-4 flex items-center gap-1 text-gray-500 hover:text-orange-500 text-sm font-medium">
        ← Back
      </button>

      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow p-4 md:p-6">
        <div className="flex flex-col md:grid md:grid-cols-2 gap-5 md:gap-8">

          {/* Images */}
          <div>
            <div className="bg-gray-50 rounded-2xl flex items-center justify-center p-4 min-h-56 mb-3 overflow-hidden">
              <img src={images[selectedImg]} alt={product.title}
                className="max-h-56 w-full object-contain rounded-xl"/>
            </div>
            {/* Thumbnail row */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setSelectedImg(i)}
                    className={`flex-shrink-0 w-14 h-14 rounded-xl overflow-hidden border-2 transition
                      ${selectedImg === i ? "border-orange-400" : "border-gray-200"}`}>
                    <img src={img} alt="" className="w-full h-full object-cover"/>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col">
            <p className="text-xs text-orange-500 uppercase font-semibold mb-1">{product.category}</p>
            <h1 className="text-base md:text-xl font-bold text-gray-900 mb-2">{product.title}</h1>

            {/* Rating + Stock */}
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <div className="flex items-center gap-1 bg-yellow-50 border border-yellow-200 px-2 py-1 rounded-full">
                <span className="text-yellow-500 text-xs">⭐</span>
                <span className="text-xs font-semibold">{product.rating}</span>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full font-medium
                ${product.stock > 10 ? "bg-green-50 text-green-600" :
                  product.stock > 0 ? "bg-yellow-50 text-yellow-600" : "bg-red-50 text-red-600"}`}>
                {product.stock > 0 ? `✅ ${product.stock} in stock` : "❌ Out of stock"}
              </span>
            </div>

            {/* Price */}
            <div className="bg-orange-50 border border-orange-100 rounded-xl px-4 py-2 mb-3 flex items-center gap-3">
              <span className="text-2xl font-bold text-orange-500">${product.price}</span>
              {product.discountPercentage > 0 && (
                <span className="bg-green-100 text-green-600 text-xs font-bold px-2 py-1 rounded-lg">
                  -{Math.round(product.discountPercentage)}% OFF
                </span>
              )}
            </div>

            <p className="text-xs md:text-sm text-gray-500 leading-relaxed mb-4">{product.description}</p>

            {/* Meta */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              {[
                ["Brand", product.brand || "N/A"],
                ["Category", product.category],
                ["Rating", `${product.rating} / 5`],
                ["Stock", product.stock],
              ].map(([label, val]) => (
                <div key={label} className="bg-gray-50 rounded-xl p-2.5">
                  <p className="text-xs text-gray-400 mb-0.5">{label}</p>
                  <p className="font-bold text-gray-800 text-sm capitalize">{val}</p>
                </div>
              ))}
            </div>

            {/* Buttons */}
            <div className="flex gap-2 mt-auto">
              <button onClick={handleAdd} disabled={product.stock === 0}
                className={`flex-1 py-2.5 rounded-xl font-bold text-white text-sm transition
                  ${product.stock === 0 ? "bg-gray-300 cursor-not-allowed" :
                    inCart || added ? "bg-green-500" : "bg-orange-500 hover:bg-orange-600"}`}>
                {product.stock === 0 ? "Out of Stock" : added ? "✓ Added!" : inCart ? "✓ In Cart" : "🛒 Add to Cart"}
              </button>
              <button onClick={() => toggleWishlist(product)}
                className={`px-4 py-2.5 rounded-xl border-2 text-lg transition
                  ${wishlisted ? "border-red-300 bg-red-50" : "border-gray-200"}`}>
                {wishlisted ? "❤️" : "🤍"}
              </button>
              <button onClick={() => navigate("/cart")}
                className="flex-1 py-2.5 rounded-xl font-bold border-2 border-orange-500 text-orange-500 text-sm hover:bg-orange-50 transition">
                View Cart →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default ProductDetail;