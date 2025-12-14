import React, { useState, useEffect } from "react";
import { FiUser, FiSettings, FiLogOut } from "react-icons/fi";

const TRANSITION_DURATION = 300;

const menuItems = [
  {
    name: "Logout",
    icon: FiLogOut,
    path: "#",
    type: "button",
    className: "text-red-600 hover:text-red-700",
  },
];

const DropdownMenu = ({ id, onClose, isMenuOpen, onLogout }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const isTransitioningIn = isMounted && isMenuOpen;

  const transitionClasses = `
  transition ease-in-out duration-${TRANSITION_DURATION} transform origin-top-right
  ${isTransitioningIn ? "opacity-100 scale-100" : "opacity-0 scale-95"}
 `;

  const handleItemClick = (item) => {
    onClose();
    if (item.type === "button" && item.name === "Logout" && onLogout) {
      onLogout();
    }
  };

  return (
    <div
      id={id}
      className={`absolute right-0 mt-2 w-32 grainy-border bg-white rounded-lg z-20 shadow-lg ${transitionClasses}`}
      role="menu"
      aria-orientation="vertical"
      aria-labelledby="user-menu-button"
    >
      <div className="font-semibold" role="none">
        {menuItems.map((item) => {
          const Icon = item.icon;

          const ItemElement = item.type === "link" ? "a" : "button";

          return (
            <ItemElement
              key={item.name}
              {...(item.type === "link" ? { href: item.path } : {})}
              {...(item.type === "button" ? { type: "button" } : {})}
              onClick={() => handleItemClick(item)}
              className={`
                  flex items-center gap-3 px-4 py-3 text-sm hover:bg-primary-200 cursor-pointer 
                  w-full text-left focus:outline-none 
         ${item.className || ""}
       `}
              role="menuitem"
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              {item.name}
            </ItemElement>
          );
        })}
      </div>
    </div>
  );
};

export default DropdownMenu;
