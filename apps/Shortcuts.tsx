import React, { useState } from 'react';
import { Shortcut } from '../types';
import { SHORTCUT_ICONS } from '../constants';
import { PlusIcon } from '../components/Icons';

interface ShortcutsProps {
    savedShortcuts: Shortcut[];
    onSaveShortcuts: (shortcuts: Shortcut[]) => void;
}

const Shortcuts: React.FC<ShortcutsProps> = ({ savedShortcuts, onSaveShortcuts }) => {
    const [isCreating, setIsCreating] = useState(false);
    const [title, setTitle] = useState('');
    const [uri, setUri] = useState('');
    const [selectedIconId, setSelectedIconId] = useState<string>(Object.keys(SHORTCUT_ICONS)[0]);

    const handleCreate = () => {
        if (!title || !uri) {
            alert("Title and URI are required.");
            return;
        }

        const newShortcut: Shortcut = {
            id: `shortcut-${Date.now()}`,
            title,
            uri,
            iconId: selectedIconId,
        };

        onSaveShortcuts([...savedShortcuts, newShortcut]);
        
        // Reset form
        setIsCreating(false);
        setTitle('');
        setUri('');
        setSelectedIconId(Object.keys(SHORTCUT_ICONS)[0]);
    };

    const handleDelete = (id: string) => {
        onSaveShortcuts(savedShortcuts.filter(sc => sc.id !== id));
    }

    if (isCreating) {
        return (
            <div className="w-full h-full bg-gray-50 dark:bg-gray-800 p-4 flex flex-col text-gray-800 dark:text-gray-200">
                <h2 className="text-lg font-bold mb-4">New Shortcut</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                        <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g., Visual Studio Code" className="w-full p-2 bg-transparent border rounded-md dark:border-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Launch URI</label>
                        <input type="text" value={uri} onChange={e => setUri(e.target.value)} placeholder="e.g., vscode://" className="w-full p-2 bg-transparent border rounded-md dark:border-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Icon</label>
                        <div className="grid grid-cols-5 gap-4">
                            {Object.entries(SHORTCUT_ICONS).map(([id, Icon]) => (
                                <button key={id} onClick={() => setSelectedIconId(id)} className={`p-2 rounded-lg flex items-center justify-center ${selectedIconId === id ? 'bg-blue-500' : 'bg-gray-200 dark:bg-gray-700'}`}>
                                    <Icon className="w-8 h-8" />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="mt-auto flex space-x-2 pt-4">
                    <button onClick={handleCreate} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500">Create</button>
                    <button onClick={() => setIsCreating(false)} className="flex-1 px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500">Cancel</button>
                </div>
            </div>
        )
    }

    return (
        <div className="w-full h-full bg-gray-50 dark:bg-gray-800 flex flex-col text-gray-800 dark:text-gray-200">
            <header className="flex-shrink-0 p-3 border-b bg-gray-100 flex items-center justify-between dark:bg-gray-900 dark:border-gray-700">
                <h1 className="font-bold">Native App Shortcuts</h1>
                <button onClick={() => setIsCreating(true)} className="p-1.5 rounded-full bg-blue-500 text-white hover:bg-blue-600">
                    <PlusIcon className="w-5 h-5"/>
                </button>
            </header>
            <div className="p-2 text-xs text-center bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200">
                Note: This requires the native app to be installed and support URI schemes (e.g., `steam://`).
            </div>

            <div className="flex-grow overflow-auto p-2">
                {savedShortcuts.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-500">
                        <p>No shortcuts created.</p>
                        <p className="text-xs">Click the '+' to add a new shortcut.</p>
                    </div>
                ) : (
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-200 dark:bg-gray-700">
                            <tr>
                                <th className="p-2 w-12">Icon</th>
                                <th className="p-2">Name</th>
                                <th className="p-2">URI</th>
                                <th className="p-2 w-12"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {savedShortcuts.map(sc => {
                                const Icon = SHORTCUT_ICONS[sc.iconId];
                                return (
                                    <tr key={sc.id} className="border-b border-gray-200 dark:border-gray-700">
                                        <td className="p-2">
                                            {Icon && <Icon className="w-6 h-6" />}
                                        </td>
                                        <td className="p-2 font-medium">{sc.title}</td>
                                        <td className="p-2 font-mono text-gray-500 dark:text-gray-400">{sc.uri}</td>
                                        <td className="p-2">
                                            <button onClick={() => handleDelete(sc.id)} className="text-red-500 hover:text-red-700 text-xs font-bold">X</button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default Shortcuts;