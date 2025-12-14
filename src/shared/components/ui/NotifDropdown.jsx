import React, { useState, useEffect } from "react";

const TRANSITION_DURATION = 300;

const NotifDropdown = ({ id, isMenuOpen, children }) => {
  const [isReadyForTransition, setIsReadyForTransition] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReadyForTransition(true);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const isTransitioningIn = isReadyForTransition && isMenuOpen;

  const opacityClass = isTransitioningIn ? "opacity-100" : "opacity-0";
  const transformClass = isTransitioningIn
    ? "translate-y-0 scale-100"
    : "translate-y-1 scale-95";

  const transitionClasses = `
    transition ease-in-out duration-${TRANSITION_DURATION} transform origin-top-right
    ${opacityClass} ${transformClass}
  `;

  const baseClass =
    "absolute right-0 mt-2 md:w-100 w-72 grainy-border bg-white rounded-lg z-20";

  return (
    <div
      id={id}
      className={`${baseClass} ${transitionClasses}`}
      role="menu"
      aria-orientation="vertical"
      aria-labelledby="notification-button"
    >
      {children}
    </div>
  );
};
export default NotifDropdown;
