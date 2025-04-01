import { useState } from 'react';
import Header from '../../components/Header';


// Content component
const Content = ({ content }: { content: string }) => (
  <div className="flex-1 p-2 mt-5">
    {/* Added mt-16 to push content below the fixed header */}
    <h2 className="text-2xl mb-4">{content}</h2>
    <p>Content goes here. This is a sample area where you can display dynamic content.</p>

    {/* Docked and resizable divs */}
    <div className="relative">
    
    {/* add divs here */}
    </div>
  </div>
);

// Main App component
const Index = () => {
 const [content] = useState('Home');

  return (
    <div className="flex h-screen max-w-screen">
      {/* Sidebar */}
      {/* Main content */}
      <div className={`flex flex-col flex-1 transition-all duration-300 ease-in-out`}>
        {/* Header */}
      <Header />
        {/* Main Content */}
        <Content content={content} />
      </div>
    </div>
  );
};

export default Index;
