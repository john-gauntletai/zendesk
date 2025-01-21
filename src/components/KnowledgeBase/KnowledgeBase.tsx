const KnowledgeBase = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Knowledge Base</h1>
      <div className="grid gap-4">
        {[1, 2, 3].map((item) => (
          <div key={item} className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Article {item}</h2>
              <div className="h-24 animate-pulse bg-base-300 rounded-lg"></div>
              <div className="card-actions justify-end">
                <button className="btn btn-primary">View</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KnowledgeBase;
