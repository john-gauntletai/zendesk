import { useState } from "react";
import { SparklesIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { KnowledgeBase } from "../../types";
import { toast } from "react-hot-toast";
import { useKnowledgeBaseStore } from "../../store";

interface BuildWithAIModalProps {
  isOpen: boolean;
  onClose: () => void;
  knowledgeBase: KnowledgeBase;
}

const BuildWithAIModal = ({
  isOpen,
  onClose,
  knowledgeBase,
}: BuildWithAIModalProps) => {
  const { generateCategoriesAndArticles, generationStatus } = useKnowledgeBaseStore();
  const [step, setStep] = useState<1 | 2>(1);
  const [brandVoiceExample, setBrandVoiceExample] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!brandVoiceExample.trim()) {
      toast.error("Please provide a brand voice example");
      return;
    }

    setIsSubmitting(true);
    try {
      await generateCategoriesAndArticles(knowledgeBase.id, {brandVoiceExample, additionalNotes});
      toast.success(
        "AI generation has started! You can close this window - the progress will be visible on the knowledge base card.", 
        { duration: 6000 }
      );
      onClose();
    } catch (error) {
      console.error("Error generating with AI:", error);
      toast.error("Failed to generate with AI");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-2xl relative">
        <button 
          className="btn btn-sm btn-ghost absolute right-2 top-2"
          onClick={onClose}
        >
          <XMarkIcon className="w-5 h-5" />
        </button>

        {step === 1 ? (
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <SparklesIcon className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-bold text-2xl mb-4">
              Build Your Knowledge Base with AI
            </h3>
            <p className="text-base-content/70 mb-8 text-lg">
              Set up your Knowledge Base in minutes, not days. Let AI create
              your categories and start you off with several already written
              articles so you don't have to start from scratch.
            </p>
            <p className="text-base-content/70 mb-8 text-lg">
              Simply show us your brand's voice with an example of writing, and
              you have the option of giving additional notes to guide the AI.
            </p>
            <button
              className="btn btn-primary btn-lg"
              onClick={() => setStep(2)}
            >
              Get Started
            </button>
          </div>
        ) : (
          <div>
            <h3 className="font-bold text-xl mb-6">
              Train AI with Your Brand's Voice
            </h3>

            <div className="form-control gap-6">
              <div>
                <label className="label">
                  <span className="label-text font-medium">
                    Brand Voice Notes / Example
                  </span>
                  <span className="label-text-alt text-base-content/70">
                    Required
                  </span>
                </label>
                <textarea
                  className="textarea textarea-bordered w-full h-32"
                  placeholder="Paste an example of your brand's writing style here. This could be from your website, blog, or any other content that represents your brand's voice well."
                  value={brandVoiceExample}
                  onChange={(e) => setBrandVoiceExample(e.target.value)}
                />
              </div>

              <div>
                <label className="label">
                  <span className="label-text font-medium">
                    Additional Notes
                  </span>
                  <span className="label-text-alt text-base-content/70">
                    Optional
                  </span>
                </label>
                <textarea
                  className="textarea textarea-bordered w-full h-32"
                  placeholder="Add any specific instructions or preferences for the AI. For example: 'Focus on technical topics' or 'Keep the tone casual and friendly'"
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                />
              </div>
            </div>

            <div className="modal-action">
              <button className="btn btn-ghost" onClick={() => setStep(1)}>
                Back
              </button>
              <button
                className="btn btn-primary"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="loading loading-spinner" />
                    Generating...
                  </>
                ) : (
                  <>
                    Generate with AI
                    <SparklesIcon className="w-4 h-4 ml-2" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {isSubmitting && (
          <div className="mt-4 p-4 bg-base-200 rounded-lg">
            <div className="flex items-center gap-3">
              <span className="loading loading-spinner" />
              <div>
                <p className="font-medium">{generationStatus?.message}</p>
                <div className="text-sm text-base-content/70 mt-1">
                  This will take several minutes. You can close this modal - the generation will continue in the background.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="modal-backdrop" onClick={onClose}>
        <button className="cursor-default">Close</button>
      </div>
    </div>
  );
};

export default BuildWithAIModal;
