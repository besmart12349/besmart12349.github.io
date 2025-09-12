import React, { useState, useMemo } from 'react';
import type { Contact } from '../types';
import { PlusIcon } from '../components/Icons';

interface ContactsProps {
    savedContacts: Contact[];
    onSaveContacts: (contacts: Contact[]) => void;
}

// Predefined avatars
const AVATARS = [
    '#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5',
    '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50',
    '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800', '#ff5722'
];

const Avatar: React.FC<{ contact: Contact; size?: 'sm' | 'lg' }> = ({ contact, size = 'sm' }) => {
    const sizeClasses = size === 'sm' ? 'w-10 h-10 text-base' : 'w-24 h-24 text-3xl';
    const initials = `${contact.firstName?.[0] || ''}${contact.lastName?.[0] || ''}`.toUpperCase();
    return (
        <div 
            className={`rounded-full flex items-center justify-center text-white font-bold ${sizeClasses} flex-shrink-0`}
            style={{ backgroundColor: AVATARS[contact.avatarId % AVATARS.length] }}
        >
            {initials}
        </div>
    );
};

const Contacts: React.FC<ContactsProps> = ({ savedContacts, onSaveContacts }) => {
    const [contacts, setContacts] = useState<Contact[]>(savedContacts || []);
    const [selectedContactId, setSelectedContactId] = useState<string | null>( (savedContacts && savedContacts.length > 0) ? savedContacts[0].id : null);
    const [isEditing, setIsEditing] = useState(false);
    const [isCreating, setIsCreating] = useState(false);

    const sortedContacts = useMemo(() => 
        [...contacts].sort((a, b) => a.lastName.localeCompare(b.lastName)),
        [contacts]
    );

    const selectedContact = useMemo(() => 
        contacts.find(c => c.id === selectedContactId),
        [contacts, selectedContactId]
    );

    const handleSelectContact = (id: string) => {
        setSelectedContactId(id);
        setIsEditing(false);
        setIsCreating(false);
    };

    const handleAddNew = () => {
        setSelectedContactId(null);
        setIsEditing(false);
        setIsCreating(true);
    };
    
    const handleEdit = () => {
        if (selectedContact) {
            setIsEditing(true);
            setIsCreating(false);
        }
    };
    
    const handleDelete = () => {
        if (selectedContact && window.confirm(`Are you sure you want to delete ${selectedContact.firstName} ${selectedContact.lastName}?`)) {
            const newContacts = contacts.filter(c => c.id !== selectedContact.id);
            setContacts(newContacts);
            onSaveContacts(newContacts);
            setSelectedContactId(newContacts.length > 0 ? newContacts[0].id : null);
        }
    };

    const handleSave = (contactData: Omit<Contact, 'id'>) => {
        let newContacts;
        let newId = selectedContactId;
        if (isCreating) {
            const newContact: Contact = { ...contactData, id: `contact-${Date.now()}` };
            newContacts = [...contacts, newContact];
            newId = newContact.id;
        } else if (isEditing && selectedContact) {
            newContacts = contacts.map(c => c.id === selectedContact.id ? { ...c, ...contactData } : c);
        } else {
            return;
        }

        setContacts(newContacts);
        onSaveContacts(newContacts);
        setIsEditing(false);
        setIsCreating(false);
        setSelectedContactId(newId);
    };
    
    const handleCancel = () => {
        setIsEditing(false);
        setIsCreating(false);
        if (!selectedContactId && contacts.length > 0) {
            setSelectedContactId(contacts[0].id);
        }
    };

    const ContactForm: React.FC<{ contact?: Contact; onSave: (data: Omit<Contact, 'id'>) => void; onCancel: () => void }> = ({ contact, onSave, onCancel }) => {
        const [formData, setFormData] = useState({
            firstName: contact?.firstName || '',
            lastName: contact?.lastName || '',
            email: contact?.email || '',
            phone: contact?.phone || '',
            avatarId: contact?.avatarId ?? Math.floor(Math.random() * AVATARS.length),
        });

        const handleSubmit = (e: React.FormEvent) => {
            e.preventDefault();
            onSave(formData);
        };
        
        return (
            <form onSubmit={handleSubmit} className="p-6 h-full flex flex-col overflow-y-auto">
                <h2 className="text-xl font-bold mb-4 flex-shrink-0">{contact ? 'Edit Contact' : 'New Contact'}</h2>
                <div className="flex-grow space-y-4">
                    <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Avatar</label>
                        <div className="flex flex-wrap gap-2 mt-1">
                            {AVATARS.map((color, index) => (
                                <button type="button" key={index} onClick={() => setFormData(f => ({...f, avatarId: index}))} className={`w-8 h-8 rounded-full transition-all ${formData.avatarId === index ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-gray-100 dark:ring-offset-gray-800' : ''}`} style={{ backgroundColor: color }} />
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">First Name</label>
                        <input type="text" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} required className="w-full p-2 mt-1 bg-transparent border rounded-md dark:border-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500"/>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Last Name</label>
                        <input type="text" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} required className="w-full p-2 mt-1 bg-transparent border rounded-md dark:border-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500"/>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                        <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full p-2 mt-1 bg-transparent border rounded-md dark:border-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500"/>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Phone</label>
                        <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full p-2 mt-1 bg-transparent border rounded-md dark:border-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500"/>
                    </div>
                </div>
                <div className="flex-shrink-0 flex space-x-2 pt-4 mt-auto">
                    <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500">Save</button>
                    <button type="button" onClick={onCancel} className="flex-1 px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500">Cancel</button>
                </div>
            </form>
        );
    };

    const ContactDetails: React.FC<{ contact: Contact }> = ({ contact }) => (
        <div className="p-6 h-full flex flex-col items-center">
            <Avatar contact={contact} size="lg" />
            <h2 className="text-2xl font-bold mt-4">{contact.firstName} {contact.lastName}</h2>
            <div className="text-left w-full max-w-sm mt-6 space-y-3 text-sm">
                <p><strong className="w-16 inline-block text-gray-500 dark:text-gray-400">Email:</strong> {contact.email || 'N/A'}</p>
                <p><strong className="w-16 inline-block text-gray-500 dark:text-gray-400">Phone:</strong> {contact.phone || 'N/A'}</p>
            </div>
             <div className="mt-auto pt-4 flex space-x-2">
                <button onClick={handleEdit} className="px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500">Edit</button>
                <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-500">Delete</button>
            </div>
        </div>
    );

    return (
        <div className="w-full h-full bg-gray-100 dark:bg-gray-800 flex text-gray-800 dark:text-gray-200">
            {/* Sidebar */}
            <div className="w-1/3 h-full bg-gray-200/50 dark:bg-gray-900/50 border-r border-gray-300/60 dark:border-gray-700/60 flex flex-col">
                <div className="p-2 border-b border-gray-300/60 dark:border-gray-700/60 flex-shrink-0 flex items-center justify-between">
                    <h1 className="font-bold px-2">All Contacts</h1>
                    <button onClick={handleAddNew} className="p-1.5 rounded-full bg-blue-500 text-white hover:bg-blue-600">
                        <PlusIcon className="w-5 h-5"/>
                    </button>
                </div>
                <ul className="flex-grow overflow-y-auto">
                    {sortedContacts.map(contact => (
                        <li key={contact.id}>
                            <button
                                onClick={() => handleSelectContact(contact.id)}
                                className={`w-full text-left p-3 border-b border-gray-200 dark:border-gray-700/50 flex items-center space-x-3 ${selectedContactId === contact.id && !isEditing && !isCreating ? 'bg-blue-200/50 dark:bg-blue-900/50' : 'hover:bg-gray-200/70 dark:hover:bg-gray-800'}`}
                            >
                                <Avatar contact={contact} />
                                <span className="font-semibold text-sm truncate dark:text-gray-200">{contact.firstName} {contact.lastName}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Main Content */}
            <div className="w-2/3 h-full flex flex-col">
                {isEditing || isCreating ? (
                    <ContactForm contact={isEditing ? selectedContact : undefined} onSave={handleSave} onCancel={handleCancel} />
                ) : selectedContact ? (
                    <ContactDetails contact={selectedContact} />
                ) : (
                    <div className="flex-grow flex items-center justify-center text-gray-500 text-center p-4">
                        <div>
                            <h2 className="text-lg font-semibold">No Contact Selected</h2>
                            <p>Select a contact from the list or create a new one.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Contacts;