import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useOrder } from "../context/OrderContext";

function Checkout() {
  const { cart, dispatch } = useCart();
  const { placeOrder } = useOrder();
  const navigate = useNavigate();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [finalAmt, setFinalAmt] = useState(0);
  const [form, setForm] = useState({
    name: "", email: "", phone: "",
    address: "", city: "", pincode: "", payment: "cod",
  });

  // ✅ Live total
  const total = cart.reduce((sum, i) => sum + parseFloat(i.price || 0) * parseInt(i.qty || 1), 0);
  const totalItems = cart.reduce((sum, i) => sum + parseInt(i.qty || 1), 0);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleOrder(e) {
    e.preventDefault();

    // ✅ Final total calculate
    const finalTotal = cart.reduce((sum, item) => {
      return sum + parseFloat(item.price || 0) * parseInt(item.qty || 1);
    }, 0);

    setFinalAmt(finalTotal);
    placeOrder(cart, form, finalTotal);
    dispatch({ type: "CLEAR" });
    setOrderPlaced(true);
  }

  // ✅ Success Screen
  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full text-center">
          <div className="text-5xl mb-3">🎉</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Placed!</h2>
          <p className="text-gray-500 text-sm mb-5">
            Thank you <strong>{form.name}</strong>! Delivering to{" "}
            <strong>{form.city}</strong>.
          </p>

          <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 mb-5 text-left">
            <div className="flex justify-between text-sm mb-2 pb-2 border-b border-orange-100">
              <span className="text-gray-500">Order Amount</span>
              <span className="text-orange-500 font-bold text-lg">
                ${finalAmt.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-500">Shipping</span>
              <span className="text-green-500 font-medium">FREE</span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-500">Payment</span>
              <span className="font-medium text-gray-700">
                {form.payment === "cod" ? "💵 Cash on Delivery" : "💳 Online"}
              </span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-500">Address</span>
              <span className="font-medium text-gray-700 text-right">
                {form.address}, {form.city} - {form.pincode}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Phone</span>
              <span className="font-medium text-gray-700">{form.phone}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <button onClick={() => navigate("/orders")}
              className="flex-1 border-2 border-orange-500 text-orange-500 font-bold py-2.5 rounded-xl text-sm hover:bg-orange-50 transition">
              📦 View Orders
            </button>
            <button onClick={() => navigate("/")}
              className="flex-1 bg-orange-500 text-white font-bold py-2.5 rounded-xl text-sm hover:bg-orange-600 transition">
              Shop More →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Empty cart
  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center gap-3">
        <div className="text-5xl">🛒</div>
        <h2 className="text-lg font-bold text-gray-700">Cart is empty!</h2>
        <button onClick={() => navigate("/")}
          className="bg-orange-500 text-white px-6 py-2.5 rounded-xl font-semibold text-sm">
          Go Shopping →
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-3 md:p-5 pb-32 md:pb-5">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-gray-900">Checkout</h1>
          <button onClick={() => navigate("/cart")}
            className="text-orange-500 text-sm font-medium">← Cart</button>
        </div>

        <form onSubmit={handleOrder}>
          <div className="flex flex-col lg:grid lg:grid-cols-3 gap-3">

            {/* Form */}
            <div className="lg:col-span-2 flex flex-col gap-3">

              {/* Delivery */}
              <div className="bg-white rounded-2xl shadow p-4">
                <h2 className="font-bold text-gray-900 mb-3">📦 Delivery Info</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    ["name", "Full Name", "text", "Your name"],
                    ["email", "Email", "email", "your@email.com"],
                    ["phone", "Phone", "tel", "+91 9876543210"],
                    ["city", "City", "text", "Your city"],
                    ["pincode", "Pincode", "text", "6 digit pincode"],
                    ["address", "Address", "text", "Street, Area"],
                  ].map(([name, label, type, ph]) => (
                    <div key={name}>
                      <label className="text-xs text-gray-500 font-medium mb-1 block">
                        {label} *
                      </label>
                      <input type={type} name={name} value={form[name]}
                        onChange={handleChange} placeholder={ph} required
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-orange-400"/>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment */}
              <div className="bg-white rounded-2xl shadow p-4">
                <h2 className="font-bold text-gray-900 mb-3">💳 Payment</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    ["cod", "💵 Cash on Delivery", "Pay when delivered"],
                    ["online", "💳 Online Payment", "UPI / Card / Net Banking"],
                  ].map(([val, label, sub]) => (
                    <label key={val}
                      className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition
                        ${form.payment === val ? "border-orange-400 bg-orange-50" : "border-gray-200"}`}>
                      <input type="radio" name="payment" value={val}
                        checked={form.payment === val} onChange={handleChange}
                        className="accent-orange-500"/>
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">{label}</p>
                        <p className="text-xs text-gray-400">{sub}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="fixed bottom-0 left-0 right-0 lg:static bg-white lg:rounded-2xl shadow-lg p-4 border-t lg:border-0 z-40">

                {/* Desktop summary */}
                <div className="hidden lg:block mb-4">
                  <h2 className="font-bold text-gray-900 mb-3">Order Summary</h2>
                  <div className="flex flex-col gap-2 max-h-40 overflow-y-auto mb-3">
                    {cart.map(item => (
                      <div key={item.id} className="flex items-center gap-2">
                        <img
                          src={item.thumbnail || item.image || ""}
                          alt={item.title}
                          className="w-10 h-10 object-cover bg-gray-50 rounded-lg"
                          onError={e => e.target.src = "https://via.placeholder.com/40"}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-700 line-clamp-1">{item.title}</p>
                          <p className="text-xs text-gray-400">x{item.qty} × ${item.price}</p>
                        </div>
                        <p className="text-xs font-bold flex-shrink-0">
                          ${(parseFloat(item.price) * parseInt(item.qty)).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between text-sm text-gray-500 mb-1">
                      <span>{totalItems} items</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500 mb-2">
                      <span>Shipping</span>
                      <span className="text-green-500">FREE</span>
                    </div>
                    <div className="flex justify-between font-bold text-gray-900">
                      <span>Total</span>
                      <span className="text-orange-500 text-lg">${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Mobile summary */}
                <div className="flex items-center justify-between lg:hidden">
                  <div>
                    <p className="text-xs text-gray-500">{totalItems} items • FREE shipping</p>
                    <p className="font-bold text-orange-500 text-lg">${total.toFixed(2)}</p>
                  </div>
                  <button type="submit"
                    className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 px-6 rounded-xl text-sm transition">
                    🎉 Place Order
                  </button>
                </div>

                {/* Desktop button */}
                <button type="submit"
                  className="hidden lg:block w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl text-sm transition">
                  🎉 Place Order — ${total.toFixed(2)}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Checkout;