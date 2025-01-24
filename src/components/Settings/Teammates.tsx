import SettingsPageLayout from "./SettingsPageLayout";
import Avatar from "../__shared/Avatar";

const Teammates = () => {
  return (
    <SettingsPageLayout 
      title="Teammates"
      actions={
        <button className="btn btn-primary btn-sm">
          Invite Teammate
        </button>
      }
    >
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <p>Manage your teammates here</p>
        </div>
      </div>
    </SettingsPageLayout>
  );
};

export default Teammates; 