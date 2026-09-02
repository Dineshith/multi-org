import React from 'react';
import { Images } from 'lucide-react';

export default function Gallery() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Images className="w-7 h-7 text-blue-600" />
          Gallery Management
        </h3>
        <p className="text-slate-500 mt-1">Manage images and media for the website.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-16 text-center flex flex-col items-center justify-center min-h-[400px]">
        <Images className="w-16 h-16 text-slate-200 mb-4" />
        <h4 className="text-xl font-bold text-slate-700">Coming Soon</h4>
        <p className="text-slate-500 mt-2 max-w-md">
          This is a dummy gallery page. The full image management functionality will be integrated here later.
        </p>
      </div>
    </div>
  );
}
