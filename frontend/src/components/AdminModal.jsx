import React, { useState, useEffect } from 'react';
import { Lock, KeyRound, Cloud, Upload, Plus, Trash2, CheckCircle2, AlertCircle, RefreshCw, X, ShieldCheck } from 'lucide-react';

export default function AdminModal({ isOpen, onClose, onMenuUpdated, categories = [] }) {
  const [pin, setPin] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('sync'); // 'sync' | 'add' | 'manage'
  const [status, setStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  // New Dish Form State
  const [dishName, setDishName] = useState('');
  const [dishCategory, setDishCategory] = useState(categories[1] || 'Starters');
  const [dishPrice, setDishPrice] = useState('');
  const [dishDescription, setDishDescription] = useState('');
  const [dishDietary, setDishDietary] = useState('Non-Vegetarian');
  const [dishSpicy, setDishSpicy] = useState('0');
  const [dishPrepTime, setDishPrepTime] = useState('15 min');
  const [dishChefSpecial, setDishChefSpecial] = useState(false);
  const [dishPopular, setDishPopular] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  // Dishes for management tab
  const [allDishes, setAllDishes] = useState([]);

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      fetchAdminStatus();
      fetchDishes();
    }
  }, [isOpen, isAuthenticated]);

  /**
   * Helper to safely parse API responses even if Nginx or Express returns HTML errors
   */
  const safeParseResponse = async (res) => {
    const rawText = await res.text();
    let data = null;
    try {
      data = JSON.parse(rawText);
    } catch (e) {
      if (res.status === 413 || rawText.includes('413 Request Entity Too Large')) {
        throw new Error('Photo is too large for server upload (Nginx 413). Please select a file under 10MB or update nginx.conf.');
      }
      if (res.status === 502) {
        throw new Error('Node.js backend is restarting (502 Bad Gateway). Please wait 5 seconds and retry.');
      }
      throw new Error(`Server returned HTTP ${res.status}: ${rawText.replace(/<[^>]*>?/gm, '').slice(0, 120)}`);
    }
    return data;
  };

  const handleVerifyPin = async (e) => {
    e?.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/verify-pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin })
      });
      const data = await safeParseResponse(res);
      if (data.success) {
        setIsAuthenticated(true);
        sessionStorage.setItem('admin_pin', pin);
        fetchAdminStatus(pin);
        fetchDishes();
      } else {
        setError(data.message || 'Incorrect PIN');
      }
    } catch (err) {
      setError(err.message || 'Connection error');
    } finally {
      setIsLoading(false);
    }
  };

  const getSavedPin = () => pin || sessionStorage.getItem('admin_pin') || '';

  const fetchAdminStatus = async (currentPin) => {
    const p = currentPin || getSavedPin();
    try {
      const res = await fetch('/api/admin/status', {
        headers: { 'x-admin-pin': p }
      });
      const data = await safeParseResponse(res);
      if (data && data.success) {
        setStatus(data);
      }
    } catch (err) {
      console.warn('Status fetch error:', err);
    }
  };

  const fetchDishes = async () => {
    try {
      const res = await fetch('/api/menu');
      const data = await safeParseResponse(res);
      if (data && data.success) {
        setAllDishes(data.items || []);
      }
    } catch (err) {
      console.warn('Dishes fetch error:', err);
    }
  };

  const handleSyncS3 = async () => {
    setIsLoading(true);
    setMessage(null);
    setError(null);
    try {
      const res = await fetch('/api/admin/sync-s3', {
        method: 'POST',
        headers: { 'x-admin-pin': getSavedPin() }
      });
      const data = await safeParseResponse(res);
      if (data.success) {
        setMessage(data.message);
        onMenuUpdated?.();
      } else {
        setError(data.message || 'Sync failed');
      }
    } catch (err) {
      setError('Sync failed: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddDish = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('name', dishName);
      formData.append('category', dishCategory);
      formData.append('price', dishPrice);
      formData.append('description', dishDescription);
      formData.append('dietary', dishDietary);
      formData.append('spicyLevel', dishSpicy);
      formData.append('prepTime', dishPrepTime);
      formData.append('isChefSpecial', dishChefSpecial);
      formData.append('isPopular', dishPopular);
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const res = await fetch('/api/admin/add-dish', {
        method: 'POST',
        headers: {
          'x-admin-pin': getSavedPin()
        },
        body: formData
      });

      const data = await safeParseResponse(res);
      if (data.success) {
        setMessage(`✔ Dish "${dishName}" added successfully and uploaded to S3!`);
        // Reset form
        setDishName('');
        setDishPrice('');
        setDishDescription('');
        setImageFile(null);
        fetchDishes();
        onMenuUpdated?.();
      } else {
        setError(data.message || 'Failed to add dish');
      }
    } catch (err) {
      setError('Error adding dish: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteDish = async (dishId, dishTitle) => {
    if (!confirm(`Are you sure you want to remove "${dishTitle}" from the menu?`)) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/dish/${dishId}`, {
        method: 'DELETE',
        headers: { 'x-admin-pin': getSavedPin() }
      });
      const data = await safeParseResponse(res);
      if (data.success) {
        setMessage(`✔ Removed "${dishTitle}" from menu.`);
        fetchDishes();
        onMenuUpdated?.();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-dark-900 border border-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative text-slate-100">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-dark-850 hover:bg-dark-800 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="p-6 sm:p-8 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">
                Restaurant Admin & S3 Manager
              </h3>
              <p className="text-xs text-slate-400">
                Securely import menu items and dish photos directly into Amazon S3
              </p>
            </div>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 sm:p-8">

          {/* Feedback messages */}
          {message && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs sm:text-sm flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
              <span>{message}</span>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs sm:text-sm flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {/* STEP 1: Enter PIN (If not authenticated) */}
          {!isAuthenticated ? (
            <form onSubmit={handleVerifyPin} className="max-w-sm mx-auto text-center py-6">
              <div className="w-14 h-14 mx-auto rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4">
                <KeyRound className="w-7 h-7" />
              </div>
              <h4 className="font-serif text-lg font-bold text-white mb-2">Enter Admin Security PIN</h4>
              <p className="text-xs text-slate-400 mb-6">
                Enter your 4-digit PIN to access S3 import and menu management. (Default PIN: <strong className="text-amber-400">1234</strong>)
              </p>

              <div className="mb-4">
                <input
                  type="password"
                  maxLength={10}
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="Enter PIN (e.g. 1234)"
                  className="w-full text-center text-xl tracking-widest px-4 py-3 rounded-xl bg-dark-950 border border-slate-700 text-white placeholder-slate-600 focus:outline-none focus:border-amber-500"
                  autoFocus
                />
              </div>

              <button
                type="submit"
                disabled={isLoading || !pin}
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-dark-950 font-bold text-sm shadow transition-all disabled:opacity-50"
              >
                {isLoading ? 'Verifying...' : 'Unlock Admin Portal'}
              </button>
            </form>
          ) : (
            /* STEP 2: Authenticated Admin Portal */
            <div>
              {/* S3 Live Status Bar */}
              <div className="p-4 rounded-2xl bg-dark-950/80 border border-slate-800 mb-6 flex flex-wrap items-center justify-between gap-4 text-xs">
                <div className="flex items-center space-x-2">
                  <Cloud className="w-4 h-4 text-amber-400" />
                  <span>
                    S3 Bucket: <strong className="text-white">{status?.s3?.bucketName || 'Checking...'}</strong>
                  </span>
                  <span className="text-slate-500">({status?.s3?.region})</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span>Total Menu Dishes: <strong className="text-amber-400">{allDishes.length}</strong></span>
                  <button
                    onClick={() => { setIsAuthenticated(false); setPin(''); }}
                    className="text-slate-400 hover:text-rose-400 underline"
                  >
                    Lock Portal
                  </button>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-slate-800 mb-6">
                <button
                  onClick={() => setActiveTab('sync')}
                  className={`pb-3 px-4 text-xs sm:text-sm font-semibold transition-colors border-b-2 ${
                    activeTab === 'sync'
                      ? 'border-amber-500 text-amber-400'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  1. S3 Cloud Import & Sync
                </button>
                <button
                  onClick={() => setActiveTab('add')}
                  className={`pb-3 px-4 text-xs sm:text-sm font-semibold transition-colors border-b-2 ${
                    activeTab === 'add'
                      ? 'border-amber-500 text-amber-400'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  2. Add New Dish to S3
                </button>
                <button
                  onClick={() => setActiveTab('manage')}
                  className={`pb-3 px-4 text-xs sm:text-sm font-semibold transition-colors border-b-2 ${
                    activeTab === 'manage'
                      ? 'border-amber-500 text-amber-400'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  3. Delete / Manage Dishes
                </button>
              </div>

              {/* TAB 1: S3 Cloud Sync */}
              {activeTab === 'sync' && (
                <div className="space-y-4">
                  <div className="p-5 rounded-2xl bg-dark-950/60 border border-slate-800">
                    <h4 className="font-serif font-bold text-white text-base mb-1">
                      One-Click S3 Media Import
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed mb-4">
                      Automatically downloads all starter menu food images, restaurant hero banners, and videos, and uploads them directly into your private Amazon S3 bucket using your EC2 IAM role.
                    </p>

                    <button
                      onClick={handleSyncS3}
                      disabled={isLoading}
                      className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-dark-950 font-bold text-sm shadow transition-all disabled:opacity-50"
                    >
                      <Upload className="w-4 h-4" />
                      <span>{isLoading ? 'Importing Media to S3...' : 'Start S3 Media Import'}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 2: Add New Dish Form */}
              {activeTab === 'add' && (
                <form onSubmit={handleAddDish} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Dish Name *</label>
                      <input
                        type="text"
                        required
                        value={dishName}
                        onChange={(e) => setDishName(e.target.value)}
                        placeholder="e.g. Saffron Chilean Sea Bass"
                        className="w-full px-3 py-2 rounded-xl bg-dark-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Category *</label>
                      <select
                        value={dishCategory}
                        onChange={(e) => setDishCategory(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-dark-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-amber-500"
                      >
                        {categories.filter(c => c !== 'All').map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Price ($) *</label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={dishPrice}
                        onChange={(e) => setDishPrice(e.target.value)}
                        placeholder="24.50"
                        className="w-full px-3 py-2 rounded-xl bg-dark-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Dietary</label>
                      <select
                        value={dishDietary}
                        onChange={(e) => setDishDietary(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-dark-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-amber-500"
                      >
                        <option value="Vegetarian">Vegetarian</option>
                        <option value="Non-Vegetarian">Non-Vegetarian</option>
                        <option value="Vegan">Vegan</option>
                        <option value="Gluten-Free">Gluten-Free</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Prep Time</label>
                      <input
                        type="text"
                        value={dishPrepTime}
                        onChange={(e) => setDishPrepTime(e.target.value)}
                        placeholder="15-20 min"
                        className="w-full px-3 py-2 rounded-xl bg-dark-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Dish Description</label>
                    <textarea
                      rows={2}
                      value={dishDescription}
                      onChange={(e) => setDishDescription(e.target.value)}
                      placeholder="Mouth-watering ingredients and culinary techniques..."
                      className="w-full px-3 py-2 rounded-xl bg-dark-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  {/* Image Upload Input */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Upload Dish Photo (Stored into S3)
                    </label>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={(e) => setImageFile(e.target.files[0])}
                      className="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-amber-500/10 file:text-amber-400 hover:file:bg-amber-500/20"
                    />
                  </div>

                  {/* Flags */}
                  <div className="flex items-center space-x-6 pt-2">
                    <label className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={dishChefSpecial}
                        onChange={(e) => setDishChefSpecial(e.target.checked)}
                        className="rounded border-slate-700 text-amber-500 focus:ring-0"
                      />
                      <span>Chef's Choice Special</span>
                    </label>

                    <label className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={dishPopular}
                        onChange={(e) => setDishPopular(e.target.checked)}
                        className="rounded border-slate-700 text-amber-500 focus:ring-0"
                      />
                      <span>Mark as Popular</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-dark-950 font-bold text-sm shadow transition-all disabled:opacity-50 mt-4 flex items-center justify-center space-x-2"
                  >
                    <Plus className="w-4 h-4 font-bold" />
                    <span>{isLoading ? 'Uploading to S3...' : 'Upload Image to S3 & Add Dish'}</span>
                  </button>
                </form>
              )}

              {/* TAB 3: Manage / Delete Dishes */}
              {activeTab === 'manage' && (
                <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                  {allDishes.map((dish) => (
                    <div
                      key={dish.id}
                      className="p-3 rounded-xl bg-dark-950/60 border border-slate-800 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center space-x-3 overflow-hidden">
                        <img
                          src={dish.imageUrl || dish.fallbackImage}
                          alt={dish.name}
                          className="w-12 h-12 rounded-lg object-cover bg-dark-850 shrink-0"
                        />
                        <div className="truncate">
                          <h5 className="font-semibold text-white truncate">{dish.name}</h5>
                          <span className="text-slate-400">{dish.category} • ${dish.price.toFixed(2)}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleDeleteDish(dish.id, dish.name)}
                        className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 transition-colors shrink-0"
                        title="Delete Dish"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
