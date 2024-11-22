import { Header } from "@/components/Header";
import { BillsList } from "@/components/BillsList";

const Bills = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <BillsList />
      </main>
    </div>
  );
};

export default Bills;