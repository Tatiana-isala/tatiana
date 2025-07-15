// lib/userService.ts
import { User } from '@/lib/db';

// Simulez une base de données en mémoire
const users: User[] = [];

export async function initializeUsers() {
  // Remplissez avec les utilisateurs existants si nécessaire
}

export async function getUserById(id: string): Promise<User | null> {
  return users.find(user => user.id === id) || null;
}

export async function getAllUsers(): Promise<User[]> {
  return [...users];
}

export async function getUsersByRole(role: User['role']): Promise<User[]> {
  return users.filter(user => user.role === role);
}