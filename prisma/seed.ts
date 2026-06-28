import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash("Admin123!", 10);

  // Companies
  const company1 = await prisma.company.upsert({
    where: { id: "seed-company-01" },
    create: { id: "seed-company-01", name: "Handwerk Demo GmbH" },
    update: {},
  });

  const company2 = await prisma.company.upsert({
    where: { id: "seed-company-02" },
    create: { id: "seed-company-02", name: "TechSolutions GmbH" },
    update: {},
  });

  const company3 = await prisma.company.upsert({
    where: { id: "seed-company-03" },
    create: { id: "seed-company-03", name: "Global Services AG" },
    update: {},
  });

  // Users - Company 1
  const admin = await prisma.user.upsert({
    where: { email: "admin@handwerk.local" },
    create: {
      email: "admin@handwerk.local",
      password,
      firstName: "Klaus",
      lastName: "Bauer",
      role: "ADMIN",
      companyId: company1.id,
      locale: "DE",
    },
    update: { password },
  });

  const admin2 = await prisma.user.upsert({
    where: { email: "admin2@handwerk.local" },
    create: {
      email: "admin2@handwerk.local",
      password,
      firstName: "Max",
      lastName: "Schneider",
      role: "ADMIN",
      companyId: company1.id,
      locale: "DE",
    },
    update: {},
  });

  const manager = await prisma.user.upsert({
    where: { email: "manager@handwerk.local" },
    create: {
      email: "manager@handwerk.local",
      password,
      firstName: "Anna",
      lastName: "Müller",
      role: "MANAGER",
      companyId: company1.id,
      locale: "DE",
    },
    update: {},
  });

  const manager2 = await prisma.user.upsert({
    where: { email: "manager2@handwerk.local" },
    create: {
      email: "manager2@handwerk.local",
      password,
      firstName: "Lisa",
      lastName: "Becker",
      role: "MANAGER",
      companyId: company1.id,
      locale: "DE",
    },
    update: {},
  });

  const manager3 = await prisma.user.upsert({
    where: { email: "manager3@handwerk.local" },
    create: {
      email: "manager3@handwerk.local",
      password,
      firstName: "Robert",
      lastName: "Schulz",
      role: "MANAGER",
      companyId: company1.id,
      locale: "DE",
    },
    update: {},
  });

  const emp1 = await prisma.user.upsert({
    where: { email: "thomas@handwerk.local" },
    create: {
      email: "thomas@handwerk.local",
      password,
      firstName: "Thomas",
      lastName: "Wagner",
      role: "EMPLOYEE",
      companyId: company1.id,
      locale: "DE",
    },
    update: {},
  });

  const emp2 = await prisma.user.upsert({
    where: { email: "stefan@handwerk.local" },
    create: {
      email: "stefan@handwerk.local",
      password,
      firstName: "Stefan",
      lastName: "Hoffmann",
      role: "EMPLOYEE",
      companyId: company1.id,
      locale: "DE",
    },
    update: {},
  });

  const emp3 = await prisma.user.upsert({
    where: { email: "emp3@handwerk.local" },
    create: {
      email: "emp3@handwerk.local",
      password,
      firstName: "Andreas",
      lastName: "Fischer",
      role: "EMPLOYEE",
      companyId: company1.id,
      locale: "DE",
    },
    update: {},
  });

  const emp4 = await prisma.user.upsert({
    where: { email: "emp4@handwerk.local" },
    create: {
      email: "emp4@handwerk.local",
      password,
      firstName: "Julia",
      lastName: "Weber",
      role: "EMPLOYEE",
      companyId: company1.id,
      locale: "DE",
    },
    update: {},
  });

  const emp5 = await prisma.user.upsert({
    where: { email: "emp5@handwerk.local" },
    create: {
      email: "emp5@handwerk.local",
      password,
      firstName: "Michael",
      lastName: "Meyer",
      role: "EMPLOYEE",
      companyId: company1.id,
      locale: "DE",
    },
    update: {},
  });

  const supervisor = await prisma.user.upsert({
    where: { email: "supervisor@handwerk.local" },
    create: {
      email: "supervisor@handwerk.local",
      password,
      firstName: "Karl",
      lastName: "Weber",
      role: "SUPERVISOR",
      companyId: company1.id,
      locale: "DE",
    },
    update: {},
  });

  // Company 2 - TechSolutions GmbH Users
  const company2Manager = await prisma.user.upsert({
    where: { email: "manager@techsolutions.local" },
    create: {
      email: "manager@techsolutions.local",
      password,
      firstName: "Thomas",
      lastName: "Müller",
      role: "MANAGER",
      companyId: company2.id,
      locale: "DE",
    },
    update: {},
  });

  const company2Emp1 = await prisma.user.upsert({
    where: { email: "emp1@techsolutions.local" },
    create: {
      email: "emp1@techsolutions.local",
      password,
      firstName: "Sarah",
      lastName: "Schmidt",
      role: "EMPLOYEE",
      companyId: company2.id,
      locale: "DE",
    },
    update: {},
  });

  const company2Emp2 = await prisma.user.upsert({
    where: { email: "emp2@techsolutions.local" },
    create: {
      email: "emp2@techsolutions.local",
      password,
      firstName: "Michael",
      lastName: "Fischer",
      role: "EMPLOYEE",
      companyId: company2.id,
      locale: "DE",
    },
    update: {},
  });

  const company2Supervisor = await prisma.user.upsert({
    where: { email: "supervisor@techsolutions.local" },
    create: {
      email: "supervisor@techsolutions.local",
      password,
      firstName: "Andreas",
      lastName: "Weber",
      role: "SUPERVISOR",
      companyId: company2.id,
      locale: "DE",
    },
    update: {},
  });

  // Company 3 - Global Services AG Users
  const company3Manager = await prisma.user.upsert({
    where: { email: "manager@globalservices.local" },
    create: {
      email: "manager@globalservices.local",
      password,
      firstName: "Julia",
      lastName: "Hoffmann",
      role: "MANAGER",
      companyId: company3.id,
      locale: "DE",
    },
    update: {},
  });

  const company3Emp1 = await prisma.user.upsert({
    where: { email: "emp1@globalservices.local" },
    create: {
      email: "emp1@globalservices.local",
      password,
      firstName: "Christian",
      lastName: "Klein",
      role: "EMPLOYEE",
      companyId: company3.id,
      locale: "DE",
    },
    update: {},
  });

  const company3Emp2 = await prisma.user.upsert({
    where: { email: "emp2@globalservices.local" },
    create: {
      email: "emp2@globalservices.local",
      password,
      firstName: "Laura",
      lastName: "Braun",
      role: "EMPLOYEE",
      companyId: company3.id,
      locale: "DE",
    },
    update: {},
  });

  const company3Supervisor = await prisma.user.upsert({
    where: { email: "supervisor@globalservices.local" },
    create: {
      email: "supervisor@globalservices.local",
      password,
      firstName: "Peter",
      lastName: "Schulz",
      role: "SUPERVISOR",
      companyId: company3.id,
      locale: "DE",
    },
    update: {},
  });

  // Customers - Company 1
  const customers1Data = [
    { firstName: "Hans", lastName: "Schmidt", email: "hans.schmidt@gmail.com", phone: "+49 170 1234567", street: "Hauptstraße 12", city: "Berlin", postalCode: "10115" },
    { firstName: "Maria", lastName: "Weber", email: "maria.weber@web.de", phone: "+49 160 9876543", street: "Berliner Allee 45", city: "Hamburg", postalCode: "20095" },
    { firstName: "Peter", lastName: "Fischer", email: "p.fischer@outlook.de", phone: "+49 151 5554433", street: "Gartenweg 7", city: "München", postalCode: "80331" },
    { firstName: "Sabine", lastName: "Krause", email: "sabine.krause@t-online.de", phone: "+49 172 6667788", street: "Lindenstraße 22", city: "Köln", postalCode: "50667" },
    { firstName: "Michael", lastName: "Neumann", email: "m.neumann@gmx.de", phone: "+49 163 1112233", street: "Rosenweg 3", city: "Frankfurt", postalCode: "60311" },
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
    { firstName: "Thomas", lastName: "Meyer", email: "t.meyer@techsolutions.de", phone: "+49 171 2345678", street: "Technologiepark 5", city: "München", postalCode: "80333" },
    { firstName: "Anna", lastName: "Schulz", email: "a.schulz@techsolutions.de", phone: "+49 162 3456789", street: "Innovationsweg 12", city: "Berlin", postalCode: "10178" },
    { firstName: "Christian", lastName: "Becker", email: "c.becker@techsolutions.de", phone: "+49 173 4567890", street: "Softwarestraße 8", city: "Hamburg", postalCode: "20097" },
    { firstName: "Laura", lastName: "Wagner", email: "l.wagner@techsolutions.de", phone: "+49 174 5678901", street: "Digitalplatz 3", city: "Frankfurt", postalCode: "60313" },
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
    { firstName: "Peter", lastName: "Hoffmann", email: "p.hoffmann@globalservices.de", phone: "+49 175 6789012", street: "Globalstraße 15", city: "Stuttgart", postalCode: "70174" },
    { firstName: "Julia", lastName: "Klein", email: "j.klein@globalservices.de", phone: "+49 176 7890123", street: "Serviceplatz 7", city: "Köln", postalCode: "50670" },
    { firstName: "Andreas", lastName: "Braun", email: "a.braun@globalservices.de", phone: "+49 177 8901234", street: "Internationalweg 22", city: "Düsseldorf", postalCode: "40215" },
    { firstName: "Sarah", lastName: "Richter", email: "s.richter@globalservices.de", phone: "+49 178 9012345", street: "Weltmarkt 9", city: "Leipzig", postalCode: "04107" },
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
    { title: "Heizung fällt aus", description: "Die Heizungsanlage funktioniert nicht mehr. Bitte dringend prüfen.", category: "HEATING" as const, priority: "URGENT" as const, status: "NEW" as const, source: "PHONE" as const, customer: customers1[0] },
    { title: "Wasserrohr gebrochen", description: "Im Keller läuft Wasser aus einem gebrochenen Rohr.", category: "PLUMBING" as const, priority: "HIGH" as const, status: "ASSIGNED" as const, source: "EMAIL" as const, customer: customers1[1] },
    { title: "Steckdose defekt", description: "Mehrere Steckdosen im Wohnzimmer haben keinen Strom mehr.", category: "ELECTRICITY" as const, priority: "MEDIUM" as const, status: "IN_PROGRESS" as const, source: "WEB_CHAT" as const, customer: customers1[2] },
    { title: "Wände streichen", description: "Alle Zimmer im Erdgeschoss sollen neu gestrichen werden.", category: "PAINTING" as const, priority: "LOW" as const, status: "COMPLETED" as const, source: "PHONE" as const, customer: customers1[3] },
    { title: "Thermostat austauschen", description: "Der Raumthermostat zeigt falsche Temperaturen an.", category: "HEATING" as const, priority: "MEDIUM" as const, status: "ASSIGNED" as const, source: "EMAIL" as const, customer: customers1[4] },
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
    { title: "Server ausfall", description: "Der Hauptserver ist abgestürzt und startet nicht mehr.", category: "ELECTRICITY" as const, priority: "URGENT" as const, status: "NEW" as const, source: "EMAIL" as const, customer: customers2[0] },
    { title: "Netzwerkprobleme", description: "Das WLAN im Büro funktioniert nicht richtig.", category: "ELECTRICITY" as const, priority: "HIGH" as const, status: "IN_PROGRESS" as const, source: "WEB_CHAT" as const, customer: customers2[1] },
    { title: "Software Update", description: "Alle Arbeitsplätze benötigen ein Software-Update.", category: "OTHER" as const, priority: "MEDIUM" as const, status: "ASSIGNED" as const, source: "EMAIL" as const, customer: customers2[2] },
    { title: "Drucker defekt", description: "Der Netzwerkdrucker druckt nicht mehr.", category: "ELECTRICITY" as const, priority: "LOW" as const, status: "NEW" as const, source: "PHONE" as const, customer: customers2[3] },
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
    { title: "Klimaanlage defekt", description: "Die Klimaanlage im Büro kühlt nicht mehr.", category: "HEATING" as const, priority: "HIGH" as const, status: "ASSIGNED" as const, source: "PHONE" as const, customer: customers3[0] },
    { title: "Lüftungssystem", description: "Das Lüftungssystem macht laute Geräusche.", category: "HEATING" as const, priority: "MEDIUM" as const, status: "NEW" as const, source: "EMAIL" as const, customer: customers3[1] },
    { title: "Beleuchtung prüfen", description: "Die Hallenbeleuchtung muss gewartet werden.", category: "ELECTRICITY" as const, priority: "LOW" as const, status: "IN_PROGRESS" as const, source: "WEB_CHAT" as const, customer: customers3[2] },
    { title: "Sicherheitscheck", description: "Jährlicher Sicherheitscheck erforderlich.", category: "OTHER" as const, priority: "MEDIUM" as const, status: "NEW" as const, source: "EMAIL" as const, customer: customers3[3] },
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
    { title: "Heizungsprüfung", description: "Jahreswartung der Heizungsanlage", status: "PLANNED" as const, daysOffset: 2, customer: customers1[0], employee: emp1 },
    { title: "Rohrreparatur", description: "Austausch des defekten Wasserrohrs", status: "PLANNED" as const, daysOffset: 3, customer: customers1[1], employee: emp2 },
    { title: "Elektroprüfung", description: "Sicherheitscheck Elektroanlage", status: "PLANNED" as const, daysOffset: 5, customer: customers1[2], employee: emp1 },
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
    { title: "Server Wartung", description: "Regelmäßige Serverwartung", status: "PLANNED" as const, daysOffset: 4, customer: customers2[0], employee: company2Emp1 },
    { title: "Netzwerk-Check", description: "Netzwerkinfrastruktur prüfen", status: "PLANNED" as const, daysOffset: 6, customer: customers2[1], employee: company2Emp2 },
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
    { title: "Klimaanlage Service", description: "Wartung der Klimaanlage", status: "PLANNED" as const, daysOffset: 8, customer: customers3[0], employee: company3Emp1 },
    { title: "Lüftungs-Check", description: "Lüftungssystem inspizieren", status: "PLANNED" as const, daysOffset: 10, customer: customers3[1], employee: company3Emp2 },
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
    { title: "Neues Ticket", message: "Ein neues dringendes Ticket wurde erstellt.", type: "WARNING" as const, isRead: false },
    { title: "Termin morgen", message: "Erinnerung: Sie haben einen Termin morgen.", type: "INFO" as const, isRead: false },
    { title: "Ticket abgeschlossen", message: "Ein Ticket wurde erfolgreich abgeschlossen.", type: "SUCCESS" as const, isRead: true },
    { title: "Dringende Anfrage", message: "Eine neue dringende Anfrage ist eingegangen.", type: "ERROR" as const, isRead: false },
    { title: "Neue Nachricht", message: "Jemand hat einen Kommentar zu einem Ticket hinzugefügt.", type: "INFO" as const, isRead: true },
    { title: "Neuer Kunde", message: "Ein neuer Kunde hat sich registriert.", type: "INFO" as const, isRead: false },
    { title: "Adresse aktualisiert", message: "Ein Kunde hat seine Adresse aktualisiert.", type: "INFO" as const, isRead: false },
    { title: "Hoher Ticket-Anfall", message: "Diese Woche wurden viele neue Tickets erstellt.", type: "WARNING" as const, isRead: false },
    { title: "Positives Feedback", message: "Ein Kunde hat positives Feedback gegeben.", type: "SUCCESS" as const, isRead: true },
    { title: "Wichtiger Kunde", message: "Ein wichtiger Kunde benötigt Aufmerksamkeit.", type: "ERROR" as const, isRead: false },
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


  // Conversations and Messages - AI konuşmaları
  const conversations = [];
  for (let i = 0; i < 3; i++) {
    const conversation = await prisma.conversation.upsert({
      where: { id: `seed-conv-${i}` },
      create: {
        id: `seed-conv-${i}`,
        companyId: [company1.id, company2.id, company3.id][i],
        createdAt: new Date(now.getTime() - i * 24 * 60 * 60 * 1000),
      },
      update: {},
    });
    conversations.push(conversation);
  }

  const messagesData = [
    { conversationId: conversations[0].id, role: "user", content: "Ich habe ein Problem mit meiner Heizung." },
    { conversationId: conversations[0].id, role: "assistant", content: "Ich kann Ihnen helfen. Können Sie mir mehr Details geben?" },
    { conversationId: conversations[1].id, role: "user", content: "Der Server läuft nicht mehr." },
    { conversationId: conversations[1].id, role: "assistant", content: "Haben Sie versucht, den Server neu zu starten?" },
    { conversationId: conversations[2].id, role: "user", content: "Die Klimaanlage macht Geräusche." },
    { conversationId: conversations[2].id, role: "assistant", content: "Das könnte ein Wartungsproblem sein. Ich empfehle einen Techniker." },
  ];

  for (const message of messagesData) {
    await prisma.message.upsert({
      where: { id: `seed-msg-${message.conversationId}-${message.role}` },
      create: {
        id: `seed-msg-${message.conversationId}-${message.role}`,
        conversationId: message.conversationId,
        role: message.role,
        content: message.content,
        createdAt: new Date(now.getTime() - Math.random() * 24 * 60 * 60 * 1000),
      },
      update: {},
    });
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

  // Email Inbox - Gelen kutusu
  const emailInboxData = [
    {
      companyId: company1.id,
      messageId: "msg-001@example.com",
      fromEmail: customers1[0].email ?? "hans@example.com",
      fromName: `${customers1[0].firstName} ${customers1[0].lastName}`,
      subject: "Dringendes Heizungsproblem",
      body: "Hallo, meine Heizung funktioniert nicht mehr. Bitte helfen Sie mir so schnell wie möglich.",
      processed: true,
      ticketId: `seed-t1-00`,
    },
    {
      companyId: company2.id,
      messageId: "msg-002@example.com",
      fromEmail: customers2[0].email ?? "thomas@example.com",
      fromName: `${customers2[0].firstName} ${customers2[0].lastName}`,
      subject: "Server Ausfall",
      body: "Unser Hauptserver ist abgestürzt. Wir benötigen dringend Hilfe.",
      processed: true,
      ticketId: `seed-t2-00`,
    },
    {
      companyId: company3.id,
      messageId: "msg-003@example.com",
      fromEmail: customers3[0].email ?? "peter@example.com",
      fromName: `${customers3[0].firstName} ${customers3[0].lastName}`,
      subject: "Klimaanlage defekt",
      body: "Die Klimaanlage im Büro kühlt nicht mehr. Wann können Sie kommen?",
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

  console.log("✅ Seed tamamlandı:");
  console.log(`   - 3 şirket`);
  console.log(`   - ${allUsers.length} kullanıcı`);
  console.log(`   - ${allCustomers.length} müşteri`);
  console.log(`   - ${tickets1Data.length + tickets2Data.length + tickets3Data.length} ticket`);
  console.log(`   - ${appointments1Data.length + appointments2Data.length + appointments3Data.length} randevu`);
  console.log(`   - ${conversations.length} konuşma`);
  console.log(`   - ${messagesData.length} mesaj`);
  console.log(`   - ${activityLogsData.length} aktivite logu`);
  console.log(`   - ${emailInboxData.length} email`);
  console.log(`   - ${notifIndex} bildirim`);
  console.log(`\n   Giriş bilgileri:`);
  console.log(`   - Company 1: admin@handwerk.local / Admin123!`);
  console.log(`   - Company 2: manager@techsolutions.local / Admin123!`);
  console.log(`   - Company 3: manager@globalservices.local / Admin123!`);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
