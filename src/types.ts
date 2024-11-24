export interface County {
  id: number;
  name: string;
  capital: string;
  population: number;
  area: number;
  governor: string;
  bills?: Bill[];
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface Bill {
  id: number;
  title: string;
  description: string;
  type: "national" | "county";
  status: "draft" | "in_progress" | "passed" | "rejected";
  county?: string;
  created_at: string;
  updated_at: string;
  votes?: {
    yes: number;
    no: number;
    abstain: number;
  };
  comments?: Comment[];
}

export interface Comment {
  id: number;
  content: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  votes: {
    up: number;
    down: number;
  };
}
