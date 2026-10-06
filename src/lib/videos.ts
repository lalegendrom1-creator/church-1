import { supabase } from '@/lib/supabase';
import type { Video, VideoInput } from '@/types';

export async function fetchPublishedVideos(): Promise<Video[]> {
  const { data, error } = await supabase
    .from('videos')
    .select('*')
    .eq('status', 'published')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function fetchAllVideos(): Promise<Video[]> {
  const { data, error } = await supabase
    .from('videos')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function createVideo(input: VideoInput): Promise<Video> {
  const { data, error } = await supabase
    .from('videos')
    .insert(input)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateVideo(id: string, input: Partial<VideoInput>): Promise<Video> {
  const { data, error } = await supabase
    .from('videos')
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteVideo(id: string): Promise<void> {
  const { error } = await supabase
    .from('videos')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
