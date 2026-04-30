"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const AdminSidebar = ({ onLogout }: { onLogout: () => void }) => {
    const pathname = usePathname();

    const links = [
        { href: "/admin", label: "Overview" },
        { href: "/admin/products", label: "Product Catalogue" },
        { href: "/admin/blog", label: "Blog Editor" },
        { href: "/admin/consultations", label: "Consultations" },
        { href: "/admin/orders", label: "Customer Orders" },
        { href: "/admin/settings", label: "Settings" },
    ];

    return (
        <aside className="w-64 bg-white border-r border-gray-100 h-screen fixed left-0 top-0 flex flex-col shadow-sm">
            <div className="p-8 border-b border-gray-100">
                <h2 className="text-xl font-serif text-charcoal tracking-wide">RK Furnishings</h2>
                <span className="text-[9px] uppercase tracking-[0.4em] text-gold font-bold mt-2 block">Admin Panel</span>
            </div>

            <nav className="flex-1 p-6 space-y-2 overflow-y-auto">
                <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-6 mt-4">Modules</p>
                {links.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`block px-4 py-3 rounded-sm text-xs uppercase tracking-wider transition-all duration-300 font-medium ${isActive
                                ? "bg-charcoal text-white shadow-md"
                                : "text-gray-500 hover:bg-gray-50 hover:text-charcoal"
                                }`}
                        >
                            {link.label}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-6 border-t border-gray-100">
                <button
                    onClick={onLogout}
                    className="w-full bg-red-50 text-red-600 px-4 py-3 text-[10px] uppercase tracking-[0.2em] font-bold rounded-sm border border-red-100 hover:bg-red-600 hover:text-white transition-colors"
                >
                    Sign Out
                </button>
                <div className="mt-4 text-center">
                    <a href="/" className="text-[9px] text-gray-400 hover:text-gold uppercase tracking-widest underline underline-offset-4">Return to Site</a>
                </div>
            </div>
        </aside>
    );
};

export default AdminSidebar;
