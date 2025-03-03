import * as React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Heading from "@/lib/all-site/Heading";

const FormSection = ({ title, children }) => {
  return (
    <Card className="w-full shadow-md border border-gray-100 bg-white/95 backdrop-blur-sm">
      <CardHeader className="pb-2 border-b">
        <Heading
          text={title}
          center={true}
          size="sm"
          hasMargin={false}
        />
      </CardHeader>
      <CardContent className="pt-6">
        {children}
      </CardContent>
    </Card>
  );
};

export default FormSection;