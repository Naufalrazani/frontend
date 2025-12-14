import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { RiDashboard3Line } from "react-icons/ri";
import { TbSchool } from "react-icons/tb";
import { MdInsights } from "react-icons/md";
import { BsFire } from "react-icons/bs";
import { IoClose } from "react-icons/io5";
import { FiLogOut } from "react-icons/fi";
import { HiMenu } from "react-icons/hi";
import logoMading from "@assets/img/logo-name.png";
import defaultAvatar from "@assets/img/default-avatar.png";
import Avatar from "@shared/components/ui/Avatar";
import { useAuth } from "@features/auth/context/AuthContext";
import { useDashboard } from "@features/dashboard/context/DashboardContext";

const MENU_ITEMS = [
  { icon: <RiDashboard3Line />, label: "Dashboard", path: "/dashboard" },
  { icon: <TbSchool />, label: "My Courses", path: "/mycourses" },
  { icon: <MdInsights />, label: "Insights", path: "/insights" },
];

const Sidebar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const { data, loading } = useDashboard();

  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const statistics = data?.statistics ?? {};
  const weeklyTrend = data?.weekly_trend ?? [];

  const userName = user?.name ?? "Pengguna";
  const avatar = user?.avatar_url ?? defaultAvatar;

  const streak = statistics?.consistency_of_access?.days_active ?? "0 hari";

  const lastActive = weeklyTrend.length > 0 ? weeklyTrend.at(-1).date : "N/A";

  const renderContent = (isMobile = false) => {
    const expanded = isMobile || isExpanded;

    return (
      <>
        <div className="flex items-center justify-between mb-4">
          <img
            src={logoMading}
            alt="Logo"
            className={`transition-all duration-300 ${
              expanded ? "w-24 md:w-28 opacity-100" : "w-0 opacity-0"
            }`}
          />

          {!isMobile && (
            <button
              onClick={() => setIsExpanded((prev) => !prev)}
              className="p-3 rounded-full bg-white grainy-border"
            >
              {isExpanded ? <IoClose /> : <HiMenu />}
            </button>
          )}

          {isMobile && (
            <button
              onClick={() => setIsMobileOpen(false)}
              className="p-3 rounded-full bg-white grainy-border"
            >
              <IoClose />
            </button>
          )}
        </div>

        <div
          className={`grainy-border bg-white rounded-xl mb-5 p-3 md:p-4
          transition-all duration-300
          ${expanded ? "opacity-100" : "opacity-0 h-0 overflow-hidden"}`}
        >
          {loading ? (
            <p className="text-center text-xs md:text-sm text-primary-400">
              Loading profile...
            </p>
          ) : (
            <>
              <div className="flex flex-col items-center py-6">
                <Avatar src={avatar} alt={userName} size="lg" />
                <p className="mt-2 text-sm md:text-base font-semibold text-center">
                  {userName}
                </p>
              </div>

              <div className="text-xs md:text-sm">
                <p className="flex items-center gap-1 font-medium text-primary-600 mb-1">
                  Streak <BsFire className="text-yellow-500" />
                </p>
                <p className="text-primary-500 leading-relaxed mb-4">
                  <span className="grainy-border font-semibold py-1 px-2 inline-block mr-1">
                    {streak}
                  </span>
                  <br />
                  <small>Terakhir aktif: {lastActive}</small>
                </p>
              </div>
            </>
          )}
        </div>

        <ul className="flex-1">
          {MENU_ITEMS.map((item) => {
            const active = location.pathname === item.path;

            return (
              <li key={item.label}>
                <Link
                  to={item.path}
                  onClick={() => setIsMobileOpen(false)}
                  className={`flex items-center gap-3
                  p-3
                  rounded-xl mb-1.5
                  transition-all duration-300
                  ${
                    active
                      ? "grainy-border bg-white font-semibold"
                      : "hover:bg-white text-primary-600"
                  }`}
                >
                  <span className="text-lg md:text-xl shrink-0">
                    {item.icon}
                  </span>
                  {expanded && (
                    <span className="text-xs md:text-sm lg:text-base">
                      {item.label}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        <button
          onClick={logout}
          className="flex items-center gap-3
          text-red-500 font-semibold
          px-3 py-2.5 md:px-4 md:py-3
          rounded-xl hover:bg-red-50
          transition-all duration-300"
        >
          <FiLogOut className="text-lg md:text-xl shrink-0" />
          {expanded && (
            <span className="text-xs md:text-sm lg:text-base">Logout</span>
          )}
        </button>
      </>
    );
  };

  return (
    <>
      <button
        onClick={() => setIsMobileOpen(true)}
        className="md:hidden fixed bottom-4 left-4 z-50
        p-3 bg-white grainy-border shadow"
      >
        <HiMenu />
      </button>

      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-screen w-72 z-50
        bg-primary-100 p-4 shadow-lg
        transform transition-transform duration-300
        md:hidden
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {renderContent(true)}
      </aside>

      <aside
        className={`hidden md:flex flex-col h-screen sticky top-0
        bg-primary-100 p-4 shadow-lg
        transition-all duration-500
        ${isExpanded ? "w-72" : "w-20"}`}
      >
        {renderContent(false)}
      </aside>
    </>
  );
};

export default Sidebar;
