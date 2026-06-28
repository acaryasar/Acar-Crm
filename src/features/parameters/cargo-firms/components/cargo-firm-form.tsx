'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

interface CargoFirm {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  isDeleted: boolean;
  deletedAt: Date | null;
  deletedBy: string | null;
  createdAt: Date;
  createdBy: string | null;
  updatedAt: Date;
  updatedBy: string | null;
}

interface CargoFirmFormProps {
  mode: 'create' | 'edit' | 'view';
  cargoFirm?: CargoFirm;
}

export function CargoFirmForm({ mode, cargoFirm }: CargoFirmFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: cargoFirm?.name || '',
    email: cargoFirm?.email || '',
    phoneNumber: cargoFirm?.phoneNumber || '',
    address: cargoFirm?.address || '',
    isDeleted: cargoFirm?.isDeleted ?? false,
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
        ? '/api/parameters/cargo-firms' 
        : `/api/parameters/cargo-firms/${cargoFirm?.id}`;
      
      const method = mode === 'create' ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          address: formData.address,
          isDeleted: formData.isDeleted,
        }),
      });

      if (response.ok) {
        router.push('/dashboard/parameters/cargo-firms');
        router.refresh();
      } else {
        const error = await response.json();
        console.error('Error saving cargo firm:', error);
      }
    } catch (error) {
      console.error('Error saving cargo firm:', error);
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
            href="/dashboard/parameters/cargo-firms"
            className="inline-flex items-center justify-center gap-2 text-slate-600 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <div className="h-10 w-10 rounded-xl bg-amber-100 flex items-center justify-center">
            <Save size={20} className="text-amber-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              {mode === 'create' ? 'New Cargo Firm' : mode === 'edit' ? 'Edit Cargo Firm' : 'View Cargo Firm'}
            </h1>
            <p className="text-sm text-slate-500">
              {mode === 'create' ? 'Create a new cargo firm' : cargoFirm?.name || ''}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isViewMode && cargoFirm && (
            <Link
              href={`/dashboard/parameters/cargo-firms?mode=edit&id=${cargoFirm.id}`}
              className="inline-flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors shadow-sm"
            >
              <Save size={16} />
              Edit
            </Link>
          )}
          {!isViewMode && (
            <>
              <Link
                href="/dashboard/parameters/cargo-firms"
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
            <CardTitle>Cargo Firm Information</CardTitle>
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
                  placeholder="Enter cargo firm name"
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name}</p>
                )}
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
                  placeholder="Enter email"
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

              <div className="space-y-2">
                <label htmlFor="address" className="text-sm font-medium text-slate-700">
                  Address
                </label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  disabled={isViewMode || isSubmitting}
                  placeholder="Enter address"
                />
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
                      className="w-4 h-4 text-amber-600 border-slate-300 rounded focus:ring-amber-500"
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
