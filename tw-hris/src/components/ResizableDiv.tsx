import React, { useState, useEffect, useRef } from 'react';
import Tables from './Tables';

interface ResizableDivProps {
  backgroundColor?: string;
  header?: string;
  content?: string;
  width?: number | string;
  height?: number;
}

const ResizableDiv: React.FC<ResizableDivProps> = ({
  backgroundColor = 'bg-blue-500',
  header = 'Resizable Div',
  content = 'Movable and Resizable Div',
  width = '100%',
  height = 200,
}) => {
  const [size, setSize] = useState<{ width: number | string; height: number }>({ width, height });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isResizing, setIsResizing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [lastX, setLastX] = useState(0);
  const [lastY, setLastY] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const startResizing = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsResizing(true);
    setLastX(e.clientX);
    setLastY(e.clientY);
  };

  const stopResizing = () => {
    setIsResizing(false);
  };

  const onResize = (e: MouseEvent) => {
    if (isResizing) {
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;

      setSize((prevSize) => {
        let newWidth: number = typeof prevSize.width === 'number' ? prevSize.width : 0;

        if (typeof prevSize.width === 'number') {
          newWidth = prevSize.width + dx;
        } else if (typeof prevSize.width === 'string' && prevSize.width.includes('%')) {
          const containerWidth = containerRef.current?.clientWidth || 0;
          const percentageWidth = parseFloat(prevSize.width);
          newWidth = (percentageWidth / 100) * containerWidth + dx;
        }

        return {
          width: Math.max(newWidth, 150),
          height: Math.max(prevSize.height + dy, 150),
        };
      });

      setLastX(e.clientX);
      setLastY(e.clientY);
    }
  };

  const startDragging = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    setLastX(e.clientX);
    setLastY(e.clientY);
  };

  const stopDragging = () => {
    setIsDragging(false);
  };

  const onDrag = (e: MouseEvent) => {
    if (isDragging) {
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      setPosition((prevPos) => ({
        x: prevPos.x + dx,
        y: prevPos.y + dy,
      }));
      setLastX(e.clientX);
      setLastY(e.clientY);
    }
  };



  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', onResize);
      document.addEventListener('mouseup', stopResizing);
      document.addEventListener('mouseleave', stopResizing);
    } else {
      document.removeEventListener('mousemove', onResize);
      document.removeEventListener('mouseup', stopResizing);
      document.removeEventListener('mouseleave', stopResizing);
    }

    if (isDragging) {
      document.addEventListener('mousemove', onDrag);
      document.addEventListener('mouseup', stopDragging);
      document.addEventListener('mouseleave', stopDragging);
    } else {
      document.removeEventListener('mousemove', onDrag);
      document.removeEventListener('mouseup', stopDragging);
      document.removeEventListener('mouseleave', stopDragging);
    }

    return () => {
      document.removeEventListener('mousemove', onResize);
      document.removeEventListener('mouseup', stopResizing);
      document.removeEventListener('mouseleave', stopResizing);
      document.removeEventListener('mousemove', onDrag);
      document.removeEventListener('mouseup', stopDragging);
      document.removeEventListener('mouseleave', stopDragging);
    };
  }, [isResizing, isDragging, lastX, lastY]);

  return (
    <div
      ref={containerRef}
      className={`${backgroundColor} border border-gray-500 p-4 relative mt-2`}
      style={{
        width: typeof size.width === 'number' ? `${size.width}px` : size.width,
        height: 'auto',
        top: position.y,
        left: position.x,
      }}
    >
      <div onMouseDown={startDragging} className="cursor-move">
        <p className="text-white text-3xl">{header}</p>
      </div>

     

      <p className="text-white">{content}</p>
      <Tables />

      {/* Resize handle fixed at the bottom-right corner */}
      <div
        onMouseDown={startResizing}
        className="absolute right-0 bottom-0 w-4 h-4 cursor-se-resize bg-gray-800"
      />


    </div>
  );
};

export default ResizableDiv;
