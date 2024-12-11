import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { movieApi } from '../api/movieApi';
import { useState } from 'react';

export default function MovieList() {
  const [page, setPage] = useState(1);
  const { data: movies, isLoading, error, isError } = useQuery({
    queryKey: ['movies', page],
    queryFn: () => movieApi.getMovies(page),
    retry: 1,
    onError: (error) => {
      console.error('Error in MovieList query:', error);
    }
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl text-gray-600">Loading movies...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded p-4 m-4">
        <h3 className="text-lg font-semibold text-red-800">Error Loading Movies</h3>
        <p className="text-red-600">{error.message}</p>
        <p className="text-sm text-gray-600 mt-2">
          Please make sure the backend server is running and accessible.
          Check the console for more details.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Movies</h1>
        <Link
          to="/create"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Movie
        </Link>
      </div>

      {movies?.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">No movies found.</p>
          <Link
            to="/create"
            className="text-blue-500 hover:underline mt-2 inline-block"
          >
            Add your first movie
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {movies?.map((movie) => (
            <Link
              key={movie.id}
              to={`/movies/${movie.id}`}
              className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-semibold mb-2">{movie.title}</h2>
              <p className="text-gray-600">{movie.genre}</p>
              <p className="text-sm text-gray-500 mt-2">
                Directed by {movie.director}
              </p>
            </Link>
          ))}
        </div>
      )}

      <div className="flex justify-center gap-4 mt-6">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={!movies?.length}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}