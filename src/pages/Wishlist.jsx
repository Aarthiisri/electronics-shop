import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

function Wishlist() {
  const { wishlist, toggleWishlist } = useWishlist();
  const { dispatch } = useCart();
  const navigate = useNavigate();

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center gap-3 p-4">
        <div className="text-5xl">❤️</div>
        <h2 className="text-lg font-bold text-gray-700">Wishlist is empty!</h2>
        <p className="text-gray-400 text-sm">உங்களுக்கு பிடிச்ச products save பண்ணு</p>
        <button onClick={() => navigate("/")}
          className="bg-orange-500 text-white px-6 py-2.5 rounded-xl font-semibold text-sm">
          Browse Products →
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-3 md:p-5">
      <div className="max-w-4xl mx-auto">

        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-gray-900">
            ❤️ Wishlist
            <span className="text-sm font-normal text-gray-400 ml-2">
              ({wishlist.length} items)
            </span>
          </h1>
          <button onClick={() => navigate("/")}
            className="text-orange-500 text-sm font-medium">
            ← Shop
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {wishlist.map(product => {

            // ✅ Image fix — thumbnail → image → placeholder
            const imgSrc = product.thumbnail
              || product.image
              || (product.images && product.images[0])
              || "https://via.placeholder.com/150";

            return (
              <div key={product.id}
                className="bg-white rounded-2xl shadow hover:shadow-lg transition p-3 flex flex-col relative">

                {/* Remove from wishlist */}
                <button
                  onClick={() => toggleWishlist(product)}
                  className="absolute top-2 right-2 text-base z-10 hover:scale-110 transition">
                  ❤️
                </button>

                {/* Image */}
                <div
                  onClick={() => navigate(`/product/${product.id}`)}
                  className="h-32 md:h-40 flex items-center justify-center bg-gray-50 rounded-xl mb-2 cursor-pointer overflow-hidden">
                  <img
                    src={imgSrc}
                    alt={product.title}
                    className="h-full w-full object-cover rounded-xl"
                    onError={e => {
                      e.target.src = "https://via.placeholder.com/150?text=No+Image";
                    }}
                  />
                </div>

                {/* Info */}
                <p className="text-xs text-orange-500 uppercase font-semibold mb-0.5">
                  {product.category}
                </p>
                <h3 className="text-xs md:text-sm font-semibold text-gray-800 line-clamp-2 mb-1 flex-1">
                  {product.title}
                </h3>

                {/* Rating */}
                {product.rating && (
                  <div className="flex items-center gap-1 mb-2">
                    <span className="text-yellow-400 text-xs">⭐</span>
                    <span className="text-xs text-gray-500">{product.rating}</span>
                  </div>
                )}

                {/* Price + Cart */}
                <div className="flex items-center justify-between mt-auto">
                  <div>
                    <span className="font-bold text-gray-900 text-sm">
                      ${product.price}
                    </span>
                    {product.discountPercentage > 0 && (
                      <span className="text-xs text-green-500 ml-1">
                        -{Math.round(product.discountPercentage)}%
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      dispatch({ type: "ADD", payload: product });
                      navigate("/cart");
                    }}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-2 py-1.5 rounded-lg text-xs font-semibold transition">
                    + Cart
                  </button>
                </div>

              </div>
            );
          })}
        </div>

        {/* Clear All */}
        {wishlist.length > 0 && (
          <div className="text-center mt-4">
            <button
              onClick={() => {
                if (window.confirm("Wishlist clear பண்ணணுமா?")) {
                  wishlist.forEach(p => toggleWishlist(p));
                }
              }}
              className="text-red-400 text-sm hover:text-red-600 transition">
              🗑 Clear Wishlist
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

export default Wishlist;