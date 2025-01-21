const Settings = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Account Settings</h2>
          <div className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input type="text" placeholder="email@example.com" className="input input-bordered" disabled />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Full Name</span>
              </label>
              <input type="text" placeholder="John Doe" className="input input-bordered" disabled />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
