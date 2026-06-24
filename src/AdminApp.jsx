import React, { useState, useEffect } from 'react';
import { useUser, useAuth, useClerk } from '@clerk/clerk-react';
import AdminDashboard from './pages/AdminDashboard';
import LoginModal from './components/LoginModal';
import { getCurrentUser, setCurrentUser, registerTokenGetter, syncClerkUser } from './utils/db';
import { ShieldCheck, LogOut, Lock, UserCheck } from 'lucide-react';

export default function AdminApp() {
  const { user: clerkUser, isLoaded: clerkUserLoaded, isSignedIn } = useUser();
  const { getToken, signOut: clerkSignOut } = useAuth();
  const { openSignIn } = useClerk();

  const [user, setUser] = useState(null);
  const [loginOpen, setLoginOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Register Clerk Token Getter
  useEffect(() => {
    registerTokenGetter(async () => {
      try {
        return await getToken();
      } catch (err) {
        return null;
      }
    });
  }, [getToken]);

  // Synchronize Clerk user state with backend database
  useEffect(() => {
    const handleSync = async () => {
      if (isSignedIn && clerkUser) {
        try {
          const syncedUser = await syncClerkUser(clerkUser);
          setUser(syncedUser);
        } catch (err) {
          console.error("Admin user sync failed:", err);
        }
        setLoading(false);
      } else if (clerkUserLoaded) {
        if (!isSignedIn) {
          setUser(null);
          setCurrentUser(null);
        }
        setLoading(false);
      }
    };
    handleSync();
  }, [isSignedIn, clerkUser, clerkUserLoaded]);

  // Fallback to local cached user if not using/signed in to Clerk yet
  useEffect(() => {
    if (!isSignedIn && !clerkUserLoaded) {
      setUser(getCurrentUser());
      setLoading(false);
    }
  }, [isSignedIn, clerkUserLoaded]);

  const handleLoginSuccess = (loggedInUser) => {
    setUser(loggedInUser);
    setLoginOpen(false);
  };

  const handleLogout = async () => {
    try {
      if (isSignedIn) {
        await clerkSignOut();
      }
    } catch (err) {
      console.error("Admin Clerk sign out failed:", err);
    }
    setCurrentUser(null);
    setUser(null);
    alert('Logged out from Admin successfully.');
  };

  const handleOpenLogin = () => {
    if (openSignIn) {
      openSignIn();
    } else {
      setLoginOpen(true);
    }
  };


  if (loading) {
    return (
      <div className="admin-loading-screen">
        <div className="spinner"></div>
        <style>{`
          .admin-loading-screen {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            background-color: #1e2d3d;
            color: white;
          }
          .spinner {
            border: 4px solid rgba(255,255,255,0.1);
            width: 36px;
            height: 36px;
            border-radius: 50%;
            border-left-color: #088178;
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // 1. If not logged in, show Secure Portal Gate
  if (!user) {
    return (
      <div className="admin-gate-page">
        <div className="gate-card">
          <div className="gate-icon-wrapper">
            <Lock size={32} />
          </div>
          <h1>A1 Fashion Secure Admin</h1>
          <p>This is a private administration panel. Authorized owners only. Please sign in to verify your access credentials.</p>
          <button className="btn-primary" onClick={handleOpenLogin}>
            Sign In / Verify OTP
          </button>
        </div>

        <LoginModal
          isOpen={loginOpen}
          onClose={() => setLoginOpen(false)}
          onLoginSuccess={handleLoginSuccess}
        />

        <style>{`
          .admin-gate-page {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: radial-gradient(circle, #25384b 0%, #15202c 100%);
            padding: 20px;
          }
          .gate-card {
            background-color: white;
            border-radius: 15px;
            padding: 40px 30px;
            max-width: 420px;
            width: 100%;
            box-shadow: 0 16px 40px rgba(0,0,0,0.3);
            text-align: center;
            border: 1px solid rgba(255,255,255,0.1);
          }
          .gate-icon-wrapper {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background-color: #ffeef0;
            color: #ff4d4f;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 20px auto;
          }
          .gate-card h1 {
            font-size: 24px;
            color: #253D53;
            margin-bottom: 12px;
          }
          .gate-card p {
            font-size: 13px;
            color: #7E7E7E;
            line-height: 1.6;
            margin-bottom: 30px;
          }
        `}</style>
      </div>
    );
  }

  // 2. If logged in but NOT admin, show Access Denied
  if (user.role !== 'admin') {
    return (
      <div className="admin-gate-page">
        <div className="gate-card">
          <div className="gate-icon-wrapper" style={{ backgroundColor: '#ffeef0', color: '#ff4d4f' }}>
            🔒
          </div>
          <h1 style={{ color: '#ff4d4f' }}>Access Denied</h1>
          <p>You are logged in as <strong>{user.name}</strong> ({user.phone}), but you do not have administrative clearance for this dashboard.</p>
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
            <button className="btn-outline" onClick={handleLogout}>
              <LogOut size={14} /> Log Out
            </button>
            <button className="btn-primary" onClick={handleOpenLogin}>
              Switch Account
            </button>
          </div>
        </div>

        <LoginModal
          isOpen={loginOpen}
          onClose={() => setLoginOpen(false)}
          onLoginSuccess={handleLoginSuccess}
        />

        <style>{`
          .admin-gate-page {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: radial-gradient(circle, #25384b 0%, #15202c 100%);
            padding: 20px;
          }
          .gate-card {
            background-color: white;
            border-radius: 15px;
            padding: 40px 30px;
            max-width: 420px;
            width: 100%;
            box-shadow: 0 16px 40px rgba(0,0,0,0.3);
            text-align: center;
          }
          .gate-icon-wrapper {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            font-size: 28px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 20px auto;
          }
        `}</style>
      </div>
    );
  }

  // 3. Authorized Admin: Render Dashboard
  return (
    <div className="admin-full-wrapper">
      {/* Admin Top Navigation */}
      <nav className="admin-top-bar">
        <div className="admin-bar-inner">
          <div className="admin-logo">
            <span className="logo-badge">A1</span>
            <span className="logo-text">Fashion Control</span>
          </div>
          <div className="admin-user-info">
            <UserCheck size={16} />
            <span>Logged in: <strong>{user.name}</strong></span>
            <button onClick={handleLogout} className="admin-logout-action-btn">
              <LogOut size={14} /> Log Out
            </button>
          </div>
        </div>
      </nav>

      {/* Main Admin Content Dashboard */}
      <AdminDashboard onCatalogUpdated={() => {}} />

      <style>{`
        .admin-full-wrapper {
          background-color: #f7f8f9;
          min-height: 100vh;
          padding-bottom: 50px;
        }
        .admin-top-bar {
          background-color: #1e2d3d;
          color: white;
          padding: 12px 0;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        .admin-bar-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .admin-logo {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .logo-badge {
          background-color: #088178;
          color: white;
          font-weight: 800;
          font-size: 16px;
          padding: 2px 8px;
          border-radius: 4px;
        }
        .logo-text {
          font-weight: 700;
          font-size: 16px;
          letter-spacing: 0.5px;
        }
        .admin-user-info {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 13px;
        }
        .admin-logout-action-btn {
          background-color: rgba(255,255,255,0.08);
          color: #ff4d4f;
          border: 1px solid rgba(255,77,79,0.2);
          border-radius: 4px;
          padding: 4px 10px;
          font-size: 11px;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: all 0.2s ease;
        }
        .admin-logout-action-btn:hover {
          background-color: #ff4d4f;
          color: white;
          border-color: #ff4d4f;
        }
      `}</style>
    </div>
  );
}
