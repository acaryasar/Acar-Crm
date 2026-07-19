import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { readFileSync } from "fs";
import { join } from "path";

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash("Admin123!", 10);

  
  // Banks
  const bank1 = await prisma.bank.upsert({
    where: { id: "seed-bank-01" },
    create: {
      id: "seed-bank-01",
      name: "Ziraat Bankası",
      address: "Ankara",
      email: "info@ziraatbank.com.tr",
      phoneNumber: "444 00 00",
    },
    update: {},
  });

  const bank2 = await prisma.bank.upsert({
    where: { id: "seed-bank-02" },
    create: {
      id: "seed-bank-02",
      name: "Halkbank",
      address: "Ankara",
      email: "info@halkbank.com.tr",
      phoneNumber: "444 00 00",
    },
    update: {},
  });

  const bank3 = await prisma.bank.upsert({
    where: { id: "seed-bank-03" },
    create: {
      id: "seed-bank-03",
      name: "Vakıfbank",
      address: "İstanbul",
      email: "info@vakifbank.com.tr",
      phoneNumber: "444 00 00",
    },
    update: {},
  });

  const bank4 = await prisma.bank.upsert({
    where: { id: "seed-bank-04" },
    create: {
      id: "seed-bank-04",
      name: "İş Bankası",
      address: "İstanbul",
      email: "info@isbank.com.tr",
      phoneNumber: "444 00 00",
    },
    update: {},
  });

  const bank5 = await prisma.bank.upsert({
    where: { id: "seed-bank-05" },
    create: {
      id: "seed-bank-05",
      name: "Garanti BBVA",
      address: "İstanbul",
      email: "info@garanti.com.tr",
      phoneNumber: "444 00 00",
    },
    update: {},
  });

  const bank6 = await prisma.bank.upsert({
    where: { id: "seed-bank-06" },
    create: {
      id: "seed-bank-06",
      name: "Akbank",
      address: "İstanbul",
      email: "info@akbank.com",
      phoneNumber: "444 00 00",
    },
    update: {},
  });

  const bank7 = await prisma.bank.upsert({
    where: { id: "seed-bank-07" },
    create: {
      id: "seed-bank-07",
      name: "Yapı Kredi",
      address: "İstanbul",
      email: "info@yapikredi.com.tr",
      phoneNumber: "444 00 00",
    },
    update: {},
  });

  const bank8 = await prisma.bank.upsert({
    where: { id: "seed-bank-08" },
    create: {
      id: "seed-bank-08",
      name: "QNB Finansbank",
      address: "İstanbul",
      email: "info@finansbank.com.tr",
      phoneNumber: "444 00 00",
    },
    update: {},
  });

  const bank9 = await prisma.bank.upsert({
    where: { id: "seed-bank-09" },
    create: {
      id: "seed-bank-09",
      name: "Türkiye İş Bankası",
      address: "İstanbul",
      email: "info@isbank.com.tr",
      phoneNumber: "444 00 00",
    },
    update: {},
  });

  const bank10 = await prisma.bank.upsert({
    where: { id: "seed-bank-10" },
    create: {
      id: "seed-bank-10",
      name: "Denizbank",
      address: "İstanbul",
      email: "info@denizbank.com",
      phoneNumber: "444 00 00",
    },
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

  // Company 2 - Acar Tech Ltd. Users
  const company2Manager = await prisma.user.upsert({
    where: { email: "manager@acartech.local" },
    create: {
      email: "manager@acartech.local",
      password,
      firstName: "Mustafa",
      lastName: "Yılmaz",
      role: "MANAGER",      
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
      create: { id: `seed-c1-${data.lastName.toLowerCase()}`,  ...data },
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
      create: { id: `seed-c2-${data.lastName.toLowerCase()}`,  ...data },
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
      create: { id: `seed-c3-${data.lastName.toLowerCase()}`, ...data },
      update: {},
    });
    customers3.push(customer);
  }

  const allCustomers = [...customers1, ...customers2, ...customers3];

  // Tickets - Company 1 (Products, Orders, Invoices, Shipping related)
  const tickets1Data = [
    { title: "Ürün teslimat gecikmesi", description: "Siparişimdeki ürünler henüz teslim edilmedi, kargo takibinde bilgi yok.", category: "OTHER" as const, priority: "HIGH" as const, status: "NEW" as const, source: "EMAIL" as const, customer: customers1[0] },
    { title: "Fatura itirazı", description: "Son faturada yanlış tutar yansıtılmış, düzeltme talep ediyorum.", category: "OTHER" as const, priority: "URGENT" as const, status: "ASSIGNED" as const, source: "PHONE" as const, customer: customers1[1] },
    { title: "Sipariş değişikliği", description: "Siparişimdeki ürün miktarını artırmak istiyorum.", category: "OTHER" as const, priority: "MEDIUM" as const, status: "IN_PROGRESS" as const, source: "WEB_CHAT" as const, customer: customers1[2] },
    { title: "Ürün iadesi", description: "Teslim edilen ürün hasarlı, iade talep ediyorum.", category: "OTHER" as const, priority: "HIGH" as const, status: "NEW" as const, source: "EMAIL" as const, customer: customers1[3] },
    { title: "Kargo hasarı", description: "Kargoda ürün kırılmış, hasar tespiti için talep.", category: "OTHER" as const, priority: "URGENT" as const, status: "ASSIGNED" as const, source: "PHONE" as const, customer: customers1[4] },
    { title: "Fatura düzeltme", description: "Vergi numarası faturada yanlış yazılmış.", category: "OTHER" as const, priority: "MEDIUM" as const, status: "COMPLETED" as const, source: "EMAIL" as const, customer: customers1[0] },
    { title: "Sipariş iptali", description: "Henüz kargoya verilmeyen siparişimi iptal etmek istiyorum.", category: "OTHER" as const, priority: "MEDIUM" as const, status: "ASSIGNED" as const, source: "WEB_CHAT" as const, customer: customers1[1] },
    { title: "Kargo takibi", description: "Kargo nerede, teslimat durumu hakkında bilgi istiyorum.", category: "OTHER" as const, priority: "LOW" as const, status: "NEW" as const, source: "PHONE" as const, customer: customers1[2] },
  ];

  const now = new Date();
  for (let i = 0; i < tickets1Data.length; i++) {
    const t = tickets1Data[i];
    await prisma.ticket.upsert({
      where: { id: `seed-t1-${String(i).padStart(2, "0")}` },
      create: {
        id: `seed-t1-${String(i).padStart(2, "0")}`,
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

  // Tickets - Company 2 (Products, Orders, Invoices, Shipping related)
  const tickets2Data = [
    { title: "Sipariş teslimat sorunu", description: "Siparişimdeki ürünler eksik teslim edildi.", category: "OTHER" as const, priority: "HIGH" as const, status: "NEW" as const, source: "EMAIL" as const, customer: customers2[0] },
    { title: "Fatura ödeme sorunu", description: "Fatura ödemesi yapıldı ama sistemde görünmüyor.", category: "OTHER" as const, priority: "URGENT" as const, status: "ASSIGNED" as const, source: "PHONE" as const, customer: customers2[1] },
    { title: "Ürün stok sorunu", description: "Sipariş ettiğim ürün stokta yokmuş, bilgilendirilmedim.", category: "OTHER" as const, priority: "MEDIUM" as const, status: "IN_PROGRESS" as const, source: "WEB_CHAT" as const, customer: customers2[2] },
    { title: "Kargo adresi değişikliği", description: "Kargo adresimi değiştirmek istiyorum.", category: "OTHER" as const, priority: "MEDIUM" as const, status: "ASSIGNED" as const, source: "EMAIL" as const, customer: customers2[3] },
    { title: "Fatura kopyası", description: "Fatura kopyasını tekrar göndermenizi istiyorum.", category: "OTHER" as const, priority: "LOW" as const, status: "NEW" as const, source: "PHONE" as const, customer: customers2[0] },
    { title: "Sipariş durumu", description: "Siparişim ne zaman kargoya verilecek?", category: "OTHER" as const, priority: "MEDIUM" as const, status: "COMPLETED" as const, source: "WEB_CHAT" as const, customer: customers2[1] },
  ];

  for (let i = 0; i < tickets2Data.length; i++) {
    const t = tickets2Data[i];
    await prisma.ticket.upsert({
      where: { id: `seed-t2-${String(i).padStart(2, "0")}` },
      create: {
        id: `seed-t2-${String(i).padStart(2, "0")}`,
        
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

  // Tickets - Company 3 (Products, Orders, Invoices, Shipping related)
  const tickets3Data = [
    { title: "Ürün kalite sorunu", description: "Teslim edilen ürün kalitesi beklediğim gibi değil.", category: "OTHER" as const, priority: "HIGH" as const, status: "ASSIGNED" as const, source: "PHONE" as const, customer: customers3[0] },
    { title: "Fatura ödeme planı", description: "Fatura ödemeyi taksitli yapmak istiyorum.", category: "OTHER" as const, priority: "MEDIUM" as const, status: "NEW" as const, source: "EMAIL" as const, customer: customers3[1] },
    { title: "Sipariş iptal talebi", description: "Siparişimi iptal etmek istiyorum, iade süreci nedir?", category: "OTHER" as const, priority: "MEDIUM" as const, status: "IN_PROGRESS" as const, source: "WEB_CHAT" as const, customer: customers3[2] },
    { title: "Kargo hasar tespiti", description: "Kargoda hasar oluştu, tespit raporu istiyorum.", category: "OTHER" as const, priority: "HIGH" as const, status: "NEW" as const, source: "EMAIL" as const, customer: customers3[3] },
    { title: "Ürün değişimi", description: "Teslim edilen ürünü değiştirmek istiyorum.", category: "OTHER" as const, priority: "MEDIUM" as const, status: "ASSIGNED" as const, source: "PHONE" as const, customer: customers3[0] },
  ];

  for (let i = 0; i < tickets3Data.length; i++) {
    const t = tickets3Data[i];
    await prisma.ticket.upsert({
      where: { id: `seed-t3-${String(i).padStart(2, "0")}` },
      create: {
        id: `seed-t3-${String(i).padStart(2, "0")}`,
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
    for (let i = 0; i < 5; i++) {
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



  // Activity Logs - Genel aktivite logları
  const activityLogsData = [
    {  userId: admin.id, action: "LOGIN", entityType: "USER", entityId: admin.id },
    {  userId: manager.id, action: "TICKET_CREATED", entityType: "TICKET", entityId: `seed-t1-00` },
    {  userId: emp1.id, action: "TICKET_ASSIGNED", entityType: "TICKET", entityId: `seed-t1-00` },
    {  userId: company2Manager.id, action: "CUSTOMER_CREATED", entityType: "CUSTOMER", entityId: customers2[0].id },
    {  userId: company2Emp1.id, action: "TICKET_UPDATED", entityType: "TICKET", entityId: `seed-t2-00` },
    {  userId: company3Manager.id, action: "APPOINTMENT_CREATED", entityType: "APPOINTMENT", entityId: `seed-a3-00` },
    {  userId: company3Emp1.id, action: "APPOINTMENT_COMPLETED", entityType: "APPOINTMENT", entityId: `seed-a3-00` },
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

  // Email Inbox - Gelen kutusu
  const emailInboxData = [
    {
      messageId: "msg-001@example.com",
      fromEmail: customers1[0].email ?? "mehmet@example.com",
      fromName: `${customers1[0].firstName} ${customers1[0].lastName}`,
      subject: "Acil Klima Sorunu",
      body: "Merhaba, klimam çalışmıyor. Lütfen en kısa sürede yardımcı olun.",
      processed: true,
      ticketId: `seed-t1-00`,
    },
    {
      
      messageId: "msg-002@example.com",
      fromEmail: customers2[0].email ?? "kemal@example.com",
      fromName: `${customers2[0].firstName} ${customers2[0].lastName}`,
      subject: "Sunucu Çöktü",
      body: "Ana sunucumuz çöktü. Acil yardıma ihtiyacımız var.",
      processed: true,
      ticketId: `seed-t2-00`,
    },
    {
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

  // Product Categories - 1
  const category1 = await prisma.productCategory.upsert({
    where: { id: "seed-cat-01" },
    create: { id: "seed-cat-01", name: "Radyografi Test Ürünleri" },
    update: {},
  });

  const category2 = await prisma.productCategory.upsert({
    where: { id: "seed-cat-02" },
    create: { id: "seed-cat-02", name: "Ultrasonik Test Ürünleri" },
    update: {},
  });

  const category3 = await prisma.productCategory.upsert({
    where: { id: "seed-cat-03" },
    create: { id: "seed-cat-03", name: "Penetrant Test Ürünleri" },
    update: {},
  });

  const category4 = await prisma.productCategory.upsert({
    where: { id: "seed-cat-04" },
    create: { id: "seed-cat-04", name: "Manyetik Parçacık Test Ürünleri" },
    update: {},
  });

  const category5 = await prisma.productCategory.upsert({
    where: { id: "seed-cat-05" },
    create: { id: "seed-cat-05", name: "Sertlik Ölçüm Cihazları" },
    update: {},
  });

  const category6 = await prisma.productCategory.upsert({
    where: { id: "seed-cat-06" },
    create: { id: "seed-cat-06", name: "Analitik Cihazlar" },
    update: {},
  });

  const category7 = await prisma.productCategory.upsert({
    where: { id: "seed-cat-07" },
    create: { id: "seed-cat-07", name: "Eğitim ve Sertifikasyon" },
    update: {},
  });

  const category8 = await prisma.productCategory.upsert({
    where: { id: "seed-cat-08" },
    create: { id: "seed-cat-08", name: "Aksesuarlar" },
    update: {},
  });

  // Products - 100 NDT products based on ndtservis.com
  const productsData = [
    // Radyografi Test Ürünleri
    { code: "NDT-001", name: "Endüstriyel Radyografi Filmleri", description: "CARESTREAM INDUSTREX Endüstriyel Radyografi Filmleri, radyografi muayenesi için tüm NDT pazarının değişken ihtiyaçlarını karşılamaktadır.", categoryId: category1.id, unit: "PIECE", purchasePrice: "1500.00", salePrice: "2500.00", taxRate: "18", currentStock: 50, minStock: 10, barcode: "8690000000001" },
    { code: "NDT-002", name: "Developer Banyo Kimyasalı", description: "INDUSTREX Single Part Developer kimyasalı, INDUSTREX Endüstriyel Radyografi Filmlerinin banyo işleminin geliştirme basamağında kullanılmak üzere geliştirilmiştir.", categoryId: category1.id, unit: "LT", purchasePrice: "800.00", salePrice: "1200.00", taxRate: "18", currentStock: 30, minStock: 5, barcode: "8690000000002" },
    { code: "NDT-003", name: "Fixer Banyo Kimyasalı", description: "INDUSTREX Single Part Fixer kimyasalı, radyografi filmlerinin sabitleme işlemi için kullanılır.", categoryId: category1.id, unit: "LT", purchasePrice: "750.00", salePrice: "1150.00", taxRate: "18", currentStock: 25, minStock: 5, barcode: "8690000000003" },
    { code: "NDT-004", name: "Radyografi Filmi Kodak", description: "Kodak Endüstri 400 Radyografi filmi, yüksek kaliteli görüntüler için.", categoryId: category1.id, unit: "PIECE", purchasePrice: "1800.00", salePrice: "2800.00", taxRate: "18", currentStock: 40, minStock: 8, barcode: "8690000000004" },
    { code: "NDT-005", name: "Radyografi Filmi Agfa", description: "Agfa NDT S1 Radyografi filmi, hassas görüntüleme için.", categoryId: category1.id, unit: "PIECE", purchasePrice: "1700.00", salePrice: "2700.00", taxRate: "18", currentStock: 35, minStock: 7, barcode: "8690000000005" },
    { code: "NDT-006", name: "Banyo Tankı", description: "Radyografi film banyo tankı, 5 kapasiteli.", categoryId: category1.id, unit: "PIECE", purchasePrice: "2500.00", salePrice: "3500.00", taxRate: "18", currentStock: 15, minStock: 3, barcode: "8690000000006" },
    { code: "NDT-007", name: "Film Kurutma Ünitesi", description: "Radyografi filmleri için otomatik kurutma ünitesi.", categoryId: category1.id, unit: "PIECE", purchasePrice: "4500.00", salePrice: "6500.00", taxRate: "18", currentStock: 10, minStock: 2, barcode: "8690000000007" },
    { code: "NDT-008", name: "Film Görüntüleyici", description: "Radyografi filmleri için yüksek çözünürlüklü görüntüleyici.", categoryId: category1.id, unit: "PIECE", purchasePrice: "8000.00", salePrice: "12000.00", taxRate: "18", currentStock: 8, minStock: 2, barcode: "8690000000008" },
    { code: "NDT-009", name: "İzotop Kaynak", description: "Ir-192 İzotop kaynağı, radyografi muayenesi için.", categoryId: category1.id, unit: "PIECE", purchasePrice: "25000.00", salePrice: "35000.00", taxRate: "18", currentStock: 3, minStock: 1, barcode: "8690000000009" },
    { code: "NDT-010", name: "Se-75 Kaynak", description: "Se-75 İzotop kaynağı, düşük enerjili radyografi için.", categoryId: category1.id, unit: "PIECE", purchasePrice: "22000.00", salePrice: "32000.00", taxRate: "18", currentStock: 4, minStock: 1, barcode: "8690000000010" },
    { code: "NDT-011", name: "X-Ray Tüp", description: "Endüstriyel X-Ray tüpü, 300kV kapasiteli.", categoryId: category1.id, unit: "PIECE", purchasePrice: "45000.00", salePrice: "65000.00", taxRate: "18", currentStock: 2, minStock: 1, barcode: "8690000000011" },
    { code: "NDT-012", name: "X-Ray Jeneratör", description: "Portatif X-Ray jeneratörü, 200kV.", categoryId: category1.id, unit: "PIECE", purchasePrice: "85000.00", salePrice: "120000.00", taxRate: "18", currentStock: 1, minStock: 1, barcode: "8690000000012" },
    { code: "NDT-013", name: "Kurşun Ekran", description: "Radyasyon koruma için kurşun ekran levhalar.", categoryId: category1.id, unit: "M2", purchasePrice: "500.00", salePrice: "800.00", taxRate: "18", currentStock: 100, minStock: 20, barcode: "8690000000013" },
    { code: "NDT-014", name: "Film Kesici", description: "Radyografi film kesici makinesi.", categoryId: category1.id, unit: "PIECE", purchasePrice: "1200.00", salePrice: "1800.00", taxRate: "18", currentStock: 12, minStock: 3, barcode: "8690000000014" },
    { code: "NDT-015", name: "Film Etiketleri", description: "Radyografi film tanımlama etiketleri (100 adet).", categoryId: category1.id, unit: "PACKAGE", purchasePrice: "50.00", salePrice: "80.00", taxRate: "18", currentStock: 200, minStock: 50, barcode: "8690000000015" },
    
    // Ultrasonik Test Ürünleri
    { code: "NDT-016", name: "DC 2000 Ultrasonik Kalınlık Ölçer", description: "DC 2000 Ultrasonik Kalınlık Ölçüm cihazı; yüzeyinde kaplama veya boya barındırmayan çelik, paslanmaz çelik, alüminyum, bakır, kompozit, plastik, cam, polietilen gibi çeşitli malzemelerin kalınlıklarının ölçümünde kullanılmaktadır.", categoryId: category2.id, unit: "PIECE", purchasePrice: "15000.00", salePrice: "22000.00", taxRate: "18", currentStock: 8, minStock: 2, barcode: "8690000000016" },
    { code: "NDT-017", name: "Ultrasonik Prob", description: "5 MHz ultrasonik prob, kalınlık ölçümü için.", categoryId: category2.id, unit: "PIECE", purchasePrice: "2500.00", salePrice: "3500.00", taxRate: "18", currentStock: 20, minStock: 5, barcode: "8690000000017" },
    { code: "NDT-018", name: "Ultrasonik Jel", description: "Ultrasonik test için kullanılan jel (5L).", categoryId: category2.id, unit: "LT", purchasePrice: "200.00", salePrice: "350.00", taxRate: "18", currentStock: 50, minStock: 10, barcode: "8690000000018" },
    { code: "NDT-019", name: "Ultrasonik Test Cihazı", description: "Dijital ultrasonik test cihazı, flaw detector.", categoryId: category2.id, unit: "PIECE", purchasePrice: "35000.00", salePrice: "50000.00", taxRate: "18", currentStock: 5, minStock: 1, barcode: "8690000000019" },
    { code: "NDT-020", name: "Phased Array Prob", description: "Phased Array ultrasonik prob, 64 element.", categoryId: category2.id, unit: "PIECE", purchasePrice: "8000.00", salePrice: "12000.00", taxRate: "18", currentStock: 10, minStock: 2, barcode: "8690000000020" },
    { code: "NDT-021", name: "TOFD Prob", description: "Time of Flight Diffraction prob.", categoryId: category2.id, unit: "PIECE", purchasePrice: "7500.00", salePrice: "11000.00", taxRate: "18", currentStock: 8, minStock: 2, barcode: "8690000000021" },
    { code: "NDT-022", name: "Prob Tutucu", description: "Ultrasonik prob tutucu aksesuar.", categoryId: category2.id, unit: "PIECE", purchasePrice: "300.00", salePrice: "500.00", taxRate: "18", currentStock: 30, minStock: 8, barcode: "8690000000022" },
    { code: "NDT-023", name: "Kalibrasyon Bloğu", description: "Ultrasonik kalibrasyon bloğu, çelik.", categoryId: category2.id, unit: "PIECE", purchasePrice: "1500.00", salePrice: "2500.00", taxRate: "18", currentStock: 15, minStock: 3, barcode: "8690000000023" },
    { code: "NDT-024", name: "Kablo Seti", description: "Ultrasonik prob kablo seti, 5m.", categoryId: category2.id, unit: "PIECE", purchasePrice: "400.00", salePrice: "600.00", taxRate: "18", currentStock: 25, minStock: 5, barcode: "8690000000024" },
    { code: "NDT-025", name: "Batarya", description: "Ultrasonik cihaz için lityum batarya.", categoryId: category2.id, unit: "PIECE", purchasePrice: "800.00", salePrice: "1200.00", taxRate: "18", currentStock: 20, minStock: 5, barcode: "8690000000025" },
    { code: "NDT-026", name: "Şarj Cihazı", description: "Ultrasonik cihaz batarya şarj cihazı.", categoryId: category2.id, unit: "PIECE", purchasePrice: "600.00", salePrice: "900.00", taxRate: "18", currentStock: 15, minStock: 3, barcode: "8690000000026" },
    { code: "NDT-027", name: "Su Tankı", description: "Ultrasonik test için su tankı.", categoryId: category2.id, unit: "PIECE", purchasePrice: "3000.00", salePrice: "4500.00", taxRate: "18", currentStock: 5, minStock: 1, barcode: "8690000000027" },
    { code: "NDT-028", name: "Sıcaklık Prob", description: "Sıcaklık ölçüm probu, ultrasonik test için.", categoryId: category2.id, unit: "PIECE", purchasePrice: "450.00", salePrice: "700.00", taxRate: "18", currentStock: 18, minStock: 4, barcode: "8690000000028" },
    { code: "NDT-029", name: "Prob Bağlantı Adaptörü", description: "Ultrasonik prob bağlantı adaptörü.", categoryId: category2.id, unit: "PIECE", purchasePrice: "150.00", salePrice: "250.00", taxRate: "18", currentStock: 40, minStock: 10, barcode: "8690000000029" },
    { code: "NDT-030", name: "Koruma Kılıfı", description: "Ultrasonik cihaz koruma kılıfı.", categoryId: category2.id, unit: "PIECE", purchasePrice: "350.00", salePrice: "500.00", taxRate: "18", currentStock: 12, minStock: 3, barcode: "8690000000030" },
    
    // Penetrant Test Ürünleri
    { code: "NDT-031", name: "Penetrant Sıvısı Tip I", description: "Tip I penetrant sıvısı, floresan.", categoryId: category3.id, unit: "LT", purchasePrice: "400.00", salePrice: "600.00", taxRate: "18", currentStock: 40, minStock: 8, barcode: "8690000000031" },
    { code: "NDT-032", name: "Penetrant Sıvısı Tip II", description: "Tip II penetrant sıvısı, görünür renkli.", categoryId: category3.id, unit: "LT", purchasePrice: "350.00", salePrice: "550.00", taxRate: "18", currentStock: 35, minStock: 7, barcode: "8690000000032" },
    { code: "NDT-033", name: "Developer Tip I", description: "Tip I developer, kuru toz.", categoryId: category3.id, unit: "KG", purchasePrice: "250.00", salePrice: "400.00", taxRate: "18", currentStock: 50, minStock: 10, barcode: "8690000000033" },
    { code: "NDT-034", name: "Developer Tip II", description: "Tip II developer, ıslak developer.", categoryId: category3.id, unit: "LT", purchasePrice: "300.00", salePrice: "500.00", taxRate: "18", currentStock: 30, minStock: 6, barcode: "8690000000034" },
    { code: "NDT-035", name: "Temizleyici", description: "Penetrant test temizleyici solüsyon.", categoryId: category3.id, unit: "LT", purchasePrice: "200.00", salePrice: "350.00", taxRate: "18", currentStock: 60, minStock: 12, barcode: "8690000000035" },
    { code: "NDT-036", name: "Penetrant Test Seti", description: "Komple penetrant test seti, taşınabilir.", categoryId: category3.id, unit: "SET", purchasePrice: "2500.00", salePrice: "4000.00", taxRate: "18", currentStock: 10, minStock: 2, barcode: "8690000000036" },
    { code: "NDT-037", name: "UV Lamba", description: "Floresan penetrant için UV lamba.", categoryId: category3.id, unit: "PIECE", purchasePrice: "1200.00", salePrice: "1800.00", taxRate: "18", currentStock: 15, minStock: 3, barcode: "8690000000037" },
    { code: "NDT-038", name: "Püskürtücü", description: "Penetrant püskürtücü sprey.", categoryId: category3.id, unit: "PIECE", purchasePrice: "150.00", salePrice: "250.00", taxRate: "18", currentStock: 50, minStock: 10, barcode: "8690000000038" },
    { code: "NDT-039", name: "Fırça", description: "Penetrant uygulama fırçası.", categoryId: category3.id, unit: "PIECE", purchasePrice: "50.00", salePrice: "80.00", taxRate: "18", currentStock: 100, minStock: 20, barcode: "8690000000039" },
    { code: "NDT-040", name: "Bez", description: "Penetrant test için temizleme bezleri (50 adet).", categoryId: category3.id, unit: "PACKAGE", purchasePrice: "100.00", salePrice: "150.00", taxRate: "18", currentStock: 80, minStock: 16, barcode: "8690000000040" },
    { code: "NDT-041", name: "Koruyucu Eldiven", description: "Penetrant test için nitril eldivenler (100 adet).", categoryId: category3.id, unit: "PACKAGE", purchasePrice: "200.00", salePrice: "300.00", taxRate: "18", currentStock: 60, minStock: 12, barcode: "8690000000041" },
    { code: "NDT-042", name: "Emici Kağıt", description: "Penetrant test için emici kağıtlar.", categoryId: category3.id, unit: "PACKAGE", purchasePrice: "80.00", salePrice: "120.00", taxRate: "18", currentStock: 90, minStock: 18, barcode: "8690000000042" },
    { code: "NDT-043", name: "Karartma Çadırı", description: "Floresan penetrant için karartma çadırı.", categoryId: category3.id, unit: "PIECE", purchasePrice: "3500.00", salePrice: "5000.00", taxRate: "18", currentStock: 5, minStock: 1, barcode: "8690000000043" },
    { code: "NDT-044", name: "Sıvı Temizleyici", description: "Penetrant test sonrası sıvı temizleyici.", categoryId: category3.id, unit: "LT", purchasePrice: "180.00", salePrice: "300.00", taxRate: "18", currentStock: 45, minStock: 9, barcode: "8690000000044" },
    { code: "NDT-045", name: "Test Bloğu", description: "Penetrant test kalibrasyon bloğu.", categoryId: category3.id, unit: "PIECE", purchasePrice: "800.00", salePrice: "1200.00", taxRate: "18", currentStock: 12, minStock: 3, barcode: "8690000000045" },
    
    // Manyetik Parçacık Test Ürünleri
    { code: "NDT-046", name: "Manyetik Toz Tip I", description: "Tip I manyetik toz, floresan.", categoryId: category4.id, unit: "KG", purchasePrice: "300.00", salePrice: "500.00", taxRate: "18", currentStock: 40, minStock: 8, barcode: "8690000000046" },
    { code: "NDT-047", name: "Manyetik Toz Tip II", description: "Tip II manyetik toz, görünür renkli.", categoryId: category4.id, unit: "KG", purchasePrice: "280.00", salePrice: "450.00", taxRate: "18", currentStock: 35, minStock: 7, barcode: "8690000000047" },
    { code: "NDT-048", name: "Manyetik Toz Tip III", description: "Tip III manyetik toz, ıslak.", categoryId: category4.id, unit: "LT", purchasePrice: "350.00", salePrice: "550.00", taxRate: "18", currentStock: 30, minStock: 6, barcode: "8690000000048" },
    { code: "NDT-049", name: "Manyetik Toz Tip IV", description: "Tip IV manyetik toz, yüksek hassasiyet.", categoryId: category4.id, unit: "KG", purchasePrice: "400.00", salePrice: "650.00", taxRate: "18", currentStock: 25, minStock: 5, barcode: "8690000000049" },
    { code: "NDT-050", name: "Manyetik Toz Tip VI", description: "Tip VI manyetik toz, düşük parlaklık.", categoryId: category4.id, unit: "KG", purchasePrice: "320.00", salePrice: "520.00", taxRate: "18", currentStock: 28, minStock: 6, barcode: "8690000000050" },
    { code: "NDT-051", name: "Manyetik Toz Tip VII", description: "Tip VII manyetik toz, yüksek parlaklık.", categoryId: category4.id, unit: "KG", purchasePrice: "380.00", salePrice: "600.00", taxRate: "18", currentStock: 22, minStock: 5, barcode: "8690000000051" },
    { code: "NDT-052", name: "Manyetik Toz Tip VIII", description: "Tip VIII manyetik toz, çok amaçlı.", categoryId: category4.id, unit: "KG", purchasePrice: "350.00", salePrice: "580.00", taxRate: "18", currentStock: 26, minStock: 5, barcode: "8690000000052" },
    { code: "NDT-053", name: "Manyetik Toz Karıştırıcı", description: "Manyetik toz karıştırıcı cihazı.", categoryId: category4.id, unit: "PIECE", purchasePrice: "1200.00", salePrice: "1800.00", taxRate: "18", currentStock: 8, minStock: 2, barcode: "8690000000053" },
    { code: "NDT-054", name: "Manyetik Toz Püskürtücü", description: "Manyetik toz püskürtücü cihazı.", categoryId: category4.id, unit: "PIECE", purchasePrice: "1500.00", salePrice: "2200.00", taxRate: "18", currentStock: 6, minStock: 2, barcode: "8690000000054" },
    { code: "NDT-055", name: "Manyetik Toz Tankı", description: "Manyetik toz tankı, 10L.", categoryId: category4.id, unit: "PIECE", purchasePrice: "800.00", salePrice: "1200.00", taxRate: "18", currentStock: 10, minStock: 2, barcode: "8690000000055" },
    { code: "NDT-056", name: "Manyetik Toz Fırçası", description: "Manyetik toz uygulama fırçası.", categoryId: category4.id, unit: "PIECE", purchasePrice: "80.00", salePrice: "120.00", taxRate: "18", currentStock: 40, minStock: 8, barcode: "8690000000056" },
    { code: "NDT-057", name: "UV Lamba Manyetik", description: "Manyetik toz için UV lamba.", categoryId: category4.id, unit: "PIECE", purchasePrice: "1100.00", salePrice: "1700.00", taxRate: "18", currentStock: 12, minStock: 3, barcode: "8690000000057" },
    { code: "NDT-058", name: "Manyetik Test Seti", description: "Komple manyetik test seti.", categoryId: category4.id, unit: "SET", purchasePrice: "3500.00", salePrice: "5500.00", taxRate: "18", currentStock: 5, minStock: 1, barcode: "8690000000058" },
    { code: "NDT-059", name: "Manyetik Prob", description: "Manyetik test probu.", categoryId: category4.id, unit: "PIECE", purchasePrice: "600.00", salePrice: "900.00", taxRate: "18", currentStock: 20, minStock: 4, barcode: "8690000000059" },
    { code: "NDT-060", name: "Manyetik Jeneratör", description: "Portatif manyetik jeneratör.", categoryId: category4.id, unit: "PIECE", purchasePrice: "4500.00", salePrice: "6500.00", taxRate: "18", currentStock: 4, minStock: 1, barcode: "8690000000060" },
    
    // Sertlik Ölçüm Cihazları
    { code: "NDT-061", name: "TKM 459 CE UCI Sertlik Ölçüm Cihazı", description: "TKM-459 CE UCI Sertlik Ölçüm Cihazı ile hızlı bir şekilde yüksek hassasiyetli sonuçlar alınabilmektedir.", categoryId: category5.id, unit: "PIECE", purchasePrice: "12000.00", salePrice: "18000.00", taxRate: "18", currentStock: 6, minStock: 2, barcode: "8690000000061" },
    { code: "NDT-062", name: "MH 320 LEEB Bilyalı Sertlik Ölçüm Cihazı", description: "MH320 taşınabilir Leeb sertlik test cihazı, Leeb sertlik ölçüm prensibine dayanmaktadır.", categoryId: category5.id, unit: "PIECE", purchasePrice: "14000.00", salePrice: "20000.00", taxRate: "18", currentStock: 5, minStock: 1, barcode: "8690000000062" },
    { code: "NDT-063", name: "Rockwell Sertlik Ölçer", description: "Rockwell sertlik ölçüm cihazı, dijital.", categoryId: category5.id, unit: "PIECE", purchasePrice: "18000.00", salePrice: "25000.00", taxRate: "18", currentStock: 4, minStock: 1, barcode: "8690000000063" },
    { code: "NDT-064", name: "Vickers Sertlik Ölçer", description: "Vickers sertlik ölçüm cihazı, mikroskoplu.", categoryId: category5.id, unit: "PIECE", purchasePrice: "22000.00", salePrice: "30000.00", taxRate: "18", currentStock: 3, minStock: 1, barcode: "8690000000064" },
    { code: "NDT-065", name: "Brinell Sertlik Ölçer", description: "Brinell sertlik ölçüm cihazı.", categoryId: category5.id, unit: "PIECE", purchasePrice: "16000.00", salePrice: "23000.00", taxRate: "18", currentStock: 4, minStock: 1, barcode: "8690000000065" },
    { code: "NDT-066", name: "Shore Sertlik Ölçer", description: "Shore sertlik ölçüm cihazı, tip D.", categoryId: category5.id, unit: "PIECE", purchasePrice: "8500.00", salePrice: "12000.00", taxRate: "18", currentStock: 8, minStock: 2, barcode: "8690000000066" },
    { code: "NDT-067", name: "Sertlik Test Bloğu", description: "Sertlik kalibrasyon test bloğu seti.", categoryId: category5.id, unit: "SET", purchasePrice: "2500.00", salePrice: "3500.00", taxRate: "18", currentStock: 10, minStock: 2, barcode: "8690000000067" },
    { code: "NDT-068", name: "Sertlik Ölçüm Ucu", description: "Sertlik ölçüm ucu, konik.", categoryId: category5.id, unit: "PIECE", purchasePrice: "450.00", salePrice: "700.00", taxRate: "18", currentStock: 30, minStock: 6, barcode: "8690000000068" },
    { code: "NDT-069", name: "Sertlik Ölçüm Ucu Küresel", description: "Sertlik ölçüm ucu, küresel.", categoryId: category5.id, unit: "PIECE", purchasePrice: "500.00", salePrice: "750.00", taxRate: "18", currentStock: 25, minStock: 5, barcode: "8690000000069" },
    { code: "NDT-070", name: "Sertlik Ölçüm Ağırlığı", description: "Sertlik ölçüm için standart ağırlıklar.", categoryId: category5.id, unit: "SET", purchasePrice: "800.00", salePrice: "1200.00", taxRate: "18", currentStock: 15, minStock: 3, barcode: "8690000000070" },
    { code: "NDT-071", name: "Sertlik Ölçüm Standart Bloğu", description: "Sertlik ölçüm standart bloğu, HRC.", categoryId: category5.id, unit: "PIECE", purchasePrice: "1200.00", salePrice: "1800.00", taxRate: "18", currentStock: 12, minStock: 3, barcode: "8690000000071" },
    { code: "NDT-072", name: "Sertlik Ölçüm Adaptörü", description: "Sertlik ölçüm adaptörü.", categoryId: category5.id, unit: "PIECE", purchasePrice: "350.00", salePrice: "550.00", taxRate: "18", currentStock: 20, minStock: 4, barcode: "8690000000072" },
    { code: "NDT-073", name: "Sertlik Ölçüm Kablosu", description: "Sertlik ölçüm kablo seti.", categoryId: category5.id, unit: "PIECE", purchasePrice: "250.00", salePrice: "400.00", taxRate: "18", currentStock: 25, minStock: 5, barcode: "8690000000073" },
    { code: "NDT-074", name: "Sertlik Ölçüm Bataryası", description: "Sertlik ölçüm cihaz bataryası.", categoryId: category5.id, unit: "PIECE", purchasePrice: "400.00", salePrice: "600.00", taxRate: "18", currentStock: 18, minStock: 4, barcode: "8690000000074" },
    { code: "NDT-075", name: "Sertlik Ölçüm Kılıfı", description: "Sertlik ölçüm cihaz koruma kılıfı.", categoryId: category5.id, unit: "PIECE", purchasePrice: "300.00", salePrice: "450.00", taxRate: "18", currentStock: 15, minStock: 3, barcode: "8690000000075" },
    
    // Analitik Cihazlar
    { code: "NDT-076", name: "ER2200 Polarizasyon Azalma Oranı Ölçer", description: "FBERPRO'nun Polarizasyon Sönme Oranı Ölçeri ER2200, Polarizasyon Sönme Oranını (PER), Polarizasyon Açısını ve Gücü olağanüstü hassasiyet ve hızla ölçer.", categoryId: category6.id, unit: "PIECE", purchasePrice: "25000.00", salePrice: "35000.00", taxRate: "18", currentStock: 3, minStock: 1, barcode: "8690000000076" },
    { code: "NDT-077", name: "Spektrometre", description: "XRF spektrometre, element analizi için.", categoryId: category6.id, unit: "PIECE", purchasePrice: "45000.00", salePrice: "65000.00", taxRate: "18", currentStock: 2, minStock: 1, barcode: "8690000000077" },
    { code: "NDT-078", name: "Metal Analiz Cihazı", description: "Taşınabilir metal analiz cihazı.", categoryId: category6.id, unit: "PIECE", purchasePrice: "35000.00", salePrice: "50000.00", taxRate: "18", currentStock: 3, minStock: 1, barcode: "8690000000078" },
    { code: "NDT-079", name: "Kalınlık Ölçüm Prob", description: "Analitik kalınlık ölçüm probu.", categoryId: category6.id, unit: "PIECE", purchasePrice: "1800.00", salePrice: "2800.00", taxRate: "18", currentStock: 10, minStock: 2, barcode: "8690000000079" },
    { code: "NDT-080", name: "Analitik Software", description: "Analitik cihaz yazılım lisansı.", categoryId: category6.id, unit: "PIECE", purchasePrice: "5000.00", salePrice: "8000.00", taxRate: "18", currentStock: 20, minStock: 5, barcode: "8690000000080" },
    { code: "NDT-081", name: "Veri Toplama Ünitesi", description: "Analitik veri toplama ünitesi.", categoryId: category6.id, unit: "PIECE", purchasePrice: "3000.00", salePrice: "4500.00", taxRate: "18", currentStock: 8, minStock: 2, barcode: "8690000000081" },
    { code: "NDT-082", name: "Sensör Adaptörü", description: "Analitik sensör adaptörü.", categoryId: category6.id, unit: "PIECE", purchasePrice: "600.00", salePrice: "900.00", taxRate: "18", currentStock: 25, minStock: 5, barcode: "8690000000082" },
    { code: "NDT-083", name: "Kalibrasyon Standardı", description: "Analitik kalibrasyon standardı.", categoryId: category6.id, unit: "SET", purchasePrice: "1500.00", salePrice: "2500.00", taxRate: "18", currentStock: 12, minStock: 3, barcode: "8690000000083" },
    { code: "NDT-084", name: "Ölçüm Prob Seti", description: "Analitik ölçüm prob seti.", categoryId: category6.id, unit: "SET", purchasePrice: "2200.00", salePrice: "3500.00", taxRate: "18", currentStock: 8, minStock: 2, barcode: "8690000000084" },
    { code: "NDT-085", name: "Veri Kablosu", description: "Analitik veri transfer kablosu.", categoryId: category6.id, unit: "PIECE", purchasePrice: "200.00", salePrice: "350.00", taxRate: "18", currentStock: 30, minStock: 6, barcode: "8690000000085" },
    { code: "NDT-086", name: "Analitik Batarya", description: "Analitik cihaz bataryası.", categoryId: category6.id, unit: "PIECE", purchasePrice: "500.00", salePrice: "800.00", taxRate: "18", currentStock: 20, minStock: 4, barcode: "8690000000086" },
    { code: "NDT-087", name: "Analitik Kılıf", description: "Analitik cihaz koruma kılıfı.", categoryId: category6.id, unit: "PIECE", purchasePrice: "400.00", salePrice: "600.00", taxRate: "18", currentStock: 15, minStock: 3, barcode: "8690000000087" },
    { code: "NDT-088", name: "Analitik Standart", description: "Analitik ölçüm standardı.", categoryId: category6.id, unit: "PIECE", purchasePrice: "1000.00", salePrice: "1500.00", taxRate: "18", currentStock: 18, minStock: 4, barcode: "8690000000088" },
    { code: "NDT-089", name: "Analitik Aksesuar Seti", description: "Analitik cihaz aksesuar seti.", categoryId: category6.id, unit: "SET", purchasePrice: "800.00", salePrice: "1200.00", taxRate: "18", currentStock: 14, minStock: 3, barcode: "8690000000089" },
    { code: "NDT-090", name: "Analitik Yazıcı", description: "Analitik veri yazıcısı.", categoryId: category6.id, unit: "PIECE", purchasePrice: "1200.00", salePrice: "1800.00", taxRate: "18", currentStock: 6, minStock: 2, barcode: "8690000000090" },
    
    // Eğitim ve Sertifikasyon
    { code: "NDT-091", name: "NDT Seviye I Eğitimi", description: "Tahribatsız muayene seviye I eğitim programı.", categoryId: category7.id, unit: "PIECE", purchasePrice: "5000.00", salePrice: "8000.00", taxRate: "18", currentStock: 50, minStock: 10, barcode: "8690000000091" },
    { code: "NDT-092", name: "NDT Seviye II Eğitimi", description: "Tahribatsız muayene seviye II eğitim programı.", categoryId: category7.id, unit: "PIECE", purchasePrice: "7000.00", salePrice: "11000.00", taxRate: "18", currentStock: 40, minStock: 8, barcode: "8690000000092" },
    { code: "NDT-093", name: "NDT Seviye III Eğitimi", description: "Tahribatsız muayene seviye III eğitim programı.", categoryId: category7.id, unit: "PIECE", purchasePrice: "12000.00", salePrice: "18000.00", taxRate: "18", currentStock: 20, minStock: 5, barcode: "8690000000093" },
    { code: "NDT-094", name: "Radyografi Sertifikasyon", description: "Radyografi test sertifikasyon programı.", categoryId: category7.id, unit: "PIECE", purchasePrice: "4000.00", salePrice: "6500.00", taxRate: "18", currentStock: 30, minStock: 6, barcode: "8690000000094" },
    { code: "NDT-095", name: "Ultrasonik Sertifikasyon", description: "Ultrasonik test sertifikasyon programı.", categoryId: category7.id, unit: "PIECE", purchasePrice: "4500.00", salePrice: "7000.00", taxRate: "18", currentStock: 25, minStock: 5, barcode: "8690000000095" },
    { code: "NDT-096", name: "Penetrant Sertifikasyon", description: "Penetrant test sertifikasyon programı.", categoryId: category7.id, unit: "PIECE", purchasePrice: "3500.00", salePrice: "5500.00", taxRate: "18", currentStock: 35, minStock: 7, barcode: "8690000000096" },
    { code: "NDT-097", name: "Manyetik Sertifikasyon", description: "Manyetik parçacık test sertifikasyon programı.", categoryId: category7.id, unit: "PIECE", purchasePrice: "3500.00", salePrice: "5500.00", taxRate: "18", currentStock: 30, minStock: 6, barcode: "8690000000097" },
    { code: "NDT-098", name: "Eğitim Materyal Seti", description: "NDT eğitim materyal seti.", categoryId: category7.id, unit: "SET", purchasePrice: "1500.00", salePrice: "2500.00", taxRate: "18", currentStock: 20, minStock: 4, barcode: "8690000000098" },
    { code: "NDT-099", name: "Eğitim Video Seti", description: "NDT eğitim video seti (DVD).", categoryId: category7.id, unit: "SET", purchasePrice: "800.00", salePrice: "1200.00", taxRate: "18", currentStock: 25, minStock: 5, barcode: "8690000000099" },
    { code: "NDT-100", name: "Sertifikasyon Kitabı", description: "NDT sertifikasyon kılavuz kitabı.", categoryId: category7.id, unit: "PIECE", purchasePrice: "250.00", salePrice: "400.00", taxRate: "18", currentStock: 40, minStock: 8, barcode: "8690000000100" },
  ];

  // Create products
  for (let i = 0; i < productsData.length; i++) {
    const p = productsData[i];
    await prisma.product.upsert({
      where: { id: `seed-prod-${String(i).padStart(3, "0")}` },
      create: {
        id: `seed-prod-${String(i).padStart(3, "0")}`,
        code: p.code,
        name: p.name,
        description: p.description,
        categoryId: p.categoryId,
        unit: p.unit as any,
        purchasePrice: p.purchasePrice,
        salePrice: p.salePrice,
        taxRate: p.taxRate,
        currentStock: p.currentStock,
        minStock: p.minStock,
        maxStock: p.currentStock * 2,
        barcode: p.barcode,
        isActive: true,
      },
      update: {},
    });
  }

  // Orders - 50 orders with different statuses
  const orderStatuses = ["DRAFT", "PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "COMPLETED", "CANCELLED"];
  const paymentStatuses = ["UNPAID", "PARTIAL", "PAID", "REFUNDED"];
  
  const ordersData = [];
  for (let i = 0; i < 50; i++) {
    const customer = allCustomers[i % allCustomers.length];
    const product1 = productsData[i % productsData.length];
    const product2 = productsData[(i + 1) % productsData.length];
    const product3 = productsData[(i + 2) % productsData.length];
    
    const qty1 = Math.floor(Math.random() * 5) + 1;
    const qty2 = Math.floor(Math.random() * 3) + 1;
    const qty3 = Math.floor(Math.random() * 2) + 1;
    
    const price1 = parseFloat(product1.salePrice);
    const price2 = parseFloat(product2.salePrice);
    const price3 = parseFloat(product3.salePrice);
    
    const subtotal1 = qty1 * price1;
    const subtotal2 = qty2 * price2;
    const subtotal3 = qty3 * price3;
    
    const tax1 = subtotal1 * 0.18;
    const tax2 = subtotal2 * 0.18;
    const tax3 = subtotal3 * 0.18;
    
    const total1 = subtotal1 + tax1;
    const total2 = subtotal2 + tax2;
    const total3 = subtotal3 + tax3;
    
    const subtotal = subtotal1 + subtotal2 + subtotal3;
    const taxAmount = tax1 + tax2 + tax3;
    const totalAmount = subtotal + taxAmount;
    
    const orderDate = new Date();
    orderDate.setDate(orderDate.getDate() - Math.floor(Math.random() * 30));
    
    ordersData.push({
      orderNumber: `ORD-${String(i + 1).padStart(5, "0")}`,
      customerId: customer.id,
      orderDate: orderDate,
      status: orderStatuses[i % orderStatuses.length] as any,
      paymentStatus: paymentStatuses[i % paymentStatuses.length] as any,
      subtotal: subtotal.toFixed(2),
      taxAmount: taxAmount.toFixed(2),
      discountAmount: (Math.random() > 0.7 ? Math.floor(Math.random() * 500) : 0).toFixed(2),
      shippingCost: (Math.random() > 0.5 ? Math.floor(Math.random() * 100) + 20 : 0).toFixed(2),
      totalAmount: totalAmount.toFixed(2),
      shippingAddress: `${customer.street || ""} ${customer.city || "İstanbul"} ${customer.postalCode || ""}`,
      billingAddress: `${customer.street || ""} ${customer.city || "İstanbul"} ${customer.postalCode || ""}`,
      notes: i % 5 === 0 ? "Acil sipariş" : "",
      orderItems: [
        {
          productId: `seed-prod-${String(i % productsData.length).padStart(3, "0")}`,
          quantity: qty1,
          unitPrice: product1.salePrice,
          taxRate: "18",
          discount: "0",
          subtotal: subtotal1.toFixed(2),
          taxAmount: tax1.toFixed(2),
          totalAmount: total1.toFixed(2),
        },
        {
          productId: `seed-prod-${String((i + 1) % productsData.length).padStart(3, "0")}`,
          quantity: qty2,
          unitPrice: product2.salePrice,
          taxRate: "18",
          discount: "0",
          subtotal: subtotal2.toFixed(2),
          taxAmount: tax2.toFixed(2),
          totalAmount: total2.toFixed(2),
        },
        {
          productId: `seed-prod-${String((i + 2) % productsData.length).padStart(3, "0")}`,
          quantity: qty3,
          unitPrice: product3.salePrice,
          taxRate: "18",
          discount: "0",
          subtotal: subtotal3.toFixed(2),
          taxAmount: tax3.toFixed(2),
          totalAmount: total3.toFixed(2),
        },
      ],
    });
  }

  // Create orders
  for (let i = 0; i < ordersData.length; i++) {
    const o = ordersData[i];
    const order = await prisma.order.upsert({
      where: { id: `seed-order-${String(i).padStart(3, "0")}` },
      create: {
        id: `seed-order-${String(i).padStart(3, "0")}`,
        orderNumber: o.orderNumber,
        customerId: o.customerId,
        orderDate: o.orderDate,
        status: o.status,
        paymentStatus: o.paymentStatus,
        subtotal: o.subtotal,
        taxAmount: o.taxAmount,
        discountAmount: o.discountAmount,
        shippingCost: o.shippingCost,
        totalAmount: o.totalAmount,
        shippingAddress: o.shippingAddress,
        billingAddress: o.billingAddress,
        notes: o.notes,
        isActive: true,
      },
      update: {},
    });

    // Create order items
    for (let j = 0; j < o.orderItems.length; j++) {
      const item = o.orderItems[j];
      await prisma.orderItem.upsert({
        where: { id: `seed-order-item-${String(i).padStart(3, "0")}-${String(j).padStart(2, "0")}` },
        create: {
          id: `seed-order-item-${String(i).padStart(3, "0")}-${String(j).padStart(2, "0")}`,
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          taxRate: item.taxRate,
          discount: item.discount,
          subtotal: item.subtotal,
          taxAmount: item.taxAmount,
          totalAmount: item.totalAmount,
        },
        update: {},
      });
    }
  }

  // Invoices - 100 invoices with different statuses
  const invoiceStatuses = ["DRAFT", "SENT", "PARTIAL", "PAID", "OVERDUE", "CANCELLED"];
  
  const invoicesData = [];
  for (let i = 0; i < 100; i++) {
    const customer = allCustomers[i % allCustomers.length];
    const order = ordersData[i % ordersData.length];
    const product1 = productsData[i % productsData.length];
    const product2 = productsData[(i + 1) % productsData.length];
    
    const qty1 = Math.floor(Math.random() * 5) + 1;
    const qty2 = Math.floor(Math.random() * 3) + 1;
    
    const price1 = parseFloat(product1.salePrice);
    const price2 = parseFloat(product2.salePrice);
    
    const subtotal1 = qty1 * price1;
    const subtotal2 = qty2 * price2;
    
    const tax1 = subtotal1 * 0.18;
    const tax2 = subtotal2 * 0.18;
    
    const total1 = subtotal1 + tax1;
    const total2 = subtotal2 + tax2;
    
    const subtotal = subtotal1 + subtotal2;
    const taxAmount = tax1 + tax2;
    const totalAmount = subtotal + taxAmount;
    
    const invoiceDate = new Date();
    invoiceDate.setDate(invoiceDate.getDate() - Math.floor(Math.random() * 60));
    
    const dueDate = new Date(invoiceDate);
    dueDate.setDate(dueDate.getDate() + 30);
    
    const status = invoiceStatuses[i % invoiceStatuses.length] as any;
    const paidAmount = status === "PAID" ? String(totalAmount) : status === "PARTIAL" ? String(totalAmount * (Math.random() * 0.5 + 0.25)) : "0";
    const remainingAmount = String(totalAmount - parseFloat(paidAmount));
    
    invoicesData.push({
      invoiceNumber: `INV-${String(i + 1).padStart(6, "0")}`,
      customerId: customer.id,
      orderId: order.orderNumber,
      invoiceDate: invoiceDate,
      dueDate: dueDate,
      status: status,
      subtotal: subtotal.toFixed(2),
      taxAmount: taxAmount.toFixed(2),
      discountAmount: (Math.random() > 0.8 ? Math.floor(Math.random() * 500) : 0).toFixed(2),
      totalAmount: totalAmount.toFixed(2),
      paidAmount: paidAmount,
      remainingAmount: remainingAmount,
      billingAddress: `${customer.street || ""} ${customer.city || "İstanbul"} ${customer.postalCode || ""}`,
      shippingAddress: `${customer.street || ""} ${customer.city || "İstanbul"} ${customer.postalCode || ""}`,
      notes: i % 10 === 0 ? "Acil fatura" : "",
      emailSent: status !== "DRAFT",
      invoiceItems: [
        {
          productId: `seed-prod-${String(i % productsData.length).padStart(3, "0")}`,
          description: product1.name,
          quantity: qty1,
          unitPrice: product1.salePrice,
          taxRate: "18",
          discount: "0",
          subtotal: subtotal1.toFixed(2),
          taxAmount: tax1.toFixed(2),
          totalAmount: total1.toFixed(2),
        },
        {
          productId: `seed-prod-${String((i + 1) % productsData.length).padStart(3, "0")}`,
          description: product2.name,
          quantity: qty2,
          unitPrice: product2.salePrice,
          taxRate: "18",
          discount: "0",
          subtotal: subtotal2.toFixed(2),
          taxAmount: tax2.toFixed(2),
          totalAmount: total2.toFixed(2),
        },
      ],
    });
  }

  // Create invoices
  for (let i = 0; i < invoicesData.length; i++) {
    const inv = invoicesData[i];
    const invoice = await prisma.invoice.upsert({
      where: { id: `seed-invoice-${String(i).padStart(3, "0")}` },
      create: {
        id: `seed-invoice-${String(i).padStart(3, "0")}`,
        invoiceNumber: inv.invoiceNumber,
        customerId: inv.customerId,
        orderId: inv.orderId ? `seed-order-${String(i % ordersData.length).padStart(3, "0")}` : null,
        invoiceDate: inv.invoiceDate,
        dueDate: inv.dueDate,
        status: inv.status,
        subtotal: inv.subtotal,
        taxAmount: inv.taxAmount,
        discountAmount: inv.discountAmount,
        totalAmount: inv.totalAmount,
        paidAmount: inv.paidAmount,
        remainingAmount: inv.remainingAmount,
        billingAddress: inv.billingAddress,
        shippingAddress: inv.shippingAddress,
        notes: inv.notes,
        emailSent: inv.emailSent,
        isActive: true,
      },
      update: {},
    });

    // Create invoice items
    for (let j = 0; j < inv.invoiceItems.length; j++) {
      const item = inv.invoiceItems[j];
      await prisma.invoiceItem.upsert({
        where: { id: `seed-invoice-item-${String(i).padStart(3, "0")}-${String(j).padStart(2, "0")}` },
        create: {
          id: `seed-invoice-item-${String(i).padStart(3, "0")}-${String(j).padStart(2, "0")}`,
          invoiceId: invoice.id,
          productId: item.productId,
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          taxRate: item.taxRate,
          discount: item.discount,
          subtotal: item.subtotal,
          taxAmount: item.taxAmount,
          totalAmount: item.totalAmount,
        },
        update: {},
      });
    }

    // Create payments for PARTIAL and PAID invoices
    if (inv.status === "PARTIAL" || inv.status === "PAID") {
      const paymentAmount = parseFloat(inv.paidAmount);
      const payment = await prisma.payment.upsert({
        where: { id: `seed-payment-${String(i).padStart(3, "0")}` },
        create: {
          id: `seed-payment-${String(i).padStart(3, "0")}`,
          invoiceId: invoice.id,
          paymentDate: new Date(),
          amount: inv.paidAmount,
          paymentMethod: "BANK_TRANSFER",
          reference: `REF-${String(i + 1).padStart(6, "0")}`,
          notes: "Otomatik ödeme",
          isActive: true,
        },
        update: {},
      });
    }
  }

  console.log("✅ Seed tamamlandı:");
  console.log(`   - 3 şirket`);
  console.log(`   - 10 banka`);
  console.log(`   - ${allUsers.length} kullanıcı`);
  console.log(`   - ${allCustomers.length} müşteri`);
  console.log(`   - ${tickets1Data.length + tickets2Data.length + tickets3Data.length} ticket`);
  console.log(`   - ${appointments1Data.length + appointments2Data.length + appointments3Data.length} randevu`);
  console.log(`   - ${activityLogsData.length} aktivite logu`);
  console.log(`   - ${emailInboxData.length} email`);
  console.log(`   - ${notifIndex} bildirim`);
  console.log(`   - 8 ürün kategorisi`);
  console.log(`   - ${productsData.length} ürün`);
  console.log(`   - ${ordersData.length} sipariş`);
  console.log(`   - ${invoicesData.length} fatura`);
  console.log(`\n   Giriş bilgileri:`);
  console.log(`   - admin@acar-crm.local / Admin123!`);
  console.log(`   - manager@acartech.local / Admin123!`);
  console.log(`   - manager@acarglobal.local / Admin123!`);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });