import AdvancedSearch from "@/components/AdvancedSearch";

const SearchPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-ocean bg-clip-text text-transparent">
            Advanced Marine Search
          </h1>
          <p className="text-xl text-muted-foreground">
            Powerful search and filtering tools for marine biodiversity data
          </p>
        </div>
        
        <AdvancedSearch />
      </div>
    </div>
  );
};

export default SearchPage;