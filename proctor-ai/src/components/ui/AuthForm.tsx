import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label"; // Fixed Label import
import { toast } from "sonner"; // Use Sonner for notifications

// Supabase client setup
const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_KEY);

export default function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state for better UX

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("All fields are required!");
      return;
    }

    setLoading(true);
    try {
      let response;
      if (isRegister) {
        response = await supabase.auth.signUp({ email, password });
      } else {
        response = await supabase.auth.signInWithPassword({ email, password });
      }

      if (response.error) throw response.error;

      const user = response.data.user;
      if (user) {
        // Store user ID in Chrome storage
        chrome.storage.sync.set({ userId: user.id }, () => {
          toast.success(isRegister ? "Registered successfully!" : "Logged in successfully!");
        });
      }
    } catch (error: any) {
      toast.error(`Authentication Failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-80 p-6 shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{isRegister ? "Register" : "Login"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Email</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <Label>Password</Label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Processing..." : isRegister ? "Sign Up" : "Sign In"}
          </Button>
        </form>
        <p className="text-center text-sm mt-3">
          {isRegister ? "Already have an account?" : "Don't have an account?"}
          <button className="text-blue-500 ml-1 hover:underline" onClick={() => setIsRegister(!isRegister)}>
            {isRegister ? "Login" : "Sign Up"}
          </button>
        </p>
      </CardContent>
    </Card>
  );
}
