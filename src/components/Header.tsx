import { useState, useEffect, useCallback, useMemo, memo } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { throttle } from "@/utils/performance";

const Header = memo(() => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = throttle(() => {
      setIsScrolled(window.scrollY > 50);
    }, 100);
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActiveRoute = useCallback((path: string) => location.pathname === path, [location.pathname]);

  const navLinks = useMemo(() => [{
    path: "/",
    label: "Home"
  }, {
    path: "/about-partners",
    label: "About & Partners"
  }, {
    path: "/storytelling",
    label: "Storytelling"
  }, {
    path: "/experts",
    label: "Experts"
  }, {
    path: "/events",
    label: "Events"
  }, {
    path: "/news",
    label: "Business/Tech News"
  }], []);

  const closeMobileMenu = useCallback(() => setMobileMenuOpen(false), []);
  const toggleMobileMenu = useCallback(() => setMobileMenuOpen(prev => !prev), []);

  const NavLink = memo(({ path, label }: { path: string; label: string }) => (
    <Link 
      to={path} 
      className={`nav-link px-3 py-2 text-sm font-medium transition-all duration-200 relative group ${
        isActiveRoute(path) ? 'text-gray-900 font-bold' : 'text-gray-700 hover:text-gray-900'
      }`}
    >
      {label}
      <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-gray-900 transition-transform origin-left duration-300 ${
        isActiveRoute(path) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
      }`}></span>
    </Link>
  ));

  const MobileNavLink = memo(({ path, label, onClick }: { path: string; label: string; onClick: () => void }) => (
    <Link 
      to={path} 
      className="block px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors" 
      onClick={onClick}
    >
      {label}
    </Link>
  ));

  const Logo = memo(() => (
    <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
      <img 
        src="/lovable-uploads/a622b81f-1bc6-4b70-90bc-fdf0fd79ae53.png" 
        alt="ABTC Bulgaria Logo" 
        className="h-12 w-12 object-contain"
        loading="eager"
        decoding="async"
      />
      <div className="flex flex-col">
        <div className="flex items-center">
          <span className="text-base mr-1">🇺🇸</span>
          <span className="text-lg font-bold text-blue-700 mr-1">ABTC</span>
          <span className="text-lg font-bold text-red-600 tracking-tight">Bulgaria</span>
        </div>
        <p className="text-xs text-gray-600 leading-tight hidden sm:block">🇺🇸 American Business & Technology Club</p>
      </div>
    </Link>
  ));

  const AuthButtons = memo(() => (
    <div className="hidden md:flex items-center space-x-3">
      <Link to="/login">
        <Button variant="ghost" size="sm" className="font-medium text-gray-700 hover:text-gray-900">
          Log in
        </Button>
      </Link>
      <Link to="/join">
        <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white font-medium">
          Join Us
        </Button>
      </Link>
    </div>
  ));

  const MobileMenuButton = memo(({ onClick, isOpen }: { onClick: () => void; isOpen: boolean }) => (
    <div className="md:hidden flex justify-center flex-1">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={onClick} 
        className="h-10 w-10 bg-gray-100 hover:bg-gray-200 border border-gray-300 shadow-sm"
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        {isOpen ? <X size={24} className="text-gray-700" /> : <Menu size={24} className="text-gray-700" />}
      </Button>
    </div>
  ));

  const MobileMenu = memo(({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => isOpen && (
    <div className="md:hidden bg-white shadow-lg border-t">
      {/* Mobile Organization Name */}
      <div className="px-4 py-3 border-b border-gray-200 bg-slate-50">
        <div className="text-center">
          <p className="text-base font-semibold text-gray-800 leading-tight">🇺🇸 American Business & Technology Club</p>
        </div>
      </div>
      
      <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
        {navLinks.map(link => (
          <MobileNavLink 
            key={link.path} 
            path={link.path} 
            label={link.label} 
            onClick={onClose}
          />
        ))}
        <div className="pt-3 pb-2 border-t border-gray-200 mt-3">
          <Link to="/login" onClick={onClose}>
            <Button variant="ghost" size="sm" className="w-full justify-center mb-2 font-medium text-gray-700">
              Log in
            </Button>
          </Link>
          <Link to="/join" onClick={onClose}>
            <Button size="sm" className="w-full justify-center bg-blue-600 hover:bg-blue-700 text-white font-medium">
              Join Us
            </Button>
          </Link>
        </div>
      </div>
    </div>
  ));

  return (
    <header className={`bg-white shadow-sm sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'shadow-md' : ''}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center my-[3px] py-0 bg-slate-50">
          <Logo />
          
          <nav className="hidden md:flex space-x-8">
            {navLinks.map(link => (
              <NavLink key={link.path} path={link.path} label={link.label} />
            ))}
          </nav>
          
          <AuthButtons />
          <MobileMenuButton onClick={toggleMobileMenu} isOpen={mobileMenuOpen} />
        </div>
      </div>
      
      <MobileMenu isOpen={mobileMenuOpen} onClose={closeMobileMenu} />
    </header>
  );
});

Header.displayName = 'Header';

export default Header;
