import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
        Instant Commerce
      </h1>
      <div className="space-x-4">
        <Link to="/auth" className="text-purple-600 underline">Sign In</Link>
        <Link to="/start-store" className="text-purple-600 underline">Start a Store</Link>
      </div>
    </div>
  );
};

export default Home;
