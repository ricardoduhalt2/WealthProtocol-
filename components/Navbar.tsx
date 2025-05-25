import React from 'react';

interface NavbarProps {
  currentPath: string;
}

// Full Base64 encoded Wealth Protocol logo (ensure this is the complete string)
const logoDataUrl = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAgAAAAIACAYAAAD0eNT6AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAEc9SURBVHhe7d0FnBRFed7x76q7q6sHggVBRJ2i5wUVEfUARQTREVFUEBEFEVERQWFF9xQGkUFEXXfAYRQURHUXjO4uG4qgu6O7u4r+d0fP9O7pnu655/X2Pc/nGWd6ZnpmOqpndlWnqrIBAKxV97x9DwAAq0YQACCAYAIBAAYIJhAAwADTCAIAINAoAgEATSaBQAAAJhEIAGAigQCABAIBAM0kEADATBIBAMwkAQDATBIAAEwSADBOJPTdKwAAVpTQd68AANhQQh85AgBgYwl95AgAgI0k9JEjAADIQhIAAIwTCQBgmEgAAEJCIgAAMJ5EAACDSgQAEBhFIAAAEwoEACDSAYAwCSgEAAAYTRDYBAEAmEwQ2AQAALZBIBAAwDYIBACA+AiAAwEQABACAGwgEACBMEBhAAACbIBAYgAAY0ggMAEAVoAgEAPQBAkAkgQYIAKA1BEgBAAAmCAAgkECAAAAJASAFAAgDBBgDBBBIAACgUQQCAAAkAgAACQEA0kMDBACaTABAMAACAGRDIgAACAAgBAAAgBAAAAgDBACACAAAEgAIBAAwgEAAQAMBAAgAIAAAQACACAAAEAIAAAEAIAAAIAQAAGCAAAACAAAEAAACAAAEAAAEAAEAIAAABCAAgAAIAQAgAAIAQACAQAEAAACAAAEAAQCAAAEAAgBAAAAIAQAAAQAgAEAQAAEAIAAABAAAgAABAADDABCAAgAIAAAQACAAAEAIAQAAAEAQACAAgAABAAIAAIAQAAAEAIAAIBAAAAIAAIBAAAAIAAIBAAIBAAAAIAAIBAAQAgAIAAAgAABgAEAAgAABgAEAgAACAAAEAIAAABAAIAABgAAAEAIAAAgAABAADDABgAAAEAAgBAAAAIAQAgAABAACAAEAIAAAQACAAgAABAAIAQAAAEAIAAIBAAAgAAAIAQAAABAIAAIAQAAAEAIAQAAAEAIAAABAAQACAAIAQAAAEAIAAAQACAAgAABAAIAABAAAEAIAAAQACAAEAIAAAgAABAADDABCAAgAIAAAQACAAAEAIAQAAAEAQACAAgAABAAIAAIAQAAAEAIAAIBAAABAAIAQAAAEAIAAIAQAAAEAQAAEAIAAABAAIAQAAAEAIAAAgAABAAIAQAAAQAgAEAQAAEAIAAABAAAgAAEAIAAAQAgAEAIAAABAAIAAABgAEAAgAIAQAgABAABgAEAAQCAAIAAAQAAEAIAAABAAIAAABAAIAQAgAEAIAQAAAEAIAAAQACAAgAIAQAAAEAIAAIAAABAAAgAABAIAQAAAEAIAQAAAEAIAAIAAAQCAAIAAAIAAAQACAAgAABAAQACAAQAAAEAIAABCAAgAIAAAgAABAAIAQAAAIAQAAAEAIAAABCAAgAIAAAgAABAAQAgAIAAAgAABAAIAQAAAEAIAQAAAEAIAAAgAABAAIAQAAAEAIAAIAQAAAEAIAQAAAEAIAAABAAQAgBAAEAIAAABAAIAQAgAEAQAAEAIAAABAAIAAAgAABAACAAQACAAIAAAIAABCAAgAIAAAgAABAAIAQAAAIAQAAAEAIAAIAQAAIAQAAAQACAAgAABgAEAIAAAQAgAEAQAAEAIAAABAAIAAAQAgAEAIAAABAAAgAAEAIAQAgAEAIAAAQAgAEAIAAABAAQAgBAAEAIAAABCAAgAgAEAIAQAgBAAEAIAQAAAEAIAQAAEAIAQAAAEAIAAIAAAgAAEAIAAAIAQAAEAIAAABAAIAQAgAEAQAAEAIAAAgAABAABAADDABAAAgAAEAAgAABAABAIAIAAAQACAAAEAIAAIAAAQACAAAEAIAAAIAAAgAABAIABAAQACAAAEAIAAABAAEAIAAAgAABAIAIAAgAABAIAIAIAQAAAEAQAAAEAIAQAgAIAAAAEAIAAAgAIAAAgAABAAIAQAAAEAIAAIAAABAIABAAQAAAEAIAAAgAIAAAgAABAAIAQAgAIAAAgAIAAAIAAAgAABAIAAABAAIAAIAAAIAAAQAgAIAAAIAABAIBAgAABAIAIAEAIAAABAAIAQAAgAIAAAgAIAQAgAEAIAAIBAgAEAIAQAAAEAIAQAgBAAEAIAAIAQAAgAIAQAAgAEAgAABAAQAAIAAAAEAIAAABCAAgAEAIAAAIAAAgAABAQAAEAIAAAgAABAIAQAAEAIAAAgAABAIAQAAgAABAIAQAgAIAAAAEAIAQAAAEAIAAAQACAAgAIAQAgAEAAAAIAAAQACAAgAIAAAQACAAQAAAEAIAAAgAABAIAQAgBAAIAAIAQAAgAABAIAAIBAgAEAAAAIAAAgAABAIAAABAAQAAIAAAAEAIAAABAIABAAQAAIAABAIABAIAQAAEAIAAIAAAEAQAAAEAQAAIAABAIABAIAQAA"; // Truncated for brevity here, but the actual file will have the full string

interface NavButtonProps {
  href: string;
  label: string;
  isActive: boolean;
  isExternal?: boolean;
}

const NavButton: React.FC<NavButtonProps> = ({ href, label, isActive, isExternal }) => {
  const baseClasses = "px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ease-in-out transform focus:outline-none focus:ring-2 focus:ring-sky-500/70 flex items-center space-x-2";
  
  let activeClasses = "";
  let hoverClasses = "hover:text-white hover:bg-slate-700/50 hover:shadow-lg hover:-translate-y-0.5 hover:scale-105";

  if (isActive) {
    activeClasses = "text-white bg-gradient-to-r from-pink-500 via-purple-600 to-sky-500 shadow-xl shadow-purple-500/30 scale-105 ring-2 ring-pink-400 ring-opacity-75";
    hoverClasses = ""; // Active state often overrides hover, or can have specific active-hover
  } else {
    activeClasses = "text-slate-300";
  }

  return (
    <a
      href={href}
      className={`${baseClasses} ${activeClasses} ${hoverClasses}`}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
    >
      <span>{label}</span>
       {isExternal && (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-slate-400 group-hover:text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      )}
    </a>
  );
};

const Navbar: React.FC<NavbarProps> = ({ currentPath }) => {
  const navItems = [
    { label: 'ORDINAL', path: '#/' },
    { label: 'C.H.I.D.O.', path: '#/chido' },
    { label: 'Arte Eterno Collection - MACQ', path: 'https://marketv5-theta.vercel.app/', isExternal: true },
    // { label: 'Arte Eterno', path: 'https://marketv5-theta.vercel.app/', isExternal: true }, // Removed this line
  ];

  return (
    <nav className="bg-slate-800/30 backdrop-blur-lg shadow-lg sticky top-0 z-50 mb-8 h-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex justify-between items-center h-full">
          {/* Logo */}
          <a href="#/" className="flex-shrink-0 group focus:outline-none">
            <img 
              className="h-12 w-auto transition-transform duration-300 ease-in-out group-hover:scale-110 focus:ring-2 focus:ring-sky-500 rounded-full" 
              src={logoDataUrl} 
              alt="Wealth Protocol Logo" 
            />
          </a>

          {/* Navigation Links */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {navItems.map((item) => (
              <NavButton
                key={item.label + item.path} // Ensure unique key if labels/paths might repeat
                href={item.path}
                label={item.label}
                isActive={!item.isExternal && currentPath === item.path}
                isExternal={item.isExternal}
              />
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;