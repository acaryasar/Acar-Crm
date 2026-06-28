'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

interface Bank {
  id: string;
  name: string;
  address: string;
  email: string;
  phoneNumber: string;
  isDeleted: boolean;
  deletedAt: Date | null;
  deletedBy: string | null;
  createdAt: Date;
  createdBy: string | null;
  updatedAt: Date;
  updatedBy: string | null;
}

interface BankFormProps {
  mode: 'create' | 'edit' | 'view';
  bank?: Bank;
}

export function BankForm({ mode, bank }: BankFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: bank?.name || '',
    address: bank?.address || '',
    email: bank?.email || '',
    phoneNumber: bank?.phoneNumber || '',
    isDeleted: bank?.isDeleted ?? false,
  });
  const [errors, setErrors] = useState<{ name?: string; email?: string; phoneNumber?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: { name?: string; email?: string; phoneNumber?: string } = {};
    if (!formData.name || formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    if (!formData.email || !formData.email.includes('@')) {
      newErrors.email = 'Valid email is required';
    }
    if (!formData.phoneNumber || formData.phoneNumber.trim().length < 5) {
      newErrors.phoneNumber = 'Phone number must be at least 5 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const url = mode === 'create' 
        ? '/api/parameters/banks' 
        : `/api/parameters/banks/${bank?.id}`;
      
      const method = mode === 'create' ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          address: formData.address,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          isDeleted: formData.isDeleted,
        }),
      });

      if (response.ok) {
        router.push('/dashboard/parameters/banks');
        router.refresh();
      } else {
        const error = await response.json();
        console.error('Error saving bank:', error);
      }
    } catch (error) {
      console.error('Error saving bank:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isViewMode = mode === 'view';

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6 shrink-0">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/parameters/banks"
            className="inline-flex items-center justify-center gap-2 text-slate-600 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center">
            <Save size={20} className="text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              {mode === 'create' ? 'New Bank' : mode === 'edit' ? 'Edit Bank' : 'View Bank'}
            </h1>
            <p className="text-sm text-slate-500">
              {mode === 'create' ? 'Create a new bank' : bank?.name || ''}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isViewMode && bank && (
            <Link
              href={`/dashboard/parameters/banks?mode=edit&id=${bank.id}`}
              className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors shadow-sm"
            >
              <Save size={16} />
              Edit
            </Link>
          )}
          {!isViewMode && (
            <>
              <Link
                href="/dashboard/parameters/banks"
                className="inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium px-4 py-2.5 rounded-xl transition-colors shadow-sm"
              >
                <X size={16} />
                Cancel
              </Link>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="gap-2 min-w-[140px]"
              >
                <Save size={16} />
                {isSubmitting ? 'Saving...' : mode === 'create' ? 'Create' : 'Save'}
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-auto">
        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>Bank Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-slate-700">
                  Name <span className="text-red-500">*</span>
                </label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={isViewMode || isSubmitting}
                  placeholder="Enter bank name"
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="address" className="text-sm font-medium text-slate-700">
                  Address
                </label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  disabled={isViewMode || isSubmitting}
                  placeholder="Enter bank address"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-slate-700">
                  Email <span className="text-red-500">*</span>
                </label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={isViewMode || isSubmitting}
                  placeholder="Enter bank email"
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="phoneNumber" className="text-sm font-medium text-slate-700">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <Input
                  id="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  disabled={isViewMode || isSubmitting}
                  placeholder="Enter phone number"
                  className={errors.phoneNumber ? 'border-red-500' : ''}
                />
                {errors.phoneNumber && (
                  <p className="text-sm text-red-500">{errors.phoneNumber}</p>
                )}
              </div>

              {mode === 'edit' && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    Active Status
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="isDeleted"
                      checked={!formData.isDeleted}
                      onChange={(e) => setFormData({ ...formData, isDeleted: !e.target.checked })}
                      disabled={isViewMode || isSubmitting}
                      className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="isDeleted" className="text-sm text-slate-600">
                      {formData.isDeleted ? 'Inactive' : 'Active'}
                    </label>
                  </div>
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
