import SettingsPageLayout from "./SettingsPageLayout";

const Tags = () => {
  return (
    <SettingsPageLayout 
      title="Tags"
      actions={
        <button className="btn btn-primary btn-sm">
          Add Tag
        </button>
      }
    >
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <p>Manage your conversation tags here</p>
        </div>
      </div>
    </SettingsPageLayout>
  );
};

export default Tags; 