import { useParams, useOutletContext, Link } from "react-router";
import { generateHTML } from "@tiptap/html";
import StarterKit from "@tiptap/starter-kit";
import { format } from "date-fns";
import { KnowledgeBase, Category, Article } from "../../types";
import { useUserStore } from "../../store";
import Avatar from "../__shared/Avatar";

interface HelpCenterOutletContext {
  knowledgeBase: KnowledgeBase;
  categories: Category[];
  articles: Article[];
}

const isMoreThanDayDifferent = (date1: string, date2: string) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 1;
};

const HelpCenterArticle = () => {
  const { articleId, kbId } = useParams();
  const { categories, articles } = useOutletContext<HelpCenterOutletContext>();
  const { users } = useUserStore();

  const article = articles.find(a => a.id === articleId);
  const category = categories.find(c => c?.id === article?.category_id);
  const lastUpdatedBy = users.find(u => u.id === article?.last_updated_by);

  if (!article || !category) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-base-content/70">
          Article Not Found
        </h2>
      </div>
    );
  }

  const articleHtml = generateHTML(JSON.parse(article.body), [
    StarterKit,
  ]);

  return (
    <div>
      {/* Breadcrumbs */}
      <div className="text-sm breadcrumbs mb-8">
        <ul>
          <li>
            <Link to={`/help/${kbId}`}>Home</Link>
          </li>
          <li>
            <Link to={`/help/${kbId}/category/${category.id}`}>
              <span className="inline-block mr-1">{category.emoji_icon}</span>
              {category.name}
            </Link>
          </li>
          <li className="text-base-content/50">{article.title}</li>
        </ul>
      </div>

      {/* Article Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
        <p className="text-xl text-base-content/70 mb-6">
          {article.description}
        </p>
        <div className="flex items-center gap-4 text-sm text-base-content/50">
          <div className="flex items-center gap-2">
            <span>
              {format(new Date(article.created_at), "MMM d, yyyy")}
            </span>
          </div>
          {isMoreThanDayDifferent(article.created_at, article.last_updated_at) && (
            <>
              <div className="flex items-center gap-2">
                <span>•</span>
              </div>
              <div className="flex items-center gap-2">
                <span>
                  Last Updated {format(new Date(article.last_updated_at), "MMM d, yyyy")}
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Article Content */}
      <div 
        className="prose prose-base sm:prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: articleHtml }}
      />
    </div>
  );
};

export default HelpCenterArticle;
