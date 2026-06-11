"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { fetchAPI } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = new URLSearchParams();
      data.append("username", email);
      data.append("password", password);
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: data,
      });

      if (!response.ok) throw new Error("Invalid credentials");
      
      const result = await response.json();
      localStorage.setItem("access_token", result.access_token);
      localStorage.setItem("refresh_token", result.refresh_token);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    // Stub for Google OAuth
    try {
      const response = await fetchAPI("/auth/google", {
        method: "POST",
        body: JSON.stringify({ credential: "dummy-google-token" }),
      });
      localStorage.setItem("access_token", response.access_token);
      localStorage.setItem("refresh_token", response.refresh_token);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <div className="w-full max-w-md p-8 glass-dark rounded-xl border border-primary/20">
        <h1 className="text-3xl font-mono font-bold mb-6 text-center text-primary">ACCESS TERMINAL</h1>
        {error && <div className="mb-4 text-red-500 font-mono text-sm">{error}</div>}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-mono mb-2">IDENTIFIER (EMAIL)</label>
            <input 
              type="email" 
              className="w-full p-3 rounded bg-black/50 border border-primary/30 text-white focus:outline-none focus:border-primary"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-mono mb-2">SECURITY KEY (PASSWORD)</label>
            <input 
              type="password" 
              className="w-full p-3 rounded bg-black/50 border border-primary/30 text-white focus:outline-none focus:border-primary"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="w-full py-3 bg-primary text-primary-foreground font-mono font-bold rounded hover:bg-primary/90 glow-cyan">
            AUTHENTICATE
          </button>
        </form>
        <div className="mt-4 text-center">
          <button onClick={handleGoogleLogin} className="w-full py-3 glass-dark border border-primary/30 font-mono text-sm rounded hover:border-primary transition">
            AUTHENTICATE VIA GOOGLE PROTOCOL
          </button>
        </div>
        <p className="mt-6 text-center text-sm font-mono text-muted-foreground">
          NO CLEARANCE? <Link href="/register" className="text-primary hover:underline">REQUEST ACCESS</Link>
        </p>
      </div>
    </div>
  );
}
