import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Sparkles, Coffee, Users, ArrowRight } from "lucide-react";

const images = [
  "https://res.cloudinary.com/direjlzc6/image/upload/v1775769492/oa2ljylcnwnqlxmrxucp.jpg",
  "https://res.cloudinary.com/direjlzc6/image/upload/v1775769490/whwebrygqittfx3tkuua.jpg",
  "https://res.cloudinary.com/direjlzc6/image/upload/v1775769489/jffw9w2fcgxm3qqt0vcl.jpg",
  "https://res.cloudinary.com/direjlzc6/image/upload/v1775769489/bx3h0ajxe0jhkb31bnwq.jpg"
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

      {/* Background Images */}
      {images.map((img, index) => (
        <img
          key={index}
          src={img}
          alt="Food"
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-[2500ms] ease-in-out ${
            index === currentImage
              ? "opacity-100 scale-110"
              : "opacity-0 scale-100"
          }`}
        />
      ))}

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/90 z-10" />

      {/* Background glow */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-orange-500/20 blur-3xl rounded-full" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-red-500/20 blur-3xl rounded-full" />

      {/* Content */}
      <div className="relative z-20 flex flex-col justify-center items-center text-center text-white px-6 min-h-screen">

        {/* Tag */}
        <p className="uppercase tracking-[6px] text-xs text-orange-300 mb-4">
          Premium Dining Experience
        </p>

        {/* Title */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold leading-tight mb-6">
          Welcome to{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">
            ASAP LOUNGE
          </span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl text-gray-300 text-lg mb-10">
          At Asap Lounge, every dish is crafted to perfection — blending flavor,
          ambience, and experience into something unforgettable.
        </p>

        {/* Feature cards */}
        <div className="flex flex-wrap justify-center gap-6 mb-12">
          {[
            { icon: Coffee, text: "Signature Dishes" },
            { icon: Users, text: "Elegant Atmosphere" },
            { icon: Sparkles, text: "Premium Experience" },
          ].map(({ icon: Icon, text }) => (
            <div
              key={text}
              className="bg-white/10 backdrop-blur-xl border border-white/10 px-6 py-4 rounded-2xl hover:scale-105 transition duration-300 shadow-lg"
            >
              <Icon className="mx-auto mb-2 text-orange-400" />
              <p className="text-sm">{text}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-5">
          <Link
            to="/login"
            className="group px-10 py-4 rounded-full border border-white/30 hover:bg-white hover:text-black transition flex items-center justify-center gap-2"
          >
            Reserve Table
            <ArrowRight className="group-hover:translate-x-1 transition" />
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Landing;