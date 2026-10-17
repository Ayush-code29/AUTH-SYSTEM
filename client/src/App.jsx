
import { useState } from "react";
import "./index.css";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");
  const [user, setUser] = useState(null);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const showMessage = (text, type = "error") => {
    setMessage(text);
    setMessageType(type);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Handles both registration and login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (loading) return;

    const endpoint = isLogin ? "/users/login" : "/users/register";

    const payload = isLogin
      ? {
          email: formData.email.trim(),
          password: formData.password,
        }
      : {
          username: formData.username.trim(),
          email: formData.email.trim(),
          password: formData.password,
        };

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || data.success === false) {
        throw new Error(
          data.message || `Request failed (${response.status})`
        );
      }

      if (isLogin) {
        // Backend must successfully authenticate the user.
        setIsLoggedIn(true);
        setUser(data.data?.user || data.user || null);
        setShowAuth(false);
        showMessage(
          data.message || "Login successful!",
          "success"
        );
      } else {
        // Registration successful: ask the user to log in.
        setIsLogin(true);
        showMessage(
          data.message || "Registration successful! Please log in.",
          "success"
        );
      }

      setFormData({
        username: "",
        email: "",
        password: "",
      });
    } catch (error) {
      showMessage(
        error.message ||
          "Unable to connect to the server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Calls the backend logout endpoint
  const handleLogout = async () => {
    if (loading) return;

    setMessage("");

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/users/logout`, {
        method: "POST",
        credentials: "include",
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || data.success === false) {
        throw new Error(data.message || "Logout failed");
      }

      setIsLoggedIn(false);
      setUser(null);
      setShowAuth(false);
      setIsLogin(true);
      setFormData({
        username: "",
        email: "",
        password: "",
      });

      showMessage("Logged out successfully.", "success");
    } catch (error) {
      showMessage(
        error.message ||
          "Could not log out. Please check your connection."
      );
    } finally {
      setLoading(false);
    }
  };

  const openAuth = () => {
    setMessage("");
    setIsLogin(true);
    setShowAuth(true);
  };

  const inputClass =
    "w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100";

  const primaryButton =
    "w-full rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60";

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4 sm:px-10">
        <button
          type="button"
          onClick={() => {
            setShowAuth(false);
            setMessage("");
          }}
          className="text-xl font-bold tracking-tight"
        >
          Auth<span className="text-blue-600">System</span>
        </button>

        {isLoggedIn ? (
          <button
            className="rounded-lg border border-gray-300 px-5 py-2 font-medium transition hover:bg-gray-100 disabled:opacity-60"
            onClick={handleLogout}
            disabled={loading}
          >
            {loading ? "Please wait..." : "Logout"}
          </button>
        ) : (
          <button
            className="rounded-lg bg-blue-600 px-5 py-2 font-medium text-white transition hover:bg-blue-700"
            onClick={openAuth}
          >
            Login / Register
          </button>
        )}
      </header>

      <main className="flex min-h-[calc(100vh-73px)] items-center justify-center px-4 py-10">
        <div className="w-full max-w-lg">
          {message && (
            <div
              role="status"
              aria-live="polite"
              className={`mb-5 rounded-lg border px-4 py-3 text-sm ${
                messageType === "success"
                  ? "border-green-200 bg-green-50 text-green-800"
                  : "border-red-200 bg-red-50 text-red-700"
              }`}
            >
              {message}
            </div>
          )}

          {isLoggedIn ? (
            <section className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm sm:p-10">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl text-green-700">
                ✓
              </div>

              <h1 className="mb-3 text-3xl font-bold">
                Welcome{user?.username ? `, ${user.username}` : ""}!
              </h1>

              <p className="mb-7 text-gray-600">
                You are successfully logged in.
              </p>

              <button
                onClick={handleLogout}
                disabled={loading}
                className={primaryButton}
              >
                {loading ? "Logging out..." : "Logout"}
              </button>
            </section>
          ) : showAuth ? (
            <section className="rounded-2xl border border-gray-200 bg-white p-7 shadow-sm sm:p-9">
              <h1 className="mb-2 text-3xl font-bold">
                {isLogin ? "Welcome Back" : "Create Account"}
              </h1>

              <p className="mb-7 text-gray-500">
                {isLogin
                  ? "Login to continue to your account."
                  : "Register to create your account."}
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                {!isLogin && (
                  <div>
                    <label
                      htmlFor="username"
                      className="mb-2 block text-sm font-medium"
                    >
                      Username
                    </label>

                    <input
                      id="username"
                      type="text"
                      name="username"
                      placeholder="Enter your username"
                      value={formData.username}
                      onChange={handleChange}
                      className={inputClass}
                      minLength={3}
                      maxLength={30}
                      autoComplete="username"
                      required
                    />
                  </div>
                )}

                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium"
                  >
                    Email
                  </label>

                  <input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className={inputClass}
                    autoComplete="email"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-medium"
                  >
                    Password
                  </label>

                  <input
                    id="password"
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    className={inputClass}
                    autoComplete={
                      isLogin ? "current-password" : "new-password"
                    }
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={primaryButton}
                >
                  {loading
                    ? "Please wait..."
                    : isLogin
                      ? "Login"
                      : "Create Account"}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-gray-600">
                {isLogin
                  ? "Don't have an account?"
                  : "Already have an account?"}

                <button
                  type="button"
                  disabled={loading}
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setMessage("");
                    setFormData({
                      username: "",
                      email: formData.email,
                      password: "",
                    });
                  }}
                  className="ml-2 font-semibold text-blue-600 hover:text-blue-700"
                >
                  {isLogin ? "Register" : "Login"}
                </button>
              </p>

              <button
                type="button"
                onClick={() => {
                  setShowAuth(false);
                  setMessage("");
                }}
                className="mt-5 w-full text-sm text-gray-500 hover:text-gray-900"
              >
                Back to Home
              </button>
            </section>
          ) : (
            <section className="text-center">
              <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-blue-600">
                Simple & Secure
              </p>

              <h1 className="mb-5 text-4xl font-bold tracking-tight sm:text-6xl">
                Welcome to AuthSystem
              </h1>

              <p className="mx-auto mb-8 max-w-xl text-lg leading-8 text-gray-600">
                A simple authentication system built with React and Node.js.
              </p>

              <button
                onClick={openAuth}
                className="rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white transition hover:bg-blue-700"
              >
                Get Started
              </button>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
