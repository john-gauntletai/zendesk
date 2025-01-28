import { useState } from "react";
import { useKnowledgeBaseStore } from "../../store";
import { PlusIcon, BookOpenIcon } from "@heroicons/react/24/outline";
import KnowledgeBaseCard from "./KnowledgeBaseCard";
import CreateKnowledgeBaseModal from "./CreateKnowledgeBaseModal";

const KnowledgeBase = () => {
  const { knowledgeBases, categories, articles } = useKnowledgeBaseStore();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Knowledge Bases</h1>
        <button 
          className="btn btn-primary btn-sm"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Create Knowledge Base
        </button>
      </div>

      {knowledgeBases.length === 0 ? (
        <div className="card bg-base-100 shadow-lg border border-base-300">
          <div className="card-body items-center text-center py-12">
            <BookOpenIcon className="w-16 h-16 text-base-content/20" />
            <h2 className="text-xl font-bold mt-4">No Knowledge Bases Yet</h2>
            <p className="text-base-content/70 mt-2 mb-6">
              Create your first knowledge base to start organizing your documentation
            </p>
            <button 
              className="btn btn-primary"
              onClick={() => setIsCreateModalOpen(true)}
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              Create Knowledge Base
            </button>
          </div>
        </div>
      ) : (
        <div className="grid gap-6">
          {knowledgeBases.map((kb) => (
            <KnowledgeBaseCard
              key={kb.id}
              knowledgeBase={kb}
              categories={categories}
              articles={articles}
            />
          ))}
        </div>
      )}

      <CreateKnowledgeBaseModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
};

export default KnowledgeBase;
