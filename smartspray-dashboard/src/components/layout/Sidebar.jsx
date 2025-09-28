import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  HomeIcon,
  MapIcon,
  BeakerIcon,
  ChartBarIcon,
  BellIcon,
  CogIcon,
  UserIcon,
  UsersIcon,
  VideoCameraIcon,
  BugAntIcon, // Alternative icon for disease detection
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { user } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: HomeIcon },
    { name: 'Camera', href: '/profile/upload-image', icon: VideoCameraIcon },
    { name: 'Disease Detection', href: '/disease-detection', icon: BugAntIcon }, // Using BugAntIcon
    { name: 'Farms', href: '/farms', icon: MapIcon },
    { name: 'Spray Control', href: '/spray/control', icon: BeakerIcon },
    { name: 'Analytics', href: '/analytics', icon: ChartBarIcon },
    { name: 'Notifications', href: '/notifications', icon: BellIcon },
  ];

  const adminNavigation = [
    { name: 'Users', href: '/admin/users', icon: UsersIcon },
    { name: 'System', href: '/admin/system', icon: CogIcon },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-green-800 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between h-16 px-4 bg-green-900">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 bg-white rounded-full flex items-center justify-center">
                <span className="text-green-800 font-bold text-sm">SS</span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-white">कृषिNetra</p>
            </div>
          </div>
        </div>

        <div className="h-screen flex-1 overflow-y-auto">
          <nav className="mt-5 px-2 space-y-1">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  `group flex items-center px-2 py-2 text-base font-medium rounded-md transition-colors duration-200 ${
                    isActive
                      ? 'bg-green-900 text-white'
                      : 'text-green-100 hover:bg-green-700'
                  }`
                }
                onClick={() => setIsOpen(false)}
              >
                <item.icon className="mr-4 h-6 w-6" />
                {item.name}
              </NavLink>
            ))}

            {user?.role === 'admin' && (
              <div className="pt-4 mt-4 border-t border-green-700">
                <p className="px-2 text-xs font-semibold text-green-300 uppercase tracking-wider">
                  Admin
                </p>
                <div className="mt-2 space-y-1">
                  {adminNavigation.map((item) => (
                    <NavLink
                      key={item.name}
                      to={item.href}
                      className={({ isActive }) =>
                        `group flex items-center px-2 py-2 text-base font-medium rounded-md transition-colors duration-200 ${
                          isActive
                            ? 'bg-green-900 text-white'
                            : 'text-green-100 hover:bg-green-700'
                        }`
                      }
                      onClick={() => setIsOpen(false)}
                    >
                      <item.icon className="mr-4 h-6 w-6" />
                      {item.name}
                    </NavLink>
                  ))}
                </div>
              </div>
            )}
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;