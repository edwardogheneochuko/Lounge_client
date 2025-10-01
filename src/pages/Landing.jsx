import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Sparkles, Coffee, Users } from "lucide-react"; // lucide icons

const images = [
  "/homepage1.jpg",
  "/homepage2.jpg",
  "/homepage3.jpg",
  "/homepage4.jpg",
];

const Landing = () => {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Background slideshow */}
      {images.map((img, index) => (
        <img
          key={index}
          src={img}
          alt={`Slide ${index}`}
          className={`absolute w-full h-full object-cover transition-opacity duration-1000 ease-in-out transform ${
            index === currentImage
              ? "opacity-100 scale-105"
              : "opacity-0 scale-100"
          }`}
        />
      ))}

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60 z-10"></div>

      {/* Centered content */}
      <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white z-20">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
          Asap Lounge
        </h1>
        <p className="max-w-xl text-lg md:text-xl text-gray-200 mb-6 px-4">
          <Sparkles className="inline-block w-6 h-6 text-pink-400 mr-2" />
          Where comfort meets connection.  
        </p>

        <div className="flex gap-6 mb-8">
          <div className="flex items-center gap-2">
            <Coffee className="w-6 h-6 text-yellow-300" />
            <span>Relax</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-6 h-6 text-green-300" />
            <span>Connect</span>
          </div>
        </div>

        <Link
          to="/login"
          className="bg-white text-black px-8 py-3 rounded-xl shadow-lg 
          hover:bg-gray-300 duration-300 text-lg font-semibold"
        >
          Enter Lounge
        </Link>
      </div>
    </div>
  );
};

export default Landing;
