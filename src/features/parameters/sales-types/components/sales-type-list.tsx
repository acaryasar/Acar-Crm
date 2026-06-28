'use client';

import { useState } from 'react';
import { Plus, Search, Edit, Trash2, FileSpreadsheet } from 'lucide-react';
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

interface SalesType {
  id: string;
  guidId: string;
  name: string | null;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface SalesTypeListProps {
  salesTypes: SalesType[];
}

export function SalesTypeList({ salesTypes }: SalesTypeListProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filteredSalesTypes = salesTypes.filter(
    (st) =>
      st.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      st.guidId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async () => {
    if (!selectedId) return;

    try {
      const response = await fetch(`/api/parameters/sales-types/${selectedId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.refresh();
        setDeleteDialogOpen(false);
        setSelectedId(null);
      }
    } catch (error) {
      console.error('Error deleting sales type:', error);
    }
  };

  const handleExportExcel = () => {
    const data = filteredSalesTypes.map((st) => ({
      'Guid ID': st.guidId,
      'Name': st.name || '',
      'Active': st.isDeleted ? 'No' : 'Yes',
      'Created At': new Date(st.createdAt).toLocaleString(),
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
    link.setAttribute('download', `sales-types-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6 shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-indigo-100 flex items-center justify-center">
            <FileSpreadsheet size={20} className="text-indigo-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Sales Types</h1>
            <p className="text-sm text-slate-500">{filteredSalesTypes.length} sales types</p>
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
            <FileSpreadsheet size={16} />
            Export
          </Button>
          <Button
            onClick={() => router.push('/dashboard/parameters/sales-types?mode=create')}
            className="gap-2"
          >
            <Plus size={16} />
            New Sales Type
          </Button>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-auto border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Guid ID</TableHead>
              <TableHead>Active</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSalesTypes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                  No sales types found
                </TableCell>
              </TableRow>
            ) : (
              filteredSalesTypes.map((salesType) => (
                <TableRow key={salesType.id}>
                  <TableCell className="font-medium">{salesType.name || '-'}</TableCell>
                  <TableCell className="text-slate-500">{salesType.guidId}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        salesType.isDeleted
                          ? 'bg-red-100 text-red-700'
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {salesType.isDeleted ? 'Inactive' : 'Active'}
                    </span>
                  </TableCell>
                  <TableCell className="text-slate-500">
                    {new Date(salesType.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push(`/dashboard/parameters/sales-types?mode=edit&id=${salesType.id}`)}
                      >
                        <Edit size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedId(salesType.id);
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
            <AlertDialogTitle>Delete Sales Type</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this sales type? This action cannot be undone.
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
