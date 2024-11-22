import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ContactForm } from "@/components/ContactForm";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 text-green-700">
              Sauti ya Wananchi
            </h1>
            <p className="text-xl mb-6 text-gray-600">
              Your Voice in County Governance
            </p>
            <div className="border-l-4 border-red-600 pl-4 mb-8 text-left">
              <p className="text-lg text-gray-700">
                Welcome to Sauti ya Wananchi, Kenya's premier civic engagement platform. 
                We connect citizens with their county governments, making local governance 
                more transparent and accessible.
              </p>
            </div>
          </div>

          {/* Features Section */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="p-6 bg-white rounded-lg shadow-md border-t-4 border-black">
              <h3 className="text-lg font-semibold mb-2">Track County Bills</h3>
              <p className="text-gray-600">
                Stay informed about legislative developments in your county.
              </p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md border-t-4 border-red-600">
              <h3 className="text-lg font-semibold mb-2">Interactive Map</h3>
              <p className="text-gray-600">
                Explore Kenya's 47 counties and their governance structures.
              </p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md border-t-4 border-green-700">
              <h3 className="text-lg font-semibold mb-2">Public Participation</h3>
              <p className="text-gray-600">
                Engage with your county government and make your voice heard.
              </p>
            </div>
          </div>

          {/* Contact Form Section */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-8 text-center">Get in Touch</h2>
            <ContactForm />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;