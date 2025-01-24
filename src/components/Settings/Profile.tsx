import { useState, useEffect } from "react";
import { useSessionStore } from "../../store";
import SettingsPageLayout from "./SettingsPageLayout";
import supabase from "../../supabase";
import { toast } from "react-hot-toast";
import Avatar from "../__shared/Avatar";

const Profile = () => {
  const { session, fetchSession } = useSessionStore();
  const [formData, setFormData] = useState({
    full_name: session?.full_name || "",
    email: session?.email || "",
    avatar_url: session?.avatar_url || "",
  });
  const [isEdited, setIsEdited] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (session) {
      setFormData({
        full_name: session.full_name || "",
        email: session.email || "",
        avatar_url: session.avatar_url || "",
      });
    }
  }, [session]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setIsEdited(true);
  };

  const handleSave = async () => {
    if (!session?.id) return;
    
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('users')
        .update({ 
          full_name: formData.full_name,
          avatar_url: formData.avatar_url,
        })
        .eq('id', session.id);

      if (error) throw error;

      await fetchSession();
      setIsEdited(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SettingsPageLayout 
      title="My Profile"
      actions={(
        <button 
          className="btn btn-primary btn-sm"
          onClick={handleSave}
          disabled={!isEdited || isSaving}
        >
          {isSaving ? (
            <>
              <span className="loading loading-spinner loading-xs"></span>
              Saving...
            </>
          ) : (
            'Save Changes'
          )}
        </button>
      )}
    >
      <div className="card bg-base-100 shadow-md rounded-lg border-2 border-base-300">
        <div className="card-body">
          <div className="flex items-start gap-6 mb-6">
            <div className="flex-shrink-0">
              <Avatar user={formData} size={80} />
            </div>
            <div className="flex-1">
              <h3 className="font-medium mb-2">Profile Picture</h3>
              <div className="form-control">
                <input 
                  type="url"
                  name="avatar_url"
                  value={formData.avatar_url}
                  onChange={handleInputChange}
                  className="input input-bordered text-sm"
                  placeholder="Enter image URL"
                />
                <label className="label">
                  <span className="label-text-alt text-base-content/60">
                    Enter a URL for your profile picture, or leave blank to use generated avatar
                  </span>
                </label>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Full Name</span>
              </label>
              <input 
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleInputChange}
                className="input input-bordered"
                placeholder="Enter your full name"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input 
                type="email"
                name="email"
                value={formData.email}
                className="input input-bordered"
                disabled
              />
              <label className="label">
                <span className="label-text-alt text-base-content/60">Email cannot be changed</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </SettingsPageLayout>
  );
};

export default Profile; 