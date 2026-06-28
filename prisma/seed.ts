import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { readFileSync } from "fs";
import { join } from "path";

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash("Admin123!", 10);

  // Companies
  const company1 = await prisma.company.upsert({
    where: { id: "seed-company-01" },
    create: { id: "seed-company-01", name: "Acar CRM Demo" },
    update: {},
  });

  const company2 = await prisma.company.upsert({
    where: { id: "seed-company-02" },
    create: { id: "seed-company-02", name: "Acar Tech Ltd." },
    update: {},
  });

  const company3 = await prisma.company.upsert({
    where: { id: "seed-company-03" },
    create: { id: "seed-company-03", name: "Acar Global Inc." },
    update: {},
  });

  // Users - Company 1
  const admin = await prisma.user.upsert({
    where: { email: "admin@acar-crm.local" },
    create: {
      email: "admin@acar-crm.local",
      password,
      firstName: "Ahmet",
      lastName: "Yılmaz",
      role: "ADMIN",
      companyId: company1.id,
      locale: "TR",
    },
    update: { password },
  });

  const admin2 = await prisma.user.upsert({
    where: { email: "admin2@acar-crm.local" },
    create: {
      email: "admin2@acar-crm.local",
      password,
      firstName: "Mehmet",
      lastName: "Demir",
      role: "ADMIN",
      companyId: company1.id,
      locale: "TR",
    },
    update: {},
  });

  const manager = await prisma.user.upsert({
    where: { email: "manager@acar-crm.local" },
    create: {
      email: "manager@acar-crm.local",
      password,
      firstName: "Ayşe",
      lastName: "Kaya",
      role: "MANAGER",
      companyId: company1.id,
      locale: "TR",
    },
    update: {},
  });

  const manager2 = await prisma.user.upsert({
    where: { email: "manager2@acar-crm.local" },
    create: {
      email: "manager2@acar-crm.local",
      password,
      firstName: "Fatma",
      lastName: "Çelik",
      role: "MANAGER",
      companyId: company1.id,
      locale: "TR",
    },
    update: {},
  });

  const manager3 = await prisma.user.upsert({
    where: { email: "manager3@acar-crm.local" },
    create: {
      email: "manager3@acar-crm.local",
      password,
      firstName: "Ali",
      lastName: "Şahin",
      role: "MANAGER",
      companyId: company1.id,
      locale: "TR",
    },
    update: {},
  });

  const emp1 = await prisma.user.upsert({
    where: { email: "thomas@acar-crm.local" },
    create: {
      email: "thomas@acar-crm.local",
      password,
      firstName: "Can",
      lastName: "Öztürk",
      role: "EMPLOYEE",
      companyId: company1.id,
      locale: "TR",
    },
    update: {},
  });

  const emp2 = await prisma.user.upsert({
    where: { email: "stefan@acar-crm.local" },
    create: {
      email: "stefan@acar-crm.local",
      password,
      firstName: "Emre",
      lastName: "Yıldız",
      role: "EMPLOYEE",
      companyId: company1.id,
      locale: "TR",
    },
    update: {},
  });

  const emp3 = await prisma.user.upsert({
    where: { email: "emp3@acar-crm.local" },
    create: {
      email: "emp3@acar-crm.local",
      password,
      firstName: "Burak",
      lastName: "Aydın",
      role: "EMPLOYEE",
      companyId: company1.id,
      locale: "TR",
    },
    update: {},
  });

  const emp4 = await prisma.user.upsert({
    where: { email: "emp4@acar-crm.local" },
    create: {
      email: "emp4@acar-crm.local",
      password,
      firstName: "Elif",
      lastName: "Koç",
      role: "EMPLOYEE",
      companyId: company1.id,
      locale: "TR",
    },
    update: {},
  });

  const emp5 = await prisma.user.upsert({
    where: { email: "emp5@acar-crm.local" },
    create: {
      email: "emp5@acar-crm.local",
      password,
      firstName: "Oğuz",
      lastName: "Polat",
      role: "EMPLOYEE",
      companyId: company1.id,
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
      companyId: company1.id,
      locale: "TR",
    },
    update: {},
  });

  // Company 2 - Acar Tech Ltd. Users
  const company2Manager = await prisma.user.upsert({
    where: { email: "manager@acartech.local" },
    create: {
      email: "manager@acartech.local",
      password,
      firstName: "Mustafa",
      lastName: "Yılmaz",
      role: "MANAGER",
      companyId: company2.id,
      locale: "TR",
    },
    update: {},
  });

  const company2Emp1 = await prisma.user.upsert({
    where: { email: "emp1@acartech.local" },
    create: {
      email: "emp1@acartech.local",
      password,
      firstName: "Zeynep",
      lastName: "Demir",
      role: "EMPLOYEE",
      companyId: company2.id,
      locale: "TR",
    },
    update: {},
  });

  const company2Emp2 = await prisma.user.upsert({
    where: { email: "emp2@acartech.local" },
    create: {
      email: "emp2@acartech.local",
      password,
      firstName: "Kemal",
      lastName: "Kaya",
      role: "EMPLOYEE",
      companyId: company2.id,
      locale: "TR",
    },
    update: {},
  });

  const company2Supervisor = await prisma.user.upsert({
    where: { email: "supervisor@acartech.local" },
    create: {
      email: "supervisor@acartech.local",
      password,
      firstName: "Deniz",
      lastName: "Şahin",
      role: "SUPERVISOR",
      companyId: company2.id,
      locale: "TR",
    },
    update: {},
  });

  // Company 3 - Acar Global Inc. Users
  const company3Manager = await prisma.user.upsert({
    where: { email: "manager@acarglobal.local" },
    create: {
      email: "manager@acarglobal.local",
      password,
      firstName: "Selin",
      lastName: "Arslan",
      role: "MANAGER",
      companyId: company3.id,
      locale: "TR",
    },
    update: {},
  });

  const company3Emp1 = await prisma.user.upsert({
    where: { email: "emp1@acarglobal.local" },
    create: {
      email: "emp1@acarglobal.local",
      password,
      firstName: "Mert",
      lastName: "Koç",
      role: "EMPLOYEE",
      companyId: company3.id,
      locale: "TR",
    },
    update: {},
  });

  const company3Emp2 = await prisma.user.upsert({
    where: { email: "emp2@acarglobal.local" },
    create: {
      email: "emp2@acarglobal.local",
      password,
      firstName: "Seda",
      lastName: "Polat",
      role: "EMPLOYEE",
      companyId: company3.id,
      locale: "TR",
    },
    update: {},
  });

  const company3Supervisor = await prisma.user.upsert({
    where: { email: "supervisor@acarglobal.local" },
    create: {
      email: "supervisor@acarglobal.local",
      password,
      firstName: "Tolga",
      lastName: "Yıldız",
      role: "SUPERVISOR",
      companyId: company3.id,
      locale: "TR",
    },
    update: {},
  });

  // Customers - Company 1
  const customers1Data = [
    { firstName: "Mehmet", lastName: "Yılmaz", email: "mehmet.yilmaz@gmail.com", phone: "+90 532 1234567", street: "Atatürk Caddesi 12", city: "İstanbul", postalCode: "34000" },
    { firstName: "Ayşe", lastName: "Demir", email: "ayse.demir@hotmail.com", phone: "+90 533 9876543", street: "Bağdat Caddesi 45", city: "İstanbul", postalCode: "34700" },
    { firstName: "Ali", lastName: "Kaya", email: "ali.kaya@outlook.com", phone: "+90 534 5554433", street: "Barış Manço Sokak 7", city: "Ankara", postalCode: "06000" },
    { firstName: "Fatma", lastName: "Çelik", email: "fatma.celik@gmail.com", phone: "+90 535 6667788", street: "Cumhuriyet Caddesi 22", city: "İzmir", postalCode: "35000" },
    { firstName: "Mustafa", lastName: "Şahin", email: "mustafa.sahin@yahoo.com", phone: "+90 542 1112233", street: "Gül Sokak 3", city: "Bursa", postalCode: "16000" },
  ];

  const customers1 = [];
  for (const data of customers1Data) {
    const customer = await prisma.customer.upsert({
      where: { id: `seed-c1-${data.lastName.toLowerCase()}` },
      create: { id: `seed-c1-${data.lastName.toLowerCase()}`, companyId: company1.id, ...data },
      update: {},
    });
    customers1.push(customer);
  }

  // Customers - Company 2
  const customers2Data = [
    { firstName: "Kemal", lastName: "Öztürk", email: "kemal.ozturk@acartech.com", phone: "+90 555 2345678", street: "Teknoloji Parkı 5", city: "İstanbul", postalCode: "34400" },
    { firstName: "Selin", lastName: "Arslan", email: "selin.arslan@acartech.com", phone: "+90 556 3456789", street: "İnovasyon Caddesi 12", city: "Ankara", postalCode: "06100" },
    { firstName: "Burak", lastName: "Koç", email: "burak.koc@acartech.com", phone: "+90 557 4567890", street: "Yazılım Sokak 8", city: "İzmir", postalCode: "35100" },
    { firstName: "Elif", lastName: "Yıldız", email: "elif.yildiz@acartech.com", phone: "+90 558 5678901", street: "Dijital Meydan 3", city: "Bursa", postalCode: "16100" },
  ];

  const customers2 = [];
  for (const data of customers2Data) {
    const customer = await prisma.customer.upsert({
      where: { id: `seed-c2-${data.lastName.toLowerCase()}` },
      create: { id: `seed-c2-${data.lastName.toLowerCase()}`, companyId: company2.id, ...data },
      update: {},
    });
    customers2.push(customer);
  }

  // Customers - Company 3
  const customers3Data = [
    { firstName: "Tolga", lastName: "Polat", email: "tolga.polat@acarglobal.com", phone: "+90 559 6789012", street: "Global Caddesi 15", city: "Antalya", postalCode: "07000" },
    { firstName: "Seda", lastName: "Kaya", email: "seda.kaya@acarglobal.com", phone: "+90 560 7890123", street: "Hizmet Meydanı 7", city: "İzmir", postalCode: "35200" },
    { firstName: "Mert", lastName: "Çelik", email: "mert.celik@acarglobal.com", phone: "+90 561 8901234", street: "Uluslararası Sokak 22", city: "Ankara", postalCode: "06200" },
    { firstName: "Zeynep", lastName: "Demir", email: "zeynep.demir@acarglobal.com", phone: "+90 562 9012345", street: "Dünya Pazarı 9", city: "İstanbul", postalCode: "34100" },
  ];

  const customers3 = [];
  for (const data of customers3Data) {
    const customer = await prisma.customer.upsert({
      where: { id: `seed-c3-${data.lastName.toLowerCase()}` },
      create: { id: `seed-c3-${data.lastName.toLowerCase()}`, companyId: company3.id, ...data },
      update: {},
    });
    customers3.push(customer);
  }

  const allCustomers = [...customers1, ...customers2, ...customers3];

  // Tickets - Company 1
  const tickets1Data = [
    { title: "Klima arızası", description: "Klima sistemi çalışmıyor. Acil kontrol gerekiyor.", category: "HEATING" as const, priority: "URGENT" as const, status: "NEW" as const, source: "PHONE" as const, customer: customers1[0] },
    { title: "Su borusu patladı", description: "Bodrum kattan su sızıntısı var, boru patlamış.", category: "PLUMBING" as const, priority: "HIGH" as const, status: "ASSIGNED" as const, source: "EMAIL" as const, customer: customers1[1] },
    { title: "Elektrik prizi arızası", description: "Oturma odasındaki elektrik prizleri çalışmıyor.", category: "ELECTRICITY" as const, priority: "MEDIUM" as const, status: "IN_PROGRESS" as const, source: "WEB_CHAT" as const, customer: customers1[2] },
    { title: "Duvar boyama", description: "Zemin kattaki tüm odaların duvarları yeniden boyanacak.", category: "PAINTING" as const, priority: "LOW" as const, status: "COMPLETED" as const, source: "PHONE" as const, customer: customers1[3] },
    { title: "Termostat değişimi", description: "Oda termostatı yanlış sıcaklık gösteriyor.", category: "HEATING" as const, priority: "MEDIUM" as const, status: "ASSIGNED" as const, source: "EMAIL" as const, customer: customers1[4] },
  ];

  const now = new Date();
  for (let i = 0; i < tickets1Data.length; i++) {
    const t = tickets1Data[i];
    await prisma.ticket.upsert({
      where: { id: `seed-t1-${String(i).padStart(2, "0")}` },
      create: {
        id: `seed-t1-${String(i).padStart(2, "0")}`,
        companyId: company1.id,
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

  // Tickets - Company 2
  const tickets2Data = [
    { title: "Sunucu çöktü", description: "Ana sunucu çöktü ve yeniden başlamıyor.", category: "ELECTRICITY" as const, priority: "URGENT" as const, status: "NEW" as const, source: "EMAIL" as const, customer: customers2[0] },
    { title: "Ağ sorunları", description: "Ofisteki Wi-Fi düzgün çalışmıyor.", category: "ELECTRICITY" as const, priority: "HIGH" as const, status: "IN_PROGRESS" as const, source: "WEB_CHAT" as const, customer: customers2[1] },
    { title: "Yazılım güncellemesi", description: "Tüm iş istasyonları yazılım güncellemesi gerekiyor.", category: "OTHER" as const, priority: "MEDIUM" as const, status: "ASSIGNED" as const, source: "EMAIL" as const, customer: customers2[2] },
    { title: "Yazıcı arızası", description: "Ağ yazıcısı yazmıyor.", category: "ELECTRICITY" as const, priority: "LOW" as const, status: "NEW" as const, source: "PHONE" as const, customer: customers2[3] },
  ];

  for (let i = 0; i < tickets2Data.length; i++) {
    const t = tickets2Data[i];
    await prisma.ticket.upsert({
      where: { id: `seed-t2-${String(i).padStart(2, "0")}` },
      create: {
        id: `seed-t2-${String(i).padStart(2, "0")}`,
        companyId: company2.id,
        customerId: t.customer.id,
        assignedUserId: i % 2 === 0 ? company2Emp1.id : company2Emp2.id,
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

  // Tickets - Company 3
  const tickets3Data = [
    { title: "Klima arızası", description: "Ofisteki klima sistemi soğutmuyor.", category: "HEATING" as const, priority: "HIGH" as const, status: "ASSIGNED" as const, source: "PHONE" as const, customer: customers3[0] },
    { title: "Havalandırma sistemi", description: "Havalandırma sistemi gürültülü çalışıyor.", category: "HEATING" as const, priority: "MEDIUM" as const, status: "NEW" as const, source: "EMAIL" as const, customer: customers3[1] },
    { title: "Aydınlatma kontrolü", description: "Salon aydınlatması bakım gerekiyor.", category: "ELECTRICITY" as const, priority: "LOW" as const, status: "IN_PROGRESS" as const, source: "WEB_CHAT" as const, customer: customers3[2] },
    { title: "Güvenlik kontrolü", description: "Yıllık güvenlik kontrolü gerekli.", category: "OTHER" as const, priority: "MEDIUM" as const, status: "NEW" as const, source: "EMAIL" as const, customer: customers3[3] },
  ];

  for (let i = 0; i < tickets3Data.length; i++) {
    const t = tickets3Data[i];
    await prisma.ticket.upsert({
      where: { id: `seed-t3-${String(i).padStart(2, "0")}` },
      create: {
        id: `seed-t3-${String(i).padStart(2, "0")}`,
        companyId: company3.id,
        customerId: t.customer.id,
        assignedUserId: i % 2 === 0 ? company3Emp1.id : company3Emp2.id,
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

  // Appointments - Company 1
  const appointments1Data = [
    { title: "Klima kontrolü", description: "Klima sisteminin yıllık bakımı", status: "PLANNED" as const, daysOffset: 2, customer: customers1[0], employee: emp1 },
    { title: "Boru tamiri", description: "Arızalı su borusunun değişimi", status: "PLANNED" as const, daysOffset: 3, customer: customers1[1], employee: emp2 },
    { title: "Elektrik kontrolü", description: "Elektrik sistemi güvenlik kontrolü", status: "PLANNED" as const, daysOffset: 5, customer: customers1[2], employee: emp1 },
  ];

  for (let i = 0; i < appointments1Data.length; i++) {
    const a = appointments1Data[i];
    const start = new Date(now.getTime() + a.daysOffset * 24 * 60 * 60 * 1000);
    start.setHours(9 + i % 4 * 2, 0, 0, 0);
    const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);

    await prisma.appointment.upsert({
      where: { id: `seed-a1-${String(i).padStart(2, "0")}` },
      create: {
        id: `seed-a1-${String(i).padStart(2, "0")}`,
        companyId: company1.id,
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

  // Appointments - Company 2
  const appointments2Data = [
    { title: "Sunucu bakımı", description: "Düzenli sunucu bakımı", status: "PLANNED" as const, daysOffset: 4, customer: customers2[0], employee: company2Emp1 },
    { title: "Ağ kontrolü", description: "Ağ altyapısını kontrol et", status: "PLANNED" as const, daysOffset: 6, customer: customers2[1], employee: company2Emp2 },
  ];

  for (let i = 0; i < appointments2Data.length; i++) {
    const a = appointments2Data[i];
    const start = new Date(now.getTime() + a.daysOffset * 24 * 60 * 60 * 1000);
    start.setHours(10 + i % 2 * 2, 0, 0, 0);
    const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);

    await prisma.appointment.upsert({
      where: { id: `seed-a2-${String(i).padStart(2, "0")}` },
      create: {
        id: `seed-a2-${String(i).padStart(2, "0")}`,
        companyId: company2.id,
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

  // Appointments - Company 3
  const appointments3Data = [
    { title: "Klima servisi", description: "Klima sistemi bakımı", status: "PLANNED" as const, daysOffset: 8, customer: customers3[0], employee: company3Emp1 },
    { title: "Havalandırma kontrolü", description: "Havalandırma sistemini kontrol et", status: "PLANNED" as const, daysOffset: 10, customer: customers3[1], employee: company3Emp2 },
  ];

  for (let i = 0; i < appointments3Data.length; i++) {
    const a = appointments3Data[i];
    const start = new Date(now.getTime() + a.daysOffset * 24 * 60 * 60 * 1000);
    start.setHours(11 + i % 2 * 2, 0, 0, 0);
    const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);

    await prisma.appointment.upsert({
      where: { id: `seed-a3-${String(i).padStart(2, "0")}` },
      create: {
        id: `seed-a3-${String(i).padStart(2, "0")}`,
        companyId: company3.id,
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

  // Collect all users for notifications
  const allUsers = [
    admin, admin2, manager, manager2, manager3, supervisor, emp1, emp2, emp3, emp4, emp5,
    company2Manager, company2Emp1, company2Emp2, company2Supervisor,
    company3Manager, company3Emp1, company3Emp2, company3Supervisor,
  ];

  // Notifications for all users
  const notifData = [
    { title: "Yeni Talep", message: "Yeni bir acil talep oluşturuldu.", type: "WARNING" as const, isRead: false },
    { title: "Yarın Randevu", message: "Hatırlatma: Yarın bir randevunuz var.", type: "INFO" as const, isRead: false },
    { title: "Talep Tamamlandı", message: "Bir talep başarıyla tamamlandı.", type: "SUCCESS" as const, isRead: true },
    { title: "Acil İstek", message: "Yeni bir acil istek geldi.", type: "ERROR" as const, isRead: false },
    { title: "Yeni Mesaj", message: "Bir talepe yorum eklendi.", type: "INFO" as const, isRead: true },
    { title: "Yeni Müşteri", message: "Yeni bir müşteri kayıt oldu.", type: "INFO" as const, isRead: false },
    { title: "Adres Güncellendi", message: "Bir müşteri adresini güncelledi.", type: "INFO" as const, isRead: false },
    { title: "Yüksek Talep", message: "Bu hafta çok sayıda yeni talep oluşturuldu.", type: "WARNING" as const, isRead: false },
    { title: "Olumlu Geri Bildirim", message: "Bir müşteriden olumlu geri bildirim alındı.", type: "SUCCESS" as const, isRead: true },
    { title: "Önemli Müşteri", message: "Önemli bir müşteri ilgi bekliyor.", type: "ERROR" as const, isRead: false },
  ];

  // Create notifications for each user
  let notifIndex = 0;
  for (const user of allUsers) {
    const userCompanyId = user.companyId;
    for (let i = 0; i < 5; i++) {
      const n = notifData[notifIndex % notifData.length];
      await prisma.notification.upsert({
        where: { id: `seed-notif-${String(notifIndex).padStart(3, "0")}` },
        create: {
          id: `seed-notif-${String(notifIndex).padStart(3, "0")}`,
          companyId: userCompanyId,
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



  // Activity Logs - Genel aktivite logları
  const activityLogsData = [
    { companyId: company1.id, userId: admin.id, action: "LOGIN", entityType: "USER", entityId: admin.id },
    { companyId: company1.id, userId: manager.id, action: "TICKET_CREATED", entityType: "TICKET", entityId: `seed-t1-00` },
    { companyId: company1.id, userId: emp1.id, action: "TICKET_ASSIGNED", entityType: "TICKET", entityId: `seed-t1-00` },
    { companyId: company2.id, userId: company2Manager.id, action: "CUSTOMER_CREATED", entityType: "CUSTOMER", entityId: customers2[0].id },
    { companyId: company2.id, userId: company2Emp1.id, action: "TICKET_UPDATED", entityType: "TICKET", entityId: `seed-t2-00` },
    { companyId: company3.id, userId: company3Manager.id, action: "APPOINTMENT_CREATED", entityType: "APPOINTMENT", entityId: `seed-a3-00` },
    { companyId: company3.id, userId: company3Emp1.id, action: "APPOINTMENT_COMPLETED", entityType: "APPOINTMENT", entityId: `seed-a3-00` },
  ];

  for (const log of activityLogsData) {
    await prisma.activityLog.upsert({
      where: { id: `seed-activity-${log.action}-${log.entityId || 'system'}` },
      create: {
        id: `seed-activity-${log.action}-${log.entityId || 'system'}`,
        companyId: log.companyId,
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

  // Vergi Daireleri - JSON dosyasından oku
  const taxOfficesFilePath = join(__dirname, 'tax-offices.json');
  const taxOfficesData = JSON.parse(readFileSync(taxOfficesFilePath, 'utf-8'));

  // Email Inbox - Gelen kutusu
  const emailInboxData = [
    {
      companyId: company1.id,
      messageId: "msg-001@example.com",
      fromEmail: customers1[0].email ?? "mehmet@example.com",
      fromName: `${customers1[0].firstName} ${customers1[0].lastName}`,
      subject: "Acil Klima Sorunu",
      body: "Merhaba, klimam çalışmıyor. Lütfen en kısa sürede yardımcı olun.",
      processed: true,
      ticketId: `seed-t1-00`,
    },
    {
      companyId: company2.id,
      messageId: "msg-002@example.com",
      fromEmail: customers2[0].email ?? "kemal@example.com",
      fromName: `${customers2[0].firstName} ${customers2[0].lastName}`,
      subject: "Sunucu Çöktü",
      body: "Ana sunucumuz çöktü. Acil yardıma ihtiyacımız var.",
      processed: true,
      ticketId: `seed-t2-00`,
    },
    {
      companyId: company3.id,
      messageId: "msg-003@example.com",
      fromEmail: customers3[0].email ?? "tolga@example.com",
      fromName: `${customers3[0].firstName} ${customers3[0].lastName}`,
      subject: "Klima Arızası",
      body: "Ofisteki klima soğutmuyor. Ne zaman gelebilirsiniz?",
      processed: false,
    },
  ];

  for (const email of emailInboxData) {
    await prisma.emailInbox.upsert({
      where: { messageId: email.messageId },
      create: {
        companyId: email.companyId,
        messageId: email.messageId,
        fromEmail: email.fromEmail,
        fromName: email.fromName,
        subject: email.subject,
        body: email.body,
        processed: email.processed,
        ticketId: email.ticketId,
        createdAt: new Date(now.getTime() - Math.random() * 48 * 60 * 60 * 1000),
      },
      update: {},
    });
  }

  // Vergi Dairelerini ekle
  for (const taxOffice of taxOfficesData) {
    await prisma.taxOffice.upsert({
      where: { muhasebeBirimiKodu: taxOffice.muhasebeBirimiKodu },
      create: {
        plateCode: taxOffice.plateCode,
        name: taxOffice.name,
        districtName: taxOffice.districtName,
        muhasebeBirimiKodu: taxOffice.muhasebeBirimiKodu,
        taxOfficeName: taxOffice.taxOfficeName,
      },
      update: {},
    });
  }

  console.log("✅ Seed tamamlandı:");
  console.log(`   - 3 şirket`);
  console.log(`   - ${allUsers.length} kullanıcı`);
  console.log(`   - ${allCustomers.length} müşteri`);
  console.log(`   - ${tickets1Data.length + tickets2Data.length + tickets3Data.length} ticket`);
  console.log(`   - ${appointments1Data.length + appointments2Data.length + appointments3Data.length} randevu`);
  console.log(`   - ${activityLogsData.length} aktivite logu`);
  console.log(`   - ${emailInboxData.length} email`);
  console.log(`   - ${notifIndex} bildirim`);
  console.log(`   - ${taxOfficesData.length} vergi dairesi (örnek: Adana)`);
  console.log(`\n   Giriş bilgileri:`);
  console.log(`   - Company 1: admin@acar-crm.local / Admin123!`);
  console.log(`   - Company 2: manager@acartech.local / Admin123!`);
  console.log(`   - Company 3: manager@acarglobal.local / Admin123!`);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
