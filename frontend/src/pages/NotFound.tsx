
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import PageTransition from "@/components/shared/PageTransition";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="container px-4 py-20 flex flex-col items-center text-center">
            <div className="text-9xl font-bold text-accent/30 mb-8">404</div>
            <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
            <p className="text-muted-foreground mb-8 max-w-md">
              The page you are looking for doesn't exist or has been moved.
            </p>
            <Button asChild size="lg">
              <Link to="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default NotFound;
