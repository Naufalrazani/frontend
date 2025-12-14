import React, { useState, useRef, useEffect } from "react";
import { FiChevronDown, FiBell } from "react-icons/fi";
import Avatar from "@shared/components/ui/Avatar";
import DropdownMenu from "../ui/DropdownMenu";
import NotifDropdown from "../ui/NotifDropdown";
import { IoBook } from "react-icons/io5";
import { MdAssignment } from "react-icons/md";
import { useAuth } from "@features/auth/hooks/useAuth";
import defaultAvatar from "@assets/img/default-avatar.png";

const TRANSITION_DURATION = 300;

const Header = () => {
  const { user, loading, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMenuRendered, setIsMenuRendered] = useState(false);
  const menuRef = useRef(null);

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isNotifRendered, setIsNotifRendered] = useState(false);
  const notifRef = useRef(null);
  const avatar = user?.avatar_url || defaultAvatar;

  const toggleMenu = () => {
    if (isNotifOpen) setIsNotifOpen(false);

    const nextIsMenuOpen = !isMenuOpen;
    setIsMenuOpen(nextIsMenuOpen);
    if (nextIsMenuOpen) {
      setIsMenuRendered(true);
    }
  };
  const closeMenu = () => setIsMenuOpen(false);

  const toggleNotif = () => {
    if (isMenuOpen) setIsMenuOpen(false);

    const nextIsNotifOpen = !isNotifOpen;
    setIsNotifOpen(nextIsNotifOpen);
    if (nextIsNotifOpen) {
      setIsNotifRendered(true);
    }
  };
  const closeNotif = () => setIsNotifOpen(false);

  useEffect(() => {
    let timer;
    if (!isMenuOpen && isMenuRendered) {
      timer = setTimeout(() => {
        setIsMenuRendered(false);
      }, TRANSITION_DURATION);
    }
    return () => clearTimeout(timer);
  }, [isMenuOpen, isMenuRendered]);

  useEffect(() => {
    let timer;
    if (!isNotifOpen && isNotifRendered) {
      timer = setTimeout(() => {
        setIsNotifRendered(false);
      }, TRANSITION_DURATION);
    }
    return () => clearTimeout(timer);
  }, [isNotifOpen, isNotifRendered]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        closeMenu();
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        closeNotif();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const userName = user?.name || "Pengguna";
  const displaySummary = "Ringkasan pembelajaran Anda minggu ini";

  if (loading) {
    return (
      <header className="w-full flex justify-between items-center p-6 border-b border-primary-200 z-10">
        <div className="animate-pulse">
          <div className="h-6 bg-primary-200 rounded w-48 mb-1"></div>
          <div className="h-4 bg-primary-200 rounded w-64"></div>
        </div>
        <div className="h-10 w-24 bg-primary-200 rounded-lg animate-pulse"></div>
      </header>
    );
  }

  return (
    <header className="w-full flex justify-between items-center p-3 md:p-6 border-b border-primary-200 z-10">
      <div>
        <h1 className="text-lg md:text-xl font-bold">Halo, {userName}</h1>
        <p className="text-xs md:text-sm">{displaySummary}</p>
      </div>

      <div className="flex items-center gap-1 md:gap-4">
        <div className="relative" ref={menuRef}>
          <button
            id="user-menu-button"
            onClick={toggleMenu}
            className="flex items-center gap-0.5 hover:opacity-80 transition cursor-pointer"
            aria-expanded={isMenuOpen}
            aria-controls="user-menu"
          >
            <Avatar src={avatar} alt={userName} size="sm" />
            <FiChevronDown
              className={`w-4 h-4 transition-transform duration-300 text-primary-600 ${
                isMenuOpen ? "rotate-180" : "rotate-0"
              }`}
              aria-hidden="true"
            />
          </button>

          {isMenuRendered && (
            <DropdownMenu
              id="user-menu"
              onClose={closeMenu}
              isMenuOpen={isMenuOpen}
              onLogout={logout}
            />
          )}
        </div>

        <div className="relative" ref={notifRef}>
          <button
            onClick={toggleNotif}
            className="p-2 text-primary-600 hover:opacity-80 transition relative cursor-pointer"
            aria-label="Notifications"
            aria-expanded={isNotifOpen}
            aria-controls="notification-menu"
          >
            <FiBell className="w-6 h-6" />
            <span
              className={`absolute top-1 right-1.5 px-1 rounded-full bg-red-500 text-xs font-bold text-white leading-tight ${
                isNotifOpen ? "hidden" : ""
              }`}
              aria-hidden="true"
            >
              2
            </span>
          </button>

          {isNotifRendered && (
            <NotifDropdown
              id="notification-menu"
              onClose={closeNotif}
              isMenuOpen={isNotifOpen}
            >
              <div className="p-4 border-b">
                <h3 className="font-semibold">Notifikasi Terbaru (2)</h3>
              </div>
              <ul>
                <li className="px-4 py-3 flex items-center gap-3 hover:bg-primary-200 cursor-pointer text-sm">
                  <MdAssignment />
                  Submission OpenMusic V3 telah dinilai.
                </li>
                <li className="px-4 py-3 flex items-center gap-3 hover:bg-primary-200 text-sm cursor-pointer">
                  <IoBook />
                  Kelas Belajar Dasar JavaScript telah selesai.
                </li>
              </ul>
            </NotifDropdown>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
