import { prisma } from '@/lib/prisma';
import { CustomerAuthorityList } from '@/features/parameters/customer-authorities/components/customer-authority-list';
import { CustomerAuthorityForm } from '@/features/parameters/customer-authorities/components/customer-authority-form';
import { requireRole } from '@/lib/auth-guard';

export default async function CustomerAuthoritiesPage({
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
  const customerAuthorityId = params.id;

  let customerAuthority = null;
  if ((mode === 'edit' || mode === 'view') && customerAuthorityId) {
    customerAuthority = await prisma.customerAuthority.findUnique({
      where: { id: customerAuthorityId },
    });
  }

  const customerAuthorities = await prisma.customerAuthority.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });

  if (mode !== 'list') {
    return <CustomerAuthorityForm mode={mode} customerAuthority={customerAuthority || undefined} />;
  }

  return <CustomerAuthorityList customerAuthorities={customerAuthorities} />;
}
