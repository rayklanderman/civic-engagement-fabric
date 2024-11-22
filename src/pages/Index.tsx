import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">
            Your Voice in Kenya's Future
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Participate in your county's legislative process. Make your voice heard on bills and policies that affect your community.
          </p>
          <div className="flex justify-center gap-4">
            <Button 
              size="lg"
              onClick={() => navigate('/counties')}
            >
              Find Your County
            </Button>
            <Button 
              size="lg"
              variant="outline"
              onClick={() => navigate('/bills')}
            >
              View Active Bills
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;