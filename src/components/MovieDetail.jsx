import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { movieApi } from '../api/movieApi';
import { useState } from 'react';

export default function MovieDetail() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [comment, setComment] = useState({
    username: '',
    title: '',
    content: '',
    rating: 5
  });

  const { data: movie, isLoading, error } = useQuery({
    queryKey: ['movie', id],
    queryFn: () => movieApi.getMovie(id)
  });

  const addCommentMutation = useMutation({
    mutationFn: (commentData) => movieApi.addComment(id, commentData),
    onSuccess: () => {
      queryClient.invalidateQueries(['movie', id]);
      setComment({ username: '', title: '', content: '', rating: 5 });
    }
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const handleSubmitComment = (e) => {
    e.preventDefault();
    addCommentMutation.mutate(comment);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white p-6 rounded-lg shadow">
        <h1 className="text-3xl font-bold mb-4">{movie.title}</h1>
        <p className="text-gray-600 mb-4">{movie.description}</p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h2 className="font-semibold">Genre</h2>
            <p>{movie.genre}</p>
          </div>
          <div>
            <h2 className="font-semibold">Director</h2>
            <p>{movie.director}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">Comments</h2>
        <form onSubmit={handleSubmitComment} className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              value={comment.username}
              onChange={(e) =>
                setComment({ ...comment, username: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              value={comment.title}
              onChange={(e) => setComment({ ...comment, title: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Comment
            </label>
            <textarea
              value={comment.content}
              onChange={(e) =>
                setComment({ ...comment, content: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              rows="4"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Rating (1-5)
            </label>
            <input
              type="number"
              min="1"
              max="5"
              value={comment.rating}
              onChange={(e) =>
                setComment({ ...comment, rating: parseInt(e.target.value) })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            disabled={addCommentMutation.isLoading}
          >
            Add Comment
          </button>
        </form>

        <div className="space-y-4">
          {movie.comments?.map((comment) => (
            <div
              key={comment.id}
              className="border-b border-gray-200 pb-4 last:border-0"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{comment.title}</h3>
                  <p className="text-sm text-gray-500">by {comment.username}</p>
                </div>
                <div className="text-yellow-500">
                  {'★'.repeat(comment.rating)}
                  {'☆'.repeat(5 - comment.rating)}
                </div>
              </div>
              <p className="mt-2 text-gray-600">{comment.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}