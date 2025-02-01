import { useState } from "react";
import { format } from "date-fns";
import { PlusIcon, FolderIcon, DocumentTextIcon, EllipsisVerticalIcon, ArrowTopRightOnSquareIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { KnowledgeBase, Category, Article } from "../../types";
import { useKnowledgeBaseStore } from "../../store";
import ArticleFlyout from "./ArticleFlyout";
import DeleteCategoryModal from "./DeleteCategoryModal";
import DeleteArticleModal from "./DeleteArticleModal";
import EditKnowledgeBaseModal from "./EditKnowledgeBaseModal";
import DeleteKnowledgeBaseModal from "./DeleteKnowledgeBaseModal";
import { Link } from "react-router";
import CreateOrEditCategoryModal from "./CreateOrEditCategoryModal";
import BuildWithAIModal from "./BuildWithAIModal";

interface KnowledgeBaseCardProps {
  knowledgeBase: KnowledgeBase;
  categories: Category[];
  articles: Article[];
  onOpenBuildWithAI: () => void;
}

const getPlainTextFromJson = (jsonString: string) => {
  try {
    const json = JSON.parse(jsonString);
    let text = '';

    const extractTextFromNode = (node: any) => {
      if (node.type === 'text') {
        text += node.text;
      } else if (node.type === 'paragraph') {
        node.content?.forEach(extractTextFromNode);
        text += ' ';
      } else if (node.type === 'heading') {
        node.content?.forEach(extractTextFromNode);
        text += ' ';
      } else if (node.content) {
        node.content.forEach(extractTextFromNode);
      }
    };

    json.content?.forEach(extractTextFromNode);
    return text.trim();
  } catch (error) {
    console.error('Error parsing article body:', error);
    return '';
  }
};

const KnowledgeBaseCard = ({ knowledgeBase, categories, articles, onOpenBuildWithAI }: KnowledgeBaseCardProps) => {
  const { generationStatus, generatingKbId } = useKnowledgeBaseStore();
  const [isCreateCategoryModalOpen, setIsCreateCategoryModalOpen] = useState(false);
  const [isArticleFlyoutOpen, setIsArticleFlyoutOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [deletingArticle, setDeletingArticle] = useState<Article | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isBuildWithAIModalOpen, setIsBuildWithAIModalOpen] = useState(false);
  const kbCategories = categories.filter((cat) => cat.knowledgebase_id === knowledgeBase.id);
  const kbArticles = articles.filter(
    (article) =>
      categories.find((c) => c.id === article.category_id)?.knowledgebase_id === knowledgeBase.id
  );

  const isGenerating = generatingKbId === knowledgeBase.id && 
    generationStatus && 
    !['completed', 'error'].includes(generationStatus.status);

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
              style={{ backgroundColor: `${knowledgeBase.theme_color}20` }}
            >
              {knowledgeBase.logo_url ? (
                <img src={knowledgeBase.logo_url} alt={knowledgeBase.name} className="w-8 h-8" />
              ) : (
                "📚"
              )}
            </div>
            <div className="pr-4">
              <h2 className="text-xl font-bold">{knowledgeBase.name}</h2>
              <p className="text-base-content/70">{knowledgeBase.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost btn-sm btn-square">
                <EllipsisVerticalIcon className="w-5 h-5" />
              </label>
              <ul tabIndex={0} className="dropdown-content menu p-2 shadow-lg bg-base-100 rounded-box w-52 border border-base-300">
                <li>
                  <button onClick={() => setIsEditModalOpen(true)}>
                    Edit Knowledge Base
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setIsDeleteModalOpen(true)}
                    className="text-error"
                  >
                    Delete Knowledge Base
                  </button>
                </li>
              </ul>
            </div>
            <button 
              className="btn btn-sm"
              onClick={() => setIsBuildWithAIModalOpen(true)}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <span className="loading loading-spinner loading-sm" />
                  {generationStatus.message}
                </>
              ) : (
                <>
                  <SparklesIcon className="w-4 h-4" />
                  Build with AI
                </>
              )}
            </button>
            <Link 
              to={`/help/${knowledgeBase.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-sm"
            >
              <ArrowTopRightOnSquareIcon className="w-4 h-4" />
              Preview
            </Link>
          </div>
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
                      <td>
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{category.emoji_icon}</span>
                          <span>{category.name}</span>
                        </div>
                      </td>
                      <td>
                        {articles.filter((a) => a.category_id === category.id).length}
                      </td>
                      <td>
                        <button 
                          className="btn btn-ghost btn-xs"
                          onClick={() => setEditingCategory(category)}
                        >
                          Edit
                        </button>
                        <button 
                          className="btn btn-ghost btn-xs text-error"
                          onClick={() => setDeletingCategory(category)}
                        >
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
              onClick={handleCreateArticle}
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
                    <th>Last Updated</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {kbArticles.map((article) => (
                    <tr key={article.id}>
                      <td className="font-medium max-w-sm">{article.title}</td>
                      <td className="max-w-sm">
                        <p className="truncate text-base-content/70">
                          {getPlainTextFromJson(article.body)}
                        </p>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <span className="text-xl">
                            {categories.find((c) => c.id === article.category_id)?.emoji_icon}
                          </span>
                          <span>
                            {categories.find((c) => c.id === article.category_id)?.name}
                          </span>
                        </div>
                      </td>
                      <td className="text-base-content/70">
                        {format(new Date(article.last_updated_at), "MMM d, yyyy")}
                      </td>
                      <td>
                        <div className={`badge font-semibold ${
                          article.status === 'published' 
                            ? 'badge-neutral' 
                            : ''
                        } badge-sm`}>
                          {article.status === 'published' ? 'Published' : 'Draft'}
                        </div>
                      </td>
                      <td>
                        <button 
                          className="btn btn-ghost btn-xs"
                          onClick={() => setEditingArticle(article)}
                        >
                          Edit
                        </button>
                        <button 
                          className="btn btn-ghost btn-xs text-error"
                          onClick={() => setDeletingArticle(article)}
                        >
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

      <CreateOrEditCategoryModal 
        isOpen={isCreateCategoryModalOpen}
        isNewCategory
        onClose={() => setIsCreateCategoryModalOpen(false)}
        knowledgeBaseId={knowledgeBase.id}
      />

      {(isArticleFlyoutOpen || editingArticle) && (
        <ArticleFlyout
          isOpen={true}
          onClose={() => {
            setIsArticleFlyoutOpen(false);
            setEditingArticle(null);
          }}
          isNewArticle={!editingArticle}
          article={editingArticle || undefined}
          knowledgeBaseId={knowledgeBase.id}
          categories={kbCategories}
        />
      )}

      {editingCategory && (
        <CreateOrEditCategoryModal
          isOpen={true}
          onClose={() => setEditingCategory(null)}
          category={editingCategory}
          knowledgeBaseId={knowledgeBase.id}
        />
      )}

      {deletingCategory && (
        <DeleteCategoryModal
          isOpen={true}
          onClose={() => setDeletingCategory(null)}
          category={deletingCategory}
        />
      )}

      {deletingArticle && (
        <DeleteArticleModal
          isOpen={true}
          onClose={() => setDeletingArticle(null)}
          article={deletingArticle}
        />
      )}

      {isEditModalOpen && (
        <EditKnowledgeBaseModal
          isOpen={true}
          onClose={() => setIsEditModalOpen(false)}
          knowledgeBase={knowledgeBase}
        />
      )}

      {isDeleteModalOpen && (
        <DeleteKnowledgeBaseModal
          isOpen={true}
          onClose={() => setIsDeleteModalOpen(false)}
          knowledgeBase={knowledgeBase}
        />
      )}

      {isBuildWithAIModalOpen && (
        <BuildWithAIModal
          isOpen={true}
          onClose={() => setIsBuildWithAIModalOpen(false)}
          knowledgeBase={knowledgeBase}
        />
      )}
    </div>
  );
};

export default KnowledgeBaseCard; 