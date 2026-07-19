import { prisma } from '@/lib/prisma';
import { CurrencyList } from '@/features/parameters/currencies/components/currency-list';
import { CurrencyForm } from '@/features/parameters/currencies/components/currency-form';
import { requireRole } from '@/lib/auth-guard';

export default async function CurrenciesPage({
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
  const currencyId = params.id;

  let currency = null;
  if ((mode === 'edit' || mode === 'view') && currencyId) {
    currency = await prisma.currency.findUnique({
      where: { id: currencyId },
    });
  }

  const currencies = await prisma.currency.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });

  if (mode !== 'list') {
    return <CurrencyForm mode={mode} currency={currency || undefined} />;
  }

  return <CurrencyList currencies={currencies} />;
}
