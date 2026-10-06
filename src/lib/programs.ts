import { supabase } from '@/lib/supabase';
import type { Program, ProgramInput } from '@/types';

export async function fetchPublishedPrograms(): Promise<Program[]> {
  const { data, error } = await supabase
    .from('programs')
    .select('*')
    .eq('status', 'published')
    .order('program_date', { ascending: true })
    .order('start_time', { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function fetchAllPrograms(): Promise<Program[]> {
  const { data, error } = await supabase
    .from('programs')
    .select('*')
    .order('program_date', { ascending: true })
    .order('start_time', { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function createProgram(input: ProgramInput): Promise<Program> {
  const { data, error } = await supabase
    .from('programs')
    .insert(input)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateProgram(id: string, input: Partial<ProgramInput>): Promise<Program> {
  const { data, error } = await supabase
    .from('programs')
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteProgram(id: string): Promise<void> {
  const { error } = await supabase
    .from('programs')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
