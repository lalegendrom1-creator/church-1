export interface Program {
  id: string;
  title: string;
  description: string | null;
  program_date: string;
  day_name: string;
  start_time: string;
  location: string;
  status: 'published' | 'draft';
  created_at: string;
  updated_at: string;
}

export interface ProgramInput {
  title: string;
  description: string | null;
  program_date: string;
  day_name: string;
  start_time: string;
  location: string;
  status: 'published' | 'draft';
}
