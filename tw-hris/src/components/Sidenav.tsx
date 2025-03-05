import { useState } from 'react';
import { FaHome } from 'react-icons/fa';
import { TfiAlignJustify } from 'react-icons/tfi';
import { BiSolidMessageEdit } from 'react-icons/bi';
import { IoPerson } from 'react-icons/io5';
import { ReactNode } from 'react';

interface SidebarIconProps {
  icon: ReactNode;
  label: string;
  onClick?: () => void;
  expanded: boolean;
}

const SidebarIcon = ({ icon, label, onClick, expanded }: SidebarIconProps) => (
  <div
    className="sidebar-icon grid grid-cols-3 items-center p-3 cursor-pointer hover:bg-blue-700 rounded-md transition-all"
    onClick={onClick}
  >
    {/* Icon in first column */}
    <div className={`flex justify-center ${expanded ? 'block' : 'justify-center'}`}>
      {icon}
    </div>

    {/* Label in second column, hidden when collapsed */}
    <div className={`col-span-2 text-white ${expanded ? 'block' : 'hidden'}`}>
      {label}
    </div>
  </div>
);

const Sidenav = () => {
  const [expanded, setExpanded] = useState(false);

  // Function to toggle the sidebar width
  const toggleSidebar = () => {
    setExpanded(!expanded);
  };

  // Example click handler for sidebar items
  const handleClick = (label: string) => {
    console.log(`${label} clicked!`);
  };

  return (
    <div
      className={`fixed top-0 left-0 h-screen ${
        expanded ? 'w-64' : 'w-16'
      } m-0 flex flex-col bg-blue-900 text-white shadow-lg transition-all duration-300 ease-in-out`}
    >
      {/* Sidebar toggle button */}
      <div
        className="sidebar-toggle p-4 cursor-pointer hover:bg-blue-700 rounded-md transition-all"
        onClick={toggleSidebar}
      >
        <TfiAlignJustify size="18" />
      </div>

      <div className="flex-1 mt-8">
        {/* Sidebar items */}
        <SidebarIcon
          icon={<FaHome className="text-white" size={18} />}
          label="Home"
          expanded={expanded}
          onClick={() => handleClick('Home')}
        />
        <SidebarIcon
          icon={<BiSolidMessageEdit className="text-white" size={18} />}
          label="Messages"
          expanded={expanded}
          onClick={() => handleClick('Messages')}
        />
        <SidebarIcon
          icon={<IoPerson className="text-white" size={18} />}
          label="Profile"
          expanded={expanded}
          onClick={() => handleClick('Profile')}
        />
      </div>
    </div>
  );
};

export default Sidenav;
