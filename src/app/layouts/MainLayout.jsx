import React from "react";
import Sidebar from "@shared/components/layout/Sidebar";
import Header from "@shared/components/layout/Header";
import Footer from "@shared/components/layout/Footer";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex flex-col flex-1 overflow-x-hidden">
        <Header />
        <main className="flex-1 p-3 md:p-6">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default MainLayout;
