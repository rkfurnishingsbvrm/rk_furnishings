"use client";
import { useState, useEffect } from "react";
import { API_BASE_URL } from "@/lib/config";


export default function SettingsAdmin() {
    const [settings, setSettings] = useState({
        adminPassword: "",
        confirmPassword: "",
        contactNumber: "",
        supportEmail: ""
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/admin/settings`);
            const data = await res.json();

            setSettings({
                ...settings,
                contactNumber: data.contactNumber,
                supportEmail: data.supportEmail
            });
        } catch (err) {
            console.error("Failed to fetch settings:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ type: "", text: "" });

        if (settings.adminPassword && settings.adminPassword !== settings.confirmPassword) {
            setMessage({ type: "error", text: "Passwords do not match!" });
            setSaving(false);
            return;
        }

        try {
            const res = await fetch(`${API_BASE_URL}/admin/settings`, {
                method: "POST",

                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    adminPassword: settings.adminPassword || undefined,
                    contactNumber: settings.contactNumber,
                    supportEmail: settings.supportEmail
                })
            });

            if (res.ok) {
                setMessage({ type: "success", text: "Settings updated successfully!" });
                setSettings(prev => ({ ...prev, adminPassword: "", confirmPassword: "" }));
            } else {
                throw new Error("Failed to save");
            }
        } catch (err) {
            setMessage({ type: "error", text: "Failed to update settings." });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-gold mx-auto"></div>
        </div>
    );

    return (
        <div className="space-y-10 animate-fade-in-up">
            <div className="flex justify-between items-end border-b border-gray-100 pb-6">
                <div>
                    <h1 className="text-3xl font-serif text-charcoal mb-2">Portal Settings</h1>
                    <p className="text-gray-500 text-xs tracking-widest uppercase">Configuration & Security</p>
                </div>
                <button 
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-gold text-white text-[10px] uppercase tracking-[0.3em] font-bold px-8 py-4 rounded-sm hover:bg-yellow-600 transition-colors shadow-md disabled:opacity-50"
                >
                    {saving ? "Saving..." : "Save Changes"}
                </button>
            </div>

            {message.text && (
                <div className={`p-4 rounded-sm text-xs font-bold uppercase tracking-widest ${
                    message.type === "success" ? "bg-green-50 text-green-600 border border-green-100" : "bg-red-50 text-red-600 border border-red-100"
                }`}>
                    {message.text}
                </div>
            )}

            <div className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden max-w-2xl">
                <form className="p-8 space-y-8" onSubmit={handleSave}>
                    <div>
                        <h3 className="text-lg font-serif text-charcoal mb-4">Security</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2 font-bold">Update Access Password</label>
                                <input
                                    type="password"
                                    value={settings.adminPassword}
                                    onChange={(e) => setSettings({ ...settings, adminPassword: e.target.value })}
                                    className="w-full border-b pb-2 border-gray-200 focus:border-gold focus:outline-none transition-colors text-sm"
                                    placeholder="Enter new password"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2 font-bold mt-4">Confirm Password</label>
                                <input
                                    type="password"
                                    value={settings.confirmPassword}
                                    onChange={(e) => setSettings({ ...settings, confirmPassword: e.target.value })}
                                    className="w-full border-b pb-2 border-gray-200 focus:border-gold focus:outline-none transition-colors text-sm"
                                    placeholder="Re-enter new password"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-gray-100">
                        <h3 className="text-lg font-serif text-charcoal mb-4">Business Information</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2 font-bold">Contact Number</label>
                                <input
                                    type="text"
                                    value={settings.contactNumber}
                                    onChange={(e) => setSettings({ ...settings, contactNumber: e.target.value })}
                                    className="w-full border-b pb-2 border-gray-200 focus:border-gold focus:outline-none transition-colors text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2 font-bold mt-4">Support Email</label>
                                <input
                                    type="email"
                                    value={settings.supportEmail}
                                    onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                                    className="w-full border-b pb-2 border-gray-200 focus:border-gold focus:outline-none transition-colors text-sm"
                                />
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
