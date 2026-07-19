import { prisma } from '@/lib/prisma';
import { CustomerTypeList } from '@/features/parameters/customer-types/components/customer-type-list';
import { CustomerTypeForm } from '@/features/parameters/customer-types/components/customer-type-form';
import { requireRole } from '@/lib/auth-guard';

export default async function CustomerTypesPage({
  searchParams,
}: {
  searchParams: Promise<{
    mode?: 'create' | 'edit' | 'view';
    id?: string;
  }>;
}) {
  const session = await requireRole(['ADMIN', 'SUPERVISOR', 'MANAGER']);
  const params = await searchParams;
  const mode = params.mode || 'list';
  const customerTypeId = params.id;

  let customerType = null;
  if ((mode === 'edit' || mode === 'view') && customerTypeId) {
    customerType = await prisma.customerType.findUnique({
      where: { id: customerTypeId },
    });
  }

  const customerTypes = await prisma.customerType.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });

  if (mode !== 'list') {
    return <CustomerTypeForm mode={mode} customerType={customerType || undefined} />;
  }

  return <CustomerTypeList customerTypes={customerTypes} />;
}
