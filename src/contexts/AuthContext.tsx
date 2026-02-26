import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authApi, AuthResponse } from '@/services/api';

export type AppRole = 'admin' | 'user';

export interface User {
  id: string;
  email: string;
  full_name: string | null;
}

export interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  phone: string | null;
  division: string | null;
  job_title: string | null;
  avatar_url: string | null;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  role: AppRole | null;
  loading: boolean;
  isAdmin: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<Profile>) => Promise<{ error: Error | null }>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [role, setRole] = useState<AppRole | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const storedUser = localStorage.getItem('user');
        
        if (token && storedUser) {
          const userData = JSON.parse(storedUser) as { user: User; profile: Profile | null; role: AppRole };
          setUser(userData.user);
          setProfile(userData.profile);
          setRole(userData.role);
          
          // Optionally verify token with backend
          try {
            const profileData = await authApi.getProfile();
            if (profileData) {
              setProfile(profileData);
            }
          } catch {
            // Token might be expired, clear auth state
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user');
            setUser(null);
            setProfile(null);
            setRole(null);
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const signIn = async (email: string, password: string): Promise<{ error: Error | null }> => {
    try {
      const response: AuthResponse = await authApi.login({ email, password });
      
      // Store token and user data
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('user', JSON.stringify({
        user: response.user,
        profile: response.profile,
        role: response.role,
      }));
      
      setUser(response.user);
      setProfile(response.profile);
      setRole(response.role);
      
      return { error: null };
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Login gagal';
      return { error: new Error(message) };
    }
  };

  const signUp = async (email: string, password: string, fullName: string): Promise<{ error: Error | null }> => {
    try {
      const response: AuthResponse = await authApi.register({ email, password, full_name: fullName });
      
      // Store token and user data
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('user', JSON.stringify({
        user: response.user,
        profile: response.profile,
        role: response.role,
      }));
      
      setUser(response.user);
      setProfile(response.profile);
      setRole(response.role);
      
      return { error: null };
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Registrasi gagal';
      return { error: new Error(message) };
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      await authApi.logout();
    } catch {
      // Ignore logout errors, clear local state anyway
    }
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    setUser(null);
    setProfile(null);
    setRole(null);
  };

  const updateProfile = async (data: Partial<Profile>): Promise<{ error: Error | null }> => {
    if (!user) return { error: new Error('Pengguna tidak terautentikasi') };

    try {
      const updatedProfile = await authApi.updateProfile(data);
      setProfile(updatedProfile);
      
      // Update stored user data
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        userData.profile = updatedProfile;
        localStorage.setItem('user', JSON.stringify(userData));
      }
      
      return { error: null };
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Update profil gagal';
      return { error: new Error(message) };
    }
  };

  const updatePassword = async (currentPassword: string, newPassword: string): Promise<{ error: Error | null }> => {
    try {
      await authApi.updatePassword(currentPassword, newPassword);
      return { error: null };
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Update password gagal';
      return { error: new Error(message) };
    }
  };

  const isAdmin = role === 'admin';
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        role,
        loading,
        isAdmin,
        isAuthenticated,
        signIn,
        signUp,
        signOut,
        updateProfile,
        updatePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth harus digunakan dalam AuthProvider');
  }
  return context;
};
