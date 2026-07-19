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
}

interface Currency {
  id: string;
  code: string;
  name: string;
}

interface BankAccount {
  id: string;
  bankId: string;
  bank: Bank;
  currencyId: string;
  currency: Currency;
  iban: string;
  swiftNumber: string;
  isDeleted: boolean;
  deletedAt: Date | null;
  deletedBy: string | null;
  createdAt: Date;
  createdBy: string | null;
  updatedAt: Date;
  updatedBy: string | null;
}

interface BankAccountFormProps {
  mode: 'create' | 'edit' | 'view';
  bankAccount?: BankAccount;
  banks: Bank[];
  currencies: Currency[];
}

export function BankAccountForm({ mode, bankAccount, banks, currencies }: BankAccountFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    bankId: bankAccount?.bankId || '',
    currencyId: bankAccount?.currencyId || '',
    iban: bankAccount?.iban || '',
    swiftNumber: bankAccount?.swiftNumber || '',
    isDeleted: bankAccount?.isDeleted ?? false,
  });
  const [errors, setErrors] = useState<{ bankId?: string; currencyId?: string; iban?: string; swiftNumber?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: { bankId?: string; currencyId?: string; iban?: string; swiftNumber?: string } = {};
    if (!formData.bankId) {
      newErrors.bankId = 'Bank is required';
    }
    if (!formData.currencyId) {
      newErrors.currencyId = 'Currency is required';
    }
    if (!formData.iban || formData.iban.trim().length < 5) {
      newErrors.iban = 'IBAN must be at least 5 characters';
    }
    if (!formData.swiftNumber || formData.swiftNumber.trim().length < 5) {
      newErrors.swiftNumber = 'Swift number must be at least 5 characters';
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
        ? '/api/parameters/bank-accounts' 
        : `/api/parameters/bank-accounts/${bankAccount?.id}`;
      
      const method = mode === 'create' ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bankId: formData.bankId,
          currencyId: formData.currencyId,
          iban: formData.iban,
          swiftNumber: formData.swiftNumber,
          isDeleted: formData.isDeleted,
        }),
      });

      if (response.ok) {
        router.push('/parameters/bank-accounts');
        router.refresh();
      } else {
        const error = await response.json();
        console.error('Error saving bank account:', error);
      }
    } catch (error) {
      console.error('Error saving bank account:', error);
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
            href="/parameters/bank-accounts"
            className="inline-flex items-center justify-center gap-2 text-slate-600 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <div className="h-10 w-10 rounded-xl bg-teal-100 flex items-center justify-center">
            <Save size={20} className="text-teal-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              {mode === 'create' ? 'New Bank Account' : mode === 'edit' ? 'Edit Bank Account' : 'View Bank Account'}
            </h1>
            <p className="text-sm text-slate-500">
              {mode === 'create' ? 'Create a new bank account' : bankAccount?.iban || ''}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isViewMode && bankAccount && (
            <Link
              href={`/parameters/bank-accounts?mode=edit&id=${bankAccount.id}`}
              className="inline-flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors shadow-sm"
            >
              <Save size={16} />
              Edit
            </Link>
          )}
          {!isViewMode && (
            <>
              <Link
                href="/parameters/bank-accounts"
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
            <CardTitle>Bank Account Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="bankId" className="text-sm font-medium text-slate-700">
                  Bank <span className="text-red-500">*</span>
                </label>
                <select
                  id="bankId"
                  value={formData.bankId}
                  onChange={(e) => setFormData({ ...formData, bankId: e.target.value })}
                  disabled={isViewMode || isSubmitting}
                  className={`w-full px-3 py-2 border rounded-lg ${errors.bankId ? 'border-red-500' : 'border-slate-300'}`}
                >
                  <option value="">Select a bank</option>
                  {banks.map((bank) => (
                    <option key={bank.id} value={bank.id}>
                      {bank.name}
                    </option>
                  ))}
                </select>
                {errors.bankId && (
                  <p className="text-sm text-red-500">{errors.bankId}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="currencyId" className="text-sm font-medium text-slate-700">
                  Currency <span className="text-red-500">*</span>
                </label>
                <select
                  id="currencyId"
                  value={formData.currencyId}
                  onChange={(e) => setFormData({ ...formData, currencyId: e.target.value })}
                  disabled={isViewMode || isSubmitting}
                  className={`w-full px-3 py-2 border rounded-lg ${errors.currencyId ? 'border-red-500' : 'border-slate-300'}`}
                >
                  <option value="">Select a currency</option>
                  {currencies.map((currency) => (
                    <option key={currency.id} value={currency.id}>
                      {currency.code} - {currency.name}
                    </option>
                  ))}
                </select>
                {errors.currencyId && (
                  <p className="text-sm text-red-500">{errors.currencyId}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="iban" className="text-sm font-medium text-slate-700">
                  IBAN <span className="text-red-500">*</span>
                </label>
                <Input
                  id="iban"
                  value={formData.iban}
                  onChange={(e) => setFormData({ ...formData, iban: e.target.value.toUpperCase() })}
                  disabled={isViewMode || isSubmitting}
                  placeholder="Enter IBAN"
                  className={`font-mono ${errors.iban ? 'border-red-500' : ''}`}
                />
                {errors.iban && (
                  <p className="text-sm text-red-500">{errors.iban}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="swiftNumber" className="text-sm font-medium text-slate-700">
                  Swift Number <span className="text-red-500">*</span>
                </label>
                <Input
                  id="swiftNumber"
                  value={formData.swiftNumber}
                  onChange={(e) => setFormData({ ...formData, swiftNumber: e.target.value.toUpperCase() })}
                  disabled={isViewMode || isSubmitting}
                  placeholder="Enter Swift number"
                  className={`font-mono ${errors.swiftNumber ? 'border-red-500' : ''}`}
                />
                {errors.swiftNumber && (
                  <p className="text-sm text-red-500">{errors.swiftNumber}</p>
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
                      className="w-4 h-4 text-teal-600 border-slate-300 rounded focus:ring-teal-500"
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
