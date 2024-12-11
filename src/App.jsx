import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MovieList from './components/MovieList';
import MovieDetail from './components/MovieDetail';
import CreateMovie from './components/CreateMovie';
import Navigation from './components/Navigation';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Navigation />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<MovieList />} />
              <Route path="/movies/:id" element={<MovieDetail />} />
              <Route path="/create" element={<CreateMovie />} />
            </Routes>
          </main>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;