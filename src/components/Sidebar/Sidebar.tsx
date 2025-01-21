import { useState } from 'react';
import { Link, useLocation } from 'react-router';
import { useSessionStore } from '../../store';
import {
  InboxIcon,
  ChartBarIcon,
  BookOpenIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/solid';

const Sidebar = () => {
  const { logout } = useSessionStore();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  const getLinkClasses = (path: string) => {
    return `p-2 rounded-lg tooltip tooltip-right ${
      isActive(path) 
        ? 'bg-primary text-primary-content' 
        : 'hover:bg-base-300'
    }`;
  };

  const handleSignOut = async () => {
    logout();
  };

  return (
    <div className="w-14 h-screen flex flex-col items-center py-4">
      {/* Logo */}
      <div className="mb-8">
        <Link to="/" className="text-xl font-bold text-primary">
          🦄
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
      <div className="relative">
        <button
          onClick={() => setShowProfileMenu(!showProfileMenu)}
          className="w-10 h-10 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center"
        >
          <span className="text-lg">👤</span>
        </button>

        {/* Dropdown Menu */}
        {showProfileMenu && (
          <div className="absolute bottom-full mb-2 left-full ml-2 w-48 bg-base-100 rounded-lg shadow-xl py-2">
            <div className="px-4 py-2 border-b border-base-200">
              <div className="font-medium">user@example.com</div>
              <div className="text-sm text-base-content/70">Personal Account</div>
            </div>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 text-left w-full hover:bg-base-200 text-error"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
