import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router";
import Avatar from "../__shared/Avatar";
import { useSessionStore } from '../../store';
import Portal from "../Portal";
import {
  InboxIcon,
  ChartBarIcon,
  BookOpenIcon,
  Cog6ToothIcon,
  ChevronDownIcon,
  CommandLineIcon,
  ArrowRightStartOnRectangleIcon,
  UserCircleIcon,
  SunIcon,
  MoonIcon,
} from '@heroicons/react/24/outline';

const Sidebar = () => {
  const { logout } = useSessionStore();
  const { session } = useSessionStore();
  const location = useLocation();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const [theme, setTheme] = useState(() => 
    document.documentElement.getAttribute('data-theme') || 'light'
  );
  
  const profileTriggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current && 
        !menuRef.current.contains(event.target as Node) &&
        !profileTriggerRef.current?.contains(event.target as Node)
      ) {
        setIsProfileMenuOpen(false);
      }
    };

    const updatePosition = () => {
      if (profileTriggerRef.current) {
        const rect = profileTriggerRef.current.getBoundingClientRect();
        const menuHeight = menuRef.current?.offsetHeight || 0;
        
        setMenuPosition({
          top: rect.top - menuHeight - 200, // Position above with 8px gap
          left: rect.right,
        });
      }
    };

    if (isProfileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("scroll", updatePosition, true);
      window.addEventListener("resize", updatePosition);
      // Delay position update to next frame to ensure menu is rendered
      requestAnimationFrame(updatePosition);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [isProfileMenuOpen]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(current => current === 'light' ? 'business' : 'light');
  };

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

      {/* Profile Menu Trigger */}
      <div className="mt-auto pt-4">
        <button
          ref={profileTriggerRef}
          onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
          className="w-10 h-10 rounded-lg flex items-center justify-center transition-colors relative"
          data-tip={session?.full_name}
        >
          <Avatar user={session} size={24} />
        </button>
      </div>

      {/* Profile Menu in Portal */}
      {isProfileMenuOpen && (
        <Portal>
          <div
            ref={menuRef}
            style={{
              position: 'fixed',
              top: menuPosition.top,
              left: menuPosition.left,
            }}
            className="z-50 w-56 bg-base-100 rounded-lg shadow-lg border border-base-300"
          >
            <div className="p-3 border-b border-base-300">
              <div className="font-medium truncate">
                {session?.full_name || "Unknown"}
              </div>
              <div className="text-sm text-base-content/70 truncate">
                {session?.email || "No email"}
              </div>
            </div>

            <div className="p-1">
              <Link
                to="/settings/profile"
                className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-base-200"
                onClick={() => setIsProfileMenuOpen(false)}
              >
                <UserCircleIcon className="w-5 h-5" />
                <span>Profile Settings</span>
              </Link>

              <button
                onClick={toggleTheme}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-base-200"
              >
                {theme === 'light' ? (
                  <>
                    <MoonIcon className="w-5 h-5" />
                    <span>Dark Mode</span>
                  </>
                ) : (
                  <>
                    <SunIcon className="w-5 h-5" />
                    <span>Light Mode</span>
                  </>
                )}
              </button>

              <button
                onClick={logout}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-base-200 text-error"
              >
                <ArrowRightStartOnRectangleIcon className="w-5 h-5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </Portal>
      )}
    </div>
  );
};

export default Sidebar;
