import React, { useState, useRef, useCallback } from 'react';
import {
  Images, Upload, Trash2, X, FolderPlus, Tag,
  ImageIcon, Grid3x3, List, Plus, CheckCircle2,
  AlertTriangle
} from 'lucide-react';

const GALLERY_KEY = 'admin_gallery_items';

function loadGallery() {
  try {
    const data = localStorage.getItem(GALLERY_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveGallery(items) {
  localStorage.setItem(GALLERY_KEY, JSON.stringify(items));
}

const CATEGORIES = ['General', 'Events', 'Sports', 'Cultural', 'Academic', 'Infrastructure'];

export default function Gallery() {
  const [items, setItems] = useState(() => loadGallery());
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [isDragging, setIsDragging] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [toast, setToast] = useState(null);
  const fileInputRef = useRef(null);

  // Upload modal state
  const [uploadForm, setUploadForm] = useState({
    caption: '',
    category: 'General',
    files: [],
    previews: [],
  });

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Read files as base64
  const readFiles = (fileList) => {
    return Promise.all(
      Array.from(fileList).map(
        (file) =>
          new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve({ dataUrl: e.target.result, name: file.name });
            reader.readAsDataURL(file);
          })
      )
    );
  };

  const handleFileChange = async (e) => {
    const results = await readFiles(e.target.files);
    setUploadForm((prev) => ({
      ...prev,
      files: [...prev.files, ...results.map((r) => r.name)],
      previews: [...prev.previews, ...results.map((r) => r.dataUrl)],
    }));
  };

  const handleDrop = useCallback(async (e) => {
    e.preventDefault();
    setIsDragging(false);
    const results = await readFiles(e.dataTransfer.files);
    setUploadForm((prev) => ({
      ...prev,
      previews: [...prev.previews, ...results.map((r) => r.dataUrl)],
    }));
  }, []);

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);

  const removePreview = (index) => {
    setUploadForm((prev) => ({
      ...prev,
      previews: prev.previews.filter((_, i) => i !== index),
    }));
  };

  const handleUpload = () => {
    if (uploadForm.previews.length === 0) {
      showToast('Please select at least one image.', 'error');
      return;
    }
    const newItems = uploadForm.previews.map((dataUrl, i) => ({
      id: `${Date.now()}-${i}`,
      src: dataUrl,
      caption: uploadForm.caption || `Image ${items.length + i + 1}`,
      category: uploadForm.category,
      uploadedAt: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
    }));
    const updated = [...newItems, ...items];
    setItems(updated);
    saveGallery(updated);
    setShowUploadModal(false);
    setUploadForm({ caption: '', category: 'General', files: [], previews: [] });
    showToast(`${newItems.length} image${newItems.length > 1 ? 's' : ''} uploaded successfully!`);
  };

  const handleDelete = (id) => {
    const updated = items.filter((i) => i.id !== id);
    setItems(updated);
    saveGallery(updated);
    setSelectedItems((prev) => prev.filter((x) => x !== id));
    showToast('Image deleted.', 'error');
  };

  const handleBulkDelete = () => {
    if (!window.confirm(`Delete ${selectedItems.length} selected image(s)?`)) return;
    const updated = items.filter((i) => !selectedItems.includes(i.id));
    setItems(updated);
    saveGallery(updated);
    setSelectedItems([]);
    showToast(`${selectedItems.length} image(s) deleted.`, 'error');
  };

  const toggleSelect = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const filtered =
    selectedCategory === 'All' ? items : items.filter((i) => i.category === selectedCategory);

  const categoryCount = (cat) =>
    cat === 'All' ? items.length : items.filter((i) => i.category === cat).length;

  return (
    <div className="flex flex-col gap-6">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-semibold transition-all ${
            toast.type === 'error'
              ? 'bg-red-50 border border-red-200 text-red-700'
              : 'bg-emerald-50 border border-emerald-200 text-emerald-700'
          }`}
        >
          {toast.type === 'error' ? (
            <AlertTriangle className="w-4 h-4" />
          ) : (
            <CheckCircle2 className="w-4 h-4" />
          )}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-slate-800">Gallery Management</h3>
          <p className="text-slate-500 mt-1">
            Manage images and media for your websites. {items.length} total image{items.length !== 1 ? 's' : ''}.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {selectedItems.length > 0 && (
            <button
              onClick={handleBulkDelete}
              className="flex items-center gap-2 px-4 py-2.5 bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm font-semibold hover:bg-red-100 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Delete {selectedItems.length} selected
            </button>
          )}
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-5 rounded-xl transition-all shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Upload Images
          </button>
        </div>
      </div>

      {/* Category Filter + View Toggle */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          {['All', ...CATEGORIES].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              {cat} <span className="opacity-60 text-xs ml-1">({categoryCount(cat)})</span>
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-slate-100 text-slate-800' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <Grid3x3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-slate-100 text-slate-800' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Gallery Grid or List */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-16 text-center flex flex-col items-center justify-center min-h-[340px]">
          <Images className="w-14 h-14 text-slate-200 mb-4" />
          <h4 className="text-lg font-bold text-slate-600">No Images Yet</h4>
          <p className="text-slate-400 text-sm mt-1 mb-4">Upload images using the button above.</p>
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold shadow-md shadow-blue-600/20 hover:bg-blue-700 transition-colors"
          >
            <Upload className="w-4 h-4" />
            Upload Now
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filtered.map((item) => {
            const isSelected = selectedItems.includes(item.id);
            return (
              <div
                key={item.id}
                className={`group relative rounded-xl overflow-hidden bg-slate-100 aspect-square border-2 transition-all cursor-pointer ${
                  isSelected ? 'border-blue-500 shadow-lg shadow-blue-500/20' : 'border-transparent hover:border-slate-300'
                }`}
                onClick={() => toggleSelect(item.id)}
              >
                <img src={item.src} alt={item.caption} className="w-full h-full object-cover" />
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex flex-col justify-between p-2">
                  <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}
                      className="w-7 h-7 bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center justify-center transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="inline-block bg-black/60 text-white text-[11px] px-2 py-0.5 rounded-md font-medium">
                      {item.category}
                    </span>
                  </div>
                </div>
                {/* Selected checkmark */}
                {isSelected && (
                  <div className="absolute top-2 left-2 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-bold">
              <tr>
                <th className="p-4 w-12"></th>
                <th className="p-4">Preview</th>
                <th className="p-4">Caption</th>
                <th className="p-4">Category</th>
                <th className="p-4">Uploaded</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => toggleSelect(item.id)}
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 cursor-pointer"
                    />
                  </td>
                  <td className="p-4">
                    <img src={item.src} alt={item.caption} className="w-12 h-12 object-cover rounded-lg border border-slate-200" />
                  </td>
                  <td className="p-4 font-medium text-slate-700 text-sm">{item.caption}</td>
                  <td className="p-4">
                    <span className="bg-blue-50 text-blue-700 border border-blue-100 text-xs font-semibold px-2.5 py-1 rounded-full">
                      {item.category}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-slate-500">{item.uploadedAt}</td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowUploadModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <div>
                <h3 className="text-xl font-bold text-slate-800">Upload Images</h3>
                <p className="text-sm text-slate-500 mt-0.5">Add images to the gallery.</p>
              </div>
              <button onClick={() => setShowUploadModal(false)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="p-6 flex flex-col gap-4">
              {/* Drop Zone */}
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                  isDragging ? 'border-blue-500 bg-blue-50' : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'
                }`}
              >
                <Upload className={`w-8 h-8 mx-auto mb-2 ${isDragging ? 'text-blue-500' : 'text-slate-400'}`} />
                <p className="text-sm font-semibold text-slate-600">
                  {isDragging ? 'Drop images here!' : 'Drag & drop or click to select'}
                </p>
                <p className="text-xs text-slate-400 mt-1">PNG, JPG, JPEG, WEBP supported</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>

              {/* Previews */}
              {uploadForm.previews.length > 0 && (
                <div className="grid grid-cols-4 gap-2">
                  {uploadForm.previews.map((src, i) => (
                    <div key={i} className="relative aspect-square rounded-lg overflow-hidden group">
                      <img src={src} alt="" className="w-full h-full object-cover" />
                      <button
                        onClick={() => removePreview(i)}
                        className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Caption & Category */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Caption</label>
                  <input
                    type="text"
                    placeholder="e.g. Annual Day 2081"
                    value={uploadForm.caption}
                    onChange={(e) => setUploadForm((p) => ({ ...p, caption: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Category</label>
                  <select
                    value={uploadForm.category}
                    onChange={(e) => setUploadForm((p) => ({ ...p, category: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-200">
                <button onClick={() => setShowUploadModal(false)} className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                  Cancel
                </button>
                <button
                  onClick={handleUpload}
                  disabled={uploadForm.previews.length === 0}
                  className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors shadow-md shadow-blue-600/20"
                >
                  <Upload className="w-4 h-4" />
                  Upload {uploadForm.previews.length > 0 ? `(${uploadForm.previews.length})` : ''}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
