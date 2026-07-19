'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

interface Department {
  id: string;
  departmentName: string;
  departmentUpper: string;
  isDeleted: boolean;
}

interface DepartmentFormProps {
  mode: 'create' | 'edit' | 'view';
  department?: Department;
}

export function DepartmentForm({ mode, department }: DepartmentFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    departmentName: department?.departmentName || '',
    departmentUpper: department?.departmentUpper || '',
    isDeleted: department?.isDeleted ?? false,
  });
  const [errors, setErrors] = useState<{ departmentName?: string; departmentUpper?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: { departmentName?: string; departmentUpper?: string } = {};
    if (!formData.departmentName || formData.departmentName.trim().length < 2) {
      newErrors.departmentName = 'Department name must be at least 2 characters';
    }
    if (!formData.departmentUpper || formData.departmentUpper.trim().length < 2) {
      newErrors.departmentUpper = 'Department upper must be at least 2 characters';
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
        ? '/api/parameters/departments' 
        : `/api/parameters/departments/${department?.id}`;
      
      const method = mode === 'create' ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          departmentName: formData.departmentName,
          departmentUpper: formData.departmentUpper,
          isDeleted: formData.isDeleted,
        }),
      });

      if (response.ok) {
        router.push('/parameters/departments');
        router.refresh();
      } else {
        const error = await response.json();
        console.error('Error saving department:', error);
      }
    } catch (error) {
      console.error('Error saving department:', error);
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
            href="/parameters/departments"
            className="inline-flex items-center justify-center gap-2 text-slate-600 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <div className="h-10 w-10 rounded-xl bg-orange-100 flex items-center justify-center">
            <Save size={20} className="text-orange-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              {mode === 'create' ? 'New Department' : mode === 'edit' ? 'Edit Department' : 'View Department'}
            </h1>
            <p className="text-sm text-slate-500">
              {mode === 'create' ? 'Create a new department' : department?.departmentName || ''}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isViewMode && department && (
            <Link
              href={`/parameters/departments?mode=edit&id=${department.id}`}
              className="inline-flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors shadow-sm"
            >
              <Save size={16} />
              Edit
            </Link>
          )}
          {!isViewMode && (
            <>
              <Link
                href="/parameters/departments"
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
            <CardTitle>Department Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="departmentName" className="text-sm font-medium text-slate-700">
                  Department Name <span className="text-red-500">*</span>
                </label>
                <Input
                  id="departmentName"
                  value={formData.departmentName}
                  onChange={(e) => setFormData({ ...formData, departmentName: e.target.value })}
                  disabled={isViewMode || isSubmitting}
                  placeholder="Enter department name"
                  className={errors.departmentName ? 'border-red-500' : ''}
                />
                {errors.departmentName && (
                  <p className="text-sm text-red-500">{errors.departmentName}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="departmentUpper" className="text-sm font-medium text-slate-700">
                  Department Upper <span className="text-red-500">*</span>
                </label>
                <Input
                  id="departmentUpper"
                  value={formData.departmentUpper}
                  onChange={(e) => setFormData({ ...formData, departmentUpper: e.target.value.toUpperCase() })}
                  disabled={isViewMode || isSubmitting}
                  placeholder="Enter department upper"
                  className={errors.departmentUpper ? 'border-red-500' : ''}
                />
                {errors.departmentUpper && (
                  <p className="text-sm text-red-500">{errors.departmentUpper}</p>
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
                      className="w-4 h-4 text-orange-600 border-slate-300 rounded focus:ring-orange-500"
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
