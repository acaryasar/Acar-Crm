import { prisma } from '@/lib/prisma';
import { CargoFirmList } from '@/features/parameters/cargo-firms/components/cargo-firm-list';
import { CargoFirmForm } from '@/features/parameters/cargo-firms/components/cargo-firm-form';
import { requireRole } from '@/lib/auth-guard';

export default async function CargoFirmsPage({
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
  const cargoFirmId = params.id;

  let cargoFirm = null;
  if ((mode === 'edit' || mode === 'view') && cargoFirmId) {
    cargoFirm = await prisma.cargoFirm.findUnique({
      where: { id: cargoFirmId },
    });
  }

  const cargoFirms = await prisma.cargoFirm.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });

  if (mode !== 'list') {
    return <CargoFirmForm mode={mode} cargoFirm={cargoFirm || undefined} />;
  }

  return <CargoFirmList cargoFirms={cargoFirms} />;
}
