import { useState } from "react";
import { format } from "date-fns";
import { PlusIcon, FolderIcon, DocumentTextIcon } from "@heroicons/react/24/outline";
import { KnowledgeBase, Category, Article } from "../../types";
import CreateCategoryModal from "./CreateCategoryModal";
import ArticleFlyout from "./ArticleFlyout";

interface KnowledgeBaseCardProps {
  knowledgeBase: KnowledgeBase;
  categories: Category[];
  articles: Article[];
}

const KnowledgeBaseCard = ({ knowledgeBase: kb, categories, articles }: KnowledgeBaseCardProps) => {
  const [isCreateCategoryModalOpen, setIsCreateCategoryModalOpen] = useState(false);
  const [isArticleFlyoutOpen, setIsArticleFlyoutOpen] = useState(false);
  const kbCategories = categories.filter((cat) => cat.knowledgebase_id === kb.id);
  const kbArticles = articles.filter(
    (article) =>
      categories.find((c) => c.id === article.category_id)?.knowledgebase_id === kb.id
  );

  const handleCreateCategory = () => {
    setIsCreateCategoryModalOpen(true);
  };

  const handleCreateArticle = () => {
    setIsArticleFlyoutOpen(true);
  };

  return (
    <div className="card bg-base-100 shadow-lg border border-base-300">
      <div className="card-body">
        {/* Knowledge Base Header */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-4">
            <div 
              className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
              style={{ backgroundColor: `${kb.theme_color}20` }}
            >
              {kb.logo_url ? (
                <img src={kb.logo_url} alt={kb.name} className="w-8 h-8" />
              ) : (
                "📚"
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold">{kb.name}</h2>
              <p className="text-base-content/70">{kb.description}</p>
            </div>
          </div>
          <button className="btn btn-sm">Preview</button>
        </div>

        {/* Categories Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Categories</h3>
            <button 
              className="btn btn-sm btn-ghost"
              onClick={handleCreateCategory}
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              Add Category
            </button>
          </div>
          {kbCategories.length === 0 ? (
            <div className="border-2 border-dashed border-base-300 rounded-lg p-8 text-center">
              <FolderIcon className="w-12 h-12 mx-auto text-base-content/20" />
              <h3 className="font-medium mt-4 mb-2">No Categories Yet</h3>
              <p className="text-base-content/70 text-sm mb-4">
                Create categories to organize your articles
              </p>
              <button 
                className="btn btn-sm btn-primary"
                onClick={handleCreateCategory}
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                Create First Category
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table table-sm">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Articles</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {kbCategories.map((category) => (
                    <tr key={category.id}>
                      <td>{category.name}</td>
                      <td>
                        {articles.filter((a) => a.category_id === category.id).length}
                      </td>
                      <td>
                        <button className="btn btn-ghost btn-xs">Edit</button>
                        <button className="btn btn-ghost btn-xs text-error">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Articles Section */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Articles</h3>
            <button 
              className="btn btn-sm btn-ghost"
              disabled={kbCategories.length === 0}
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              New Article
            </button>
          </div>
          {kbCategories.length === 0 ? (
            <div className="text-center py-6 text-base-content/70">
              Create a category first to start adding articles
            </div>
          ) : kbArticles.length === 0 ? (
            <div className="border-2 border-dashed border-base-300 rounded-lg p-8 text-center">
              <DocumentTextIcon className="w-12 h-12 mx-auto text-base-content/20" />
              <h3 className="font-medium mt-4 mb-2">No Articles Yet</h3>
              <p className="text-base-content/70 text-sm mb-4">
                Start adding articles to your knowledge base
              </p>
              <button 
                className="btn btn-sm btn-primary"
                onClick={handleCreateArticle}
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                Create First Article
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table table-sm">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Preview</th>
                    <th>Category</th>
                    <th>Author</th>
                    <th>Last Updated</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {kbArticles.map((article) => (
                    <tr key={article.id}>
                      <td className="font-medium">{article.title}</td>
                      <td className="max-w-md">
                        <p className="truncate text-base-content/70">
                          {article.content}
                        </p>
                      </td>
                      <td>
                        {categories.find((c) => c.id === article.category_id)?.name}
                      </td>
                      <td>Author Name</td>
                      <td className="text-base-content/70">
                        {format(new Date(article.created_at), "MMM d, yyyy")}
                      </td>
                      <td>
                        <button className="btn btn-ghost btn-xs">Edit</button>
                        <button className="btn btn-ghost btn-xs text-error">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <CreateCategoryModal 
        isOpen={isCreateCategoryModalOpen}
        onClose={() => setIsCreateCategoryModalOpen(false)}
        knowledgeBaseId={kb.id}
      />

      {isArticleFlyoutOpen && (
        <ArticleFlyout
          isOpen={isArticleFlyoutOpen}
          onClose={() => setIsArticleFlyoutOpen(false)}
          isNewArticle
          knowledgeBaseId={kb.id}
          categories={kbCategories}
        />
      )}
    </div>
  );
};

export default KnowledgeBaseCard; 