import { createContext, useContext, useState } from "react";

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState([]);

  function toggleWishlist(product) {
    setWishlist(prev => {
      const exists = prev.find(i => i.id === product.id);
      if (exists) {
        return prev.filter(i => i.id !== product.id);
      }
      // ✅ Full product data save பண்றோம்
      return [...prev, {
        id: product.id,
        title: product.title,
        price: product.price,
        category: product.category,
        thumbnail: product.thumbnail,   // ✅ DummyJSON
        image: product.image,           // ✅ fallback
        images: product.images,         // ✅ gallery
        rating: product.rating,
        stock: product.stock,
        brand: product.brand,
        discountPercentage: product.discountPercentage,
      }];
    });
  }

  function isWishlisted(id) {
    return wishlist.some(i => i.id === id);
  }

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isWishlisted }}>
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => useContext(WishlistContext);