import { prisma } from '@/lib/prisma';
import { BankList } from '@/features/parameters/banks/components/bank-list';
import { BankForm } from '@/features/parameters/banks/components/bank-form';
import { requireRole } from '@/lib/auth-guard';

export default async function BanksPage({
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
  const bankId = params.id;

  let bank = null;
  if ((mode === 'edit' || mode === 'view') && bankId) {
    bank = await prisma.bank.findUnique({
      where: { id: bankId },
    });
  }

  const banks = await prisma.bank.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });

  if (mode !== 'list') {
    return <BankForm mode={mode} bank={bank || undefined} />;
  }

  return <BankList banks={banks} />;
}
