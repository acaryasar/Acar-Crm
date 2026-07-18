import { prisma } from '@/lib/prisma';
import { SalesTypeList } from '@/features/parameters/sales-types/components/sales-type-list';
import { SalesTypeForm } from '@/features/parameters/sales-types/components/sales-type-form';
import { requireRole } from '@/lib/auth-guard';

export default async function SalesTypesPage({
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
  const salesTypeId = params.id;

  let salesType = null;
  if ((mode === 'edit' || mode === 'view') && salesTypeId) {
    salesType = await prisma.salesType.findUnique({
      where: { id: salesTypeId },
    });
  }

  const salesTypes = await prisma.saleType.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });

  if (mode !== 'list') {
    return <SalesTypeForm mode={mode} salesType={salesType || undefined} />;
  }

  return <SalesTypeList salesTypes={salesTypes} />;
}
