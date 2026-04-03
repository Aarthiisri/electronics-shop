import { createContext, useContext, useReducer } from "react";

const CartContext = createContext();

function cartReducer(state, action) {
  switch (action.type) {
    case "ADD": {
      const exists = state.find(i => i.id === action.payload.id);
      if (exists) {
        return state.map(i =>
          i.id === action.payload.id ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...state, { ...action.payload, qty: 1 }];
    }
    case "REMOVE":
      return state.filter(i => i.id !== action.payload);
    case "DECREASE": {
      const item = state.find(i => i.id === action.payload);
      if (item?.qty === 1) return state.filter(i => i.id !== action.payload);
      return state.map(i =>
        i.id === action.payload ? { ...i, qty: i.qty - 1 } : i
      );
    }
    case "CLEAR":
      return [];
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [cart, dispatch] = useReducer(cartReducer, []);
  return (
    <CartContext.Provider value={{ cart, dispatch }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);