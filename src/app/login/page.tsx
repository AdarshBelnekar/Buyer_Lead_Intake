"use client";
import { supabase } from "@/lib/supabaseClient";
import { useState } from "react";



export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email) return;

    setLoading(true);
    setMessage(null);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/buyers` }, // Redirect to /buyers
    });

    if (error) {
      setMessage({ type: "error", text: error.message });
    } else {
      setMessage({ type: "success", text: "Check your email for the login link!" });
      setEmail("");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold text-center text-blue-700 mb-6">Login</h1>

        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          type="email"
          className="w-full border border-gray-300 rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />

        <button
          onClick={handleLogin}
          disabled={loading || !email}
          className={`w-full py-3 rounded-lg text-white font-semibold transition ${
            loading || !email ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Sending..." : "Send Magic Link"}
        </button>

        {message && (
          <p className={`mt-4 text-center text-sm font-medium ${message.type === "error" ? "text-red-600" : "text-green-600"}`}>
            {message.text}
          </p>
        )}

        <p className="mt-6 text-center text-xs text-gray-500">
          We’ll send you a secure login link to your email. No password required.
        </p>
      </div>
    </div>
  );
}
