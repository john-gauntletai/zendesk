import { useState } from 'react';
import { Link, useLocation } from 'react-router';
import Avatar from "../__shared/Avatar";
import { useSessionStore } from '../../store';
import {
  InboxIcon,
  ChartBarIcon,
  BookOpenIcon,
  Cog6ToothIcon,
  CommandLineIcon,
  ArrowRightStartOnRectangleIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';

const Sidebar = () => {
  const { logout } = useSessionStore();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { session } = useSessionStore();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  const getLinkClasses = (path: string) => {
    return `p-2 rounded-lg tooltip tooltip-right transition-colors ${
      isActive(path) 
        ? 'bg-primary text-primary-content' 
        : 'text-gray-400 hover:text-white hover:bg-base-800'
    }`;
  };

  const handleSignOut = async () => {
    logout();
  };

  return (
    <div className="w-14 h-screen flex flex-col flex-none items-center py-4 bg-neutral">
      {/* Logo */}
      <div className="mb-8">
        <Link 
          to="/inbox" 
          className="text-gray-400 hover:text-white transition-colors"
          data-tip="Home"
        >
          <CommandLineIcon className="w-6 h-6" />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col items-center space-y-3">
        <Link
          to="/inbox"
          className={getLinkClasses('/inbox')}
          data-tip="Inbox"
        >
          <InboxIcon className="w-5 h-5" />
        </Link>

        <Link
          to="/reports"
          className={getLinkClasses('/reports')}
          data-tip="Reports"
        >
          <ChartBarIcon className="w-5 h-5" />
        </Link>

        <Link
          to="/knowledge-base"
          className={getLinkClasses('/knowledge-base')}
          data-tip="Knowledge Base"
        >
          <BookOpenIcon className="w-5 h-5" />
        </Link>

        <Link
          to="/settings"
          className={getLinkClasses('/settings')}
          data-tip="Settings"
        >
          <Cog6ToothIcon className="w-5 h-5" />
        </Link>
      </nav>

      {/* Profile Menu */}
      <div className="relative flex items-center justify-center">
        <div className="dropdown dropdown-top dropdown-start">
          <label tabIndex={0} className="w-100 flex items-center justify-center cursor-pointer focus:outline-none">
            <Avatar user={session} size={32} />
          </label>
          <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow-lg bg-white rounded-box w-52 mt-1 border border-gray-100">
            <li className="menu-title px-4 py-2">
              <div className="flex flex-col">
                <span className="font-medium text-gray-900">{session?.full_name}</span>
                <span className="text-xs text-gray-500">{session?.email}</span>
              </div>
            </li>
            <div className="divider my-0"></div>
            <li>
              <button 
                onClick={() => handleSignOut()} 
                className="flex items-center gap-2 text-gray-600 hover:text-red-600 hover:bg-red-50"
              >
                <ArrowRightStartOnRectangleIcon className="w-4 h-4" />
                <span>Sign out</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
