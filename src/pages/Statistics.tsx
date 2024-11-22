import { Header } from "@/components/Header";
import { Statistics as StatsComponent } from "@/components/Statistics";

const Statistics = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Participation Statistics</h1>
        <StatsComponent />
      </main>
    </div>
  );
};

export default Statistics;