import React from 'react';

export const AdminHeader: React.FC = () => (
  <header className="w-full bg-red-600 py-3 px-8 flex items-center justify-between">
    <h2 className="text-white text-lg font-semibold">Usuarios</h2>
    <button className="bg-white rounded-full p-2 shadow hover:bg-gray-100">
      <span className="material-icons text-red-600">account_circle</span>
    </button>
  </header>
); 