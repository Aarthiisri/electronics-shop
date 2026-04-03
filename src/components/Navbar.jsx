import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useClerk, useUser } from "@clerk/clerk-react";

function Navbar() {
  const { cart } = useCart();
  const { wishlist } = useWishlist();
  const { signOut } = useClerk();
  const { user } = useUser();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const totalItems = cart.reduce((s, i) => s + i.qty, 0);

  async function handleLogout() {
    await signOut();
    navigate("/login");
    setMenuOpen(false);
  }

  return (
    <nav className="bg-gray-900 text-white sticky top-0 z-50">
      <div className="px-4 py-3 flex justify-between items-center">

        {/* Logo */}
        <Link to="/" className="text-lg font-bold text-orange-400">
          ⚡ ElectroShop
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-4">

          {/* User info */}
          {user && (
            <div className="flex items-center gap-2">
              <img
                src={user.imageUrl}
                alt={user.firstName}
                className="w-7 h-7 rounded-full border-2 border-orange-400"
              />
              <span className="text-sm text-gray-300">
                {user.firstName || user.emailAddresses[0].emailAddress}
              </span>
            </div>
          )}

          <Link to="/wishlist" className="relative">
            <span className="text-xl">❤️</span>
            {wishlist.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {wishlist.length}
              </span>
            )}
          </Link>

          <Link to="/orders" className="text-sm text-gray-300 hover:text-orange-400 transition">
            📦 Orders
          </Link>

          <Link to="/cart" className="relative">
            <span className="text-xl">🛒</span>
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {totalItems}
              </span>
            )}
          </Link>

          <button onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded-lg text-sm transition">
            Logout
          </button>
        </div>

        {/* Mobile */}
        <div className="flex md:hidden items-center gap-3">
          <Link to="/cart" className="relative">
            <span className="text-xl">🛒</span>
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {totalItems}
              </span>
            )}
          </Link>
          <button onClick={() => setMenuOpen(!menuOpen)} className="flex flex-col gap-1.5 p-1">
            <span className={`block w-6 h-0.5 bg-white transition-all ${menuOpen ? "rotate-45 translate-y-2" : ""}`}></span>
            <span className={`block w-6 h-0.5 bg-white transition-all ${menuOpen ? "opacity-0" : ""}`}></span>
            <span className={`block w-6 h-0.5 bg-white transition-all ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`}></span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-gray-800 px-4 py-3 flex flex-col gap-3 border-t border-gray-700">
          {user && (
            <div className="flex items-center gap-2 py-2 border-b border-gray-700">
              <img src={user.imageUrl} alt="" className="w-8 h-8 rounded-full border-2 border-orange-400"/>
              <div>
                <p className="text-sm font-medium text-white">{user.firstName || "User"}</p>
                <p className="text-xs text-gray-400">{user.emailAddresses[0].emailAddress}</p>
              </div>
            </div>
          )}
          <Link to="/" onClick={() => setMenuOpen(false)} className="text-sm text-gray-300 py-2 border-b border-gray-700">🏠 Home</Link>
          <Link to="/wishlist" onClick={() => setMenuOpen(false)} className="text-sm text-gray-300 py-2 border-b border-gray-700 flex justify-between">
            <span>❤️ Wishlist</span>
            {wishlist.length > 0 && <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{wishlist.length}</span>}
          </Link>
          <Link to="/orders" onClick={() => setMenuOpen(false)} className="text-sm text-gray-300 py-2 border-b border-gray-700">📦 Orders</Link>
          <Link to="/cart" onClick={() => setMenuOpen(false)} className="text-sm text-gray-300 py-2 border-b border-gray-700 flex justify-between">
            <span>🛒 Cart</span>
            {totalItems > 0 && <span className="bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full">{totalItems}</span>}
          </Link>
          <button onClick={handleLogout} className="bg-red-500 text-white py-2 rounded-xl text-sm font-bold">Logout</button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;