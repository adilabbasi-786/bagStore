import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Coupon } from '../../types';
import { Edit, Trash, Plus, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function Coupons() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Coupon | null>(null);

  const [form, setForm] = useState<Partial<Coupon>>({
    code: '',
    discount_type: 'percent',
    discount_value: 0,
    min_spend: 0,
    usage_limit: 0,
    expiry_date: '',
    is_active: true
  });

  useEffect(() => {
    loadCoupons();
  }, []);

  const loadCoupons = async () => {
    const { data } = await supabase.from('coupons').select('*').order('created_at', { ascending: false });
    if (data) setCoupons(data);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        // Convert empty string date to null for DB
        expiry_date: form.expiry_date || null,
        // Convert usage limit 0 or empty to null if desired, but schema allows int. 
        // We'll keep 0 as strictly 0 or null if UI intends "unlimited". 
        // For now, let's treat 0 as 0.
      };

      if (editing) {
        await supabase.from('coupons').update(payload).eq('id', editing.id);
        toast.success('Coupon updated');
      } else {
        await supabase.from('coupons').insert([payload]);
        toast.success('Coupon created');
      }
      setIsModalOpen(false);
      loadCoupons();
    } catch (error: any) {
      toast.error(error.message || 'Error saving coupon');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this coupon?')) return;
    const { error } = await supabase.from('coupons').delete().eq('id', id);
    if (error) toast.error('Failed to delete coupon');
    else {
      toast.success('Coupon deleted');
      loadCoupons();
    }
  };

  const toggleStatus = async (coupon: Coupon) => {
    await supabase.from('coupons').update({ is_active: !coupon.is_active }).eq('id', coupon.id);
    loadCoupons();
  };

  const openModal = (coupon?: Coupon) => {
    if (coupon) {
      setEditing(coupon);
      setForm({
        ...coupon,
        expiry_date: coupon.expiry_date ? new Date(coupon.expiry_date).toISOString().slice(0, 16) : ''
      });
    } else {
      setEditing(null);
      setForm({
        code: '',
        discount_type: 'percent',
        discount_value: 0,
        min_spend: 0,
        usage_limit: 100,
        expiry_date: '',
        is_active: true
      });
    }
    setIsModalOpen(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Coupons</h1>
        <button 
          onClick={() => openModal()}
          className="bg-brand-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-brand-700"
        >
          <Plus size={18} /> Add Coupon
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 font-semibold text-gray-600">Code</th>
              <th className="p-4 font-semibold text-gray-600">Discount</th>
              <th className="p-4 font-semibold text-gray-600">Usage</th>
              <th className="p-4 font-semibold text-gray-600">Status</th>
              <th className="p-4 font-semibold text-gray-600">Expiry</th>
              <th className="p-4 font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {coupons.map(coupon => (
              <tr key={coupon.id} className="hover:bg-gray-50">
                <td className="p-4 font-mono font-bold text-brand-600">{coupon.code}</td>
                <td className="p-4">
                  {coupon.discount_type === 'percent' ? `${coupon.discount_value}%` : `$${coupon.discount_value}`}
                  {coupon.min_spend > 0 && <span className="text-xs text-gray-500 block">Min: ${coupon.min_spend}</span>}
                </td>
                <td className="p-4">
                  {coupon.used_count} / {coupon.usage_limit || '∞'}
                </td>
                <td className="p-4">
                  <button onClick={() => toggleStatus(coupon)} className="focus:outline-none">
                    {coupon.is_active ? (
                      <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
                        <CheckCircle size={14} /> Active
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-gray-400 text-sm font-medium">
                        <XCircle size={14} /> Inactive
                      </span>
                    )}
                  </button>
                </td>
                <td className="p-4 text-sm text-gray-500">
                  {coupon.expiry_date ? new Date(coupon.expiry_date).toLocaleDateString() : 'Never'}
                </td>
                <td className="p-4 flex gap-2">
                  <button onClick={() => openModal(coupon)} className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                    <Edit size={16} />
                  </button>
                  <button onClick={() => handleDelete(coupon.id)} className="p-2 text-red-600 hover:bg-red-50 rounded">
                    <Trash size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {coupons.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-500">No coupons found. Create one to get started.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold">{editing ? 'Edit Coupon' : 'New Coupon'}</h2>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Coupon Code</label>
                <input 
                  required 
                  className="w-full p-2 border rounded-lg uppercase" 
                  value={form.code} 
                  onChange={e => setForm({...form, code: e.target.value.toUpperCase()})} 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Type</label>
                  <select 
                    className="w-full p-2 border rounded-lg"
                    value={form.discount_type}
                    onChange={e => setForm({...form, discount_type: e.target.value as any})}
                  >
                    <option value="percent">Percentage (%)</option>
                    <option value="fixed">Fixed Amount ($)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Value</label>
                  <input 
                    type="number" 
                    required 
                    min="0"
                    className="w-full p-2 border rounded-lg" 
                    value={form.discount_value} 
                    onChange={e => setForm({...form, discount_value: Number(e.target.value)})} 
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Min Spend ($)</label>
                  <input 
                    type="number" 
                    min="0"
                    className="w-full p-2 border rounded-lg" 
                    value={form.min_spend} 
                    onChange={e => setForm({...form, min_spend: Number(e.target.value)})} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Usage Limit</label>
                  <input 
                    type="number" 
                    min="0"
                    className="w-full p-2 border rounded-lg" 
                    value={form.usage_limit || ''} 
                    onChange={e => setForm({...form, usage_limit: Number(e.target.value)})} 
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Expiry Date</label>
                <input 
                  type="datetime-local" 
                  className="w-full p-2 border rounded-lg" 
                  value={form.expiry_date || ''} 
                  onChange={e => setForm({...form, expiry_date: e.target.value})} 
                />
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)} 
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700"
                >
                  Save Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
