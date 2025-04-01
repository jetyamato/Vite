import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserDiv from '../user/UserDiv';
import Sidenav from '../../components/Sidenav';
import UserOtherInfo from '../user/UserOtherInfo';
import UserTable from '../user/UserTable';





// Content component
const Content = ({ content }: { content: string }) => (
  <div className="flex-1 p-2 mt-5">
    {/* Added mt-16 to push content below the fixed header */}
    <h2 className="text-2xl mb-4">{content}</h2>
    <p>Content goes here. This is a sample area where you can display dynamic content.</p>

    {/* Docked and resizable divs */}
    <div className="relative">
    <UserDiv component={<UserTable />} />
    <UserDiv component={<UserOtherInfo />} backgroundColor="bg-green-400"/>
    </div>
  </div>
);

// Main App component
const DashboardIndex = () => {
  const [expanded, setExpanded] = useState(false);
  const [content] = useState('Dashboard');
  const navigate = useNavigate();

  // Function to toggle the sidebar width
  const toggleSidebar = () => setExpanded(!expanded);

  // Function to handle logout, clearing the session
  const handleLogout = () => {
    sessionStorage.removeItem('user'); // Remove user session
    navigate('/'); // Redirect to home after logout
    window.location.reload();
  };

  return (
    <div className="flex h-screen max-w-screen">
      {/* Sidebar */}
      <Sidenav expanded={expanded} toggleSidebar={toggleSidebar} handleLogout={handleLogout} />
      {/* Main content */}  
      <div className={`flex flex-col flex-1 transition-all duration-300 ease-in-out ${expanded ? 'ml-64' : 'ml-16'}`}>
        {/* Main Content */}
        <Content content={content} />
   
      </div>
    </div>
  );
};

export default DashboardIndex;
