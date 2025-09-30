import React from 'react';
import { UtensilsCrossed } from 'lucide-react';
 
const Header = () => {
  return (
    <div className="flex justify-center mt-5">
      <div
        className="
          bg-pink-600 
          p-6 
          rounded-full 
          text-gray-100 
          hover:scale-110 
          hover:shadow-lg 
          transition-all 
          duration-300
          cursor-pointer
        "
        aria-label="Food Icon"
      >
        <UtensilsCrossed size={50} /> 
      </div>
    </div>
  );
};

export default Header;