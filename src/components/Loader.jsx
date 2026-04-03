function Loader() {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-gray-400 text-sm">Loading products...</p>
    </div>
  );
}
export default Loader;