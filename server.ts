import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { Resource, User, BorrowRecord, Reservation, SystemStats, DateModel } from './src/types';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Helper date parsing and difference routines mirroring C++ "Date" logic
  // Dates are represented as "DD-MM-YYYY" strings
  const stringToDateModel = (str: string): DateModel => {
    const parts = str.split('-');
    return {
      day: parseInt(parts[0], 10),
      month: parseInt(parts[1], 10),
      year: parseInt(parts[2], 10)
    };
  };

  const isLeapYear = (y: number): boolean => {
    return (y % 400 === 0) || (y % 4 === 0 && y % 100 !== 0);
  };

  const daysInMonth = (m: number, y: number): number => {
    if (m === 2) return isLeapYear(y) ? 29 : 28;
    if (m === 4 || m === 6 || m === 9 || m === 11) return 30;
    return 31;
  };

  const dateToTotalDays = (dateStr: string): number => {
    const date = stringToDateModel(dateStr);
    let totalDays = 0;

    for (let y = 1; y < date.year; y++) {
      totalDays += isLeapYear(y) ? 366 : 365;
    }

    for (let m = 1; m < date.month; m++) {
      totalDays += daysInMonth(m, date.year);
    }

    totalDays += date.day;
    return totalDays;
  };

  const getTodayDateStr = () => {
    const d = new Date();
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  let systemCurrentDate = getTodayDateStr();

  // In-memory Database matching the C++ structures (user.txt, resources.txt, borrows.txt, reservations.txt)
  let users: User[] = [
    {
      username: "admin",
      firstName: "Main",
      lastName: "Librarian",
      password: "admin",
      role: "librarian",
      account: {
        borrowedResourcesCount: 0,
        returnedResourcesCount: 0,
        reservedResourcesCount: 0,
        fineAmount: 0,
        balance: 0
      }
    },
    {
      username: "BC-12345",
      firstName: "MUHAMMAD",
      lastName: "ALI",
      password: "student123",
      role: "student",
      department: "Software Engineering",
      account: {
        borrowedResourcesCount: 1,
        returnedResourcesCount: 2,
        reservedResourcesCount: 1,
        fineAmount: 15.0,
        balance: 85.50
      }
    },
    {
      username: "SE-99882",
      firstName: "FATIMA",
      lastName: "ZAHRA",
      password: "password",
      role: "student",
      department: "Data Science",
      account: {
        borrowedResourcesCount: 0,
        returnedResourcesCount: 1,
        reservedResourcesCount: 0,
        fineAmount: 0.0,
        balance: 200.00
      }
    }
  ];

  let resources: Resource[] = [
    {
      id: "978-0131103628",
      identifier: "978-0131103628",
      title: "THE C++ PROGRAMMING LANGUAGE",
      author: "BJARNE STROUSTRUP",
      category: "COMPUTER SCIENCE",
      totalCopies: 4,
      availableCopies: 3,
      type: "book"
    },
    {
      id: "978-0132350884",
      identifier: "978-0132350884",
      title: "CLEAN CODE",
      author: "ROBERT C. MARTIN",
      category: "SOFTWARE ENGINEERING",
      totalCopies: 5,
      availableCopies: 5,
      type: "book"
    },
    {
      id: "978-0321125217",
      identifier: "978-0321125217",
      title: "DESIGN PATTERNS",
      author: "ERICH GAMMA",
      category: "SOFTWARE ENGINEERING",
      totalCopies: 2,
      availableCopies: 2,
      type: "book"
    },
    {
      id: "1043-421X",
      identifier: "1043-421X",
      title: "C++ ADVANCED SYSTEMS JOURNAL",
      author: "ACM EDITORIAL",
      category: "COMPUTING",
      totalCopies: 3,
      availableCopies: 2,
      type: "magazine"
    },
    {
      id: "0018-9162",
      identifier: "0018-9162",
      title: "IEEE COMPUTER SOCIETY JOURNAL",
      author: "IEEE",
      category: "ELECTRICAL ENGINEERING",
      totalCopies: 2,
      availableCopies: 2,
      type: "magazine"
    }
  ];

  let borrowRecords: BorrowRecord[] = [
    {
      id: "tx-1",
      username: "BC-12345",
      resourceIdentifier: "978-0131103628",
      resourceTitle: "THE C++ PROGRAMMING LANGUAGE",
      resourceType: "book",
      issueDate: "10-05-2026",
      dueDate: "17-05-2026",
      returned: false,
      fineAmount: 40, // 4 days overdue * $10 per day = $40
      status: "overdue"
    },
    {
      id: "tx-2",
      username: "BC-12345",
      resourceIdentifier: "1043-421X",
      resourceTitle: "C++ ADVANCED SYSTEMS JOURNAL",
      resourceType: "magazine",
      issueDate: "01-05-2026",
      dueDate: "08-05-2026",
      returnDate: "07-05-2026",
      returned: true,
      fineAmount: 0,
      status: "returned"
    }
  ];

  let reservations: Reservation[] = [
    {
      id: "res-1",
      username: "BC-12345",
      resourceIdentifier: "978-0131103628",
      resourceTitle: "THE C++ PROGRAMMING LANGUAGE",
      resourceType: "book"
    }
  ];

  const USERS_FILE = path.join(process.cwd(), 'users.txt');
  const RESOURCES_FILE = path.join(process.cwd(), 'resources.txt');
  const BORROWS_FILE = path.join(process.cwd(), 'borrows.txt');
  const RESERVATIONS_FILE = path.join(process.cwd(), 'reservations.txt');
  const SYSTEM_DATE_FILE = path.join(process.cwd(), 'system_date.txt');

  const loadFromFiles = () => {
    try {
      if (fs.existsSync(USERS_FILE)) {
        users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));
      }
      if (fs.existsSync(RESOURCES_FILE)) {
        resources = JSON.parse(fs.readFileSync(RESOURCES_FILE, 'utf-8'));
      }
      if (fs.existsSync(BORROWS_FILE)) {
        borrowRecords = JSON.parse(fs.readFileSync(BORROWS_FILE, 'utf-8'));
      }
      if (fs.existsSync(RESERVATIONS_FILE)) {
        reservations = JSON.parse(fs.readFileSync(RESERVATIONS_FILE, 'utf-8'));
      }
      if (fs.existsSync(SYSTEM_DATE_FILE)) {
        systemCurrentDate = fs.readFileSync(SYSTEM_DATE_FILE, 'utf-8').trim();
      }
    } catch (e) {
      console.error("Error loading state from text files, falling back to database defaults", e);
    }
  };

  const saveToFiles = () => {
    try {
      fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
      fs.writeFileSync(RESOURCES_FILE, JSON.stringify(resources, null, 2), 'utf-8');
      fs.writeFileSync(BORROWS_FILE, JSON.stringify(borrowRecords, null, 2), 'utf-8');
      fs.writeFileSync(RESERVATIONS_FILE, JSON.stringify(reservations, null, 2), 'utf-8');
      fs.writeFileSync(SYSTEM_DATE_FILE, systemCurrentDate, 'utf-8');
    } catch (e) {
      console.error("Error saving state to text files", e);
    }
  };

  // Helper sync logic representing C++ system-wide dynamic integrity
  const syncSystemState = () => {
    const todayTotal = dateToTotalDays(systemCurrentDate);
    borrowRecords = borrowRecords.map(b => {
      if (!b.returned) {
        const dueTotal = dateToTotalDays(b.dueDate);
        if (todayTotal > dueTotal) {
          const lateDays = todayTotal - dueTotal;
          const calculatedFine = lateDays * 10;
          return {
            ...b,
            status: "overdue",
            fineAmount: calculatedFine
          };
        } else {
          return {
            ...b,
            status: "active",
            fineAmount: 0
          };
        }
      }
      return b;
    });

    // Sync fineAmounts inside Student accounts directly from overdue borrowRecords
    users = users.map(user => {
      if (user.role === 'student') {
        const studentOverdueFines = borrowRecords
          .filter(b => b.username === user.username && !b.returned && b.status === "overdue")
          .reduce((sum, current) => sum + current.fineAmount, 0);
        
        // Also add non-borrow fines already processed in account
        return {
          ...user,
          account: {
            ...user.account,
            borrowedResourcesCount: borrowRecords.filter(b => b.username === user.username && !b.returned).length,
            returnedResourcesCount: borrowRecords.filter(b => b.username === user.username && b.returned).length,
            reservedResourcesCount: reservations.filter(r => r.username === user.username).length,
            fineAmount: studentOverdueFines // dynamic binding
          }
        };
      }
      return user;
    });

    // Save state to files
    saveToFiles();
  };

  // Load initially from files
  loadFromFiles();

  // Sync initially
  syncSystemState();

  // ----- REST ROUTES -----

  // Stats Endpoints
  app.get('/api/stats', (req, res) => {
    syncSystemState();
    const stats: SystemStats = {
      totalBooks: resources.filter(r => r.type === 'book').reduce((sum, r) => sum + r.totalCopies, 0),
      totalMagazines: resources.filter(r => r.type === 'magazine').reduce((sum, r) => sum + r.totalCopies, 0),
      borrowedResources: borrowRecords.filter(b => !b.returned).length,
      activeStudents: users.filter(u => u.role === 'student').length,
      overdueRecords: borrowRecords.filter(b => b.status === 'overdue' && !b.returned).length
    };
    res.json(stats);
  });

  // Current Date endpoint
  app.get('/api/system-date', (req, res) => {
    systemCurrentDate = getTodayDateStr();
    syncSystemState();
    res.json({ systemCurrentDate });
  });

  // Reservations endpoint
  app.get('/api/reservations', (req, res) => {
    res.json(reservations);
  });

  // Modify system date (allows manual passage of time to trigger C++ fine calculations dynamically)
  app.post('/api/system-date', (req, res) => {
    const { newDate } = req.body;
    if (!newDate || !/^\d{2}-\d{2}-\d{4}$/.test(newDate)) {
      return res.status(400).json({ error: "Date must be in correct DD-MM-YYYY format." });
    }
    systemCurrentDate = newDate;
    syncSystemState();
    res.json({ systemCurrentDate, message: "System time shifted successfully." });
  });

  // Users endpoint (Students registry)
  app.get('/api/users', (req, res) => {
    syncSystemState();
    res.json(users.filter(u => u.role === 'student'));
  });

  // Student Registry with strict format verification matching "LibraryManagementSystem::registerUser()"
  app.post('/api/users', (req, res) => {
    const { username, firstName, lastName, department, password, balance } = req.body;

    if (!username || !firstName || !lastName || !department || !password || balance === undefined) {
      return res.status(400).json({ error: "All parameters (username, firstName, lastName, department, password, balance) are required." });
    }

    // XX-XXXXX Format check
    const formattedUsername = username.toUpperCase();
    const isValidFormat =
      formattedUsername.length === 8 &&
      /^[A-Z]{2}-\d{5}$/.test(formattedUsername);

    if (!isValidFormat) {
      return res.status(400).json({ error: "Wrong format! Please follow XX-XXXXX (e.g. FA-12345)." });
    }

    // Check duplication
    const studentExists = users.some(u => u.username.toUpperCase() === formattedUsername);
    if (studentExists) {
      return res.status(400).json({ error: "Seat number already exists!" });
    }

    const startingBalance = Number(balance);
    if (isNaN(startingBalance) || startingBalance <= 0) {
      return res.status(400).json({ error: "Invalid Balance! Recharge with positive value." });
    }

    const newStudent: User = {
      username: formattedUsername,
      firstName: firstName.toUpperCase(),
      lastName: lastName.toUpperCase(),
      password,
      role: 'student',
      department,
      account: {
        borrowedResourcesCount: 0,
        returnedResourcesCount: 0,
        reservedResourcesCount: 0,
        fineAmount: 0,
        balance: startingBalance
      }
    };

    users.push(newStudent);
    res.status(201).json(newStudent);
  });

  // Authentication Login Endpoint
  app.post('/api/auth/login', (req, res) => {
    const { username, password, loginType } = req.body; // loginType: 'student' | 'librarian'
    const user = users.find(u => u.username.toUpperCase() === username.toUpperCase());
    
    if (!user) {
      return res.status(400).json({ error: "User not found in system." });
    }

    if (user.password !== password) {
      return res.status(400).json({ error: "Invalid Username or Password." });
    }

    const expectedRole = loginType === 'student' ? 'student' : 'librarian';
    if (user.role !== expectedRole) {
      return res.status(400).json({ error: `This account is not a ${expectedRole} account!` });
    }

    syncSystemState();
    res.json({ success: true, user });
  });

  // Get specific Student Account details
  app.get('/api/student/:username', (req, res) => {
    syncSystemState();
    const user = users.find(u => u.username.toUpperCase() === req.params.username.toUpperCase() && u.role === 'student');
    if (!user) {
      return res.status(404).json({ error: "Student account not found." });
    }
    res.json(user);
  });

  // Student PAY FINE operation
  app.post('/api/student/pay-fine', (req, res) => {
    const { username } = req.body;
    const user = users.find(u => u.username.toUpperCase() === username.toUpperCase() && u.role === 'student');
    
    if (!user) {
      return res.status(404).json({ error: "Student not found." });
    }

    syncSystemState();

    if (user.account.fineAmount <= 0) {
      return res.status(400).json({ error: "No pending fine accumulated." });
    }

    if (user.account.balance >= user.account.fineAmount) {
      user.account.balance -= user.account.fineAmount;
      const initialFinePaid = user.account.fineAmount;
      
      // Mark matching active/overdue borrows that caused the fines as returned or clear their statuses
      borrowRecords = borrowRecords.map(b => {
        if (b.username === user.username && b.status === "overdue" && !b.returned) {
          // Keep unreturned status or return copies
          return {
            ...b,
            fineAmount: 0 // Fine settled
          };
        }
        return b;
      });

      user.account.fineAmount = 0;
      return res.json({ success: true, balance: user.account.balance, message: `Payment Successful! Fine paid: $${initialFinePaid}` });
    } else {
      return res.status(400).json({ error: "Insufficient balance to pay fine. Please recharge." });
    }
  });

  // Student RECHARGE balance operation
  app.post('/api/student/recharge', (req, res) => {
    const { username, amount } = req.body;
    const targetAmt = Number(amount);

    if (isNaN(targetAmt) || targetAmt <= 0) {
      return res.status(400).json({ error: "Recharge amount must be positive!" });
    }

    const user = users.find(u => u.username.toUpperCase() === username.toUpperCase() && u.role === 'student');
    if (!user) {
      return res.status(404).json({ error: "Student not found." });
    }

    user.account.balance += targetAmt;
    res.json({ success: true, balance: user.account.balance, message: `Recharge successful! New Balance: $${user.account.balance.toFixed(2)}` });
  });

  // Resources list for general browse / search
  app.get('/api/resources', (req, res) => {
    res.json(resources);
  });

  // Add resource (Book / Magazine) used by librarian
  app.post('/api/resources', (req, res) => {
    const { title, author, category, totalCopies, identifier, type } = req.body;

    if (!title || !author || !category || !totalCopies || !identifier || !type) {
      return res.status(400).json({ error: "All parameters are required to add resources." });
    }

    const searchId = identifier.toUpperCase();
    
    // Check duplication of ISBN or ISSN
    const exists = resources.some(r => r.identifier.toUpperCase() === searchId);
    if (exists) {
      return res.status(400).json({ error: `Resource with ISBN/ISSN [ ${identifier} ] already exists!` });
    }

    const newResource: Resource = {
      id: searchId,
      identifier: searchId,
      title: title.toUpperCase(),
      author: author.toUpperCase(),
      category: category.toUpperCase(),
      totalCopies: Math.max(0, Number(totalCopies)),
      availableCopies: Math.max(0, Number(totalCopies)),
      type: type === 'magazine' ? 'magazine' : 'book'
    };

    resources.push(newResource);
    res.status(201).json(newResource);
  });

  // Update resource details (librarian menu choice)
  app.put('/api/resources/:id', (req, res) => {
    const id = req.params.id.toUpperCase();
    const { title, author, category, totalCopies } = req.body;

    const resource = resources.find(r => r.identifier.toUpperCase() === id);
    if (!resource) {
      return res.status(404).json({ error: "Resource not found." });
    }

    if (title) resource.title = title.toUpperCase();
    if (author) resource.author = author.toUpperCase();
    if (category) resource.category = category.toUpperCase();

    if (totalCopies !== undefined) {
      const copies = Number(totalCopies);
      const currentlyBorrowedCount = resource.totalCopies - resource.availableCopies;
      
      if (copies < currentlyBorrowedCount) {
        return res.status(400).json({ error: "Cannot set total copies less than currently borrowed copies." });
      }

      resource.totalCopies = copies;
      resource.availableCopies = copies - currentlyBorrowedCount;
    }

    res.json(resource);
  });

  // Delete resource (removes citations and reservations matching original deleteResource C++ code)
  app.delete('/api/resources/:id', (req, res) => {
    const id = req.params.id.toUpperCase();
    const index = resources.findIndex(r => r.identifier.toUpperCase() === id);

    if (index === -1) {
      return res.status(404).json({ error: "Resource not found." });
    }

    // Check if actively borrowed
    const hasActiveBorrows = borrowRecords.some(b => b.resourceIdentifier.toUpperCase() === id && !b.returned);
    if (hasActiveBorrows) {
      return res.status(400).json({ error: "Cannot delete resource that is currently issued to users." });
    }

    // Step 1: erase corresponding reservations
    reservations = reservations.filter(res => res.resourceIdentifier.toUpperCase() !== id);

    // Step 2: erase resource
    resources.splice(index, 1);

    res.json({ message: "Resource and its reservations deleted successfully." });
  });

  // Transactions lists for logs
  app.get('/api/transactions', (req, res) => {
    syncSystemState();
    res.json(borrowRecords);
  });

  // Borrow Resource transaction controller
  app.post('/api/transactions/borrow', (req, res) => {
    const { username, identifier, dateString } = req.body; // dateString Optional, otherwise defaults to system date

    if (!username || !identifier) {
      return res.status(400).json({ error: "Username and Book/Magazine Identifier are required." });
    }

    const matchedUser = users.find(u => u.username.toUpperCase() === username.toUpperCase() && u.role === 'student');
    if (!matchedUser) {
      return res.status(404).json({ error: "Student registry index not found." });
    }

    const matchedResource = resources.find(r => r.identifier.toUpperCase() === identifier.toUpperCase());
    if (!matchedResource) {
      return res.status(404).json({ error: "Selected Book/Magazine resource was not found." });
    }

    // Step 1: Daily limit check (max 2 resources per day)
    const todayStr = dateString || systemCurrentDate;
    const todaysBorrows = borrowRecords.filter(b => 
      b.username.toUpperCase() === username.toUpperCase() &&
      b.issueDate === todayStr
    ).length;

    if (todaysBorrows >= 2) {
      return res.status(400).json({ error: "Borrow limit reached! Max 2 resources per day." });
    }

    // Step 2: Cannot borrow same resource twice if already borrowed & active
    const alreadyBorrowed = borrowRecords.some(b =>
      b.username.toUpperCase() === username.toUpperCase() &&
      b.resourceIdentifier.toUpperCase() === identifier.toUpperCase() &&
      !b.returned
    );
    if (alreadyBorrowed) {
      return res.status(400).json({ error: "You already have this resource borrowed currently." });
    }

    // Step 3: Reservation Priority Queue Check
    const matchedResIndex = reservations.findIndex(r => r.resourceIdentifier.toUpperCase() === identifier.toUpperCase());
    if (matchedResIndex !== -1 && reservations[matchedResIndex].username.toUpperCase() !== username.toUpperCase()) {
      return res.status(400).json({ error: "This resource is reserved for another user. You cannot borrow it right now." });
    }

    // Step 4: Check copies
    if (matchedResource.availableCopies <= 0) {
      return res.status(400).json({ error: "No copies available to borrow at this moment." });
    }

    // Reduce copies
    matchedResource.availableCopies--;

    // Step 5: If current user had reserved this, remove reservation
    if (matchedResIndex !== -1 && reservations[matchedResIndex].username.toUpperCase() === username.toUpperCase()) {
      reservations.splice(matchedResIndex, 1);
    }

    // Calculate Due date (7 days limit)
    const issueParts = todayStr.split('-');
    const issueDateObj = new Date(Number(issueParts[2]), Number(issueParts[1]) - 1, Number(issueParts[0]));
    
    const dueDateObj = new Date(issueDateObj);
    dueDateObj.setDate(dueDateObj.getDate() + 7);

    const padLeft = (n: number) => n.toString().padStart(2, '0');
    const dueStr = `${padLeft(dueDateObj.getDate())}-${padLeft(dueDateObj.getMonth() + 1)}-${dueDateObj.getFullYear()}`;

    const newRecord: BorrowRecord = {
      id: "tx-" + (borrowRecords.length + Math.floor(Math.random() * 1000) + 1),
      username: username.toUpperCase(),
      resourceIdentifier: matchedResource.identifier,
      resourceTitle: matchedResource.title,
      resourceType: matchedResource.type,
      issueDate: todayStr,
      dueDate: dueStr,
      returned: false,
      fineAmount: 0,
      status: "active"
    };

    borrowRecords.unshift(newRecord);
    syncSystemState();

    res.json({ success: true, message: "Resource borrowed successfully.", record: newRecord });
  });

  // Return Resource transaction controller
  app.post('/api/transactions/return', (req, res) => {
    const { username, identifier, returnDateString, isDamaged } = req.body;

    if (!username || !identifier || !returnDateString) {
      return res.status(400).json({ error: "Missing parameters for return operation." });
    }

    const matchedUser = users.find(u => u.username.toUpperCase() === username.toUpperCase() && u.role === 'student');
    if (!matchedUser) {
      return res.status(404).json({ error: "Student not found in registry." });
    }

    const borrowIndex = borrowRecords.findIndex(b =>
      b.username.toUpperCase() === username.toUpperCase() &&
      b.resourceIdentifier.toUpperCase() === identifier.toUpperCase() &&
      !b.returned
    );

    if (borrowIndex === -1) {
      return res.status(404).json({ error: "Borrow reference record not found." });
    }

    const record = borrowRecords[borrowIndex];
    
    // Set returned status
    record.returned = true;
    record.returnDate = returnDateString;

    // Increase copies
    const resource = resources.find(r => r.identifier.toUpperCase() === identifier.toUpperCase());
    if (resource) {
      resource.availableCopies = Math.min(resource.totalCopies, resource.availableCopies + 1);
    }

    // Fine calculating matching standard C++ core formulas
    let penaltyFine = 0;
    const dueTotal = dateToTotalDays(record.dueDate);
    const returnTotal = dateToTotalDays(returnDateString);
    const lateDays = returnTotal - dueTotal;

    if (lateDays > 0) {
      penaltyFine += lateDays * 10; // $10 fine per overdue day
    }

    if (isDamaged) {
      penaltyFine += 50; // $50 flat resource damage rate
    }

    if (penaltyFine > 0) {
      matchedUser.account.fineAmount += penaltyFine;
      record.fineAmount = penaltyFine;
    }

    syncSystemState();

    res.json({
      success: true,
      fineAdded: penaltyFine,
      lateDays: Math.max(0, lateDays),
      message: `Returned Successfully. Fine additions = $${penaltyFine} calculated and logged.`
    });
  });

  // Reserve Resource transaction controller
  app.post('/api/transactions/reserve', (req, res) => {
    const { username, identifier } = req.body;

    if (!username || !identifier) {
      return res.status(400).json({ error: "Username and resource ISBN/ISSN identifier are required." });
    }

    const matchedUser = users.find(u => u.username.toUpperCase() === username.toUpperCase() && u.role === 'student');
    if (!matchedUser) {
      return res.status(404).json({ error: "Student not registered." });
    }

    const resource = resources.find(r => r.identifier.toUpperCase() === identifier.toUpperCase());
    if (!resource) {
      return res.status(404).json({ error: "Resource item not found." });
    }

    // Step 1: Check if already borrowed by him
    const activeBorrowed = borrowRecords.some(b =>
      b.username.toUpperCase() === username.toUpperCase() &&
      b.resourceIdentifier.toUpperCase() === identifier.toUpperCase() &&
      !b.returned
    );
    if (activeBorrowed) {
      return res.status(400).json({ error: "You already have this resource borrowed. No need to reserve." });
    }

    // Step 2: If copies are available, they must borrow directly instead
    if (resource.availableCopies > 0) {
      return res.status(400).json({ error: "This resource is currently available. Please borrow it directly." });
    }

    // Step 3: Cannot reserve the same resource multiple times
    const alreadyReserved = reservations.some(res =>
      res.username.toUpperCase() === username.toUpperCase() &&
      res.resourceIdentifier.toUpperCase() === identifier.toUpperCase()
    );
    if (alreadyReserved) {
      return res.status(400).json({ error: "You have already reserved this resource." });
    }

    // Step 4: Reserve
    const newReservation: Reservation = {
      id: "res-" + (reservations.length + Math.floor(Math.random() * 1000) + 1),
      username: username.toUpperCase(),
      resourceTitle: resource.title,
      resourceIdentifier: resource.identifier,
      resourceType: resource.type
    };

    reservations.push(newReservation);
    syncSystemState();

    res.json({ success: true, message: "Resource reserved successfully! Priority set when it is returned." });
  });

  // Cancel Reservation list controller
  app.post('/api/transactions/cancel-reservation', (req, res) => {
    const { username, identifier } = req.body;
    
    const index = reservations.findIndex(res =>
      res.username.toUpperCase() === username.toUpperCase() &&
      res.resourceIdentifier.toUpperCase() === identifier.toUpperCase()
    );

    if (index === -1) {
      return res.status(404).json({ error: "Reservation details not found in ledger." });
    }

    reservations.splice(index, 1);
    syncSystemState();
    res.json({ success: true, message: "Reservation cancelled." });
  });

  // Student history log
  app.get('/api/reports/student/:username', (req, res) => {
    syncSystemState();
    const username = req.params.username.toUpperCase();
    const matchedUser = users.find(u => u.username.toUpperCase() === username && u.role === 'student');
    
    if (!matchedUser) {
      return res.status(404).json({ error: "Student not found in database registry." });
    }

    const studentHistory = borrowRecords.filter(b => b.username.toUpperCase() === username);
    const studentReservations = reservations.filter(r => r.username.toUpperCase() === username);

    res.json({
      student: matchedUser,
      borrows: studentHistory,
      reservations: studentReservations
    });
  });

  // Issued Report (Librarian option 5)
  app.get('/api/reports/issued', (req, res) => {
    syncSystemState();
    const issuedList = borrowRecords.filter(b => !b.returned);
    res.json(issuedList);
  });

  // Serve static files and route fallback
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
