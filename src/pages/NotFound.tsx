
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4 max-w-md px-6">
        <h1 className="text-6xl font-bold text-brand-green">404</h1>
        <p className="text-xl text-foreground mb-4">Oops! This page doesn't exist</p>
        <p className="text-muted-foreground">
          The page you're looking for may have been moved or deleted.
        </p>
        <Button asChild className="mt-4 bg-brand-green hover:bg-brand-green-dark">
          <Link to="/" className="inline-flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Return to Dashboard
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
