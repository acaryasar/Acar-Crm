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
}

interface Employee {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  address: string | null;
  departmentId: string;
  department: Department;
  isDeleted: boolean;
  deletedAt: Date | null;
  deletedBy: string | null;
  createdAt: Date;
  createdBy: string | null;
  updatedAt: Date;
  updatedBy: string | null;
}

interface EmployeeFormProps {
  mode: 'create' | 'edit' | 'view';
  employee?: Employee;
  departments: Department[];
}

export function EmployeeForm({ mode, employee, departments }: EmployeeFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: employee?.name || '',
    email: employee?.email || '',
    phoneNumber: employee?.phoneNumber || '',
    address: employee?.address || '',
    departmentId: employee?.departmentId || '',
    isDeleted: employee?.isDeleted ?? false,
  });
  const [errors, setErrors] = useState<{ name?: string; email?: string; phoneNumber?: string; departmentId?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: { name?: string; email?: string; phoneNumber?: string; departmentId?: string } = {};
    if (!formData.name || formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    if (!formData.email || !formData.email.includes('@')) {
      newErrors.email = 'Valid email is required';
    }
    if (!formData.phoneNumber || formData.phoneNumber.trim().length < 5) {
      newErrors.phoneNumber = 'Phone number must be at least 5 characters';
    }
    if (!formData.departmentId) {
      newErrors.departmentId = 'Department is required';
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
        ? '/api/parameters/employees' 
        : `/api/parameters/employees/${employee?.id}`;
      
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
          departmentId: formData.departmentId,
          isDeleted: formData.isDeleted,
        }),
      });

      if (response.ok) {
        router.push('/dashboard/parameters/employees');
        router.refresh();
      } else {
        const error = await response.json();
        console.error('Error saving employee:', error);
      }
    } catch (error) {
      console.error('Error saving employee:', error);
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
            href="/dashboard/parameters/employees"
            className="inline-flex items-center justify-center gap-2 text-slate-600 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <div className="h-10 w-10 rounded-xl bg-cyan-100 flex items-center justify-center">
            <Save size={20} className="text-cyan-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              {mode === 'create' ? 'New Employee' : mode === 'edit' ? 'Edit Employee' : 'View Employee'}
            </h1>
            <p className="text-sm text-slate-500">
              {mode === 'create' ? 'Create a new employee' : employee?.name || ''}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isViewMode && employee && (
            <Link
              href={`/dashboard/parameters/employees?mode=edit&id=${employee.id}`}
              className="inline-flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors shadow-sm"
            >
              <Save size={16} />
              Edit
            </Link>
          )}
          {!isViewMode && (
            <>
              <Link
                href="/dashboard/parameters/employees"
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
            <CardTitle>Employee Information</CardTitle>
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
                  placeholder="Enter name"
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
                <label htmlFor="departmentId" className="text-sm font-medium text-slate-700">
                  Department <span className="text-red-500">*</span>
                </label>
                <select
                  id="departmentId"
                  value={formData.departmentId}
                  onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                  disabled={isViewMode || isSubmitting}
                  className={`w-full px-3 py-2 border rounded-lg ${errors.departmentId ? 'border-red-500' : 'border-slate-300'}`}
                >
                  <option value="">Select a department</option>
                  {departments.map((department) => (
                    <option key={department.id} value={department.id}>
                      {department.departmentName}
                    </option>
                  ))}
                </select>
                {errors.departmentId && (
                  <p className="text-sm text-red-500">{errors.departmentId}</p>
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
                      className="w-4 h-4 text-cyan-600 border-slate-300 rounded focus:ring-cyan-500"
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
