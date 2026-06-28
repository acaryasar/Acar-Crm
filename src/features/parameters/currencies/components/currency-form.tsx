'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

interface Currency {
  id: string;
  code: string;
  name: string;
  isDeleted: boolean;
  deletedAt: Date | null;
  deletedBy: string | null;
  createdAt: Date;
  createdBy: string | null;
  updatedAt: Date;
  updatedBy: string | null;
}

interface CurrencyFormProps {
  mode: 'create' | 'edit' | 'view';
  currency?: Currency;
}

export function CurrencyForm({ mode, currency }: CurrencyFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    code: currency?.code || '',
    name: currency?.name || '',
    isDeleted: currency?.isDeleted ?? false,
  });
  const [errors, setErrors] = useState<{ code?: string; name?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: { code?: string; name?: string } = {};
    if (!formData.code || formData.code.trim().length < 2) {
      newErrors.code = 'Code must be at least 2 characters';
    }
    if (!formData.name || formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
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
        ? '/api/parameters/currencies' 
        : `/api/parameters/currencies/${currency?.id}`;
      
      const method = mode === 'create' ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: formData.code.toUpperCase(),
          name: formData.name,
          isDeleted: formData.isDeleted,
        }),
      });

      if (response.ok) {
        router.push('/dashboard/parameters/currencies');
        router.refresh();
      } else {
        const error = await response.json();
        console.error('Error saving currency:', error);
      }
    } catch (error) {
      console.error('Error saving currency:', error);
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
            href="/dashboard/parameters/currencies"
            className="inline-flex items-center justify-center gap-2 text-slate-600 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <div className="h-10 w-10 rounded-xl bg-green-100 flex items-center justify-center">
            <Save size={20} className="text-green-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              {mode === 'create' ? 'New Currency' : mode === 'edit' ? 'Edit Currency' : 'View Currency'}
            </h1>
            <p className="text-sm text-slate-500">
              {mode === 'create' ? 'Create a new currency' : currency?.name || ''}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isViewMode && currency && (
            <Link
              href={`/dashboard/parameters/currencies?mode=edit&id=${currency.id}`}
              className="inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors shadow-sm"
            >
              <Save size={16} />
              Edit
            </Link>
          )}
          {!isViewMode && (
            <>
              <Link
                href="/dashboard/parameters/currencies"
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
            <CardTitle>Currency Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="code" className="text-sm font-medium text-slate-700">
                  Code <span className="text-red-500">*</span>
                </label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  disabled={isViewMode || isSubmitting}
                  placeholder="USD"
                  className={errors.code ? 'border-red-500' : ''}
                />
                {errors.code && (
                  <p className="text-sm text-red-500">{errors.code}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-slate-700">
                  Name <span className="text-red-500">*</span>
                </label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={isViewMode || isSubmitting}
                  placeholder="US Dollar"
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name}</p>
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
                      className="w-4 h-4 text-green-600 border-slate-300 rounded focus:ring-green-500"
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
