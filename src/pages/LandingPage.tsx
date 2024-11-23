import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BillsSelectionDialog } from "@/components/dialogs/BillsSelectionDialog";
import { CountySelectionDialog } from "@/components/dialogs/CountySelectionDialog";
import { ContactForm } from "@/components/ContactForm";
import { Header } from "@/components/Header";

export function LandingPage() {
  const [billsDialogOpen, setBillsDialogOpen] = useState(false);
  const [countyDialogOpen, setCountyDialogOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-blue-600 text-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Your Voice in Governance
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-100 md:text-xl">
                  Participate in shaping Kenya's future through active engagement in
                  legislative processes at both national and county levels.
                </p>
              </div>
              <div className="space-x-4">
                <Button
                  className="px-8 bg-white text-blue-600 hover:bg-gray-100"
                  onClick={() => setBillsDialogOpen(true)}
                >
                  Track National & County Bills
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
              {/* Interactive Map */}
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl text-blue-600">
                    Interactive Map
                  </h2>
                  <p className="max-w-[600px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Explore bills and public participation opportunities across all
                    counties in Kenya.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button
                    className="inline-flex bg-blue-600 hover:bg-blue-700"
                    onClick={() => navigate('/map')}
                  >
                    Open Map
                  </Button>
                </div>
              </div>

              {/* Public Participation */}
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl text-blue-600">
                    Public Participation
                  </h2>
                  <p className="max-w-[600px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Submit your views and contribute to the legislative process in
                    your county.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button
                    className="inline-flex bg-blue-600 hover:bg-blue-700"
                    onClick={() => setCountyDialogOpen(true)}
                  >
                    Participate Now
                  </Button>
                </div>
              </div>

              {/* Analytics */}
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl text-blue-600">
                    Analytics
                  </h2>
                  <p className="max-w-[600px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Track the progress of bills and view public opinion statistics.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button
                    className="inline-flex bg-blue-600 hover:bg-blue-700"
                    onClick={() => navigate('/statistics')}
                  >
                    View Analytics
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="space-y-2 text-center">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-blue-600">
                  Contact Us
                </h2>
                <p className="max-w-[600px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Have questions or feedback? We'd love to hear from you.
                </p>
              </div>
              <ContactForm />
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-6 bg-gray-800 text-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <p className="text-sm text-gray-300">
              &copy; 2024 Sauti ya Wananchi. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      <BillsSelectionDialog
        isOpen={billsDialogOpen}
        onClose={() => setBillsDialogOpen(false)}
      />
      <CountySelectionDialog
        isOpen={countyDialogOpen}
        onClose={() => setCountyDialogOpen(false)}
      />
    </div>
  );
}
