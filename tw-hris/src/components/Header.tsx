import { useState } from 'react';
import { FiAlignJustify } from "react-icons/fi";
import { useNavigate } from 'react-router-dom'; // Import the useNavigate hook

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [loginError, setLoginError] = useState(''); // Login error message
  const [isLoading, setIsLoading] = useState(false); // To manage loading state
  let items = ["Home", "About", "Services", "Contact", "Time In"];
  const navigate = useNavigate(); // Hook for navigation

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  // Handle login logic
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true); // Start loading

    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error('Invalid credentials');
      }

      const data = await response.json();
      console.log('Logged in successfully:', data);
      
      // Assuming the response contains user data and a token
      sessionStorage.setItem('user', JSON.stringify(data)); // Store user data in sessionStorage
      sessionStorage.setItem('authToken', data.token); // Store JWT token (if returned)

      setIsModalOpen(false); // Close the modal after login
      setUsername(''); // Clear the username field
      setPassword(''); // Clear the password field

      navigate('/dashboard'); // Navigate to the dashboard page
      window.location.reload(); // Optional: Reload to apply changes
    } catch (error) {
      setLoginError('Invalid username or password'); // Show error message
      console.error('Login error:', error);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  // Navigate to IndexLogin.tsx on Time In button click
  const handleTimeInClick = () => {
    navigate('/indexlogin'); // Make sure you have a route set up for /indexlogin
  };

  return (
    <>
      <div className="bg-blue-900 text-white p-4 shadow-md flex justify-between items-center w-full top-0 left-0 z-50">
        <h1 className="text-xl">HRIS</h1>

        {/* Navigation Links */}
        <nav className="hidden md:flex space-x-4 bg-blue-900">
          {items.length === 0 && <p>No item Found</p>}
          {items.map((item, index) => (
            <button
              className={selectedIndex === index ? 'text-white hover:text-gray-300 active' : 'text-white hover:text-gray-300'}
              key={item}
              onClick={() => {
                setSelectedIndex(index);
                if (item === "Time In") {
                  handleTimeInClick(); // Navigate to IndexLogin.tsx when "Time In" is clicked
                }
              }}
            >
              {item}
            </button>
          ))}
          <button onClick={() => setIsModalOpen(true)}>Login</button> {/* Open Login Modal */}
        </nav>

        {/* Mobile Menu */}
        <div className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'} bg-blue-900 w-full`}>
          <nav className="flex flex-col items-center space-y-4 py-4">
            {items.length === 0 && <p>No item Found</p>}
            {items.map((item, index) => (
              <button
                className={selectedIndex === index ? 'text-white hover:text-gray-300 active' : 'text-white hover:text-gray-300'}
                key={item}
                onClick={() => {
                  setSelectedIndex(index);
                  if (item === "Time In") {
                    handleTimeInClick(); // Navigate to IndexLogin.tsx when "Time In" is clicked
                  }
                }}
              >
                {item}
              </button>
            ))}
            <button onClick={() => setIsModalOpen(true)}>Login</button> {/* Open Login Modal */}
          </nav>
        </div>

        {/* Hamburger Icon for Mobile */}
        <FiAlignJustify
          className="md:hidden flex items-center justify-center w-10 h-10 cursor-pointer hover:bg-blue-700 rounded-md transition-all p-2"
          onClick={toggleMobileMenu}
        />
      </div>

      {/* Login Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-2xl mb-4">Login</h2>

            {loginError && <div className="text-red-500 mb-4">{loginError}</div>} {/* Display error */}

            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="text-white bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded-md mr-2"
                  disabled={isLoading} // Disable the button while loading
                >
                  {isLoading ? 'Logging in...' : 'Login'}
                </button>

                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded-md "
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
