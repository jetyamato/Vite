import React from 'react';

interface Banner {
  image: string;
  title: string;
  body: string;
}

interface CarouselProps {
  banner: Banner[];
}

const Carousel: React.FC<CarouselProps> = ({ banner }) => {
  return (
    <div id="demo" className="relative">
      {/* Indicators/dots */}
      <div className="absolute bottom-4 left-0 right-0 z-10 flex justify-center">
        {banner.map((_, index) => (
          <button
            key={index}
            type="button"
            data-bs-target="#demo"
            data-bs-slide-to={index}
            className={`w-3 h-3 mx-1 rounded-full ${
              index === 0 ? 'bg-blue-500' : 'bg-gray-500'
            }`}
          />
        ))}
      </div>

      {/* The slideshow/carousel */}
      {banner.length > 0 ? (
        <div className="relative">
          <div className="carousel-inner relative overflow-hidden">
            {banner.map((row, index) => (
              <div
                key={index}
                className={`carousel-item ${index === 0 ? 'active' : ''}`}
              >
                <img
                  src={`uploads/${row.image}`}
                  alt={row.title}
                  className="d-block w-full"
                />
                <p className="text-center">{row.body}</p>
              </div>
            ))}
          </div>

          {/* Left and right controls/icons */}
          <button
            className="absolute top-1/2 left-0 transform -translate-y-1/2 text-white bg-black bg-opacity-50 p-2 rounded-full"
            type="button"
            data-bs-target="#demo"
            data-bs-slide="prev"
          >
            <span className="carousel-control-prev-icon" />
          </button>
          <button
            className="absolute top-1/2 right-0 transform -translate-y-1/2 text-white bg-black bg-opacity-50 p-2 rounded-full"
            type="button"
            data-bs-target="#demo"
            data-bs-slide="next"
          >
            <span className="carousel-control-next-icon" />
          </button>
        </div>
      ) : (
        <p>No banners available.</p>
      )}
    </div>
  );
};

export default Carousel;
