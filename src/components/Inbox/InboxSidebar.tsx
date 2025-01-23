import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import {
  DEFAULT_ALL_FILTERS,
  DEFAULT_ASSIGNED_TO_ME_FILTERS,
} from "./constants";

interface InboxSidebarProps {
  expandedSections: {
    all: boolean;
    assigned: boolean;
  };
  onToggleSection: (section: "all" | "assigned") => void;
  onFilterClick: (query: Record<string, string>) => void;
  isFilterActive: (query: Record<string, string>) => boolean;
  conversationCounts: {
    all: Record<string, number>;
    assigned: Record<string, number>;
  };
  userId?: string;
}

const InboxSidebar = ({
  expandedSections,
  onToggleSection,
  onFilterClick,
  isFilterActive,
  conversationCounts,
  userId,
}: InboxSidebarProps) => {
  return (
    <div className="w-56 bg-base-100 border-t-2 border-b-2 border-r-2 border-base-300 flex-shrink-0 shadow-sm rounded-r-lg">
      <div className="py-4 px-2">
        <h2 className="text-lg font-bold mb-4 px-2">Inbox</h2>

        {/* All Section */}
        <div className="mb-2">
          <button
            onClick={() => onToggleSection("all")}
            className="flex items-center w-full text-left px-2 py-1 text-sm font-medium rounded-lg"
          >
            <span>All</span>
            {expandedSections.all ? (
              <ChevronDownIcon className="w-3 h-3 ml-2 flex-shrink-0" />
            ) : (
              <ChevronRightIcon className="w-3 h-3 ml-2 flex-shrink-0" />
            )}
          </button>

          {expandedSections.all && (
            <div className="ml-2">
              {DEFAULT_ALL_FILTERS.map((filter) => (
                <button
                  key={filter.label}
                  className={`flex items-center justify-between w-full px-2 py-1 text-sm hover:bg-base-200 rounded-lg ${
                    isFilterActive(filter.query)
                      ? "bg-base-200 text-primary"
                      : ""
                  }`}
                  onClick={() => onFilterClick(filter.query)}
                >
                  <span className="flex items-center">
                    <span>{filter.label}</span>
                  </span>
                  <span className="text-xs text-base-content/70">
                    {conversationCounts.all[filter.query.status]}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Assigned to Me Section */}
        <div className="mb-2">
          <button
            onClick={() => onToggleSection("assigned")}
            className="flex items-center w-full text-left px-2 py-1 text-sm font-medium rounded-lg"
          >
            <span>Assigned to Me</span>
            {expandedSections.assigned ? (
              <ChevronDownIcon className="w-3 h-3 ml-2 flex-shrink-0" />
            ) : (
              <ChevronRightIcon className="w-3 h-3 ml-2 flex-shrink-0" />
            )}
          </button>

          {expandedSections.assigned && userId && (
            <div className="ml-2">
              {DEFAULT_ASSIGNED_TO_ME_FILTERS(userId).map((filter) => (
                <button
                  key={filter.label}
                  className={`flex items-center justify-between w-full px-2 py-1 text-sm hover:bg-base-200 rounded-lg ${
                    isFilterActive(filter.query)
                      ? "bg-base-200 text-primary"
                      : ""
                  }`}
                  onClick={() => onFilterClick(filter.query)}
                >
                  <span className="flex items-center">
                    <span>{filter.label}</span>
                  </span>
                  <span className="text-xs text-base-content/70">
                    {conversationCounts.assigned[filter.query.status]}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InboxSidebar;
