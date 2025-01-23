const Profile = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">My Profile</h2>
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Full Name</span>
              </label>
              <input type="text" className="input input-bordered" />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input type="email" className="input input-bordered" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 