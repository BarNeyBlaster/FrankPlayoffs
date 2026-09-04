// Auth context — provides current user and auth state to the app.
import React, { createContext, useState, useContext, useEffect } from 'react';
import { base44 } from '@/api/base44Client';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setIsLoadingPublicSettings(false);
      let authed = false;
      try { authed = await base44.auth.isAuthenticated(); } catch { authed = false; }
      if (!mounted) return;
      if (!authed) {
        setIsLoadingAuth(false);
        return;
      }
      try {
        const me = await base44.auth.me();
        if (!mounted) return;
        setUser(me);
      } catch (e) {
        if (!mounted) return;
        const code = String(e?.code || e?.error || e?.message || '');
        if (code.includes('not_registered')) {
          setAuthError({ type: 'user_not_registered' });
        }
      } finally {
        if (mounted) setIsLoadingAuth(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const navigateToLogin = () => { base44.auth.redirectToLogin(); };
  const logout = async (redirectUrl) => { await base44.auth.logout(redirectUrl); };

  return (
    <AuthContext.Provider value={{ user, isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin, logout, setUser }}>
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