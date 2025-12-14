import React from "react";
import logoMading from "@assets/img/logo-name.png";
import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-primary-100 p-6">
      <main className="flex flex-col items-center max-w-lg bg-white shadow-lg p-4 rounded-lg">
        <header className="items-start mt-5">
          <img className="w-15 sm:w-20" src={logoMading} alt="" />
        </header>
        <Outlet />
      </main>

      <footer className="mt-6 text-sm text-primary-500">
        &copy; {new Date().getFullYear()} Mading | A25-C203 Project Capstone
      </footer>
    </div>
  );
};

export default AuthLayout;
