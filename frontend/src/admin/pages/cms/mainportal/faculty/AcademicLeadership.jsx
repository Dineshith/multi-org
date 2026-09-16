import React from 'react';
import { Users, Upload, Save, Plus, Edit2, Trash2 } from 'lucide-react';

export default function AcademicLeadership() {
    const leaders = [
        { name: 'Dr. John Doe', role: 'Dean', email: 'john@example.com' },
        { name: 'Dr. Jane Smith', role: 'Head of Department', email: 'jane@example.com' }
    ];

    return (
        <div className="p-8 max-w-6xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-100 mt-8">
            <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-5">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <Users className="w-6 h-6 text-purple-500" />
                        Academic Leadership
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">Manage the profiles of the academic leadership team.</p>
                </div>
                <button className="bg-purple-600 text-white px-5 py-2.5 rounded-xl font-medium shadow-sm hover:bg-purple-700 transition-colors flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Add New Leader
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-slate-200 bg-slate-50">
                            <th className="py-3 px-4 text-sm font-semibold text-slate-600 rounded-tl-xl">Photo</th>
                            <th className="py-3 px-4 text-sm font-semibold text-slate-600">Name</th>
                            <th className="py-3 px-4 text-sm font-semibold text-slate-600">Role</th>
                            <th className="py-3 px-4 text-sm font-semibold text-slate-600">Email</th>
                            <th className="py-3 px-4 text-sm font-semibold text-slate-600 text-right rounded-tr-xl">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leaders.map((leader, idx) => (
                            <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                <td className="py-3 px-4">
                                    <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-400">
                                        <Users className="w-5 h-5" />
                                    </div>
                                </td>
                                <td className="py-3 px-4 text-slate-700 font-medium">{leader.name}</td>
                                <td className="py-3 px-4 text-slate-500">{leader.role}</td>
                                <td className="py-3 px-4 text-slate-500">{leader.email}</td>
                                <td className="py-3 px-4 text-right">
                                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg mr-2"><Edit2 className="w-4 h-4" /></button>
                                    <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
