import React from 'react';
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

export const FallbackMap: React.FC = () => {
  return (
    <Card className="w-full h-[600px] relative p-6 flex items-center justify-center">
      <Alert variant="destructive" className="max-w-md">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Map Loading Error</AlertTitle>
        <AlertDescription>
          Unable to load the interactive map. This might be due to WebGL support issues in your browser.
          Try using a modern browser or enabling hardware acceleration.
        </AlertDescription>
      </Alert>
    </Card>
  );
};
