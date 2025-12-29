import React, { useState } from 'react';
import { Contact } from '../types';
import { Phone, User, Briefcase, Plus, X } from 'lucide-react';

interface ContactsProps {
  contacts: Contact[];
  onAdd: (c: Contact) => void;
  onDelete: (id: string) => void;
}

export const ContactsView: React.FC<ContactsProps> = ({ contacts, onAdd, onDelete }) => {
  const [showForm, setShowForm] = useState(false);
  const [newContact, setNewContact] = useState<Partial<Contact>>({});

  const handleSave = () => {
    if (newContact.name && newContact.phone) {
      onAdd({
        id: crypto.randomUUID(),
        name: newContact.name,
        phone: newContact.phone,
        role: newContact.role || 'Support',
        notes: newContact.notes
      } as Contact);
      setNewContact({});
      setShowForm(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Team & Contacts</h2>
          <p className="text-gray-400">Critical connections.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-apex-800 hover:bg-apex-700 text-white p-2 rounded-lg transition"
        >
          {showForm ? <X size={20} /> : <Plus size={20} />}
        </button>
      </div>

      {showForm && (
        <div className="bg-apex-900 border border-apex-800 p-4 rounded-xl space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input placeholder="Name" className="bg-apex-950 p-2 rounded border border-apex-800 text-white" value={newContact.name || ''} onChange={e => setNewContact({...newContact, name: e.target.value})} />
            <input placeholder="Role (e.g. Physio)" className="bg-apex-950 p-2 rounded border border-apex-800 text-white" value={newContact.role || ''} onChange={e => setNewContact({...newContact, role: e.target.value})} />
            <input placeholder="Phone" className="bg-apex-950 p-2 rounded border border-apex-800 text-white" value={newContact.phone || ''} onChange={e => setNewContact({...newContact, phone: e.target.value})} />
            <input placeholder="Notes" className="bg-apex-950 p-2 rounded border border-apex-800 text-white" value={newContact.notes || ''} onChange={e => setNewContact({...newContact, notes: e.target.value})} />
          </div>
          <button onClick={handleSave} className="bg-apex-primary px-4 py-2 rounded text-white text-sm font-bold">Save Contact</button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {contacts.map(contact => (
          <div key={contact.id} className="bg-apex-900 border border-apex-800 p-4 rounded-xl hover:border-apex-primary/50 transition group">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-apex-800 flex items-center justify-center text-gray-400 group-hover:bg-apex-primary group-hover:text-white transition">
                  <User size={20} />
                </div>
                <div>
                  <h3 className="text-white font-bold">{contact.name}</h3>
                  <div className="flex items-center gap-1 text-xs text-apex-primary">
                    <Briefcase size={10} /> {contact.role}
                  </div>
                </div>
              </div>
              <button onClick={() => onDelete(contact.id)} className="text-gray-600 hover:text-red-500"><X size={16} /></button>
            </div>
            
            <div className="mt-4 pt-4 border-t border-apex-800 flex justify-between items-center">
              <div className="text-gray-300 text-sm font-mono">{contact.phone}</div>
              <a href={`tel:${contact.phone}`} className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg hover:bg-emerald-500/20">
                <Phone size={16} />
              </a>
            </div>
          </div>
        ))}
        {contacts.length === 0 && !showForm && (
          <div className="col-span-full text-center py-12 text-gray-500 bg-apex-900/30 rounded-xl border border-dashed border-apex-800">
            No contacts added. Add your Coach, Physio, or Doctor.
          </div>
        )}
      </div>
    </div>
  );
};