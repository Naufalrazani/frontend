import React from "react";

const sizeMap = {
  sm: "w-8 h-8",
  md: "w-10 h-10",
  lg: "w-24 h-24",
};

const Avatar = ({ src, alt, size = "md", className = "" }) => {
  const classes = sizeMap[size] || sizeMap.md;

  return (
    <img
      className={`rounded-full object-cover border border-gray-300 p-0.5 ${classes} ${className}`}
      src={src}
      alt={alt}
      loading="lazy"
      role="img"
    />
  );
};

export default Avatar;
