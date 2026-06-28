'use client';

import { useState } from 'react';
import { Plus, Search, Edit, Trash2, UserCog } from 'lucide-react';
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

interface CustomerAuthority {
  id: string;
  name: string;
  email: string;
  title: string;
  gsm: string;
  phone: string;
  isDeleted: boolean;
  deletedAt: Date | null;
  deletedBy: string | null;
  createdAt: Date;
  createdBy: string | null;
  updatedAt: Date;
  updatedBy: string | null;
}

interface CustomerAuthorityListProps {
  customerAuthorities: CustomerAuthority[];
}

export function CustomerAuthorityList({ customerAuthorities }: CustomerAuthorityListProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filteredCustomerAuthorities = customerAuthorities.filter(
    (ca) =>
      ca.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ca.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ca.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ca.gsm.includes(searchTerm) ||
      ca.phone.includes(searchTerm)
  );

  const handleDelete = async () => {
    if (!selectedId) return;

    try {
      const response = await fetch(`/api/parameters/customer-authorities/${selectedId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.refresh();
        setDeleteDialogOpen(false);
        setSelectedId(null);
      }
    } catch (error) {
      console.error('Error deleting customer authority:', error);
    }
  };

  const handleExportExcel = () => {
    const data = filteredCustomerAuthorities.map((ca) => ({
      'Name': ca.name,
      'Email': ca.email,
      'Title': ca.title,
      'GSM': ca.gsm,
      'Phone': ca.phone,
      'Active': ca.isDeleted ? 'No' : 'Yes',
      'Created At': new Date(ca.createdAt).toLocaleString(),
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
    link.setAttribute('download', `customer-authorities-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6 shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-pink-100 flex items-center justify-center">
            <UserCog size={20} className="text-pink-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Customer Authorities</h1>
            <p className="text-sm text-slate-500">{filteredCustomerAuthorities.length} customer authorities</p>
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
            <UserCog size={16} />
            Export
          </Button>
          <Button
            onClick={() => router.push('/dashboard/parameters/customer-authorities?mode=create')}
            className="gap-2"
          >
            <Plus size={16} />
            New Customer Authority
          </Button>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-auto border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>GSM</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Active</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomerAuthorities.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-slate-500">
                  No customer authorities found
                </TableCell>
              </TableRow>
            ) : (
              filteredCustomerAuthorities.map((customerAuthority) => (
                <TableRow key={customerAuthority.id}>
                  <TableCell className="font-medium">{customerAuthority.name}</TableCell>
                  <TableCell>{customerAuthority.title}</TableCell>
                  <TableCell>{customerAuthority.email}</TableCell>
                  <TableCell>{customerAuthority.gsm}</TableCell>
                  <TableCell>{customerAuthority.phone}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        customerAuthority.isDeleted
                          ? 'bg-red-100 text-red-700'
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {customerAuthority.isDeleted ? 'Inactive' : 'Active'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push(`/dashboard/parameters/customer-authorities?mode=edit&id=${customerAuthority.id}`)}
                      >
                        <Edit size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedId(customerAuthority.id);
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
            <AlertDialogTitle>Delete Customer Authority</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this customer authority? This action cannot be undone.
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
