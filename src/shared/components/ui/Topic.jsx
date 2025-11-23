import React from "react";
import { IoLogoAndroid } from "react-icons/io";
import { TfiWorld } from "react-icons/tfi";
import { TbBrandApple } from "react-icons/tb";
import { RiErrorWarningFill } from "react-icons/ri";

const ICON_MAP = {
  iOS: <TbBrandApple />,
  Android: <IoLogoAndroid />,
  Web: <TfiWorld />,
};

const Topic = ({ name }) => {
  return (
    <div className="px-2 py-0.5 grainy-border flex items-center gap-1">
      {ICON_MAP[name] || <RiErrorWarningFill />}
      <p>{name}</p>
    </div>
  );
};

export default Topic;
