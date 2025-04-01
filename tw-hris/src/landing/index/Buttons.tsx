import React ,  { useState } from 'react';
const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
const [username, setUsername] = useState('');
const [password, setPassword] = useState('');
const [selectedIndex, setSelectedIndex] = useState(-1);
const [loginError, setLoginError] = useState(''); // Login error message
const [isLoading, setIsLoading] = useState(false); // To manage loading state

export const Buttons = () => {
  return (
    <div className="text-center">
      {/* Login Button */}
      <button 
        className="bg-green-500 text-white py-3 px-6 rounded-lg text-lg mb-4 hover:bg-green-400 transition-colors duration-300" 
        id="loginBtn">
        Login
      </button>
      
      {/* Time In Button */}
      <button 
        className="bg-blue-500 text-white py-3 px-6 rounded-lg text-lg hover:bg-blue-400 transition-colors duration-300" 
        id="timeInBtn">
        Time In
      </button>
    </div>
  );
}
