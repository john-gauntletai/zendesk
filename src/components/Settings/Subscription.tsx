import SettingsPageLayout from "./SettingsPageLayout";

const Subscription = () => {
  return (
    <SettingsPageLayout 
      title="My Subscription"
      actions={
        <button className="btn btn-primary btn-sm">
          Upgrade Plan
        </button>
      }
    >
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <p>Manage your subscription here</p>
        </div>
      </div>
    </SettingsPageLayout>
  );
};

export default Subscription; 