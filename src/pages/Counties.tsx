import { Header } from "@/components/Header";
import { CountyMap } from "@/components/CountyMap";

const Counties = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <CountyMap />
      </main>
    </div>
  );
};

export default Counties;