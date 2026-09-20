import React, { useState, useEffect } from 'react';
import { MessageSquareQuote, Upload, Save, Plus, Edit2, Trash2, ArrowLeft, Image as ImageIcon, Check } from 'lucide-react';

export default function SchoolFacultyMessagesList() {
    const defaultMessages = [
        {
            id: 1,
            name: "Ram Prasad Sharma",
            designation: "Chairman",
            message: "It is an honor to be a part of this institution — which is preparing the next generation of officers, innovators, and world leaders. I am committed to continue this legacy in every way possible. Thank you.",
            image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        },
        {
            id: 2,
            name: "Sunita Shrestha",
            designation: "Principal",
            message: "I have a dream — that every child should get an opportunity to evolve into a role model in society. I have a dream — that working on this auspicious mission would truly transform the face of the world.",
            image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        },
        {
            id: 3,
            name: "Krishna Bahadur Karki",
            designation: "Vice-Principal",
            message: "It's my wish and blessing that students of Akshar should be able to gather the knowledge and skill required for them to live a life of fulfillment and abundance. I will always be working to facilitate this process.",
            image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        },
        {
            id: 4,
            name: "Kamala Adhikari",
            designation: "Academic Coordinator",
            message: "Our dedicated faculty works tirelessly to create a stimulating environment where students can explore their passions. We believe in nurturing both intellect and character for a brighter tomorrow.",
            image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        }
    ];

    const [messages, setMessages] = useState([]);
    const [view, setView] = useState('list'); // 'list' | 'form'
    const [formData, setFormData] = useState(null);
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('cms_school_faculty_messages_list');
        if (saved) {
            setMessages(JSON.parse(saved));
        } else {
            setMessages(defaultMessages);
        }
    }, []);

    const saveToLocalStorage = (data) => {
        localStorage.setItem('cms_school_faculty_messages_list', JSON.stringify(data));
        window.dispatchEvent(new Event('local-storage-update'));
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
    };

    const handleAddNew = () => {
        setFormData({
            id: Date.now(),
            name: '',
            designation: '',
            message: '',
            image: null
        });
        setView('form');
    };

    const handleEdit = (item) => {
        setFormData({ ...item });
        setView('form');
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this message?")) {
            const updated = messages.filter(m => m.id !== id);
            setMessages(updated);
            saveToLocalStorage(updated);
        }
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        let updated;
        const exists = messages.find(m => m.id === formData.id);
        if (exists) {
            updated = messages.map(m => m.id === formData.id ? formData : m);
        } else {
            updated = [...messages, formData];
        }
        setMessages(updated);
        saveToLocalStorage(updated);
        setView('list');
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, image: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 overflow-hidden">
            <div className="border-b border-slate-200 bg-slate-50 p-6 flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-slate-800">Faculty & Leadership Messages</h2>
                    <p className="text-sm text-slate-500 mt-1">Manage leadership quotes, designations, and portraits.</p>
                </div>
                {view === 'list' && (
                    <button
                        onClick={handleAddNew}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" /> Add Leader Message
                    </button>
                )}
            </div>

            {isSaved && (
                <div className="bg-emerald-50 text-emerald-700 px-6 py-2.5 text-sm font-semibold flex items-center gap-2 border-b border-emerald-100">
                    <Check className="w-4 h-4" /> Changes saved successfully!
                </div>
            )}

            <div className="p-8">
                {view === 'list' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {messages.map((item) => (
                            <div key={item.id} className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between space-y-4">
                                <div className="flex items-start gap-4">
                                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-200 shrink-0">
                                        {item.image ? (
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                                                <ImageIcon className="w-6 h-6" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-slate-800 text-lg">{item.name}</h3>
                                        <span className="text-xs font-bold text-emerald-600 uppercase tracking-wide">{item.designation}</span>
                                        <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">{item.message}</p>
                                    </div>
                                </div>
                                <div className="flex justify-end gap-2 pt-2 border-t border-slate-200/60">
                                    <button
                                        onClick={() => handleEdit(item)}
                                        className="p-2 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors flex items-center gap-1 text-xs font-semibold"
                                    >
                                        <Edit2 className="w-3.5 h-3.5" /> Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(item.id)}
                                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-1 text-xs font-semibold"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" /> Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <form onSubmit={handleFormSubmit} className="max-w-2xl mx-auto space-y-6">
                        <button
                            type="button"
                            onClick={() => setView('list')}
                            className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1.5 mb-2"
                        >
                            <ArrowLeft className="w-4 h-4" /> Back to List
                        </button>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Leader Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Designation</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.designation}
                                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                                    placeholder="e.g. Principal"
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Leader Portrait / Photo</label>
                            <div className="flex items-center gap-4">
                                <div className="w-24 h-24 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 overflow-hidden flex items-center justify-center">
                                    {formData.image ? (
                                        <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <ImageIcon className="w-6 h-6 text-slate-400" />
                                    )}
                                </div>
                                <div>
                                    <input type="file" id="msg-img-upload" accept="image/*" onChange={handleImageChange} className="hidden" />
                                    <label htmlFor="msg-img-upload" className="px-4 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer shadow-sm">
                                        Choose Portrait Photo
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Message</label>
                            <textarea
                                rows={5}
                                required
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                            ></textarea>
                        </div>

                        <div className="flex gap-4 justify-end pt-4">
                            <button
                                type="button"
                                onClick={() => setView('list')}
                                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold text-sm hover:bg-emerald-700 flex items-center gap-2"
                            >
                                <Save className="w-4 h-4" /> Save Message
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
