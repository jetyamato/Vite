import { useState } from 'react';
import { FaHome, FaAdn } from 'react-icons/fa';
import { BiSolidMessageEdit, BiArrowFromLeft, BiArrowFromRight } from 'react-icons/bi';
import { IoPerson } from 'react-icons/io5';
import { ReactNode } from 'react';
import Header from './components/Header';
import ResizableDiv from './components/ResizableDiv';


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

// Sidebar (Sidenav) component
const Sidenav = ({ expanded, toggleSidebar }: { expanded: boolean; toggleSidebar: () => void }) => (
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
    </div>
  </div>
);

// Content component
const Content = ({ content }: { content: string }) => (
  <div className="flex-1 p-2 mt-5">
    {/* Added mt-16 to push content below the fixed header */}
    <h2 className="text-2xl mb-4">{content}</h2>
    <p>Content goes here. This is a sample area where you can display dynamic content.</p>

    {/* Docked and resizable divs */}
    <div className="relative">
    <ResizableDiv header="1" content='SAMPLE 1' backgroundColor='bg-red-500'  width={609}/>
    <ResizableDiv  header="2" content='SAMPLE 2' backgroundColor='bg-green-500'/>
    <ResizableDiv  header="3" content='SAMPLE 3' backgroundColor='bg-blue-500'/>
    <ResizableDiv 
      header="Resizable Box"
      content="This is a sample resizable box!"
      backgroundColor="bg-red-500"
      width={400}
      height={300}
/>
    </div>
  </div>
);

// Main App component
const App = () => {
const [expanded, setExpanded] = useState(false);
 const [content] = useState('Home');

  // Function to toggle the sidebar width
  const toggleSidebar = () => setExpanded(!expanded);

  return (
    <div className="flex h-screen max-w-screen">
      {/* Sidebar */}
      <Sidenav expanded={expanded} toggleSidebar={toggleSidebar} />
      {/* Main content */}
      <div className={`flex flex-col flex-1 transition-all duration-300 ease-in-out ${expanded ? 'ml-64' : 'ml-16'}`}>
        {/* Header */}
        <Header />

        {/* Main Content */}
        <Content content={content} />
      </div>
    </div>
  );
};

export default App;
