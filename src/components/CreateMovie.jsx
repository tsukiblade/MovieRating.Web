import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { movieApi } from '../api/movieApi';
import { useState } from 'react';

export default function CreateMovie() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [movie, setMovie] = useState({
    title: '',
    description: '',
    genre: '',
    director: '',
    actors: []
  });

  const createMovieMutation = useMutation({
    mutationFn: movieApi.createMovie,
    onSuccess: () => {
      queryClient.invalidateQueries(['movies']);
      navigate('/');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createMovieMutation.mutate(movie);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Add New Movie</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            value={movie.title}
            onChange={(e) => setMovie({ ...movie, title: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            value={movie.description}
            onChange={(e) => setMovie({ ...movie, description: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            rows="4"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Genre
          </label>
          <input
            type="text"
            value={movie.genre}
            onChange={(e) => setMovie({ ...movie, genre: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Director
          </label>
          <input
            type="text"
            value={movie.director}
            onChange={(e) => setMovie({ ...movie, director: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Actors (comma-separated)
          </label>
          <input
            type="text"
            value={movie.actors.join(', ')}
            onChange={(e) =>
              setMovie({
                ...movie,
                actors: e.target.value.split(',').map((actor) => actor.trim())
              })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          disabled={createMovieMutation.isLoading}
        >
          Create Movie
        </button>
      </form>
    </div>
  );
}