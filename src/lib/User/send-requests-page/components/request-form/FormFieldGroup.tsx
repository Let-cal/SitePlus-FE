import * as React from "react";

const FormFieldGroup = ({ children, cols = 1, gap = "gap-4" }) => {
  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-3",
    4: "grid-cols-2 md:grid-cols-4",
  };

  return (
    <div className={`grid ${gridCols[cols]} ${gap} mb-6`}>
      {children}
    </div>
  );
};

export default FormFieldGroup;