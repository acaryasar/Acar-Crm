import { prisma } from '@/lib/prisma';

export class AppointmentSchedulerService {
  /**
   * Müsait kullanıcıları bul
   */
  async findAvailableUsers(
    startAt: Date,
    endAt: Date,
    companyId: string
  ): Promise<any[]> {
    try {
      // Belirtilen zaman aralığında randevusu olmayan kullanıcıları bul
      const users = await prisma.user.findMany({
        where: {
          companyId,
          is_active: true,
          appointments: {
            none: {
              OR: [
                {
                  AND: [
                    { startAt: { lte: startAt } },
                    { endAt: { gt: startAt } }
                  ]
                },
                {
                  AND: [
                    { startAt: { lt: endAt } },
                    { endAt: { gte: endAt } }
                  ]
                },
                {
                  AND: [
                    { startAt: { gte: startAt } },
                    { endAt: { lte: endAt } }
                  ]
                }
              ]
            }
          }
        }
      });

      return users;
    } catch (error) {
      console.error('Error finding available users:', error);
      return [];
    }
  }

  /**
   * En uygun kullanıcıyı seç
   */
  async selectBestUser(
    availableUsers: any[],
    customer: any,
    entities: Record<string, any>
  ): Promise<any> {
    // Basit implementasyon: İlk kullanıcıyı seç
    // İleride AI ile daha akıllı seçim yapılabilir
    if (availableUsers.length === 0) {
      throw new Error('No available users');
    }

    // Kategori bazlı uzmanlık seçimi (basit)
    const category = entities.category;
    if (category) {
      // Kategoriye göre uygun kullanıcı bul (basit mantık)
      const specialist = availableUsers.find(user => 
        user.role === 'EMPLOYEE' || user.role === 'MANAGER'
      );
      if (specialist) return specialist;
    }

    return availableUsers[0];
  }

  /**
   * Randevu oluştur
   */
  async createAppointment(data: {
    customerId: string;
    employeeId: string;
    companyId: string;
    startAt: Date;
    endAt: Date;
    title: string;
    description?: string;
  }): Promise<any> {
    try {
      const appointment = await prisma.appointment.create({
        data: {
          customerId: data.customerId,
          employeeId: data.employeeId,
          companyId: data.companyId,
          startAt: data.startAt,
          endAt: data.endAt,
          title: data.title,
          description: data.description
        }
      });

      return appointment;
    } catch (error) {
      console.error('Error creating appointment:', error);
      throw error;
    }
  }
}
