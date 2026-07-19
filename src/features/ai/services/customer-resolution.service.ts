import { CustomerInfo } from '../channels/types';
import { prisma } from '@/lib/prisma';

export class CustomerResolutionService {
  /**
   * Mevcut müşteriyi bul
   */
  async findCustomer(identifier: string): Promise<any> {
    try {
      // Telefon veya email ile ara
      const customer = await prisma.customer.findFirst({
        where: {
          OR: [
            { phone: identifier },
            { email: identifier }
          ]
        }
      });

      return customer;
    } catch (error) {
      console.error('Error finding customer:', error);
      return null;
    }
  }

  /**
   * Yeni müşteri oluştur
   */
  async createCustomer(info: CustomerInfo): Promise<any> {
    try {
      const customer = await prisma.customer.create({
        data: {
          firstName: info.firstName || '',
          lastName: info.lastName || '',
          email: info.email,
          phone: info.phone,
          street: info.street,
          city: info.city,
          postalCode: info.postalCode
        }
      });

      return customer;
    } catch (error) {
      console.error('Error creating customer:', error);
      throw error;
    }
  }

  /**
   * Eksik müşteri bilgilerini belirle
   */
  getMissingCustomerInfo(info: any): string[] {
    const required = ['firstName', 'lastName', 'phone'];
    const missing: string[] = [];

    for (const field of required) {
      if (!info[field]) {
        missing.push(field);
      }
    }

    return missing;
  }
}
