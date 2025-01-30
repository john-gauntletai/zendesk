import { useOutletContext, Link, useParams } from "react-router";
import { KnowledgeBase, Category, Article } from "../../types";

interface HelpCenterOutletContext {
  knowledgeBase: KnowledgeBase;
  categories: Category[];
  articles: Article[];
}

const HelpCenterAllCategories = () => {
  const { kbId } = useParams();
  const { categories, articles } = useOutletContext<HelpCenterOutletContext>();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {categories.map(category => {
        const categoryArticles = articles.filter(
          article => article.category_id === category.id
        );

        return (
          <Link
            key={category.id}
            to={`/help/${kbId}/category/${category.id}`}
            className="card bg-base-100 hover:shadow-md transition-shadow border border-base-300"
          >
            <div className="card-body">
              <div className="flex items-start gap-4">
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center text-3xl bg-base-200"
                >
                  {category.emoji_icon}
                </div>
                <div>
                  <h2 className="card-title mb-1">{category.name}</h2>
                  <div className="text-sm text-base-content/70">
                    {categoryArticles.length} articles
                  </div>
                </div>
              </div>
            </div>
          </Link>
        );
      })}

      {categories.length === 0 && (
        <div className="col-span-full text-center py-12 text-base-content/70">
          No categories found
        </div>
      )}
    </div>
  );
};

export default HelpCenterAllCategories;
