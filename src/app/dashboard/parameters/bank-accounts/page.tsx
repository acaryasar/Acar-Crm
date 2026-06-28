import { prisma } from '@/lib/prisma';
import { BankAccountList } from '@/features/parameters/bank-accounts/components/bank-account-list';
import { BankAccountForm } from '@/features/parameters/bank-accounts/components/bank-account-form';
import { requireRole } from '@/lib/auth-guard';

export default async function BankAccountsPage({
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
  const bankAccountId = params.id;

  let bankAccount = null;
  if ((mode === 'edit' || mode === 'view') && bankAccountId) {
    bankAccount = await prisma.bankAccount.findUnique({
      where: { id: bankAccountId },
      include: {
        bank: true,
        currency: true,
      },
    });
  }

  const bankAccounts = await prisma.bankAccount.findMany({
    include: {
      bank: true,
      currency: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const banks = await prisma.bank.findMany({
    where: { isDeleted: false },
    orderBy: { name: 'asc' },
  });

  const currencies = await prisma.currency.findMany({
    where: { isDeleted: false },
    orderBy: { code: 'asc' },
  });

  if (mode !== 'list') {
    return (
      <BankAccountForm 
        mode={mode} 
        bankAccount={bankAccount || undefined} 
        banks={banks}
        currencies={currencies}
      />
    );
  }

  return <BankAccountList bankAccounts={bankAccounts} />;
}
