import { useState } from "react";
import axios from "axios";

// Define types for the response and error
const DiseaseApi = () => {
  const [query, setQuery] = useState(""); // Search query
  const [results, setResults] = useState([]); // API results
  const [error, setError] = useState(null); // Error handling
  const [loading, setLoading] = useState(false); // Loading state

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const url = `https://www.ebi.ac.uk/ols4/api/select?q=${query}&ontology=efo,mondo&rows=20&start=0&format=json`;
      const response = await axios.get(url);
      const data = response.data.response.docs; // Accessing the relevant data
      setResults(data);
      setLoading(false);
    } catch (err) {
      setError(
        err?.response?.data?.message || err.message || "An error occurred"
      );
      setResults([]);
      setLoading(false);
    }
  };

  return (
    <div className="p-5">
      <h1 className="text-2xl font-semibold mb-4">Search Diseases</h1>
      <form onSubmit={handleSearch} className="flex mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a disease..."
          className="border p-2 rounded-l-md w-64 text-black"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded-r-md ml-2 hover:bg-blue-600"
        >
          Search
        </button>
      </form>

      {loading && <p className="text-blue-500">Loading...</p>}

      {error && <p className="text-red-500">{error}</p>}

      <div className="mt-4">
        {results.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.map((result, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-md flex flex-col gap-2"
              >
                <h3 className="text-xl font-semibold mb-2 uppercase">
                  {result.label}
                </h3>
                <div className="text-gray-700">
                  <strong>Latest Article: </strong>
                  <a href={result.iri} target="_blank">
                    {result.iri}
                  </a>
                </div>

                <p className="text-gray-700">
                  <strong>Description:</strong> {result.description}
                </p>

                <p className="text-gray-700">
                  <strong>OBO ID:</strong> {result.obo_id}
                </p>
              </div>
            ))}
          </div>
        ) : (
          !loading && <p>No results found</p> // Prevent showing "No results" during loading
        )}
      </div>
    </div>
  );
};

export default DiseaseApi;