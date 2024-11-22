import { Card } from "@/components/ui/card";

export function Statistics() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-2">Total Participants</h3>
        <p className="text-4xl font-bold text-primary">12,458</p>
      </Card>
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-2">Active Bills</h3>
        <p className="text-4xl font-bold text-primary">47</p>
      </Card>
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-2">Counties Engaged</h3>
        <p className="text-4xl font-bold text-primary">47</p>
      </Card>
    </div>
  );
}