import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile, LoginPayload, RegisterPayload } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
  isAuthModalOpen: boolean;
  authModalReason: string;
  openAuthModal: (reason?: string, onSuccessAction?: () => void) => void;
  closeAuthModal: () => void;
  requireAuth: (action: () => void, reason?: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('cropsathi_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('cropsathi_token');
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalReason, setAuthModalReason] = useState('Please sign in or create an account to use this feature.');
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  // Validate session on mount
  useEffect(() => {
    const verifyUser = async () => {
      const storedToken = localStorage.getItem('cropsathi_token');
      if (storedToken) {
        try {
          const profile = await api.getMe();
          setUser(profile);
          localStorage.setItem('cropsathi_user', JSON.stringify(profile));
        } catch (err) {
          console.warn('Session expired or invalid, logging out.');
          localStorage.removeItem('cropsathi_token');
          localStorage.removeItem('cropsathi_user');
          setToken(null);
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    verifyUser();
  }, []);

  const login = async (credentials: LoginPayload) => {
    const res = await api.login(credentials);
    setToken(res.access_token);
    setUser(res.user);
    localStorage.setItem('cropsathi_token', res.access_token);
    localStorage.setItem('cropsathi_user', JSON.stringify(res.user));
    setIsAuthModalOpen(false);

    // If an action was queued before login, trigger it
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
  };

  const register = async (payload: RegisterPayload) => {
    const res = await api.register(payload);
    setToken(res.access_token);
    setUser(res.user);
    localStorage.setItem('cropsathi_token', res.access_token);
    localStorage.setItem('cropsathi_user', JSON.stringify(res.user));
    setIsAuthModalOpen(false);

    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
  };

  const logout = () => {
    localStorage.removeItem('cropsathi_token');
    localStorage.removeItem('cropsathi_user');
    setToken(null);
    setUser(null);
  };

  const openAuthModal = (reason?: string, onSuccessAction?: () => void) => {
    if (reason) setAuthModalReason(reason);
    if (onSuccessAction) setPendingAction(() => onSuccessAction);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setPendingAction(null);
  };

  const requireAuth = (action: () => void, reason?: string) => {
    if (token && user) {
      action();
    } else {
      openAuthModal(reason, action);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        register,
        logout,
        isAuthModalOpen,
        authModalReason,
        openAuthModal,
        closeAuthModal,
        requireAuth
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
