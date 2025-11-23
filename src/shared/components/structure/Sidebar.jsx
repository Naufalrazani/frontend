import React from "react";

// Icons
import { RiDashboard3Line } from "react-icons/ri";
import { TbSchool } from "react-icons/tb";
import { MdInsights } from "react-icons/md";
import { GrAchievement } from "react-icons/gr";
import { BsFire } from "react-icons/bs";

// Components UI
import Badge from "@shared/components/ui/Badge";
import Topic from "@shared/components/ui/Topic";
import Avatar from "@shared/components/ui/Avatar";

const MENU_ITEMS = [
  { icon: <RiDashboard3Line />, label: "Dashboard", active: true },
  { icon: <TbSchool />, label: "My Courses" },
  { icon: <MdInsights />, label: "Insights" },
  { icon: <GrAchievement />, label: "Achievements" },
];

const BADGES = ["Consistency Star", "Quiz Master"];
const TOPICS = ["iOS", "Android", "Web"];

const Sidebar = () => {
  return (
    <nav
      aria-label="Main navigation"
      className="
        hidden md:flex flex-col
        w-64 min-h-screen
        bg-primary-100 p-4 shadow-lg
        sticky top-0 overflow-y-auto
        scrollbar-thin scrollbar-thumb-primary-300 scrollbar-track-transparent
      "
    >
      {/* Logo */}
      <div className="grainy-border bg-white p-3 mb-2 text-center rounded-xl">
        Logo
      </div>

      {/* Profile */}
      <div className="grainy-border bg-white px-3 py-5 mb-8 rounded-xl">
        <div className="text-center mb-4">
          <Avatar />
          <p className="mt-2 text-xl font-bold">Muhammad Azizsyah Putra</p>
        </div>

        {/* Streak */}
        <div className="mb-4">
          <p className="flex items-center gap-1 font-medium text-primary-400">
            Streak <BsFire />
          </p>

          <div className="flex items-center gap-2 mt-1">
            <div className="grainy-border bg-white px-2 py-0.5 rounded-md">
              5 days
            </div>
            <small className="text-primary-500">Terakhir: 2025-11-02</small>
          </div>
        </div>

        {/* Learning Badges */}
        <div className="mb-4">
          <p className="font-medium text-primary-400 mb-1">Learning Badge</p>
          <div className="flex flex-wrap gap-1">
            {BADGES.map((badge) => (
              <Badge key={badge} name={badge} />
            ))}
          </div>
        </div>

        {/* Topics */}
        <div>
          <p className="font-medium text-primary-400 mb-1">
            Topics of Interest
          </p>

          <div className="flex flex-wrap gap-1">
            {TOPICS.map((topic) => (
              <Topic key={topic} name={topic} />
            ))}
          </div>

          <p className="text-center text-xs text-primary-500 mt-1">
            +2
            <a href="#" className="block underline">
              others
            </a>
          </p>
        </div>
      </div>

      {/* Navigation */}
      <div className="mb-10">
        {MENU_ITEMS.map(({ icon, label, active }) => (
          <div
            key={label}
            className={`px-4 py-0.5 mb-2 flex items-center gap-2 transition duration-300 ease-in-out
              ${
                active
                  ? "grainy-border bg-white"
                  : "border-2 border-primary-100 hover:grainy-border"
              }
            `}
          >
            {icon}
            <p>{label}</p>
          </div>
        ))}
      </div>

      {/* Help */}
      <div className="bg-primary-200 p-2 rounded-lg text-xs leading-relaxed">
        <p>
          If you found any discrepancies, please direct the questions to{" "}
          <a href="https://www.gmail.com" className="text-blue-500 underline">
            platform@devacademy.id
          </a>
        </p>
      </div>
    </nav>
  );
};

export default Sidebar;
