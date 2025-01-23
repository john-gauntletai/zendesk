import { useState } from "react";
import { Outlet } from "react-router";
import SettingsSidebar from "./SettingsSidebar";

const Settings = () => {
  const [expandedSections, setExpandedSections] = useState({
    general: true,
    inbox: true,
    billing: true,
  });

  const toggleSection = (section: "general" | "inbox" | "billing") => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <div className="flex h-screen bg-base-200">
      <SettingsSidebar
        expandedSections={expandedSections}
        onToggleSection={toggleSection}
      />
      
      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default Settings;
