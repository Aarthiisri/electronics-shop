import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

function Cart() {
  const { cart, dispatch } = useCart();
  const navigate = useNavigate();
  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const totalItems = cart.reduce((sum, i) => sum + i.qty, 0);

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center gap-3 p-4">
        <div className="text-5xl">🛒</div>
        <h2 className="text-lg font-bold text-gray-700">Your cart is empty!</h2>
        <p className="text-gray-400 text-sm">Add some products first</p>
        <button onClick={() => navigate("/")}
          className="bg-orange-500 text-white px-6 py-2.5 rounded-xl font-semibold text-sm">
          Continue Shopping →
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-3 md:p-5 pb-32 md:pb-5">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-gray-900">
            🛒 Cart <span className="text-sm font-normal text-gray-400">({totalItems})</span>
          </h1>
          <button onClick={() => navigate("/")} className="text-orange-500 text-sm font-medium">← Shop</button>
        </div>

        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-3">
          <div className="lg:col-span-2 flex flex-col gap-3">
            {cart.map(item => (
              <div key={item.id} className="bg-white rounded-2xl shadow p-3 flex gap-3 items-center">

                {/* ✅ thumbnail fix */}
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-50 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                  <img
                    src={item.thumbnail || item.image || "/placeholder.png"}
                    alt={item.title}
                    className="w-full h-full object-cover rounded-xl"
                    onError={e => { e.target.src = "https://via.placeholder.com/80"; }}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-xs text-orange-500 uppercase font-semibold mb-0.5">
                    {item.category}
                  </p>
                  <h3 className="text-xs md:text-sm font-semibold text-gray-800 line-clamp-2 mb-1.5">
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => dispatch({ type: "DECREASE", payload: item.id })}
                      className="w-6 h-6 rounded-lg bg-gray-100 hover:bg-orange-100 font-bold text-sm flex items-center justify-center">
                      −
                    </button>
                    <span className="w-5 text-center font-bold text-sm">{item.qty}</span>
                    <button
                      onClick={() => dispatch({ type: "ADD", payload: item })}
                      className="w-6 h-6 rounded-lg bg-gray-100 hover:bg-orange-100 font-bold text-sm flex items-center justify-center">
                      +
                    </button>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <p className="font-bold text-gray-900 text-sm">${(item.price * item.qty).toFixed(2)}</p>
                  <p className="text-xs text-gray-400">${item.price} each</p>
                  <button onClick={() => dispatch({ type: "REMOVE", payload: item.id })}
                    className="text-red-400 text-xs">🗑 Remove</button>
                </div>
              </div>
            ))}

            <button onClick={() => dispatch({ type: "CLEAR" })}
              className="text-red-400 text-xs text-center py-2">
              🗑 Clear All
            </button>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="fixed bottom-0 left-0 right-0 lg:static bg-white lg:rounded-2xl shadow-lg p-4 border-t lg:border-0 z-40">
              <div className="flex items-center justify-between lg:block">
                <div className="lg:mb-4">
                  <div className="flex justify-between text-sm text-gray-500 mb-1">
                    <span>Subtotal</span><span>${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500 mb-1">
                    <span>Shipping</span><span className="text-green-500 font-medium">FREE</span>
                  </div>
                  <div className="flex justify-between font-bold text-gray-900 mt-2">
                    <span>Total</span>
                    <span className="text-orange-500">${total.toFixed(2)}</span>
                  </div>
                </div>
                <button onClick={() => navigate("/checkout")}
                  className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 px-6 lg:w-full rounded-xl text-sm transition">
                  Checkout →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Cart;