import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { AlertCircle, Sprout, Mail, Lock } from "lucide-react";

// Use relative /api path for local dev (works with Vite proxy)
// For Render production, set VITE_API_URL environment variable
const API_URL = import.meta.env.VITE_API_URL || "/api";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError("Email and password are required");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      // Save token and user info
      localStorage.setItem("token", data.token);
      localStorage.setItem("user_id", data.user_id);
      localStorage.setItem("user_name", data.full_name);

      // Navigate to dashboard
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-leaf/10 to-primary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sprout className="w-8 h-8 text-leaf" />
            <h1 className="text-3xl font-bold text-foreground">Crop Advisor</h1>
          </div>
          <p className="text-muted-foreground">Login to your account</p>
        </div>

        {/* Login Card */}
        <Card className="p-6 shadow-lg">
          {error && (
            <div className="mb-4 p-3 bg-destructive/10 border border-destructive/30 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                <Input
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-input" />
                <span className="text-muted-foreground">Remember me</span>
              </label>
              <Link to="#" className="text-primary hover:underline">
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-leaf hover:bg-leaf/90"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>

          {/* Register Link */}
          <p className="text-center text-sm text-muted-foreground mt-4">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary hover:underline font-medium">
              Register here
            </Link>
          </p>

          {/* Demo Credentials */}
          <div className="mt-6 p-3 bg-primary/10 rounded-lg border border-primary/20">
            <p className="text-xs font-medium text-primary mb-2">Demo Account:</p>
            <p className="text-xs text-muted-foreground">Email: demo@cropadvisor.com</p>
            <p className="text-xs text-muted-foreground">Password: demo123456</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;
