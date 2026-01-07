import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Sparkles, Coffee, Users, ArrowRight } from "lucide-react";

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
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full min-h-screen overflow-hidden font-sans">
      {images.map((img, index) => (
        <img
          key={index}
          src={img}
          alt={`Slide ${index}`}
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-[2000ms] ease-in-out ${
            index === currentImage
              ? "opacity-100 scale-110"
              : "opacity-0 scale-100"
          }`}
        />
      ))}

      <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-pink-900/40 z-10" />

      <div className="hidden sm:block absolute top-20 left-20 w-72 h-72 bg-pink-500/30 rounded-full blur-3xl animate-pulse" />
      <div className="hidden sm:block absolute bottom-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />

      <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white z-20 px-4 sm:px-6">
        
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-wide mb-4 sm:mb-6">
          <span className="block animate-fadeInUp">Welcome to</span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 drop-shadow-lg font-serif animate-glow">
            Asap Lounge
          </span>
        </h1>

        <p className="max-w-xl sm:max-w-2xl text-base sm:text-lg md:text-2xl text-gray-200 mb-8 sm:mb-10 leading-relaxed animate-fadeIn">
          <Sparkles className="inline-block w-5 h-5 sm:w-6 sm:h-6 text-pink-400 mr-2" />
          A place where <span className="text-pink-300">comfort</span>,{" "}
          <span className="text-purple-300">creativity</span> &{" "}
          <span className="text-indigo-300">connections</span> come alive.
        </p>

        <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 sm:gap-6 mb-10 sm:mb-12">
          {[
            { icon: Coffee, text: "Relax & Unwind", color: "text-yellow-300" },
            { icon: Users, text: "Meet New People", color: "text-green-300" },
            { icon: Sparkles, text: "Feel the Vibe", color: "text-pink-400" },
          ].map(({ icon: Icon, text, color }) => (
            <div
              key={text}
              className="backdrop-blur-xl bg-white/10 border border-white/20 px-4 py-3 sm:px-6 sm:py-4 rounded-2xl shadow-xl hover:scale-105 transition"
            >
              <Icon className={`w-7 h-7 sm:w-8 sm:h-8 ${color} mx-auto mb-2`} />
              <p className="font-semibold text-sm sm:text-base">{text}</p>
            </div>
          ))}
        </div>

        <Link
          to="/login"
          className="group relative inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-10 py-3 sm:py-4 rounded-full
          bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500
          text-white text-base sm:text-lg font-bold shadow-2xl
          hover:scale-110 transition-all duration-300"
        >
          Enter the Lounge
          <ArrowRight className="group-hover:translate-x-1 transition" />
          <span className="absolute inset-0 rounded-full blur-xl opacity-40 bg-pink-500 -z-10" />
        </Link>
      </div>
    </div>
  );
};

export default Landing;
