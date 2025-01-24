import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-hot-toast";
import supabase from "../supabase";

type Step = "password" | "profile" | "complete";

const NewUserResetPassword = () => {
  const [step, setStep] = useState<Step>("password");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();


  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      
      toast.success("Password set successfully!");
      setStep("profile");
    } catch (error) {
      console.error("Error setting password:", error);
      toast.error("Failed to set password");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      const { error } = await supabase
        .from('users')
        .update({ full_name: fullName })
        .eq('id', user?.id);

      if (error) throw error;
      
      toast.success("Profile updated successfully!");
      setStep("complete");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleComplete = () => {
    window.location.href = "/inbox";
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          {/* Progress Steps */}
          <ul className="steps steps-horizontal mb-8">
            <li className={`step ${step === "password" || step === "profile" || step === "complete" ? "step-primary" : ""}`}>Password</li>
            <li className={`step ${step === "profile" || step === "complete" ? "step-primary" : ""}`}>Profile</li>
            <li className={`step ${step === "complete" ? "step-primary" : ""}`}>Complete</li>
          </ul>

          {step === "password" && (
            <form onSubmit={handleSetPassword}>
              <h2 className="card-title mb-6">Welcome to Superhero</h2>
              <p className="text-base-content/70 mb-6">First, let's set up a secure password for your account.</p>
              <div className="form-control mb-4">
                <input
                  type="password"
                  placeholder="New Password"
                  className="input input-bordered"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
              <div className="form-control mb-6">
                <input
                  type="password"
                  placeholder="Confirm Password"
                  className="input input-bordered"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
              <button 
                type="submit" 
                className="btn btn-primary w-full"
                disabled={isLoading}
              >
                {isLoading ? <span className="loading loading-spinner" /> : "Set Password"}
              </button>
            </form>
          )}

          {step === "profile" && (
            <form onSubmit={handleUpdateProfile}>
              <h2 className="card-title mb-6">Tell us about yourself</h2>
              <p className="text-base-content/70 mb-6">What should we call you?</p>
              <div className="form-control mb-6">
                <input
                  type="text"
                  placeholder="Full Name"
                  className="input input-bordered"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
              <button 
                type="submit" 
                className="btn btn-primary w-full"
                disabled={isLoading}
              >
                {isLoading ? <span className="loading loading-spinner" /> : "Continue"}
              </button>
            </form>
          )}

          {step === "complete" && (
            <div className="text-center">
              <div className="text-6xl mb-6">🎉</div>
              <h2 className="card-title justify-center mb-4">You're all set!</h2>
              <p className="text-base-content/70 mb-8">
                Welcome to the team! You're ready to start helping our heroes.
              </p>
              <button 
                className="btn btn-primary w-full"
                onClick={handleComplete}
              >
                Get Started
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewUserResetPassword;
