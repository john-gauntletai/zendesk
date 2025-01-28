import { format } from "date-fns";
import { PlusIcon } from "@heroicons/react/24/outline";
import { KnowledgeBase, Category, Article } from "../../types";

interface KnowledgeBaseCardProps {
  knowledgeBase: KnowledgeBase;
  categories: Category[];
  articles: Article[];
}

const KnowledgeBaseCard = ({ knowledgeBase: kb, categories, articles }: KnowledgeBaseCardProps) => {
  return (
    <div className="card bg-base-100 shadow-lg border border-base-300">
      <div className="card-body">
        {/* Knowledge Base Header */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-2xl">
              📚
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
            <button className="btn btn-sm btn-ghost">
              <PlusIcon className="w-4 h-4 mr-2" />
              Add Category
            </button>
          </div>
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
                {categories
                  .filter((cat) => cat.knowledge_base_id === kb.id)
                  .map((category) => (
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
        </div>

        {/* Articles Section */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Articles</h3>
            <button className="btn btn-sm btn-ghost">
              <PlusIcon className="w-4 h-4 mr-2" />
              New Article
            </button>
          </div>
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
                {articles
                  .filter(
                    (article) =>
                      categories.find((c) => c.id === article.category_id)
                        ?.knowledge_base_id === kb.id
                  )
                  .map((article) => (
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
        </div>
      </div>
    </div>
  );
};

export default KnowledgeBaseCard; 