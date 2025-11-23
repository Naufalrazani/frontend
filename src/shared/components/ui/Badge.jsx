import React from "react";
import { LuStar } from "react-icons/lu";
import { GiOnTarget } from "react-icons/gi";
import { RiErrorWarningFill } from "react-icons/ri";

const ICON_MAP = {
  "Consistency Star": <LuStar className="text-yellow-500" />,
  "Quiz Master": <GiOnTarget className="text-red-500" />,
};

const Badge = ({ name }) => {
  return (
    <div className="w-full px-2 py-0.5 grainy-border flex items-center gap-1 ">
      <p>{name}</p>
      {ICON_MAP[name] || <RiErrorWarningFill />}
    </div>
  );
};

export default Badge;
