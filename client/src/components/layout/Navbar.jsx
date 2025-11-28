import React, { useContext } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { PawPrint, LogOut, UserCircle, ShoppingBag } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  const navLinkClass = ({ isActive }) =>
    isActive ? 'text-cyan-400' : 'hover:text-cyan-400 transition-colors';

  return (
    <nav className="fixed top-0 left-0 w-full bg-slate-900/80 backdrop-blur-lg z-50">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <PawPrint className="text-cyan-400" size={28} />
          <span className="text-xl font-bold">PetSpeak AI</span>
        </Link>
        <div className="hidden md:flex items-center gap-6 text-lg justify-center flex-1">
          <NavLink to="/translate" className={`${navLinkClass} px-4 py-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 transition-all duration-300 border border-slate-600 hover:border-cyan-400`}>Translator</NavLink>
          {user && <NavLink to="/shop" className={`${navLinkClass} px-4 py-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 transition-all duration-300 border border-slate-600 hover:border-cyan-400`}>Shop</NavLink>}
        </div>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <div className="flex items-center gap-2 text-white">
                <UserCircle size={20} />
                <span>{user.username}</span>
              </div>
              <button onClick={logout} className="flex items-center gap-2 px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 transition-colors">
                <LogOut size={16} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="px-4 py-2 rounded-md hover:bg-slate-700 transition-colors">
                Login
              </Link>
              <Link to="/register" className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold px-4 py-2 rounded-md transition-colors">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
