import { User } from '../types';
import { supabase } from '../supabaseClient';

// Helper to map Supabase User to our App User type
const mapSupabaseUser = (sbUser: any): User => {
    return {
        id: sbUser.id,
        name: sbUser.user_metadata?.name || sbUser.email?.split('@')[0] || 'Usuário',
        email: sbUser.email || '',
        company: sbUser.user_metadata?.company || '',
        password: '' // We don't store passwords locally anymore
    };
};

export const loginUser = async (email: string, password: string): Promise<User> => {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        throw new Error(error.message);
    }

    if (!data.user) {
        throw new Error("Erro desconhecido ao fazer login.");
    }

    return mapSupabaseUser(data.user);
};

export const registerUser = async (user: Omit<User, 'id'>): Promise<User> => {
    const { data, error } = await supabase.auth.signUp({
        email: user.email,
        password: user.password,
        options: {
            data: {
                name: user.name,
                company: user.company
            }
        }
    });

    if (error) {
        throw new Error(error.message);
    }

    if (!data.user) {
        throw new Error("Erro ao criar conta. Verifique seu email.");
    }

    // If email confirmation is off in Supabase, this logs them in immediately.
    // If on, they might not have a session yet, but data.user exists.
    return mapSupabaseUser(data.user);
};

export const logoutUser = async (): Promise<void> => {
    const { error } = await supabase.auth.signOut();
    if (error) {
        console.error("Erro ao sair:", error);
    }
};

export const getCurrentUser = async (): Promise<User | null> => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session?.user) {
        return mapSupabaseUser(session.user);
    }
    return null;
};
