import { ReactNode } from 'react';
import { FaHome, FaAdn } from 'react-icons/fa';
import { BiSolidMessageEdit, BiArrowFromLeft, BiArrowFromRight } from 'react-icons/bi';
import { IoPerson } from 'react-icons/io5';
import { RiLogoutBoxLine } from "react-icons/ri";

// SidebarIcon component for each icon in the sidebar
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
    {/* Icon in the first column */}
    <div className={`flex justify-center ${expanded ? 'block' : 'justify-center'}`}>
      {icon}
    </div>

    {/* Label in second column, hidden when collapsed */}
    <div className={`col-span-2 text-white ${expanded ? 'block' : 'hidden'}`}>
      {label}
    </div>
  </div>
);
const Sidenav = ({ expanded, toggleSidebar, handleLogout }: { expanded: boolean; toggleSidebar: () => void; handleLogout: () => void }) =>  {
  return (
    <div
    className={`fixed top-0 left-0 h-screen ${expanded ? 'w-64' : 'w-16'} m-0 flex flex-col bg-blue-900 text-white transition-all duration-300 ease-in-out`}
  >
    {/* Sidebar toggle button */}
    <div
      className="sidebar-toggle p-4 cursor-pointer hover:bg-blue-700 rounded-md transition-all"
      onClick={toggleSidebar}
    >
      {expanded ? <BiArrowFromRight size="18" /> : <BiArrowFromLeft size="18" />}
    </div>

    <div className="flex-1 mt-8">
      {/* Sidebar items */}
      <SidebarIcon
        icon={<FaHome className="text-white" size={18} />}
        label="Home"
        expanded={expanded}
        onClick={() => console.log('Home clicked!')}
      />
      <SidebarIcon
        icon={<BiSolidMessageEdit className="text-white" size={18} />}
        label="Messages"
        expanded={expanded}
        onClick={() => console.log('Messages clicked!')}
      />
      <SidebarIcon
        icon={<IoPerson className="text-white" size={18} />}
        label="Profile"
        expanded={expanded}
        onClick={() => console.log('Profile clicked!')}
      />
      <SidebarIcon
        icon={<FaAdn className="text-white" size={18} />}
        label="Adn"
        expanded={expanded}
        onClick={() => console.log('Adn clicked!')}
      />
      
      {/* Logout Icon */}
      <SidebarIcon
        icon={<RiLogoutBoxLine className="text-white" size={18} />}
        label="Logout"
        expanded={expanded}
        onClick={handleLogout} // Trigger logout when clicked
      />
    </div>
  </div>
  )
}

export default Sidenav