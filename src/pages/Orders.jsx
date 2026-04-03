import { useOrder } from "../context/OrderContext";
import { useNavigate } from "react-router-dom";

function Orders() {
  const { orders } = useOrder();
  const navigate = useNavigate();

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center gap-3 p-4">
        <div className="text-5xl">📦</div>
        <h2 className="text-lg font-bold text-gray-700">No orders yet!</h2>
        <button onClick={() => navigate("/")}
          className="bg-orange-500 text-white px-6 py-2.5 rounded-xl font-semibold text-sm">
          Shop Now →
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-3 md:p-5">
      <div className="max-w-3xl mx-auto">

        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-gray-900">
            📦 My Orders
            <span className="text-sm font-normal text-gray-400 ml-2">
              ({orders.length})
            </span>
          </h1>
          <button onClick={() => navigate("/")}
            className="text-orange-500 text-sm font-medium">
            ← Shop
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {orders.map((order, index) => {

            // ✅ Total recalculate — 0 வந்தாலும் fix ஆகும்
            const orderTotal = order.total > 0
              ? order.total
              : order.items.reduce((sum, item) => sum + item.price * item.qty, 0);

            return (
              <div key={order.id} className="bg-white rounded-2xl shadow p-4">

                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-bold text-gray-900 text-sm">
                      Order #{orders.length - index}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {order.date} {order.time && `• ${order.time}`} • {order.items.length} items
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                      ✅ {order.status}
                    </span>
                    <span className="text-orange-500 font-bold text-base">
                      ${orderTotal.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Items */}
                <div className="flex flex-col gap-2 mb-3">
                  {order.items.map(item => {
                    const imgSrc = item.thumbnail
                      || item.image
                      || "https://via.placeholder.com/48";

                    // ✅ Item total calculate
                    const itemTotal = item.price * item.qty;

                    return (
                      <div key={item.id}
                        className="flex items-center gap-3 p-2 bg-gray-50 rounded-xl">
                        <div className="w-12 h-12 bg-white rounded-lg overflow-hidden flex-shrink-0 border border-gray-100">
                          <img
                            src={imgSrc}
                            alt={item.title}
                            className="w-full h-full object-cover"
                            onError={e => {
                              e.target.src = "https://via.placeholder.com/48?text=No+Img";
                            }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-gray-800 line-clamp-1">
                            {item.title}
                          </p>
                          <p className="text-xs text-gray-400">
                            ${item.price} × {item.qty} qty
                          </p>
                        </div>
                        <p className="text-sm font-bold text-gray-800 flex-shrink-0">
                          ${itemTotal.toFixed(2)}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* Order Summary */}
                <div className="bg-orange-50 border border-orange-100 rounded-xl p-3 mb-3">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Subtotal ({order.items.reduce((s, i) => s + i.qty, 0)} items)</span>
                    <span>${orderTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Shipping</span>
                    <span className="text-green-500 font-medium">FREE</span>
                  </div>
                  <div className="flex justify-between font-bold text-gray-900 text-sm pt-1 border-t border-orange-200">
                    <span>Total Paid</span>
                    <span className="text-orange-500">${orderTotal.toFixed(2)}</span>
                  </div>
                </div>

                {/* Delivery Info */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-gray-50 rounded-xl p-2.5">
                    <p className="text-xs text-gray-400 mb-0.5">Deliver to</p>
                    <p className="text-xs font-medium text-gray-700">
                      {order.form.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {order.form.city} - {order.form.pincode}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-2.5">
                    <p className="text-xs text-gray-400 mb-0.5">Payment</p>
                    <p className="text-xs font-medium text-gray-700">
                      {order.form.payment === "cod" ? "💵 Cash on Delivery" : "💳 Online"}
                    </p>
                    <p className="text-xs text-gray-500">{order.form.phone}</p>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Orders;