import { Link, useLocation } from "react-router";
import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

interface SettingsSidebarProps {
  expandedSections: {
    general: boolean;
    inbox: boolean;
    billing: boolean;
  };
  onToggleSection: (section: "general" | "inbox" | "billing") => void;
}

const SETTINGS_SECTIONS = {
  general: [
    { label: "👤 My Profile", path: "/settings/profile" },
    { label: "👥 Teammates", path: "/settings/teammates" },
    { label: "🏢 Teams", path: "/settings/teams" },
  ],
  inbox: [
    { label: "🏷️ Tags", path: "/settings/tags" },
    { label: "🔄 Queues & Routing", path: "/settings/routing" },
  ],
  billing: [
    { label: "💳 My Subscription", path: "/settings/subscription" },
  ],
};

const SettingsSidebar = ({
  expandedSections,
  onToggleSection,
}: SettingsSidebarProps) => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="w-56 bg-base-100 border-r-2 border-base-300 flex-shrink-0 shadow-sm">
      <div className="py-4 px-2">
        <h1 className="text-2xl font-bold mb-4 px-2">Settings</h1>

        {/* General Section */}
        <div className="mb-2">
          <button
            onClick={() => onToggleSection("general")}
            className="flex items-center w-full text-left px-2 py-1 text-sm font-medium rounded-lg"
          >
            <span>General</span>
            {expandedSections.general ? (
              <ChevronDownIcon className="w-3 h-3 ml-2 flex-shrink-0" />
            ) : (
              <ChevronRightIcon className="w-3 h-3 ml-2 flex-shrink-0" />
            )}
          </button>

          {expandedSections.general && (
            <div className="ml-2">
              {SETTINGS_SECTIONS.general.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center w-full px-2 py-1 text-sm hover:bg-base-200 rounded-lg ${
                    isActive(item.path) ? "bg-base-200 text-primary" : ""
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Inbox Section */}
        <div className="mb-2">
          <button
            onClick={() => onToggleSection("inbox")}
            className="flex items-center w-full text-left px-2 py-1 text-sm font-medium rounded-lg"
          >
            <span>Inbox</span>
            {expandedSections.inbox ? (
              <ChevronDownIcon className="w-3 h-3 ml-2 flex-shrink-0" />
            ) : (
              <ChevronRightIcon className="w-3 h-3 ml-2 flex-shrink-0" />
            )}
          </button>

          {expandedSections.inbox && (
            <div className="ml-2">
              {SETTINGS_SECTIONS.inbox.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center w-full px-2 py-1 text-sm hover:bg-base-200 rounded-lg ${
                    isActive(item.path) ? "bg-base-200 text-primary" : ""
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Billing Section */}
        <div className="mb-2">
          <button
            onClick={() => onToggleSection("billing")}
            className="flex items-center w-full text-left px-2 py-1 text-sm font-medium rounded-lg"
          >
            <span>Billing</span>
            {expandedSections.billing ? (
              <ChevronDownIcon className="w-3 h-3 ml-2 flex-shrink-0" />
            ) : (
              <ChevronRightIcon className="w-3 h-3 ml-2 flex-shrink-0" />
            )}
          </button>

          {expandedSections.billing && (
            <div className="ml-2">
              {SETTINGS_SECTIONS.billing.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center w-full px-2 py-1 text-sm hover:bg-base-200 rounded-lg ${
                    isActive(item.path) ? "bg-base-200 text-primary" : ""
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsSidebar; 