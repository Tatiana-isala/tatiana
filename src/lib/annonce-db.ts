// annonce-db.ts
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

const SUPABASE_URL = 'https://whyxuyvjncluurhmrvhh.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndoeXh1eXZqbmNsdXVyaG1ydmhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyNzI3MDcsImV4cCI6MjA2Nzg0ODcwN30.-GopatABM3yyZAezW6KBUr3OEDTi5R5JpJsIyxn70_w';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
// lib/annonce-db.ts

export interface Annonce {
  id: string;
  title: string;
  content: string;
  author_id: string;
  author_name: string;
  target_roles: ('parent' | 'enseignant')[];
  created_at: string;
  updated_at: string;
}

export interface AnnonceFormData {
  title: string;
  content: string;
  target_roles: ('parent' | 'enseignant')[];
}

export async function createAnnonce(annonceData: AnnonceFormData, user: { id: string; name: string }): Promise<Annonce> {
  const newAnnonce: Annonce = {
    id: uuidv4(),
    title: annonceData.title,
    content: annonceData.content,
    author_id: user.id,
    author_name: user.name,
    target_roles: annonceData.target_roles,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('annonces')
    .insert(newAnnonce)
    .select()
    .single();

  if (error) {
    console.error('Error creating announcement:', error);
    throw error;
  }

  return data;
}

export async function getAnnoncesForUser(userRole: 'admin' | 'enseignant' | 'parent'): Promise<Annonce[]> {
  let query = supabase
    .from('annonces')
    .select('*')
    .order('created_at', { ascending: false });

  if (userRole !== 'admin') {
    query = query.contains('target_roles', [userRole]);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching announcements:', error);
    throw error;
  }

  return data || [];
}

export async function deleteAnnonce(annonceId: string): Promise<void> {
  const { error } = await supabase
    .from('annonces')
    .delete()
    .eq('id', annonceId);

  if (error) {
    console.error('Error deleting announcement:', error);
    throw error;
  }
}