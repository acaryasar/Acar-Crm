'use client';

import { useState } from 'react';
import { Plus, Search, Edit, Trash2, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useRouter } from 'next/navigation';

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

interface BankAccountListProps {
  bankAccounts: BankAccount[];
}

export function BankAccountList({ bankAccounts }: BankAccountListProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filteredBankAccounts = bankAccounts.filter(
    (ba) =>
      ba.iban.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ba.swiftNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ba.bank.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ba.currency.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async () => {
    if (!selectedId) return;

    try {
      const response = await fetch(`/api/parameters/bank-accounts/${selectedId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.refresh();
        setDeleteDialogOpen(false);
        setSelectedId(null);
      }
    } catch (error) {
      console.error('Error deleting bank account:', error);
    }
  };

  const handleExportExcel = () => {
    const data = filteredBankAccounts.map((ba) => ({
      'Bank': ba.bank.name,
      'Currency': ba.currency.code,
      'IBAN': ba.iban,
      'Swift': ba.swiftNumber,
      'Active': ba.isDeleted ? 'No' : 'Yes',
      'Created At': new Date(ba.createdAt).toLocaleString(),
    }));

    const headers = Object.keys(data[0] || {});
    const csvContent = [
      headers.join(','),
      ...data.map((row) => headers.map((header) => `"${row[header as keyof typeof row]}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `bank-accounts-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6 shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-teal-100 flex items-center justify-center">
            <CreditCard size={20} className="text-teal-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Bank Accounts</h1>
            <p className="text-sm text-slate-500">{filteredBankAccounts.length} bank accounts</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportExcel}
            className="gap-2"
          >
            <CreditCard size={16} />
            Export
          </Button>
          <Button
            onClick={() => router.push('/parameters/bank-accounts?mode=create')}
            className="gap-2"
          >
            <Plus size={16} />
            New Bank Account
          </Button>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-auto border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Bank</TableHead>
              <TableHead>Currency</TableHead>
              <TableHead>IBAN</TableHead>
              <TableHead>Swift</TableHead>
              <TableHead>Active</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBankAccounts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                  No bank accounts found
                </TableCell>
              </TableRow>
            ) : (
              filteredBankAccounts.map((bankAccount) => (
                <TableRow key={bankAccount.id}>
                  <TableCell className="font-medium">{bankAccount.bank.name}</TableCell>
                  <TableCell>{bankAccount.currency.code}</TableCell>
                  <TableCell className="font-mono text-sm">{bankAccount.iban}</TableCell>
                  <TableCell className="font-mono text-sm">{bankAccount.swiftNumber}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        bankAccount.isDeleted
                          ? 'bg-red-100 text-red-700'
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {bankAccount.isDeleted ? 'Inactive' : 'Active'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push(`/parameters/bank-accounts?mode=edit&id=${bankAccount.id}`)}
                      >
                        <Edit size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedId(bankAccount.id);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 size={16} className="text-red-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Bank Account</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this bank account? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
