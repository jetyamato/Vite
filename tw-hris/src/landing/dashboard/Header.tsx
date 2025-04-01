import React, { useState, useEffect } from 'react';

interface UserProfile {
  name: string;
  email: string;
  profileImage: string;
  userType: string;
}

const Header = ({ handleLogout, isModalOpen }: { handleLogout: () => void; isModalOpen: boolean }) => {
  const [user, setUser] = useState<UserProfile | null>(null);

  // Simulate fetching user session data (this would typically come from an API or context)
  useEffect(() => {
    // Simulating a session fetch
    const userSession = {
      name: 'John Kenneth Pepito',
      email: 'nhoj.kenneth@yahoo.com',
      profileImage: 'src/images/user/owner.jpg',
      userType: 'Admin',
    };

    setUser(userSession);
  }, []);

  const [menuToggle, setMenuToggle] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className={`top-0 z-99999 flex w-full border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 lg:border-b ${isModalOpen ? 'hidden' : ''}`}>
      <div className="flex grow flex-col items-center justify-between lg:flex-row lg:px-6">
        <div className={`w-full items-center justify-between gap-4 px-5 py-4 shadow-theme-md lg:flex lg:justify-end lg:px-0 lg:shadow-none ${menuToggle ? 'flex' : 'hidden'}`}>
          {/* User Area */}
          <div className="relative">
            {user ? (
              <a
                className="flex items-center text-gray-700 dark:text-gray-400"
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setDropdownOpen(!dropdownOpen);
                }}
              >
                <span className="mr-3 h-11 w-11 overflow-hidden rounded-full">
                  <img src={user.profileImage} alt="User" />
                </span>
                <span className="mr-1 block text-theme-sm font-medium">{user.name}</span>
                <svg
                  className={`stroke-gray-500 dark:stroke-gray-400 ${dropdownOpen ? 'rotate-180' : ''}`}
                  width="18"
                  height="20"
                  viewBox="0 0 18 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M4.3125 8.65625L9 13.3437L13.6875 8.65625" stroke="" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                </svg>
              </a>
            ) : (
              <div>Loading...</div> // Placeholder text if user data is still loading
            )}

            {/* Dropdown Start */}
            {dropdownOpen && user && (
              <div className="absolute right-0 mt-[17px] flex w-[260px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark">
                <div>
                  <span className="block text-theme-sm font-medium text-gray-700 dark:text-gray-400">{user.name}</span>
                  <span className="mt-0.5 block text-theme-xs text-gray-500 dark:text-gray-400">{user.email}</span>
                  <span className="mt-0.5 block text-theme-xs text-gray-500 dark:text-gray-400">UserType:<b>{user.userType}</b></span>
                </div>

                <ul className="flex flex-col gap-1 border-b border-gray-200 pb-3 pt-4 dark:border-gray-800">
                  <li>
                    <a
                      href="profile.html"
                      className="group flex items-center gap-3 rounded-lg px-3 py-2 text-theme-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                    >
                      Edit profile
                    </a>
                  </li>
                  <li>
                    <a
                      href="chat.html"
                      className="group flex items-center gap-3 rounded-lg px-3 py-2 text-theme-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                    >
                      Account settings
                    </a>
                  </li>
                  <li>
                    <a
                      href="profile.html"
                      className="group flex items-center gap-3 rounded-lg px-3 py-2 text-theme-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                    >
                      Support
                    </a>
                  </li>
                </ul>
                <button
                  className="group mt-3 flex items-center gap-3 rounded-lg px-3 py-2 text-theme-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                  onClick={handleLogout}
                >
                  Sign out
                </button>
              </div>
            )}
            {/* Dropdown End */}
          </div>
          {/* User Area */}
        </div>
      </div>
    </header>
  );
};

export default Header;
