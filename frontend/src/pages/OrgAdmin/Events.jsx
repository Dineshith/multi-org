import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getEvents, createEvent, updateEvent, deleteEvent } from '../../services/mockDbService';
import { Plus, Search, Edit2, Trash2 } from 'lucide-react';
import Modal from '../../components/shared/Modal';

const Events = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', description: '', image: '', date: '', publishOnMainPortal: false });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadEvents();
  }, [user.organizationId]);

  const loadEvents = () => {
    setEvents(getEvents(user.organizationId));
  };

  const handleCreateEvent = (e) => {
    e.preventDefault();
    if (editingId) {
      updateEvent(editingId, {
        ...newEvent,
        date: new Date(newEvent.date).toISOString()
      });
    } else {
      createEvent(user.organizationId, {
        ...newEvent,
        date: new Date(newEvent.date).toISOString()
      });
    }
    loadEvents();
    setIsModalOpen(false);
    setNewEvent({ title: '', description: '', image: '', date: '', publishOnMainPortal: false });
    setEditingId(null);
  };

  const handleEdit = (event) => {
    const dateStr = new Date(event.date).toISOString().split('T')[0];
    setNewEvent({ title: event.title, description: event.description, image: event.image || '', date: dateStr, publishOnMainPortal: !!event.publishOnMainPortal });
    setEditingId(event.id);
    setIsModalOpen(true);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        alert('Image is too large. Please select an image under 1MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewEvent({ ...newEvent, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      deleteEvent(id);
      loadEvents();
    }
  };
  
  const filteredEvents = events.filter(e => e.title.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div className="relative w-full sm:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button 
          onClick={() => {
            setEditingId(null);
            setNewEvent({ title: '', description: '', image: '', date: '', publishOnMainPortal: false });
            setIsModalOpen(true);
          }}
          className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
        >
          <Plus size={20} />
          <span>New Event</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event Details</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredEvents.map((event) => (
              <tr key={event.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{event.title}</div>
                  <div className="text-sm text-gray-500 line-clamp-1 mt-1">{event.description}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(event.date).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-3">
                    <button onClick={() => handleEdit(event)} className="text-indigo-600 hover:text-indigo-900" title="Edit">
                      <Edit2 size={18} />
                    </button>
                    <button onClick={() => handleDelete(event.id)} className="text-red-600 hover:text-red-900" title="Delete">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredEvents.length === 0 && (
              <tr>
                <td colSpan="3" className="px-6 py-12 text-center text-gray-500">
                  No events found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? "Edit Event" : "Create New Event"}>
        <form onSubmit={handleCreateEvent} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Event Title</label>
            <input required type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" 
                   value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Event Image (Optional)</label>
            <input type="file" accept="image/*" onChange={handleImageUpload} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
            {newEvent.image && (
              <div className="mt-2 relative inline-block">
                <img src={newEvent.image} alt="Preview" className="h-20 w-auto rounded border border-gray-200" />
                <button type="button" onClick={() => setNewEvent({...newEvent, image: ''})} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600">
                  <Trash2 size={12} />
                </button>
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Event Date</label>
            <input required type="date" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" 
                   value={newEvent.date} onChange={e => setNewEvent({...newEvent, date: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea required rows={4} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" 
                   value={newEvent.description} onChange={e => setNewEvent({...newEvent, description: e.target.value})} />
          </div>
          <div className="flex items-center">
            <input id="publishOnMainPortal" type="checkbox" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" 
                   checked={newEvent.publishOnMainPortal} onChange={e => setNewEvent({...newEvent, publishOnMainPortal: e.target.checked})} />
            <label htmlFor="publishOnMainPortal" className="ml-2 block text-sm text-gray-900">
              Publish on Main portal
            </label>
          </div>
          <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
            <button type="submit" className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 sm:col-start-2">
              {editingId ? "Update Event" : "Create Event"}
            </button>
            <button type="button" onClick={() => setIsModalOpen(false)} className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0">Cancel</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Events;
