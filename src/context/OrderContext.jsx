import { createContext, useContext, useState } from "react";

const OrderContext = createContext();

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState([]);

  function placeOrder(cart, form, total) {
    // ✅ Total recalculate பண்றோம் — pass ஆன value தப்பா இருந்தாலும் fix ஆகும்
    const calculatedTotal = cart.reduce(
      (sum, item) => sum + item.price * item.qty, 0
    );

    const newOrder = {
      id: Date.now(),
      items: cart.map(item => ({
        id: item.id,
        title: item.title,
        price: item.price,
        qty: item.qty,
        thumbnail: item.thumbnail || item.image || "",
        category: item.category,
      })),
      form,
      total: calculatedTotal, // ✅ recalculated total use பண்றோம்
      date: new Date().toLocaleDateString("en-IN"),
      time: new Date().toLocaleTimeString("en-IN"),
      status: "Confirmed",
    };

    setOrders(prev => [newOrder, ...prev]);
  }

  return (
    <OrderContext.Provider value={{ orders, placeOrder }}>
      {children}
    </OrderContext.Provider>
  );
}

export const useOrder = () => useContext(OrderContext);