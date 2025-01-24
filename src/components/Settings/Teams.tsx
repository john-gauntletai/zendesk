import SettingsPageLayout from "./SettingsPageLayout";

const Teams = () => {
  return (
    <SettingsPageLayout 
      title="Teams"
      actions={
        <button className="btn btn-primary btn-sm">
          Create Team
        </button>
      }
    >
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <p>Manage your teams here</p>
        </div>
      </div>
    </SettingsPageLayout>
  );
};

export default Teams; 