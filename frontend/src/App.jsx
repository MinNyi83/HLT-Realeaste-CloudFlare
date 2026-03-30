import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Plus, Download, Search, RefreshCw } from 'lucide-react';

// Hooks
import { useAuth } from './hooks/useAuth';
import { useOfflineSync } from './hooks/useOfflineSync';

// Components
import { Button } from './components/common/UI';
import { Layout } from './components/layout/Layout';
import { LoginView } from './components/layout/LoginView';
import { DashboardView } from './components/dashboard/DashboardView';
import { FilterBar } from './components/properties/FilterBar';
import { PropertyCard } from './components/properties/PropertyCard';
import { PropertyForm } from './components/properties/PropertyForm';
import { PropertyDetailView } from './components/properties/PropertyDetailView';
import { BookmarksView } from './components/properties/BookmarksView';
import { AnalyticsView } from './components/dashboard/AnalyticsView';
import { UsersView } from './components/users/UsersView';
import { AuditLogsView } from './components/users/AuditLogsView';

import { App as CapApp } from '@capacitor/app';
import { Browser } from '@capacitor/browser';

const API_BASE_URL = import.meta.env.VITE_API_URL;

export default function App() {
  const { user, setUser, setIsLoading } = useAuth(API_BASE_URL);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(true);

  // Data State
  const [properties, setProperties] = useState([]);
  const [agents, setAgents] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalProperties: 0,
    totalAgents: 0,
    activeListings: 0,
    totalPortfolioValue: 0
  });

  // Filter State
  const [filters, setFilters] = useState({
    search: "", ward: "", type: "", status: "", minPrice: "", maxPrice: "", bedrooms: "", minArea: ""
  });

  // UI State
  const [editingProperty, setEditingProperty] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState(null);

  const { isOnline, isSyncing, syncQueue, addToQueue, setSyncQueue, setIsSyncing } = useOfflineSync(API_BASE_URL);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const filteredProperties = useMemo(() => {
    return properties.filter(p => {
      const matchesSearch = !filters.search ||
        p.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        p.location?.toLowerCase().includes(filters.search.toLowerCase());
      const matchesWard = !filters.ward || p.ward.toString() === filters.ward;
      const matchesType = !filters.type || p.type === filters.type;
      const matchesStatus = !filters.status || p.status === filters.status;
      const matchesMinPrice = !filters.minPrice || Number(p.price) >= Number(filters.minPrice);
      const matchesMaxPrice = !filters.maxPrice || Number(p.price) <= Number(filters.maxPrice);
      const matchesBeds = !filters.bedrooms ||
        (filters.bedrooms === "4" ? (p.bedrooms >= 4) : (p.bedrooms?.toString() === filters.bedrooms));
      const matchesArea = !filters.minArea || Number(p.area) >= Number(filters.minArea);

      return matchesSearch && matchesWard && matchesType && matchesStatus && matchesMinPrice && matchesMaxPrice && matchesBeds && matchesArea;
    });
  }, [properties, filters]);

  const loadData = useCallback(async () => {
    if (!API_BASE_URL) return;
    setIsLoading(true);
    console.log("Fetching dashboard data...");

    // Robust fetching function
    const safeFetch = async (endpoint) => {
      try {
        const res = await fetch(`${API_BASE_URL}${endpoint}`, { credentials: 'include' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return await res.json();
      } catch (err) {
        console.error(`Error fetching ${endpoint}:`, err);
        return null;
      }
    };

    try {
      const [propData, agentData, statsData] = await Promise.all([
        safeFetch('/api/properties'),
        safeFetch('/api/agents'),
        safeFetch('/api/stats')
      ]);

      if (propData) {
        setProperties(propData);
        localStorage.setItem('properties_cache', JSON.stringify(propData));
      }

      if (agentData) setAgents(agentData);

      if (statsData) {
        console.log("Stats received:", statsData);
        setStats(statsData);
      } else {
        console.warn("Stats data was empty or failed.");
      }

      if (user?.role === 'admin') {
        const userData = await safeFetch('/api/users');
        if (userData) setUsers(userData);
      }
    } catch (error) {
      console.error("Critical error in loadData:", error);
      const cachedProps = localStorage.getItem('properties_cache');
      if (cachedProps) setProperties(JSON.parse(cachedProps));
    }
    setIsLoading(false);
  }, [user, setIsLoading]);

  // Handle Auth Callback (Web & Deep Link)
  const processAuthCode = useCallback(async (code, currentRedirectUri) => {
    if (!code || user) return;
    setIsLoading(true);
    try {
      console.log("Processing Auth Code from:", currentRedirectUri);
      const res = await fetch(`${API_BASE_URL}/api/auth/google/callback?code=${code}&redirect_uri=${encodeURIComponent(currentRedirectUri)}`, {
        credentials: 'include'
      });
      const data = await res.json();
      if (data.user) {
        setUser(data.user);
        localStorage.setItem('user_cache', JSON.stringify(data.user));
        // Clear code from URL
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    } catch (error) {
      console.error("Auth failed:", error);
    }
    setIsLoading(false);
  }, [user, setUser, setIsLoading]);

  useEffect(() => {
    // 1. Handle browser callback (standard web)
    const code = new URLSearchParams(window.location.search).get("code");
    if (code) processAuthCode(code, window.location.origin + "/auth/callback");

    // 2. Handle Capacitor Deep Links (Android/iOS)
    const urlListener = CapApp.addListener('appUrlOpen', async (event) => {
      console.log('App opened with URL:', event.url);
      const url = new URL(event.url);
      const code = url.searchParams.get('code');
      if (code) {
        // Use the origin from the event URL (e.g. http://localhost)
        const redirectUri = url.origin + "/auth/callback";
        processAuthCode(code, redirectUri);
        await Browser.close(); // Close the auth tab if it was opened via Browser plugin
      }
    });

    return () => { urlListener.remove(); };
  }, [processAuthCode]);

  useEffect(() => {
    if (user) loadData();
  }, [user, loadData]);

  // Sync Logic
  useEffect(() => {
    if (isOnline && syncQueue.length > 0 && !isSyncing && API_BASE_URL) {
      const processQueue = async () => {
        setIsSyncing(true);
        const newQueue = [...syncQueue];
        const failedItems = [];

        while (newQueue.length > 0) {
          const item = newQueue.shift();
          try {
            let endpoint = `${API_BASE_URL}/api/properties`;
            if (item.action === 'UPDATE' || item.action === 'DELETE') endpoint += `/${item.data.id}`;
            const method = item.action === 'CREATE' ? 'POST' : item.action === 'UPDATE' ? 'PUT' : 'DELETE';

            await fetch(endpoint, {
              method,
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
              body: item.action !== 'DELETE' ? JSON.stringify(item.data) : undefined
            });
          } catch (err) {
            failedItems.push(item);
          }
        }
        setSyncQueue(failedItems);
        setIsSyncing(false);
        loadData();
      };
      processQueue();
    }
  }, [isOnline, syncQueue, isSyncing, setSyncQueue, setIsSyncing, loadData]);

  const handleGoogleLogin = async () => {
    try {
      const redirectUri = window.location.origin + "/auth/callback";
      const res = await fetch(`${API_BASE_URL}/api/auth/google/url?redirect_uri=${encodeURIComponent(redirectUri)}`);
      const { url } = await res.json();

      if (CapApp) {
        await Browser.open({ url });
      } else {
        window.location.href = url;
      }
    } catch (error) { alert("Failed to connect to backend"); }
  };

  const handleLogout = async () => {
    try {
      if (isOnline) await fetch(`${API_BASE_URL}/api/auth/logout`, { method: 'POST', credentials: 'include' });
    } catch (e) { }
    setUser(null);
    localStorage.removeItem('user_cache');
    setCurrentPage('dashboard');
  };

  const handleSaveProperty = async (propData) => {
    const isEdit = !!propData.id;
    if (!isEdit) {
      const tempId = `temp_${Date.now()}`;
      setProperties(prev => [{ ...propData, id: tempId, isTemp: true }, ...prev]);
      if (isOnline) {
        try {
          const res = await fetch(`${API_BASE_URL}/api/properties`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(propData)
          });
          if (res.ok) loadData();
          else throw new Error("API Failed");
        } catch (err) { addToQueue('CREATE', propData); }
      } else addToQueue('CREATE', propData);
    } else {
      setProperties(properties.map(p => p.id === propData.id ? propData : p));
      if (isOnline) {
        try {
          await fetch(`${API_BASE_URL}/api/properties/${propData.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(propData)
          });
          loadData();
        } catch (err) { addToQueue('UPDATE', propData); }
      } else addToQueue('UPDATE', propData);
    }
    setCurrentPage('properties');
  };

  const handleDeleteProperty = async (id) => {
    if (!confirm('Delete property?')) return;
    setProperties(properties.filter(p => p.id !== id));
    if (isOnline) {
      try {
        await fetch(`${API_BASE_URL}/api/properties/${id}`, { method: 'DELETE', credentials: 'include' });
        loadData();
      } catch (err) { addToQueue('DELETE', { id }); }
    } else addToQueue('DELETE', { id });
  };

  const handleToggleBookmark = async (id, isBookmarked) => {
    // Optimistic update
    setProperties(properties.map(p => p.id === id ? { ...p, is_bookmarked: isBookmarked ? 0 : 1 } : p));

    if (isOnline) {
      try {
        const method = isBookmarked ? 'DELETE' : 'POST';
        const endpoint = isBookmarked ? `${API_BASE_URL}/api/bookmarks/${id}` : `${API_BASE_URL}/api/bookmarks`;
        const body = isBookmarked ? undefined : JSON.stringify({ property_id: id });

        await fetch(endpoint, {
          method,
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body
        });
        loadData();
      } catch (error) {
        console.error("Failed to toggle bookmark:", error);
        // Revert on error
        setProperties(prev => prev.map(p => p.id === id ? { ...p, is_bookmarked: isBookmarked ? 1 : 0 } : p));
      }
    }
  };

  const handleUpdateUserRole = async (userId, newRole) => {
    try {
      await fetch(`${API_BASE_URL}/api/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ role: newRole })
      });
      loadData();
    } catch (error) { }
  };

  const handleBlockUser = async (userId, isBlocked) => {
    if (!confirm(`Are you sure you want to ${isBlocked ? 'unblock' : 'block'} this user?`)) return;
    try {
      await fetch(`${API_BASE_URL}/api/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ is_blocked: !isBlocked })
      });
      loadData();
    } catch (error) { }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm("Are you sure you want to DELETE this user?")) return;
    try {
      await fetch(`${API_BASE_URL}/api/users/${userId}`, { method: 'DELETE', credentials: 'include' });
      loadData();
    } catch (error) { }
  };

  const handleExportCSV = () => {
    const headers = ["Title", "Price (M MMK)", "Ward", "Location", "Type", "Status", "Bedrooms", "Bathrooms", "Area (sqft)", "Phone", "Commission %"];
    const rows = properties.map(p => [
      `"${p.title.replace(/"/g, '""')}"`, p.price, p.ward, `"${p.location?.replace(/"/g, '""') || ''}"`,
      p.type, p.status, p.bedrooms || 0, p.bathrooms || 0, p.area || 0, `'${p.phone || ''}`, p.commission_percent || 0
    ]);
    const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Htein_Lin_Thar_Properties_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  if (!user) return <LoginView isOnline={isOnline} darkMode={darkMode} onGoogleLogin={handleGoogleLogin} onDemoLogin={() => setUser({ name: 'Demo Viewer', role: 'user', email: 'demo@htl.com' })} />;

  return (
    <Layout
      user={user}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      isOnline={isOnline}
      isSyncing={isSyncing}
      syncQueue={syncQueue}
      darkMode={darkMode}
      setDarkMode={setDarkMode}
      handleLogout={handleLogout}
    >
      {currentPage === 'dashboard' && (
        <DashboardView
          stats={stats}
          properties={properties}
          filteredProperties={filteredProperties}
          filters={filters}
          setFilters={setFilters}
          onRefresh={loadData}
          onPropertyClick={(p) => { setSelectedProperty(p); setCurrentPage('property-detail'); }}
          onToggleBookmark={handleToggleBookmark}
          userRole={user?.role || 'guest'}
        />
      )}

      {currentPage === 'analytics' && (
        <AnalyticsView stats={stats} />
      )}

      {currentPage === 'properties' && (
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2xl font-extrabold dark:text-white tracking-tight">Realestate Portfolio</h2>
              <p className="text-slate-500 text-sm mt-1">Manage and track all property listings</p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              {user?.role === 'admin' && <Button variant="secondary" icon={Download} onClick={handleExportCSV} disabled={properties.length === 0}>Export</Button>}
              <Button icon={Plus} onClick={() => setCurrentPage('add-property')} className="flex-1 sm:flex-initial shadow-lg shadow-indigo-500/20" disabled={!['admin', 'agent'].includes(user?.role)}>New Property</Button>
            </div>
          </div>
          <FilterBar filters={filters} setFilters={setFilters} />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            {filteredProperties.map(p => (
              <PropertyCard
                key={p.id}
                p={p}
                onClick={() => { setSelectedProperty(p); setCurrentPage('property-detail'); }}
                onEdit={() => { setEditingProperty(p); setCurrentPage('edit-property'); }}
                onDelete={() => handleDeleteProperty(p.id)}
                onToggleBookmark={handleToggleBookmark}
                userRole={user.role}
              />
            ))}
            {filteredProperties.length === 0 && (
              <div className="col-span-full py-20 text-center animate-in fade-in duration-700">
                <Search size={32} className="mx-auto text-slate-300 mb-4" />
                <h3 className="text-lg font-bold dark:text-white">No properties match your filters</h3>
                <Button variant="ghost" className="mt-4 text-indigo-600" onClick={() => setFilters({ search: "", ward: "", type: "", status: "", minPrice: "", maxPrice: "" })}>Reset All</Button>
              </div>
            )}
          </div>
        </div>
      )}

      {currentPage === 'favorites' && (
        <BookmarksView
          properties={properties}
          onPropertyClick={(p) => { setSelectedProperty(p); setCurrentPage('property-detail'); }}
          onToggleBookmark={handleToggleBookmark}
          userRole={user?.role || 'guest'}
        />
      )}

      {currentPage === 'add-property' && <PropertyForm onSave={handleSaveProperty} onCancel={() => setCurrentPage('properties')} />}
      {currentPage === 'edit-property' && <PropertyForm initialData={editingProperty} onSave={handleSaveProperty} onCancel={() => setCurrentPage('properties')} />}
      {currentPage === 'property-detail' && <PropertyDetailView property={selectedProperty} onBack={() => { setCurrentPage('properties'); setSelectedProperty(null); }} />}
      {currentPage === 'users' && user?.role === 'admin' && (
        <UsersView
          users={users}
          currentUser={user}
          onRefresh={loadData}
          onUpdateRole={handleUpdateUserRole}
          onBlock={handleBlockUser}
          onDelete={handleDeleteUser}
        />
      )}
      {currentPage === 'audit-logs' && user?.role === 'admin' && (
        <AuditLogsView API_BASE_URL={API_BASE_URL} />
      )}
    </Layout>
  );
}
