'use client'

import React from 'react';
import { BellIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import MobileMenu from './MobileMenu';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-1">
            <div className="md:hidden flex items-center gap-2">
              <MobileMenu />
              <h1 className="text-xl/5 font-semibold text-gray-700 ">
                Academic Dashboard
              </h1>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              type="button"
              className="relative p-1 text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <BellIcon className="h-6 w-6" />
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white"></span>
            </button>
            <div className="flex items-center">
              <UserCircleIcon className="h-8 w-8 text-gray-400" />
              <span className="ml-2 text-sm font-medium text-gray-700">
                Admin User
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;