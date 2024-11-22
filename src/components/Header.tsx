import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function Header() {
  const navigate = useNavigate();

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 
            onClick={() => navigate('/')}
            className="text-2xl font-bold text-primary cursor-pointer"
          >
            Sauti ya Wananchi
          </h1>
        </div>
        <nav className="flex items-center space-x-4">
          <Button 
            variant="ghost"
            onClick={() => navigate('/counties')}
          >
            Counties
          </Button>
          <Button 
            variant="ghost"
            onClick={() => navigate('/bills')}
          >
            Bills
          </Button>
          <Button 
            variant="ghost"
            onClick={() => navigate('/statistics')}
          >
            Statistics
          </Button>
        </nav>
      </div>
    </header>
  );
}