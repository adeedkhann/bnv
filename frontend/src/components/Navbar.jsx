import React from 'react';
import { NavLink } from 'react-router-dom';

const navLinkClass = ({ isActive }) =>
  `text-sm font-semibold transition ${isActive ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'}`;

const Navbar = () => {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <div className="text-lg font-semibold text-gray-900">User Admin</div>
        <nav className="flex items-center gap-6">
          <NavLink to="/" className={navLinkClass} end>
            Users
          </NavLink>
          <NavLink to="/add" className={navLinkClass}>
            Add User
          </NavLink>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
