'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';

interface Department {
  id: number;
  name: string;
  isActive: boolean;
}

interface CustomerType {
  id: number;
  name: string;
  isActive: boolean;
}

interface CargoFirm {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  isActive: boolean;
}

interface SaleType {
  id: number;
  name: string;
  isActive: boolean;
}

export default function ParametersPage() {
  const [activeTab, setActiveTab] = useState('departments');
  const [searchQuery, setSearchQuery] = useState('');
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  const [departments, setDepartments] = useState<Department[]>([]);
  const [customerTypes, setCustomerTypes] = useState<CustomerType[]>([]);
  const [cargoFirms, setCargoFirms] = useState<CargoFirm[]>([]);
  const [saleTypes, setSaleTypes] = useState<SaleType[]>([]);

  useEffect(() => {
    loadDepartments();
    loadCustomerTypes();
    loadCargoFirms();
    loadSaleTypes();
  }, []);

  const loadDepartments = async () => {
    try {
      const response = await fetch('/api/parameters/departments');
      if (response.ok) {
        const data = await response.json();
        setDepartments(data.data || []);
      }
    } catch (error) {
      console.error('Error loading departments:', error);
    }
  };

  const loadCustomerTypes = async () => {
    try {
      const response = await fetch('/api/parameters/customer-types');
      if (response.ok) {
        const data = await response.json();
        setCustomerTypes(data.data || []);
      }
    } catch (error) {
      console.error('Error loading customer types:', error);
    }
  };

  const loadCargoFirms = async () => {
    try {
      const response = await fetch('/api/parameters/cargo-firms');
      if (response.ok) {
        const data = await response.json();
        setCargoFirms(data.data || []);
      }
    } catch (error) {
      console.error('Error loading cargo firms:', error);
    }
  };

  const loadSaleTypes = async () => {
    try {
      const response = await fetch('/api/parameters/sales-types');
      if (response.ok) {
        const data = await response.json();
        setSaleTypes(data.data || []);
      }
    } catch (error) {
      console.error('Error loading sales types:', error);
    }
  };

  const filteredDepartments = departments.filter(d =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredCustomerTypes = customerTypes.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredCargoFirms = cargoFirms.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredSaleTypes = saleTypes.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (item: any) => {
    setEditingItem({ ...item });
    setEditModalOpen(true);
  };

  const handleAdd = () => {
    const newItem = activeTab === 'cargo-firms' 
      ? { name: '', email: '', phoneNumber: '', address: '', isActive: true }
      : { name: '', isActive: true };
    setEditingItem(newItem);
    setAddModalOpen(true);
  };

  const handleDelete = async (id: number, type: string) => {
    if (!confirm('Bu kaydı silmek istediğinizden emin misiniz?')) return;

    try {
      const response = await fetch(`/api/parameters/${type}/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Refresh data based on type
        if (type === 'departments') {
          setDepartments(departments.filter(d => d.id !== id));
        } else if (type === 'customer-types') {
          setCustomerTypes(customerTypes.filter(c => c.id !== id));
        } else if (type === 'cargo-firms') {
          setCargoFirms(cargoFirms.filter(c => c.id !== id));
        } else if (type === 'sales-types') {
          setSaleTypes(saleTypes.filter(s => s.id !== id));
        }
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleToggleActive = async (item: any, type: string) => {
    try {
      const response = await fetch(`/api/parameters/${type}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...item,
          isActive: !item.isActive,
        }),
      });

      if (response.ok) {
        const updated = await response.json();
        // Update local state based on type
        if (type === 'departments') {
          setDepartments(departments.map(d => d.id === item.id ? { ...d, isActive: !item.isActive } : d));
        } else if (type === 'customer-types') {
          setCustomerTypes(customerTypes.map(c => c.id === item.id ? { ...c, isActive: !item.isActive } : c));
        } else if (type === 'cargo-firms') {
          setCargoFirms(cargoFirms.map(c => c.id === item.id ? { ...c, isActive: !item.isActive } : c));
        } else if (type === 'sales-types') {
          setSaleTypes(saleTypes.map(s => s.id === item.id ? { ...s, isActive: !item.isActive } : s));
        }
      }
    } catch (error) {
      console.error('Error toggling active:', error);
    }
  };

  const handleSave = async (isAdd: boolean = false) => {
    try {
      const type = activeTab === 'departments' ? 'departments' :
                   activeTab === 'customer-types' ? 'customer-types' :
                   activeTab === 'cargo-firms' ? 'cargo-firms' : 'sales-types';

      const method = isAdd ? 'POST' : 'PUT';
      const response = await fetch(`/api/parameters/${type}`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingItem),
      });

      if (response.ok) {
        const result = await response.json();
        if (isAdd) {
          // Add new item to local state
          if (type === 'departments') {
            setDepartments([...departments, result.data]);
          } else if (type === 'customer-types') {
            setCustomerTypes([...customerTypes, result.data]);
          } else if (type === 'cargo-firms') {
            setCargoFirms([...cargoFirms, result.data]);
          } else if (type === 'sales-types') {
            setSaleTypes([...saleTypes, result.data]);
          }
          setAddModalOpen(false);
        } else {
          // Update existing item in local state
          if (type === 'departments') {
            setDepartments(departments.map(d => d.id === editingItem.id ? result.data : d));
          } else if (type === 'customer-types') {
            setCustomerTypes(customerTypes.map(c => c.id === editingItem.id ? result.data : c));
          } else if (type === 'cargo-firms') {
            setCargoFirms(cargoFirms.map(c => c.id === editingItem.id ? result.data : c));
          } else if (type === 'sales-types') {
            setSaleTypes(saleTypes.map(s => s.id === editingItem.id ? result.data : s));
          }
          setEditModalOpen(false);
        }
      }
    } catch (error) {
      console.error('Error saving item:', error);
    }
  };

  const renderDepartmentsTable = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>İsim</TableHead>
          <TableHead>Durum</TableHead>
          <TableHead>İşlemler</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredDepartments.map((dept) => (
          <TableRow key={dept.id}>
            <TableCell>{dept.id}</TableCell>
            <TableCell>{dept.name}</TableCell>
            <TableCell>
              <Switch
                checked={dept.isActive}
                onCheckedChange={() => handleToggleActive(dept, 'departments')}
              />
            </TableCell>
            <TableCell>
              <Button variant="ghost" size="sm" onClick={() => handleEdit(dept)}>
                <Pencil className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => handleDelete(dept.id, 'departments')}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  const renderCustomerTypesTable = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>İsim</TableHead>
          <TableHead>Durum</TableHead>
          <TableHead>İşlemler</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredCustomerTypes.map((type) => (
          <TableRow key={type.id}>
            <TableCell>{type.id}</TableCell>
            <TableCell>{type.name}</TableCell>
            <TableCell>
              <Switch
                checked={type.isActive}
                onCheckedChange={() => handleToggleActive(type, 'customer-types')}
              />
            </TableCell>
            <TableCell>
              <Button variant="ghost" size="sm" onClick={() => handleEdit(type)}>
                <Pencil className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => handleDelete(type.id, 'customer-types')}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  const renderCargoFirmsTable = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>İsim</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Telefon</TableHead>
          <TableHead>Durum</TableHead>
          <TableHead>İşlemler</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredCargoFirms.map((firm) => (
          <TableRow key={firm.id}>
            <TableCell>{firm.id}</TableCell>
            <TableCell>{firm.name}</TableCell>
            <TableCell>{firm.email}</TableCell>
            <TableCell>{firm.phoneNumber}</TableCell>
            <TableCell>
              <Switch
                checked={firm.isActive}
                onCheckedChange={() => handleToggleActive(firm, 'cargo-firms')}
              />
            </TableCell>
            <TableCell>
              <Button variant="ghost" size="sm" onClick={() => handleEdit(firm)}>
                <Pencil className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => handleDelete(firm.id, 'cargo-firms')}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  const renderSaleTypesTable = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>İsim</TableHead>
          <TableHead>Durum</TableHead>
          <TableHead>İşlemler</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredSaleTypes.map((type) => (
          <TableRow key={type.id}>
            <TableCell>{type.id}</TableCell>
            <TableCell>{type.name}</TableCell>
            <TableCell>
              <Switch
                checked={type.isActive}
                onCheckedChange={() => handleToggleActive(type, 'sales-types')}
              />
            </TableCell>
            <TableCell>
              <Button variant="ghost" size="sm" onClick={() => handleEdit(type)}>
                <Pencil className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => handleDelete(type.id, 'sales-types')}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Parametre Yönetimi</h1>
        <p className="text-muted-foreground">Departmanlar, müşteri tipleri, kargo firmaları ve satış tiplerini yönetin</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="departments">Departmanlar</TabsTrigger>
            <TabsTrigger value="customer-types">Müşteri Tipleri</TabsTrigger>
            <TabsTrigger value="cargo-firms">Kargo Firmaları</TabsTrigger>
            <TabsTrigger value="sales-types">Satış Tipleri</TabsTrigger>
          </TabsList>

          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 w-64"
              />
            </div>
            <Button onClick={handleAdd}>
              <Plus className="h-4 w-4 mr-2" />
              Yeni Ekle
            </Button>
          </div>
        </div>

        <TabsContent value="departments">
          {renderDepartmentsTable()}
        </TabsContent>

        <TabsContent value="customer-types">
          {renderCustomerTypesTable()}
        </TabsContent>

        <TabsContent value="cargo-firms">
          {renderCargoFirmsTable()}
        </TabsContent>

        <TabsContent value="sales-types">
          {renderSaleTypesTable()}
        </TabsContent>
      </Tabs>

      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Düzenle</DialogTitle>
            <DialogDescription>
              Kayıt bilgilerini düzenleyin
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">İsim</label>
              <Input
                value={editingItem?.name || ''}
                onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
              />
            </div>
            {activeTab === 'cargo-firms' && editingItem && (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <Input
                    value={editingItem?.email || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, email: e.target.value })}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Telefon</label>
                  <Input
                    value={editingItem?.phoneNumber || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, phoneNumber: e.target.value })}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Adres</label>
                  <Input
                    value={editingItem?.address || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, address: e.target.value })}
                  />
                </div>
              </>
            )}
            <div className="flex items-center gap-2">
              <Switch
                checked={editingItem?.isActive || false}
                onCheckedChange={(checked: boolean) => setEditingItem({ ...editingItem, isActive: checked })}
              />
              <label className="text-sm">Aktif</label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditModalOpen(false)}>
              İptal
            </Button>
            <Button onClick={() => handleSave(false)}>
              Kaydet
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Yeni Ekle</DialogTitle>
            <DialogDescription>
              Yeni kayıt oluşturun
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">İsim</label>
              <Input
                value={editingItem?.name || ''}
                onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
              />
            </div>
            {activeTab === 'cargo-firms' && editingItem && (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <Input
                    value={editingItem?.email || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, email: e.target.value })}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Telefon</label>
                  <Input
                    value={editingItem?.phoneNumber || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, phoneNumber: e.target.value })}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Adres</label>
                  <Input
                    value={editingItem?.address || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, address: e.target.value })}
                  />
                </div>
              </>
            )}
            <div className="flex items-center gap-2">
              <Switch
                checked={editingItem?.isActive || false}
                onCheckedChange={(checked: boolean) => setEditingItem({ ...editingItem, isActive: checked })}
              />
              <label className="text-sm">Aktif</label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddModalOpen(false)}>
              İptal
            </Button>
            <Button onClick={() => handleSave(true)}>
              Kaydet
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
