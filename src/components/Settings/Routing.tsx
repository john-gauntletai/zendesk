import SettingsPageLayout from "./SettingsPageLayout";

const Routing = () => {
  return (
    <SettingsPageLayout 
      title="Queues & Routing"
      actions={
        <button className="btn btn-primary btn-sm">
          Add Rule
        </button>
      }
    >
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <p>Configure conversation routing rules here</p>
        </div>
      </div>
    </SettingsPageLayout>
  );
};

export default Routing; 