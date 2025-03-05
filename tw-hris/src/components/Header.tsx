import { useState } from 'react';
import { FiAlignJustify } from "react-icons/fi";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  return (
<>
<div className="bg-blue-900 text-white p-4 shadow-md flex justify-between items-center w-full top-0 left-0 z-50">
    <h1 className="text-xl ">HRIS</h1>

      {/* Navigation Links */}
      <nav className="hidden md:flex space-x-4 bg-blue-900">
        <a href="#" className="text-white hover:text-gray-300">Home</a>
        <a href="#" className="text-white hover:text-gray-300">About</a>
        <a href="#" className="text-white hover:text-gray-300">Services</a>
        <a href="#" className="text-white hover:text-gray-300">Contact</a>
      </nav>



      {/* Mobile Menu */}
      <div className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'} bg-blue-900 w-full`}>
        <nav className="flex flex-col items-center space-y-4 py-4">
          <a href="#" className="text-white hover:text-gray-300">Home</a>
          <a href="#" className="text-white hover:text-gray-300">About</a>
          <a href="#" className="text-white hover:text-gray-300">Services</a>
          <a href="#" className="text-white hover:text-gray-300">Contact</a>
        </nav>
      </div>
            {/* Hamburger Icon for Mobile */}


            <FiAlignJustify
              className="md:hidden flex items-center justify-center w-10 h-10 cursor-pointer hover:bg-blue-700 rounded-md transition-all p-2"
              onClick={toggleMobileMenu}
            />
      </div>
</>
  )
}

export default Header