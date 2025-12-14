import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@features/auth/hooks/useAuth";
import { FiMail, FiLock, FiLoader, FiEye, FiEyeOff } from "react-icons/fi";

const LoginForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await login(email, password);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Terjadi kesalahan saat login.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl space-y-6 border-t-4 border-red-500 max-w-sm sm:max-w-md mx-auto w-full"
    >
      {error && (
        <div
          className="p-2 sm:p-3 text-xs sm:text-sm text-red-700 bg-red-100 border border-red-400 rounded-md"
          role="alert"
        >
          {error}
        </div>
      )}

      <div>
        <label
          htmlFor="email"
          className="block text-xs sm:text-sm font-medium text-primary-600"
        >
          Alamat Email
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiMail className="h-4 w-4 sm:h-5 sm:w-5 text-primary-400" />
          </div>

          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="appearance-none block w-full pl-10 pr-3 py-2.5 sm:py-3 border border-primary-300 rounded-md placeholder-gray-400 placeholder:text-xs sm:placeholder:text-sm focus:outline-none focus:ring-red-500 focus:border-red-500 text-sm disabled:opacity-75"
            disabled={isLoading}
            placeholder="Masukkan email"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-xs sm:text-sm font-medium text-primary-700"
        >
          Password
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiLock className="h-4 w-4 sm:h-5 sm:w-5 text-primary-400" />
          </div>

          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="appearance-none block w-full pl-10 pr-10 py-2.5 sm:py-3 border border-primary-300 rounded-md placeholder-gray-400 placeholder:text-xs sm:placeholder:text-sm focus:outline-none focus:ring-red-500 focus:border-red-500 text-sm disabled:opacity-75"
            disabled={isLoading}
            placeholder="Masukkan kata sandi"
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-primary-500 hover:text-primary-700 cursor-pointer"
            tabIndex={-1}
          >
            {showPassword ? (
              <FiEyeOff className="h-4 w-4 sm:h-5 sm:w-5" />
            ) : (
              <FiEye className="h-4 w-4 sm:h-5 sm:w-5" />
            )}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex justify-center py-2.5 sm:py-3 px-4 border border-transparent rounded-md shadow-sm text-sm sm:text-base font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-150 ease-in-out disabled:opacity-50 cursor-pointer"
      >
        {isLoading ? (
          <FiLoader className="animate-spin mr-2 h-5 w-5" />
        ) : (
          "Masuk"
        )}
      </button>
    </form>
  );
};

export default LoginForm;
