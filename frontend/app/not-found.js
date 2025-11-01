import Link from "next/link";

export default function NotFound() {
  return (
    <div
      style={{ backgroundColor: "#2b0000"}}
      className="flex flex-col items-center justify-center min-h-screen text-white"
    >
      <img
        src="/batman2.png"
        alt="Batman Logo"
        className="w-120 h-120 mb-8 rounded-lg shadow-lg   hover:scale-105 transition-transform duration-300"
      />
      <h1 className="text-7xl font-extrabold mb-4 text-yellow-400 tracking-widest drop-shadow-lg">
        404
      </h1>
      <p className="text-xl mb-8 text-center text-gray-300 max-w-md">
        Gotham’s best detective couldn’t find this page. It might be hiding in
        the shadows.
      </p>
      <Link
        href="/"
        className="px-6 py-3 bg-yellow-400 text-black font-semibold rounded-full shadow-md hover:bg-yellow-300 hover:shadow-lg transition"
      >
        Return to Gotham
      </Link>
    </div>
  );
}
