
import { useNavigate } from "react-router-dom";
import { ShieldX, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageTransition from "@/components/shared/PageTransition";
import { useIsMobile } from "@/hooks/use-mobile";

const Unauthorized = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-grow pt-16 md:pt-24 flex items-center justify-center px-4">
          <div className="container max-w-md mx-auto text-center py-8 md:py-12">
            <ShieldX className={`${isMobile ? 'h-16 w-16' : 'h-20 w-20'} text-destructive mx-auto mb-6`} />
            <h1 className="text-2xl md:text-3xl font-bold mb-4">Access Denied</h1>
            <p className="text-muted-foreground mb-8 text-sm md:text-base">
              You don't have permission to access this page. Please contact an administrator if you believe this is an error.
            </p>
            <Button onClick={() => navigate("/")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default Unauthorized;
