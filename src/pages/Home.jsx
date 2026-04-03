import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";

const CATEGORIES = [
  { label: "All", value: "all" },
  { label: "Smartphones", value: "smartphones" },
  { label: "Laptops", value: "laptops" },
  { label: "Tablets", value: "tablets" },
  { label: "Accessories", value: "mobile-accessories" },
  { label: "Watches", value: "womens-watches" },
  { label: "Men Watches", value: "mens-watches" },
];

// ✅ Hero slides
const HERO_SLIDES = [
  {
    id: 1,
    title: "Latest Smartphones",
    subtitle: "Top brands at best prices",
    offer: "Up to 40% OFF",
    bg: "from-blue-900 to-blue-700",
    img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80",
  },
  {
    id: 2,
    title: "Premium Laptops",
    subtitle: "Work & Gaming laptops",
    offer: "Free Shipping",
    bg: "from-gray-900 to-gray-700",
    img: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&q=80",
  },
  {
    id: 3,
    title: "Smart Watches",
    subtitle: "Stay connected always",
    offer: "Starting ₹999",
    bg: "from-purple-900 to-purple-700",
    img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80",
  },
  {
    id: 4,
    title: "Wireless Earbuds",
    subtitle: "Crystal clear sound",
    offer: "Best Deals Today",
    bg: "from-orange-900 to-orange-700",
    img: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&q=80",
  },
];

function Home() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [currentSlide, setCurrentSlide] = useState(0);

  // ✅ Auto slide
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % HERO_SLIDES.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  function fetchProducts() {
    setLoading(true);
    setError(false);
    const urls = [
      "/api/products/category/smartphones?limit=10",
      "/api/products/category/laptops?limit=10",
      "/api/products/category/tablets?limit=5",
      "/api/products/category/mobile-accessories?limit=5",
      "/api/products/category/womens-watches?limit=5",
      "/api/products/category/mens-watches?limit=5",
    ];
    Promise.all(urls.map(url => fetch(url).then(r => r.json())))
      .then(results => {
        const all = results.flatMap(r => r.products || []);
        setProducts(all);
        setFiltered(all);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }

  useEffect(() => { fetchProducts(); }, []);

  useEffect(() => {
    let result = products;
    if (category !== "all") result = result.filter(p => p.category === category);
    if (search) result = result.filter(p =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.brand?.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(result);
  }, [search, category, products]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center gap-4 p-4">
        <div className="text-5xl">😕</div>
        <h2 className="text-lg font-bold text-gray-700">Products load ஆகலை!</h2>
        <button onClick={fetchProducts}
          className="bg-orange-500 text-white px-6 py-2.5 rounded-xl font-semibold text-sm">
          🔄 Retry
        </button>
      </div>
    );
  }

  const slide = HERO_SLIDES[currentSlide];

  return (
    <div className="min-h-screen bg-gray-100">

      {/* ✅ HERO SECTION */}
      <div className={`relative bg-gradient-to-r ${slide.bg} overflow-hidden transition-all duration-700`}
        style={{ minHeight: "280px" }}>

        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src={slide.img}
            alt={slide.title}
            className="w-full h-full object-cover opacity-20"
          />
          <div className={`absolute inset-0 bg-gradient-to-r ${slide.bg} opacity-80`}></div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex items-center justify-between px-6 md:px-12 py-10 md:py-14">
          <div className="flex-1 ">
            {/* Offer badge */}
            <span className="inline-block bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-3">
              🔥 {slide.offer}
            </span>

            <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-2 leading-tight">
              {slide.title}
            </h1>
            <p className="text-gray-300 text-sm md:text-base mb-5">
              {slide.subtitle}
            </p>

            <button
              onClick={() => setCategory(
                slide.title.toLowerCase().includes("smart") ? "smartphones" :
                slide.title.toLowerCase().includes("laptop") ? "laptops" :
                slide.title.toLowerCase().includes("watch") ? "womens-watches" : "all"
              )}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition active:scale-95">
              Shop Now →
            </button>
          </div>

          {/* Product image */}
          <div className="hidden sm:flex flex-1 justify-end items-center">
            <div className="relative">
              <div className="w-48 h-48 md:w-64 md:h-64 rounded-2xl overflow-hidden border-4 border-white border-opacity-20 shadow-2xl">
                <img
                  src={slide.img}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Floating badge */}
              <div className="absolute -top-3 -right-3 bg-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-lg">
                {slide.offer}
              </div>
            </div>
          </div>
        </div>

        {/* Slide dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {HERO_SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`transition-all duration-300 rounded-full
                ${i === currentSlide
                  ? "bg-orange-500 w-6 h-2"
                  : "bg-white opacity-50 w-2 h-2"
                }`}
            />
          ))}
        </div>

        {/* Prev / Next arrows */}
        <button
          onClick={() => setCurrentSlide(prev => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
          className="absolute left-3 top-1/2 -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-40 text-white w-8 h-8 rounded-full flex items-center justify-center transition">
          ‹
        </button>
        <button
          onClick={() => setCurrentSlide(prev => (prev + 1) % HERO_SLIDES.length)}
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-40 text-white w-8 h-8 rounded-full flex items-center justify-center transition">
          ›
        </button>
      </div>

      {/* ✅ STATS BAR */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-3 flex justify-around">
          {[
            ["40+", "Products"],
            ["6", "Categories"],
            ["⭐ 4.5", "Rating"],
            ["🚚", "Free Ship"],
          ].map(([val, label]) => (
            <div key={label} className="text-center">
              <p className="text-orange-500 font-bold text-sm md:text-base">{val}</p>
              <p className="text-gray-400 text-xs">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ✅ CATEGORY QUICK LINKS */}
      <div className="bg-white border-b border-gray-100 px-3 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-around gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {[
              { emoji: "📱", label: "Phones", val: "smartphones" },
              { emoji: "💻", label: "Laptops", val: "laptops" },
              { emoji: "⌚", label: "Watches", val: "womens-watches" },
              { emoji: "🎧", label: "Accessories", val: "mobile-accessories" },
              { emoji: "📟", label: "Tablets", val: "tablets" },
            ].map(cat => (
              <button
                key={cat.val}
                onClick={() => {
                  setCategory(cat.val);
                  document.getElementById("products-section")?.scrollIntoView({ behavior: "smooth" });
                }}
                className={`flex flex-col items-center gap-1 flex-shrink-0 px-4 py-2 rounded-xl transition
                  ${category === cat.val
                    ? "bg-orange-500 text-white"
                    : "bg-gray-50 text-gray-600 hover:bg-orange-50"
                  }`}>
                <span className="text-xl">{cat.emoji}</span>
                <span className="text-xs font-medium">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ✅ PRODUCTS SECTION */}
      <div id="products-section" className="p-3 md:p-5">

        {/* Search + Filter */}
        <div className="max-w-md mx-auto mb-3">
          <input type="text" placeholder="🔍 Search products or brand..."
            value={search} onChange={e => setSearch(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 outline-none focus:border-orange-400 bg-white text-sm"/>
        </div>

        <div className="flex justify-around gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
          {CATEGORIES.map(cat => (
            <button key={cat.value} onClick={() => setCategory(cat.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 transition
                ${category === cat.value
                  ? "bg-orange-500 text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-orange-300"}`}>
              {cat.label}
            </button>
          ))}
        </div>

        {loading ? (
          <Loader />
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-4xl mb-3">🔍</div>
            <p className="text-gray-400 text-sm">No products found</p>
            <button onClick={() => { setSearch(""); setCategory("all"); }}
              className="text-orange-500 text-sm mt-2 hover:underline">
              Clear filters
            </button>
          </div>
        ) : (
          <>
            <p className="text-xs text-gray-400 mb-3 text-center">
              {filtered.length} products found
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {filtered.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Home;