import React from "react";
import { Link } from "react-router-dom";
import LoginForm from "../components/LoginForm";

const LoginPage = () => {
  return (
    <div className="flex items-center justify-center py-2 sm:py-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-4xl font-extrabold text-primary-900">
            Masuk ke Akun Anda
          </h1>
          <p className="mt-2 text-sm sm:text-md text-primary-600">
            Silakan masuk menggunakan email dan kata sandi yang telah terdaftar
            untuk mengakses akun Anda.
          </p>
        </div>

        <LoginForm />

        <div className="mt-8 text-center">
          <p className="text-sm text-primary-600">
            Belum punya akun?{" "}
            <Link
              to="/auth/register"
              className="font-medium text-red-500 hover:text-red-600 transition"
            >
              Daftar Sekarang
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
