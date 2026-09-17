import React, { useState, useEffect } from 'react';
import { Users, Upload, Save, Plus, Edit2, Trash2, ArrowLeft, Image as ImageIcon } from 'lucide-react';

export default function AcademicLeadership() {
    const defaultLeaders = [
        {
            id: 1,
            name: 'Dr. Ananya Sharma',
            department: 'Science',
            role: 'Head of Department',
            description: 'Ph.D. in Physics with 15 years of teaching experience. Leads advanced research in quantum mechanics.',
            email: 'ananya.s@akshar.edu.np',
            phone: '+977 9841234561',
            photo: null
        },
        {
            id: 2,
            name: 'Prof. Rajesh Thapa',
            department: 'Management',
            role: 'Senior Lecturer',
            description: 'Expert in Business Strategy and Marketing. Former consultant for top multinational companies.',
            email: 'rajesh.t@akshar.edu.np',
            phone: '+977 9841234562',
            photo: null
        },
        {
            id: 3,
            name: 'Mrs. Sunita Shrestha',
            department: 'Humanities',
            role: 'Lecturer',
            description: 'Passionate about literature and modern history. Published author of three critically acclaimed books.',
            email: 'sunita.s@akshar.edu.np',
            phone: '+977 9841234563',
            photo: null
        },
        {
            id: 4,
            name: 'Er. Bikash Maharjan',
            department: 'Computer Science',
            role: 'Assistant Professor',
            description: 'Specializes in Artificial Intelligence and Web Technologies. Mentors the college robotics club.',
            email: 'bikash.m@akshar.edu.np',
            phone: '+977 9841234564',
            photo: null
        }
    ];

    const [leaders, setLeaders] = useState([]);
    const [view, setView] = useState('list'); // 'list' or 'form'
    const [formData, setFormData] = useState(null);
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        const savedData = localStorage.getItem('cms_academic_leadership');
        if (savedData) {
            setLeaders(JSON.parse(savedData));
        } else {
            setLeaders(defaultLeaders);
        }
    }, []);

    const saveToStorage = (data) => {
        setLeaders(data);
        localStorage.setItem('cms_academic_leadership', JSON.stringify(data));
        // Simulate a save flash
        setIsSaved(true);
        setTimeout(() => {
            setIsSaved(false);
            setView('list');
        }, 1000);
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this leader?")) {
            const updated = leaders.filter(l => l.id !== id);
            saveToStorage(updated);
        }
    };

    const handleEdit = (leader) => {
        setFormData(leader);
        setView('form');
    };

    const handleAddNew = () => {
        setFormData({
            id: Date.now(),
            name: '',
            department: '',
            role: '',
            description: '',
            email: '',
            phone: '',
            photo: null
        });
        setView('form');
    };

    const handleFormChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, photo: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        const exists = leaders.find(l => l.id === formData.id);
        let updated;
        if (exists) {
            updated = leaders.map(l => l.id === formData.id ? formData : l);
        } else {
            updated = [...leaders, formData];
        }
        saveToStorage(updated);
    };

    if (view === 'form') {
        const inputCls = "w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all";
        const labelCls = "block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2";

        return (
            <div className="p-8 max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-100 mt-8">
                <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-5">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setView('list')} className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500">
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-800">
                                {leaders.find(l => l.id === formData.id) ? 'Edit Leader' : 'Add New Leader'}
                            </h2>
                            <p className="text-sm text-slate-500 mt-1">Fill in the details for the academic leader.</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleFormSubmit} className="space-y-6">
                    {/* Photo Upload */}
                    <div>
                        <label className={labelCls}>Profile Photo</label>
                        <div className="flex items-center gap-6">
                            <div className="w-24 h-24 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 flex items-center justify-center overflow-hidden relative group">
                                {formData.photo ? (
                                    <img src={formData.photo} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <ImageIcon className="w-8 h-8 text-slate-300" />
                                )}
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                    <label htmlFor="photo-upload" className="cursor-pointer w-full h-full flex items-center justify-center">
                                        <Upload className="w-5 h-5 text-white" />
                                    </label>
                                </div>
                            </div>
                            <div>
                                <input type="file" id="photo-upload" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                                <label htmlFor="photo-upload" className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer transition-colors shadow-sm">
                                    <Upload className="w-4 h-4" /> Upload Photo
                                </label>
                                <p className="text-xs text-slate-500 mt-2">Recommended: Square image, max 2MB.</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className={labelCls}>Full Name</label>
                            <input required type="text" name="name" value={formData.name} onChange={handleFormChange} className={inputCls} placeholder="e.g. Dr. Ananya Sharma" />
                        </div>
                        <div>
                            <label className={labelCls}>Department / Faculty</label>
                            <input required type="text" name="department" value={formData.department} onChange={handleFormChange} className={inputCls} placeholder="e.g. Science" />
                        </div>
                        <div>
                            <label className={labelCls}>Role / Position</label>
                            <input required type="text" name="role" value={formData.role} onChange={handleFormChange} className={inputCls} placeholder="e.g. Head of Department" />
                        </div>
                        <div>
                            <label className={labelCls}>Email Address</label>
                            <input required type="email" name="email" value={formData.email} onChange={handleFormChange} className={inputCls} placeholder="email@example.com" />
                        </div>
                        <div>
                            <label className={labelCls}>Phone Number</label>
                            <input required type="text" name="phone" value={formData.phone} onChange={handleFormChange} className={inputCls} placeholder="+977 98xxxxxxxx" />
                        </div>
                    </div>

                    <div>
                        <label className={labelCls}>Short Description</label>
                        <textarea required name="description" value={formData.description} onChange={handleFormChange} rows="3" className={`${inputCls} resize-none`} placeholder="Brief bio or expertise description..."></textarea>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                        <button type="button" onClick={() => setView('list')} className="px-5 py-2.5 rounded-xl font-semibold text-slate-600 hover:bg-slate-100 transition-colors">
                            Cancel
                        </button>
                        <button type="submit" className="bg-purple-600 text-white px-6 py-2.5 rounded-xl font-bold shadow-sm hover:bg-purple-700 transition-colors flex items-center gap-2">
                            <Save className="w-4 h-4" /> {isSaved ? 'Saved!' : 'Save Leader'}
                        </button>
                    </div>
                </form>
            </div>
        );
    }

    // List View
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
                <button onClick={handleAddNew} className="bg-purple-600 text-white px-5 py-2.5 rounded-xl font-medium shadow-sm hover:bg-purple-700 transition-colors flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Add New Leader
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                        <tr className="border-b border-slate-200 bg-slate-50">
                            <th className="py-3 px-4 text-sm font-semibold text-slate-600 rounded-tl-xl w-16">Photo</th>
                            <th className="py-3 px-4 text-sm font-semibold text-slate-600">Name & Role</th>
                            <th className="py-3 px-4 text-sm font-semibold text-slate-600">Department</th>
                            <th className="py-3 px-4 text-sm font-semibold text-slate-600">Contact</th>
                            <th className="py-3 px-4 text-sm font-semibold text-slate-600 text-right rounded-tr-xl">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leaders.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="py-8 text-center text-slate-400">No leaders added yet. Click "Add New Leader" to start.</td>
                            </tr>
                        ) : leaders.map((leader) => (
                            <tr key={leader.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                <td className="py-3 px-4">
                                    <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-400 overflow-hidden border border-slate-200">
                                        {leader.photo ? (
                                            <img src={leader.photo} alt={leader.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <Users className="w-5 h-5" />
                                        )}
                                    </div>
                                </td>
                                <td className="py-3 px-4">
                                    <div className="text-slate-800 font-bold">{leader.name}</div>
                                    <div className="text-slate-500 text-sm mt-0.5">{leader.role}</div>
                                </td>
                                <td className="py-3 px-4">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                        {leader.department}
                                    </span>
                                </td>
                                <td className="py-3 px-4">
                                    <div className="text-slate-600 text-sm">{leader.email}</div>
                                    <div className="text-slate-500 text-xs mt-0.5">{leader.phone}</div>
                                </td>
                                <td className="py-3 px-4 text-right">
                                    <button onClick={() => handleEdit(leader)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg mr-2 transition-colors" title="Edit">
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => handleDelete(leader.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
