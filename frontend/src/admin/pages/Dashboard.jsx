import React from 'react';

export default function Dashboard() {
  return (
    <div className="bg-white p-8 rounded-[1rem] shadow-sm border border-slate-100">
      <h3 className="text-xl font-extrabold text-slate-800 mb-2">Welcome to Main Admin Panel</h3>
      <p className="text-slate-500 font-medium leading-relaxed max-w-2xl">
        This is the central hub for managing your multi-organization education platform. 
        From here, you can monitor all branches, manage global users, configure academics, and track financial overviews.
      </p>
    </div>
  );
}
