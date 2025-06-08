import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
        Instant Commerce
      </h1>
      <div className="flex space-x-4">
        <Button
          asChild
          className="h-9 text-sm bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
        >
          <Link to="/auth">Sign In</Link>
        </Button>
        <Button
          asChild
          variant="outline"
          className="h-9 text-sm border-purple-300 hover:bg-purple-50"
        >
          <Link to="/start-store">Start a Store</Link>
        </Button>
      </div>
    </div>
  );
};

export default Home;
