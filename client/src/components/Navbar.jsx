import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

const NAV_LINKS = [
  { to: "/shop", label: "Shop" },
  { to: "/categories", label: "Categories" },
  { to: "/how-it-works", label: "How it works" },
  { to: "/stories", label: "Stories" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const { items: wishlistItems } = useWishlist();
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const accountRef = useRef(null);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!search.trim()) return;
    navigate(`/shop?search=${encodeURIComponent(search.trim())}`);
    setSearch("");
    setMenuOpen(false);
  };

  // Close the account dropdown on outside click
  useEffect(() => {
    const onClick = (e) => {
      if (accountRef.current && !accountRef.current.contains(e.target)) {
        setAccountOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <nav className="sticky top-0 z-50 bg-putty border-b border-line">
      <div className="max-w-[1180px] mx-auto px-5 md:px-8 py-4 md:py-5 flex items-center justify-between gap-4">
        <Link to="/" className="text-xl md:text-2xl font-bold flex items-center gap-2 font-display shrink-0">
          <span className="w-2.5 h-2.5 bg-mustard rounded-full inline-block" />
          ReWear
        </Link>

        {/* Primary links only — account-specific links (Orders/Admin) live in the dropdown below */}
        <div className="hidden xl:flex gap-6 text-sm font-medium uppercase tracking-wider">
          {NAV_LINKS.map((l) => (
            <Link key={l.to} to={l.to} className="opacity-75 hover:opacity-100 transition whitespace-nowrap">
              {l.label}
            </Link>
          ))}
        </div>

        <form onSubmit={handleSearch} className="hidden md:flex items-center bg-putty-light border border-line rounded-sm overflow-hidden shrink-0">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="bg-transparent px-3 py-2 text-sm w-24 lg:w-40 outline-none"
          />
          <button type="submit" className="px-3 opacity-60 hover:opacity-100">⌕</button>
        </form>

        <div className="flex items-center gap-3 md:gap-4 shrink-0">
          <Link to="/wishlist" className="relative text-lg" title="Wishlist">
            ♡
            {wishlistItems.length > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-rose text-cream-paper text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {wishlistItems.length}
              </span>
            )}
          </Link>
          <Link to="/cart" className="relative text-sm font-semibold uppercase tracking-wide hidden sm:block">
            Cart
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-3 bg-mustard text-ink text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>

          {user ? (
            <div className="relative hidden sm:block" ref={accountRef}>
              <button
                onClick={() => setAccountOpen((v) => !v)}
                className="flex items-center gap-2 bg-bottle text-putty-light px-4 py-2.5 rounded-sm text-[13px] font-semibold uppercase tracking-wide"
              >
                {user.name ? user.name.split(" ")[0] : "Account"}
                <span className={`text-[10px] transition ${accountOpen ? "rotate-180" : ""}`}>▾</span>
              </button>

              {accountOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-cream-paper border border-line rounded-sm shadow-lg overflow-hidden text-sm">
                  <Link
                    to="/my-orders"
                    onClick={() => setAccountOpen(false)}
                    className="block px-4 py-2.5 hover:bg-putty-light transition"
                  >
                    My Orders
                  </Link>
                  {user.role === "admin" && (
                    <Link
                      to="/admin"
                      onClick={() => setAccountOpen(false)}
                      className="block px-4 py-2.5 hover:bg-putty-light transition"
                    >
                      Admin
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      setAccountOpen(false);
                    }}
                    className="w-full text-left px-4 py-2.5 hover:bg-putty-light transition border-t border-line"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="hidden sm:block bg-bottle text-putty-light px-5 py-2.5 rounded-sm text-[13px] font-semibold uppercase tracking-wide">
              Login
            </Link>
          )}

          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="xl:hidden w-9 h-9 flex flex-col items-center justify-center gap-1.5"
            aria-label="Menu"
          >
            <span className={`block w-6 h-[1.5px] bg-ink transition ${menuOpen ? "rotate-45 translate-y-[3px]" : ""}`} />
            <span className={`block w-6 h-[1.5px] bg-ink transition ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block w-6 h-[1.5px] bg-ink transition ${menuOpen ? "-rotate-45 -translate-y-[3px]" : ""}`} />
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="xl:hidden bg-putty-light border-t border-line px-5 py-5 flex flex-col gap-4">
          <form onSubmit={handleSearch} className="flex items-center bg-cream-paper border border-line rounded-sm overflow-hidden">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="bg-transparent px-3 py-2.5 text-sm flex-1 outline-none"
            />
            <button type="submit" className="px-3 opacity-60">⌕</button>
          </form>
          {NAV_LINKS.map((l) => (
            <Link key={l.to} to={l.to} onClick={() => setMenuOpen(false)} className="text-sm font-medium uppercase tracking-wide opacity-80">
              {l.label}
            </Link>
          ))}
          {user && <Link to="/my-orders" onClick={() => setMenuOpen(false)} className="text-sm font-medium uppercase tracking-wide opacity-80">My Orders</Link>}
          {user?.role === "admin" && <Link to="/admin" onClick={() => setMenuOpen(false)} className="text-sm font-medium uppercase tracking-wide opacity-80">Admin</Link>}
          <Link to="/cart" onClick={() => setMenuOpen(false)} className="text-sm font-medium uppercase tracking-wide opacity-80">Cart ({totalItems})</Link>
          {user ? (
            <button onClick={() => { logout(); setMenuOpen(false); }} className="bg-bottle text-putty-light px-5 py-2.5 rounded-sm text-[13px] font-semibold uppercase tracking-wide text-center">
              Logout
            </button>
          ) : (
            <Link to="/login" onClick={() => setMenuOpen(false)} className="bg-bottle text-putty-light px-5 py-2.5 rounded-sm text-[13px] font-semibold uppercase tracking-wide text-center">
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}