export interface Brand {
    id: number;
    name: string;
    status: number;
    industryCategories: IndustryCategory[];
    customerSegments: CustomerSegment[];
  }

export interface IndustryCategory {
    id: number;
    industryId: number;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface CustomerSegment {
    id: number;
    name: string;
    industryId: number;
    description: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface Industry {
    id: number;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
  }