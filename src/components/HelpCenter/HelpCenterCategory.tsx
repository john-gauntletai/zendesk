import { useParams, useOutletContext, useNavigate } from "react-router";
import { format } from "date-fns";
import { KnowledgeBase, Category, Article } from "../../types";
import { useUserStore } from "../../store";
import Avatar from "../__shared/Avatar";

interface HelpCenterOutletContext {
  knowledgeBase: KnowledgeBase;
  categories: Category[];
  articles: Article[];
}

const HelpCenterCategory = () => {
  const { kbId, categoryId } = useParams();
  const { categories, articles } = useOutletContext<HelpCenterOutletContext>();
  const { users } = useUserStore();
  const navigate = useNavigate();
  const category = categories.find((cat) => cat.id === categoryId);
  const categoryArticles = articles.filter(
    (article) => article.category_id === categoryId
  );

  if (!category) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-base-content/70">
          Category Not Found
        </h2>
      </div>
    );
  }

  return (
    <div>
      {/* Category Header */}
      <div className="flex items-center gap-3 mb-8">
        <span className="text-3xl">{category.emoji_icon}</span>
        <h2 className="text-2xl font-bold">{category.name}</h2>
      </div>

      {/* Articles List */}
      <div className="grid gap-6">
        {categoryArticles.map((article) => {
          const lastUpdatedBy = users.find(
            (u) => u.id === article.last_updated_by
          );

          return (
            <div
              key={article.id}
              className="card bg-base-100 hover:shadow-md transition-shadow border border-base-300 cursor-pointer"
              onClick={() => navigate(`/help/${kbId}/article/${article.id}`)}
            >
              <div className="card-body">
                <h3 className="card-title text-xl mb-2">{article.title}</h3>
                <p className="text-base-content/70 mb-4">
                  {article.description}
                </p>
                <div className="flex items-center gap-2 text-sm text-base-content/50">
                  <div className="flex items-center gap-2">
                    <span>
                      Updated{" "}
                      {format(new Date(article.last_updated_at), "MMM d, yyyy")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {categoryArticles.length === 0 && (
          <div className="text-center py-12 text-base-content/70">
            No articles in this category yet
          </div>
        )}
      </div>
    </div>
  );
};

export default HelpCenterCategory;
