import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

function ProductCard({ product }) {
  const { dispatch } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();

  return (
    <div className="bg-white rounded-2xl shadow hover:shadow-xl transition p-3 flex flex-col relative">
      <button onClick={() => toggleWishlist(product)}
        className="absolute top-2 right-2 text-base z-10">
        {isWishlisted(product.id) ? "❤️" : "🤍"}
      </button>

      <Link to={`/product/${product.id}`}>
        <div className="h-36 flex items-center justify-center bg-gray-50 rounded-xl mb-2 overflow-hidden">
          <img
            src={product.thumbnail}  /* ✅ DummyJSON uses thumbnail */
            alt={product.title}
            className="h-32 w-full object-cover rounded-xl"
          />
        </div>
        <p className="text-xs text-orange-500 uppercase font-semibold mb-0.5">
          {product.category}
        </p>
        <h3 className="text-xs font-semibold text-gray-800 line-clamp-2 mb-1">
          {product.title}
        </h3>
        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <span className="text-yellow-400 text-xs">⭐</span>
          <span className="text-xs text-gray-500">{product.rating}</span>
        </div>
      </Link>

      <div className="mt-auto flex items-center justify-between">
        <div>
          <span className="font-bold text-gray-900 text-sm">${product.price}</span>
          {product.discountPercentage > 0 && (
            <span className="text-xs text-green-500 ml-1">
              -{Math.round(product.discountPercentage)}%
            </span>
          )}
        </div>
        <button onClick={() => dispatch({ type: "ADD", payload: product })}
          className="bg-orange-500 hover:bg-orange-600 text-white px-2.5 py-1.5 rounded-lg text-xs font-semibold transition">
          + Cart
        </button>
      </div>
    </div>
  );
}
export default ProductCard;