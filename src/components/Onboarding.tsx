import { useState, useEffect } from "react";
import { useSessionStore } from "../store";
import supabase from "../supabase";
import { toast } from "react-hot-toast";
import InviteTeammatesModal from "./Settings/InviteTeammatesModal";

const Onboarding = () => {
  const [isOnboarding, setIsOnboarding] = useState(false);
  const { session, isLoading, fetchSession } = useSessionStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [orgName, setOrgName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);

  useEffect(() => {
    if (!isLoading && session && !session.org_id) {
      setIsOnboarding(true);
    }
  }, [isLoading, session]);

  if (!isOnboarding) {
    return null;
  }

  const handleCreateOrg = async () => {
    if (!orgName.trim()) {
      toast.error("Please enter an organization name");
      return;
    }

    setIsSubmitting(true);
    try {
      const { data: org, error: orgError } = await supabase
        .from("orgs")
        .insert({
          name: orgName.trim(),
        })
        .select()
        .single();

      if (orgError) throw orgError;

      const { error: userError } = await supabase
        .from("users")
        .update({ org_id: org.id })
        .eq("id", session.id);

      if (userError) throw userError;

      await fetchSession();
      setCurrentStep(2);
    } catch (error) {
      console.error("Error creating organization:", error);
      toast.error("Failed to create organization");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50">
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div className="bg-base-100 rounded-lg shadow-xl max-w-2xl w-full">
          <ul className="steps w-full p-4">
            <li className={`step ${currentStep >= 1 ? "step-primary" : ""}`}>
              Welcome
            </li>
            <li className={`step ${currentStep >= 2 ? "step-primary" : ""}`}>
              Invite Team
            </li>
            <li className={`step ${currentStep >= 3 ? "step-primary" : ""}`}>
              Ready!
            </li>
          </ul>

          <div className="p-6">
            {currentStep === 1 && (
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">
                  Welcome to Superhero!
                </h2>
                <p className="text-base-content/70 mb-8">
                  Let's get started by setting up your organization.
                </p>
                <div className="form-control w-full max-w-md mx-auto">
                  <label className="label">
                    <span className="label-text">Organization Name</span>
                  </label>
                  <input
                    type="text"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    placeholder="Enter your company name"
                    className="input input-bordered w-full"
                  />
                </div>
                <button
                  className="btn btn-primary mt-6"
                  onClick={handleCreateOrg}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="loading loading-spinner" />
                  ) : (
                    "Next"
                  )}
                </button>
              </div>
            )}

            {currentStep === 2 && (
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">
                  Build Your Team
                </h2>
                <p className="text-base-content/70 mb-8">
                  Collaborate better by inviting your teammates to join your workspace.
                </p>
                <div className="flex justify-center gap-4">
                  <button
                    className="btn btn-primary"
                    onClick={() => setShowInviteModal(true)}
                  >
                    Invite Teammates
                  </button>
                  <button
                    className="btn btn-ghost"
                    onClick={() => setCurrentStep(3)}
                  >
                    Skip for Now
                  </button>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="text-center">
                <div className="w-24 h-24 mx-auto mb-6 text-success">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold mb-4">
                  You're All Set!
                </h2>
                <p className="text-base-content/70 mb-8">
                  Your workspace is ready. Let's get started!
                </p>
                <button
                  className="btn btn-primary"
                  onClick={() => window.location.reload()}
                >
                  Get Started
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showInviteModal && (
        <InviteTeammatesModal
          isOpen={showInviteModal}
          onClose={() => setShowInviteModal(false)}
          onSubmit={async (emails) => {
            setShowInviteModal(false);
            setCurrentStep(3);
          }}
        />
      )}
    </div>
  );
};

export default Onboarding;
