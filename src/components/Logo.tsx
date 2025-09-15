import Image from "next/image";
import React from "react";

interface LogoProps {
  size?: number; // width/height of logo
  className?: string;
  alt?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 64, className = "", alt = "SEU Students Logo" }) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Image
        src="/seu-students-logo-gold.png"
        alt={alt}
        width={size}
        height={size}
        className="object-contain drop-shadow-sm" 
        priority
      />
    </div>
  );
};

export default Logo;
