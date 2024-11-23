import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function Header() {
  const navigate = useNavigate();

  return (
    <header className="border-b bg-black">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 
            onClick={() => navigate('/')}
            className="text-2xl font-bold text-white cursor-pointer hover:text-[#BB0000]"
          >
            Sauti ya Wananchi
          </h1>
        </div>
        <nav className="flex items-center space-x-4">
          <Button 
            variant="ghost"
            onClick={() => navigate('/counties')}
            className="text-white hover:text-[#006600] hover:bg-white"
          >
            Counties
          </Button>
          <Button 
            variant="ghost"
            onClick={() => navigate('/bills')}
            className="text-white hover:text-[#006600] hover:bg-white"
          >
            Bills
          </Button>
          <Button 
            variant="ghost"
            onClick={() => navigate('/statistics')}
            className="text-white hover:text-[#006600] hover:bg-white"
          >
            Statistics
          </Button>
        </nav>
      </div>
    </header>
  );
}