"use client";

import { useState, useEffect } from "react";
import AdminSidebar from "./components/AdminSidebar";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState("");
    const [adminPassword, setAdminPassword] = useState("rkadmin123");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const fetchPassword = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/admin/settings");
                const data = await res.json();
                if (data.adminPassword) {
                    setAdminPassword(data.adminPassword);
                }
            } catch (err) {
                console.error("Failed to load admin security settings:", err);
            }
        };
        fetchPassword();
    }, []);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === adminPassword) {
            setIsAuthenticated(true);
        } else {
            alert("Invalid Password");
        }
    };

    if (!mounted) return null;

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="bg-white p-10 rounded-sm shadow-xl max-w-md w-full border border-gray-100">
                    <div className="text-center mb-10">
                        <h1 className="text-2xl font-serif text-charcoal mb-2">RK Furnishings</h1>
                        <p className="text-[10px] uppercase tracking-[0.3em] text-gold font-bold">Admin Portal</p>
                    </div>
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Access Key</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full border-b pb-2 border-gray-200 focus:border-gold focus:outline-none transition-colors text-sm"
                                placeholder="Enter admin password"
                                suppressHydrationWarning
                            />
                        </div>
                        <button
                            type="submit"
                            suppressHydrationWarning
                            className="w-full bg-charcoal text-white text-[10px] uppercase tracking-[0.3em] py-4 rounded-sm hover:bg-gold hover:text-white transition-colors"
                        >
                            Secure Login
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex bg-gray-50">
            <AdminSidebar onLogout={() => setIsAuthenticated(false)} />
            <main className="flex-1 p-10 h-screen overflow-y-auto ml-64">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
