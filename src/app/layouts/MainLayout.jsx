import React from "react";
import Sidebar from "@shared/components/structure/Sidebar";

const MainLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-x-hidden">
        <main>{/* <Outlet /> */}</main>
      </div>
    </div>
  );
};

export default MainLayout;
