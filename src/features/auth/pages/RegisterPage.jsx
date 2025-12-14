import React from "react";
import { Link } from "react-router-dom";
import RegisterForm from "../components/RegisterForm";

const RegisterPage = () => {
  return (
    <div className="flex items-center justify-center py-2 sm:py-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-4xl font-extrabold text-primary-900">
            Buat Akun Baru
          </h1>
          <p className="mt-2 text-sm md:text-md text-primary-600">
            Silakan buat akun baru dengan mengisi data yang diperlukan untuk
            mulai menggunakan layanan kami.
          </p>
        </div>

        <RegisterForm />

        <div className="mt-8 text-center">
          <p className="text-sm text-primary-600">
            Sudah punya akun?{" "}
            <Link
              to="/auth/login"
              className="font-medium text-red-500 hover:text-red-600 transition"
            >
              Masuk
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
