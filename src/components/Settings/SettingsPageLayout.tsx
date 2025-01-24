import { ReactNode } from "react";

interface SettingsPageLayoutProps {
  title: string;
  actions?: ReactNode;
  children: ReactNode;
}

const SettingsPageLayout = ({ title, actions, children }: SettingsPageLayoutProps) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">{title}</h2>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
      {children}
    </div>
  );
};

export default SettingsPageLayout; 