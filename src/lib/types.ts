export type LabStatus = "planned" | "in_progress" | "completed" | "archived";

export interface FisiLab {
  id: string;
  title: string;
  topic: string | null;
  environment: string | null;
  goal: string | null;
  description: string | null;
  status: LabStatus | string | null;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface FisiSystem {
  id: string;
  lab_id: string | null;
  hostname: string;
  os: string | null;
  role: string | null;
  ip_address: string | null;
  gateway: string | null;
  dns: string | null;
  domain_name: string | null;
  services: string[] | string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface FisiCommand {
  id: string;
  command: string;
  platform: string | null;
  category: string | null;
  purpose: string | null;
  example: string | null;
  typical_use_case: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface FisiTroubleshootingCase {
  id: string;
  title: string;
  category: string | null;
  difficulty: string | null;
  symptoms: string | null;
  checks: string | null;
  root_cause: string | null;
  solution: string | null;
  result: string | null;
  created_at: string;
  updated_at: string;
}

export interface FisiDockerService {
  id: string;
  name: string;
  image: string | null;
  port: string | null;
  service_type: string | null;
  status: string | null;
  purpose: string | null;
  compose_snippet: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}
