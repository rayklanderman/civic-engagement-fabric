import { Header } from "@/components/Header";
import { CountyMap } from "@/components/CountyMap";
import { CountyList } from "@/components/CountyList";

const Counties = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <CountyMap />
          </div>
          <div>
            <CountyList />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Counties;