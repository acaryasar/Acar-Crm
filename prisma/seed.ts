import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash("Admin123!", 10);

  // Users
  const admin = await prisma.user.upsert({
    where: { email: "admin@acar-crm.local" },
    create: {
      email: "admin@acar-crm.local",
      password,
      firstName: "Ahmet",
      lastName: "Yılmaz",
      role: "ADMIN",
      locale: "TR",
    },
    update: { password },
  });

  const manager = await prisma.user.upsert({
    where: { email: "manager@acar-crm.local" },
    create: {
      email: "manager@acar-crm.local",
      password,
      firstName: "Ayşe",
      lastName: "Kaya",
      role: "MANAGER",
      locale: "TR",
    },
    update: {},
  });

  const emp1 = await prisma.user.upsert({
    where: { email: "emp1@acar-crm.local" },
    create: {
      email: "emp1@acar-crm.local",
      password,
      firstName: "Can",
      lastName: "Öztürk",
      role: "EMPLOYEE",
      locale: "TR",
    },
    update: {},
  });

  const emp2 = await prisma.user.upsert({
    where: { email: "emp2@acar-crm.local" },
    create: {
      email: "emp2@acar-crm.local",
      password,
      firstName: "Emre",
      lastName: "Yıldız",
      role: "EMPLOYEE",
      locale: "TR",
    },
    update: {},
  });

  const supervisor = await prisma.user.upsert({
    where: { email: "supervisor@acar-crm.local" },
    create: {
      email: "supervisor@acar-crm.local",
      password,
      firstName: "Serkan",
      lastName: "Arslan",
      role: "SUPERVISOR",
      locale: "TR",
    },
    update: {},
  });

  const allUsers = [admin, manager, emp1, emp2, supervisor];

  // Customers
  const customersData = [
    { firstName: "Yıldız Teknik", lastName: "A.Ş.", email: "info@yildizteknik.com", phone: "+90 532 1234567", street: "Atatürk Caddesi 12", city: "İstanbul", postalCode: "34000" },
    { firstName: "Demir İnşaat", lastName: "Ltd. Şti.", email: "info@demirinsaat.com", phone: "+90 533 9876543", street: "Bağdat Caddesi 45", city: "İstanbul", postalCode: "34700" },
    { firstName: "Kaya Lojistik", lastName: "A.Ş.", email: "info@kayalojistik.com", phone: "+90 534 5554433", street: "Barış Manço Sokak 7", city: "Ankara", postalCode: "06000" },
    { firstName: "Çelik Metal", lastName: "San. Tic. Ltd. Şti.", email: "info@celikmetal.com", phone: "+90 535 6667788", street: "Cumhuriyet Caddesi 22", city: "İzmir", postalCode: "35000" },
    { firstName: "Şahin Otomotiv", lastName: "A.Ş.", email: "info@sahinoto.com", phone: "+90 542 1112233", street: "Gül Sokak 3", city: "Bursa", postalCode: "16000" },
  ];

  const customers = [];
  const originalIds = ["yilmaz", "demir", "kaya", "celik", "sahin"];
  for (let i = 0; i < customersData.length; i++) {
    const data = customersData[i];
    const customer = await prisma.customer.upsert({
      where: { id: `seed-c-${originalIds[i]}` },
      create: { id: `seed-c-${originalIds[i]}`, ...data },
      update: data,
    });
    customers.push(customer);
  }

  // Tickets
  const ticketsData = [
    { title: "Ürün teslimat gecikmesi", description: "Siparişimdeki ürünler henüz teslim edilmedi, kargo takibinde bilgi yok.", category: "OTHER" as const, priority: "HIGH" as const, status: "NEW" as const, source: "EMAIL" as const, customer: customers[0] },
    { title: "Fatura itirazı", description: "Son faturada yanlış tutar yansıtılmış, düzeltme talep ediyorum.", category: "OTHER" as const, priority: "URGENT" as const, status: "ASSIGNED" as const, source: "PHONE" as const, customer: customers[1] },
    { title: "Sipariş değişikliği", description: "Siparişimdeki ürün miktarını artırmak istiyorum.", category: "OTHER" as const, priority: "MEDIUM" as const, status: "IN_PROGRESS" as const, source: "WEB_CHAT" as const, customer: customers[2] },
    { title: "Ürün iadesi", description: "Teslim edilen ürün hasarlı, iade talep ediyorum.", category: "OTHER" as const, priority: "HIGH" as const, status: "NEW" as const, source: "EMAIL" as const, customer: customers[3] },
    { title: "Kargo hasarı", description: "Kargoda ürün kırılmış, hasar tespiti için talep.", category: "OTHER" as const, priority: "URGENT" as const, status: "ASSIGNED" as const, source: "PHONE" as const, customer: customers[4] },
  ];

  const now = new Date();
  for (let i = 0; i < ticketsData.length; i++) {
    const t = ticketsData[i];
    await prisma.ticket.upsert({
      where: { id: `seed-t-${String(i).padStart(2, "0")}` },
      create: {
        id: `seed-t-${String(i).padStart(2, "0")}`,
        customerId: t.customer.id,
        assignedUserId: i % 2 === 0 ? emp1.id : emp2.id,
        title: t.title,
        description: t.description,
        category: t.category,
        priority: t.priority,
        status: t.status,
        source: t.source,
        createdAt: new Date(now.getTime() - i * 24 * 60 * 60 * 1000),
      },
      update: {},
    });
  }

  // Appointments
  const appointmentsData = [
    { title: "Klima kontrolü", description: "Klima sisteminin yıllık bakımı", status: "PLANNED" as const, daysOffset: 2, customer: customers[0], employee: emp1 },
    { title: "Boru tamiri", description: "Arızalı su borusunun değişimi", status: "PLANNED" as const, daysOffset: 3, customer: customers[1], employee: emp2 },
    { title: "Elektrik kontrolü", description: "Elektrik sistemi güvenlik kontrolü", status: "PLANNED" as const, daysOffset: 5, customer: customers[2], employee: emp1 },
  ];

  for (let i = 0; i < appointmentsData.length; i++) {
    const a = appointmentsData[i];
    const start = new Date(now.getTime() + a.daysOffset * 24 * 60 * 60 * 1000);
    start.setHours(9 + i % 4 * 2, 0, 0, 0);
    const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);

    await prisma.appointment.upsert({
      where: { id: `seed-a-${String(i).padStart(2, "0")}` },
      create: {
        id: `seed-a-${String(i).padStart(2, "0")}`,
        customerId: a.customer.id,
        employeeId: a.employee.id,
        title: a.title,
        description: a.description,
        status: a.status,
        startAt: start,
        endAt: end,
      },
      update: {},
    });
  }

  // Notifications
  const notifData = [
    { title: "Yeni Talep", message: "Yeni bir acil talep oluşturuldu.", type: "WARNING" as const, isRead: false },
    { title: "Yarın Randevu", message: "Hatırlatma: Yarın bir randevunuz var.", type: "INFO" as const, isRead: false },
    { title: "Talep Tamamlandı", message: "Bir talep başarıyla tamamlandı.", type: "SUCCESS" as const, isRead: true },
    { title: "Acil İstek", message: "Yeni bir acil istek geldi.", type: "ERROR" as const, isRead: false },
    { title: "Yeni Mesaj", message: "Bir talepe yorum eklendi.", type: "INFO" as const, isRead: true },
  ];

  let notifIndex = 0;
  for (const user of allUsers) {
    for (let i = 0; i < 3; i++) {
      const n = notifData[notifIndex % notifData.length];
      await prisma.notification.upsert({
        where: { id: `seed-notif-${String(notifIndex).padStart(3, "0")}` },
        create: {
          id: `seed-notif-${String(notifIndex).padStart(3, "0")}`,
          userId: user.id,
          title: n.title,
          message: n.message,
          type: n.type,
          isRead: n.isRead,
          createdAt: new Date(now.getTime() - notifIndex * 30 * 60 * 1000),
        },
        update: {},
      });
      notifIndex++;
    }
  }

  // Activity Logs
  const activityLogsData = [
    { userId: admin.id, action: "LOGIN", entityType: "USER", entityId: admin.id },
    { userId: manager.id, action: "TICKET_CREATED", entityType: "TICKET", entityId: `seed-t-00` },
    { userId: emp1.id, action: "TICKET_ASSIGNED", entityType: "TICKET", entityId: `seed-t-00` },
    { userId: manager.id, action: "CUSTOMER_CREATED", entityType: "CUSTOMER", entityId: customers[0].id },
    { userId: emp1.id, action: "TICKET_UPDATED", entityType: "TICKET", entityId: `seed-t-01` },
    { userId: manager.id, action: "APPOINTMENT_CREATED", entityType: "APPOINTMENT", entityId: `seed-a-00` },
    { userId: emp1.id, action: "APPOINTMENT_COMPLETED", entityType: "APPOINTMENT", entityId: `seed-a-00` },
  ];

  for (const log of activityLogsData) {
    await prisma.activityLog.upsert({
      where: { id: `seed-activity-${log.action}-${log.entityId || 'system'}` },
      create: {
        id: `seed-activity-${log.action}-${log.entityId || 'system'}`,
        userId: log.userId,
        action: log.action,
        entityType: log.entityType,
        entityId: log.entityId,
        ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
        createdAt: new Date(now.getTime() - Math.random() * 72 * 60 * 60 * 1000),
      },
      update: {},
    });
  }

  console.log("✅ Seed tamamlandı:");
  console.log(`   - ${allUsers.length} kullanıcı`);
  console.log(`   - ${customers.length} müşteri`);
  console.log(`   - ${ticketsData.length} ticket`);
  console.log(`   - ${appointmentsData.length} randevu`);
  console.log(`   - ${activityLogsData.length} aktivite logu`);
  console.log(`   - ${notifIndex} bildirim`);
  console.log(`\n   Giriş bilgileri:`);
  console.log(`   - admin@acar-crm.local / Admin123!`);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
