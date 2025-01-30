import { useEffect, createContext, useContext, useState } from "react";
import { useParams, Outlet, useLocation, Link } from "react-router";
import { MagnifyingGlassIcon, CommandLineIcon } from "@heroicons/react/24/outline";
import { useKnowledgeBaseStore } from "../../store";
import { KnowledgeBase, Category, Article } from "../../types";

interface HelpCenterContextType {
  knowledgeBase: KnowledgeBase | null;
  categories: Category[];
  articles: Article[];
  isLoading: boolean;
}

export const HelpCenterContext = createContext<HelpCenterContextType>({
  knowledgeBase: null,
  categories: [],
  articles: [],
  isLoading: true,
});

export const useHelpCenter = () => useContext(HelpCenterContext);

const getContrastTextColor = (bgColor: string) => {
  // Remove the '#' if present
  const hex = bgColor.replace('#', '');
  
  // Convert hex to RGB
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  // Calculate relative luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  const theme = document.documentElement.getAttribute('data-theme');
  if (theme && theme !== 'light') {
    return luminance > 0.5 ? 'text-base-100' : 'text-base-content';
  };

  // Return white for dark backgrounds, black for light backgrounds
  return luminance > 0.5 ? 'text-base-content' : 'text-base-100';
};

const HelpCenter = () => {
  const { kbId } = useParams();
  const location = useLocation();
  const {
    fetchKnowledgeBaseById,
    fetchCategoriesByKnowledgeBaseId,
    fetchArticlesByKnowledgeBaseId,
  } = useKnowledgeBaseStore();

  const [isLoading, setIsLoading] = useState(true);
  const [knowledgeBase, setKnowledgeBase] = useState<KnowledgeBase | null>(
    null
  );
  const [categories, setCategories] = useState<Category[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const isHomePage =
    !location.pathname.includes("category") &&
    !location.pathname.includes("article");

  const filteredArticles = searchQuery
    ? articles.filter((article) =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  useEffect(() => {
    const loadData = async () => {
      if (!kbId) return;

      setIsLoading(true);
      try {
        const [kb, cats, arts] = await Promise.all([
          fetchKnowledgeBaseById(kbId),
          fetchCategoriesByKnowledgeBaseId(kbId),
          fetchArticlesByKnowledgeBaseId(kbId),
        ]);

        setKnowledgeBase(kb);
        setCategories(cats || []);
        setArticles(arts?.filter((art) => art.status === "published") || []);
      } catch (error) {
        console.error("Error loading help center data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [
    kbId,
    fetchKnowledgeBaseById,
    fetchCategoriesByKnowledgeBaseId,
    fetchArticlesByKnowledgeBaseId,
  ]);

  return (
    <div className="min-h-screen bg-base-100">
      {/* Themed Header Section */}
      <div
        className={`border-b border-base-300/50 ${
          knowledgeBase?.theme_color 
            ? getContrastTextColor(knowledgeBase.theme_color)
            : 'text-base-content'
        }`}
        style={{
          backgroundColor: knowledgeBase?.theme_color
            ? `${knowledgeBase.theme_color}`
            : undefined,
        }}
      >
        {/* Navigation Bar */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <Link 
              to={`/help/${kbId}`}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              {knowledgeBase?.logo_url ? (
                <img
                  src={knowledgeBase.logo_url}
                  alt={knowledgeBase.name}
                  className="w-8 h-8"
                />
              ) : (
                <div
                  className="w-8 h-8 rounded flex items-center justify-center text-xl"
                  style={{ backgroundColor: `${knowledgeBase?.theme_color}` }}
                >
                  📚
                </div>
              )}
              <span className="font-semibold">
                {knowledgeBase?.name ? (
                  <>
                    {knowledgeBase.name}
                    <span className="opacity-60"> | Help Center</span>
                  </>
                ) : (
                  "Help Center"
                )}
              </span>
            </Link>
          </div>
        </div>

        {/* Header Content */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col items-start">
            {isHomePage && knowledgeBase?.description && (
              <p className="text-2xl font-semibold my-8">
                {knowledgeBase.description}
              </p>
            )}

            {/* Search Bar */}
            <div className="w-full">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 opacity-50" />
                </div>
                <input
                  type="text"
                  placeholder="Search for articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input bg-white/10 border-white/10 w-full pl-10 placeholder:text-inherit placeholder:opacity-50"
                />

                {/* Search Results Dropdown */}
                {searchQuery && (
                  <div className="absolute mt-2 w-full bg-base-100 text-base-content rounded-lg shadow-lg border border-base-300 max-h-96 overflow-y-auto z-50">
                    {filteredArticles.length > 0 ? (
                      <div className="py-2">
                        {filteredArticles.map((article) => {
                          const category = categories.find(
                            (c) => c.id === article.category_id
                          );

                          return (
                            <Link
                              key={article.id}
                              to={`/help/${kbId}/article/${article.id}`}
                              className="flex items-start gap-3 px-4 py-3 hover:bg-base-200"
                              onClick={() => setSearchQuery("")}
                            >
                              <div className="flex-1 min-w-0">
                                <div className="font-medium mb-1 truncate">
                                  {article.title}
                                </div>
                                {category && (
                                  <div className="flex items-center gap-1.5 text-sm text-base-content/70">
                                    <span>{category.emoji_icon}</span>
                                    <span>{category.name}</span>
                                  </div>
                                )}
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="px-4 py-3 text-base-content/70">
                        No articles found
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-5xl min-h-96 mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg" />
          </div>
        ) : !knowledgeBase ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-base-content/70">
              Knowledge Base Not Found
            </h2>
          </div>
        ) : (
          <Outlet context={{ knowledgeBase, categories, articles }} />
        )}
      </main>
      <footer className="border-t border-base-300/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center">
            <p className="text-sm text-base-content/70">
              &copy; {new Date().getFullYear()} {knowledgeBase?.name}
            </p>
            <div className="flex items-center gap-2 text-sm text-base-content/70">
              <span>Powered by</span>
              <div className="flex items-center gap-1">
                <CommandLineIcon className="w-4 h-4" />
                <span className="font-medium">Superhero</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HelpCenter;
