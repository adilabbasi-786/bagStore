import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { UserProfile } from '../../types';
import { User } from 'lucide-react';

export default function Customers() {
  const [customers, setCustomers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCustomers() {
      const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
      if (data) setCustomers(data);
      setLoading(false);
    }
    loadCustomers();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Customers</h1>
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 font-semibold text-gray-600">Customer</th>
              <th className="p-4 font-semibold text-gray-600">Role</th>
              <th className="p-4 font-semibold text-gray-600">Joined Date</th>
              <th className="p-4 font-semibold text-gray-600">ID</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {customers.map(customer => (
              <tr key={customer.id} className="hover:bg-gray-50">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center text-brand-600">
                      <User size={20} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{customer.full_name || 'No Name'}</p>
                      <p className="text-sm text-gray-500">{customer.email}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                    customer.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {customer.role}
                  </span>
                </td>
                <td className="p-4 text-gray-500">
                  {customer.created_at ? new Date(customer.created_at).toLocaleDateString() : 'N/A'}
                </td>
                <td className="p-4 text-xs text-gray-400 font-mono">
                  {customer.id}
                </td>
              </tr>
            ))}
            {customers.length === 0 && !loading && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-gray-500">No customers found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
