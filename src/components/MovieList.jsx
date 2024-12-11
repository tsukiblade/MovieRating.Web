import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { movieApi } from '../api/movieApi';
import { useState } from 'react';

export default function MovieList() {
  const [page, setPage] = useState(1);
  const { data: movies, isLoading, error } = useQuery({
    queryKey: ['movies', page],
    queryFn: () => movieApi.getMovies(page)
  });

  if (isLoading) return <div data-testid="loading">Loading...</div>;
  if (error) return <div data-testid="error">Error: {error.message}</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold" data-testid="movies-title">Movies</h1>
        <Link
          to="/create"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          data-testid="add-movie-button"
        >
          Add Movie
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="movies-grid">
        {movies?.map((movie) => (
          <Link
            key={movie.id}
            to={`/movies/${movie.id}`}
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
            data-testid={`movie-card-${movie.id}`}
          >
            <h2 className="text-xl font-semibold mb-2" data-testid={`movie-title-${movie.id}`}>{movie.title}</h2>
            <p className="text-gray-600" data-testid={`movie-genre-${movie.id}`}>{movie.genre}</p>
            <p className="text-sm text-gray-500 mt-2" data-testid={`movie-director-${movie.id}`}>
              Directed by {movie.director}
            </p>
          </Link>
        ))}
      </div>

      <div className="flex justify-center gap-4 mt-6" data-testid="pagination">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          data-testid="prev-page"
        >
          Previous
        </button>
        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={!movies?.length}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          data-testid="next-page"
        >
          Next
        </button>
      </div>
    </div>
  );
}