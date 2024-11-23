import { Card } from "@/components/ui/card";
import { BillAnalytics } from "./BillAnalytics";

export function Statistics() {
  return (
    <div className="space-y-8">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-white shadow-lg">
          <h3 className="text-lg font-semibold mb-2 text-[#BB0000]">Total Participants</h3>
          <p className="text-4xl font-bold text-black">12,458</p>
          <p className="text-sm text-gray-600 mt-2">Active citizens engaged in legislative processes</p>
        </Card>
        <Card className="p-6 bg-white shadow-lg">
          <h3 className="text-lg font-semibold mb-2 text-[#BB0000]">Active Bills</h3>
          <p className="text-4xl font-bold text-black">47</p>
          <p className="text-sm text-gray-600 mt-2">Bills currently under review across counties</p>
        </Card>
        <Card className="p-6 bg-white shadow-lg">
          <h3 className="text-lg font-semibold mb-2 text-[#BB0000]">Counties Engaged</h3>
          <p className="text-4xl font-bold text-black">47</p>
          <p className="text-sm text-gray-600 mt-2">Counties actively participating in the platform</p>
        </Card>
      </div>

      {/* Bill Analytics */}
      <Card className="p-6 bg-white shadow-lg">
        <h3 className="text-xl font-semibold mb-4 text-[#BB0000]">Bill Analytics</h3>
        <BillAnalytics />
      </Card>

      {/* County Participation */}
      <Card className="p-6 bg-white shadow-lg">
        <h3 className="text-xl font-semibold mb-4 text-[#BB0000]">Top Participating Counties</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-medium">Nairobi</span>
            <div className="flex-1 mx-4">
              <div className="h-2 bg-gray-200 rounded">
                <div className="h-full bg-[#006600] rounded" style={{ width: '85%' }}></div>
              </div>
            </div>
            <span className="text-sm text-gray-600">85%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-medium">Mombasa</span>
            <div className="flex-1 mx-4">
              <div className="h-2 bg-gray-200 rounded">
                <div className="h-full bg-[#006600] rounded" style={{ width: '78%' }}></div>
              </div>
            </div>
            <span className="text-sm text-gray-600">78%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-medium">Kisumu</span>
            <div className="flex-1 mx-4">
              <div className="h-2 bg-gray-200 rounded">
                <div className="h-full bg-[#006600] rounded" style={{ width: '72%' }}></div>
              </div>
            </div>
            <span className="text-sm text-gray-600">72%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-medium">Nakuru</span>
            <div className="flex-1 mx-4">
              <div className="h-2 bg-gray-200 rounded">
                <div className="h-full bg-[#006600] rounded" style={{ width: '68%' }}></div>
              </div>
            </div>
            <span className="text-sm text-gray-600">68%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-medium">Kiambu</span>
            <div className="flex-1 mx-4">
              <div className="h-2 bg-gray-200 rounded">
                <div className="h-full bg-[#006600] rounded" style={{ width: '65%' }}></div>
              </div>
            </div>
            <span className="text-sm text-gray-600">65%</span>
          </div>
        </div>
      </Card>
    </div>
  );
}