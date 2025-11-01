import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-discord-dark to-discord-darker flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
          <span className="text-5xl font-bold text-primary">404</span>
        </div>
        <h1 className="text-4xl font-bold text-white mb-2">Page Not Found</h1>
        <p className="text-discord-muted mb-8">
          Oops! We couldn't find the page you're looking for. It might have been moved or deleted.
        </p>
        <Link to="/">
          <Button className="bg-primary hover:bg-primary/90 text-white gap-2">
            <Home className="w-4 h-4" />
            Return Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
