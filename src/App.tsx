import { useState, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Book as BookIcon,
  Users as UsersIcon,
  Receipt as ReceiptIcon,
  AlertCircle,
  Plus,
  Search,
  BookOpen,
  ArrowRightLeft,
  X,
  History,
  CheckCircle,
  Hash,
  Clock,
  Coins,
  ChevronRight,
  Code,
  FileCheck,
  Server,
  Trash2,
  Calendar,
  Layers,
  Sparkles,
  UserCheck,
  LogOut,
  CreditCard,
  Percent,
  TrendingUp,
  RotateCcw,
  CheckSquare,
  AlertTriangle
} from 'lucide-react';
import { Resource, User, BorrowRecord, Reservation, SystemStats } from './types';

export default function App() {
  // Auth state
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLibrarian, setIsLibrarian] = useState<boolean>(false);
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '', role: 'student' as 'student' | 'librarian' });

  // Core data states
  const [resources, setResources] = useState<Resource[]>([]);
  const [studentsList, setStudentsList] = useState<User[]>([]);
  const [transactions, setTransactions] = useState<BorrowRecord[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [systemDate, setSystemDate] = useState<string>('21-05-2026');
  const [stats, setStats] = useState<SystemStats>({
    totalBooks: 0,
    totalMagazines: 0,
    borrowedResources: 0,
    activeStudents: 0,
    overdueRecords: 0
  });

  // Action states & UI loaders
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Dynamic Console simulation log matching original C++ cout stream output
  const [cppConsoleLogs, setCppConsoleLogs] = useState<string[]>([
    "Initializing The Scholars' Library Backend Engine...",
    "DB Files Loaded Successfully:",
    "  - Loaded Student accounts from 'users.txt'",
    "  - Loaded catalog resources from 'resources.txt'",
    "  - Loaded active loan list from 'borrows.txt'",
    "  - Loaded reservation queue list from 'reservations.txt'",
    "System running on port 3000..."
  ]);

  // Command input in C++ simulate console
  const [consoleCommand, setConsoleCommand] = useState<string>('');

  // Modals
  const [showAddResourceModal, setShowAddResourceModal] = useState(false);
  const [showUpdateResourceModal, setShowUpdateResourceModal] = useState<Resource | null>(null);
  const [showBorrowModal, setShowBorrowModal] = useState<Resource | null>(null);
  const [showReturnModal, setShowReturnModal] = useState<BorrowRecord | null>(null);
  const [showRegisterStudentModal, setShowRegisterStudentModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState<string | null>(null); // student username for official printable report

  // Search filter options matching C++ searching criteria Options
  const [searchResourceType, setSearchResourceType] = useState<'all' | 'book' | 'magazine'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCriteria, setSearchCriteria] = useState<'title' | 'author' | 'identifier' | 'category'>('title');

  // Form states
  const [newStudentForm, setNewStudentForm] = useState({
    username: '',
    firstName: '',
    lastName: '',
    department: '',
    password: '',
    balance: 100
  });

  const [newResourceForm, setNewResourceForm] = useState({
    title: '',
    author: '',
    category: '',
    identifier: '',
    totalCopies: 2,
    type: 'book' as 'book' | 'magazine'
  });

  const [returnFormOptions, setReturnFormOptions] = useState({
    isDamaged: false,
    returnDate: '21-05-2026'
  });

  const [rechargeSlider, setRechargeSlider] = useState<number>(50);

  // Append customized messages to our retro C++ Console simulation panel
  const addConsoleLog = (text: string) => {
    setCppConsoleLogs(prev => [...prev.slice(-40), `>> ${text}`]);
  };

  const addCoutLog = (text: string) => {
    setCppConsoleLogs(prev => [...prev.slice(-40), text]);
  };

  // Synchronize entire frontend database dynamically with backend express C++ simulator
  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [resStats, resResources, resDate, resTransactions, resStudents, resReservations] = await Promise.all([
        fetch('/api/stats'),
        fetch('/api/resources'),
        fetch('/api/system-date'),
        fetch('/api/transactions'),
        fetch('/api/users'),
        fetch('/api/reservations')
      ]);

      if (!resStats.ok || !resResources.ok || !resDate.ok || !resTransactions.ok || !resStudents.ok || !resReservations.ok) {
        throw new Error("Failed to load schema from the local C++ Simulation Server.");
      }

      const activeStats = await resStats.json();
      const activeResources = await resResources.json();
      const activeDateInfo = await resDate.json();
      const activeTransactions = await resTransactions.json();
      const activeStudents = await resStudents.json();
      const activeReservations = await resReservations.json();

      setStats(activeStats);
      setResources(activeResources);
      setSystemDate(activeDateInfo.systemCurrentDate);
      setTransactions(activeTransactions);
      setStudentsList(activeStudents);
      setReservations(activeReservations);

      // If a student is logged in, refresh their specific user statistics
      if (currentUser && currentUser.role === 'student') {
        const studentRes = await fetch(`/api/student/${currentUser.username}`);
        if (studentRes.ok) {
          const freshStudentData = await studentRes.json();
          setCurrentUser(freshStudentData);
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Could not sync backend repository variables.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const triggerSuccessMsg = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  const triggerErrorMsg = (msg: string) => {
    setErrorMessage(msg);
    setTimeout(() => setErrorMessage(null), 5500);
  };

  // Manual fast forward of time to test overdue day-rate fine multipliers
  const handleShiftDate = async (newDateStr: string) => {
    try {
      const res = await fetch('/api/system-date', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newDate: newDateStr })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      addConsoleLog(`App::shiftTime("${newDateStr}")`);
      addCoutLog(`[C++] System clock shifted. Refreshing balances & pending fine multipliers.`);
      triggerSuccessMsg(`Time shifted! Simulation date is now: ${newDateStr}`);
      fetchAllData();
    } catch (err: any) {
      triggerErrorMsg(err.message || "Failed to parse simulated date format.");
    }
  };

  // Login handler
  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: loginForm.username,
          password: loginForm.password,
          loginType: loginForm.role
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Authentication check failed.");

      setCurrentUser(data.user);
      setIsLibrarian(data.user.role === 'librarian');
      triggerSuccessMsg(`Logged in successfully as ${data.user.firstName} ${data.user.lastName}!`);
      
      addConsoleLog(`App::login("${data.user.username}", "******")`);
      addCoutLog(`[C++] loginSuccessful() -> Entered ${data.user.role === 'librarian' ? 'librarianMenu()' : 'studentMenu()'}`);
    } catch (err: any) {
      triggerErrorMsg(err.message || "Invalid credentials.");
      addConsoleLog(`App::login("${loginForm.username}", "******")`);
      addCoutLog(`[ERROR] Invalid Username or Password. checkPassword() returned false.`);
    }
  };

  const handleLogout = () => {
    addConsoleLog(`App::logout("${currentUser?.username}")`);
    addCoutLog(`[OK] Logged out successfully! Freeing session allocation pointers.`);
    setCurrentUser(null);
    setIsLibrarian(false);
    setLoginForm({ username: '', password: '', role: 'student' });
    triggerSuccessMsg("Successfully logged out of console session.");
  };

  // Student registration with XX-XXXXX regex validations
  const handleRegisterStudent = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStudentForm)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration validation failed.");

      triggerSuccessMsg(`Student ${data.firstName} ${data.lastName} catalogued successfully under roll: ${data.username}!`);
      setShowRegisterStudentModal(false);
      setNewStudentForm({
        username: '',
        firstName: '',
        lastName: '',
        department: '',
        password: '',
        balance: 100
      });

      addConsoleLog(`LMS::registerUser("${data.username}")`);
      addCoutLog(`[C++] Student ${data.username} registered with starting balance of $${data.account.balance}`);
      fetchAllData();
    } catch (err: any) {
      triggerErrorMsg(err.message || "Format error.");
    }
  };

  // Self-registration for student from login gate
  const handleGateRegisterStudent = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStudentForm)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration validation failed.");

      triggerSuccessMsg(`Student account created successfully under roll: ${data.username}!`);
      
      addConsoleLog(`LMS::registerUser("${data.username}")`);
      addCoutLog(`[C++] Student ${data.username} registered with starting balance of $${data.account.balance}`);

      // Auto login!
      try {
        const loginRes = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: data.username,
            password: newStudentForm.password,
            loginType: 'student'
          })
        });
        const loginData = await loginRes.json();
        if (loginRes.ok) {
          setCurrentUser(loginData.user);
          setIsLibrarian(false);
          setIsRegistering(false);
          triggerSuccessMsg(`Successfully registered and logged in as ${data.firstName} ${data.lastName}!`);
        } else {
          setIsRegistering(false);
          setLoginForm({ username: data.username, password: '', role: 'student' });
        }
      } catch (err: any) {
        setIsRegistering(false);
        setLoginForm({ username: data.username, password: '', role: 'student' });
      }

      setNewStudentForm({
        username: '',
        firstName: '',
        lastName: '',
        department: '',
        password: '',
        balance: 100
      });
      fetchAllData();
    } catch (err: any) {
      triggerErrorMsg(err.message || "Format or unique seat roll error.");
    }
  };

  // Add Book or Magazine via Librarian menu options
  const handleAddResource = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newResourceForm.title,
          author: newResourceForm.author,
          category: newResourceForm.category,
          identifier: newResourceForm.identifier,
          totalCopies: Number(newResourceForm.totalCopies),
          type: newResourceForm.type
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add resource.");

      triggerSuccessMsg(`Added resource with format identifiers: ${data.identifier}`);
      setShowAddResourceModal(false);
      setNewResourceForm({ title: '', author: '', category: '', identifier: '', totalCopies: 2, type: 'book' });

      addConsoleLog(`Library_System::addResource()`);
      addCoutLog(`[C++] ${data.type.toUpperCase()} catalogued successfully! Total copies = ${data.totalCopies}`);
      fetchAllData();
    } catch (err: any) {
      triggerErrorMsg(err.message);
    }
  };

  // Update resource configuration
  const handleUpdateResource = async (e: FormEvent) => {
    e.preventDefault();
    if (!showUpdateResourceModal) return;
    try {
      const res = await fetch(`/api/resources/${showUpdateResourceModal.identifier}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: showUpdateResourceModal.title,
          author: showUpdateResourceModal.author,
          category: showUpdateResourceModal.category,
          totalCopies: Number(showUpdateResourceModal.totalCopies)
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update details.");

      triggerSuccessMsg(`Successfully saved updates to identifier ${data.identifier}!`);
      setShowUpdateResourceModal(null);

      addConsoleLog(`Library_System::updateResource("${data.identifier}")`);
      addCoutLog(`[C++] Resource information amended. New totals: ${data.availableCopies}/${data.totalCopies} available.`);
      fetchAllData();
    } catch (err: any) {
      triggerErrorMsg(err.message);
    }
  };

  // Delete matching resource
  const handleDeleteResource = async (identifier: string) => {
    if (!confirm(`Confirm absolute deletion of resource ID [${identifier}]? All reservations for this record will be cleared.`)) return;
    try {
      const res = await fetch(`/api/resources/${identifier}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to execute delete routine.");

      triggerSuccessMsg(`Successfully purged library resource pointer ${identifier}.`);
      addConsoleLog(`Library_System::deleteResource("${identifier}")`);
      addCoutLog(`[C++] Resource and its reservation associations deleted successfully.`);
      fetchAllData();
    } catch (err: any) {
      triggerErrorMsg(err.message);
    }
  };

  // Student Borrows resource
  const handleBorrow = async (resource: Resource) => {
    if (!currentUser) return;
    try {
      const res = await fetch('/api/transactions/borrow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: currentUser.username,
          identifier: resource.identifier,
          dateString: systemDate
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not borrow resource.");

      triggerSuccessMsg(`Outstanding borrow! Due date is set to 7 days hence: ${data.record.dueDate}`);
      setShowBorrowModal(null);
      
      addConsoleLog(`Library_System::borrowResource(${currentUser.username}, ${resource.identifier})`);
      addCoutLog(`[C++] Successful checkout! Resource borrowed Count incremented.`);
      fetchAllData();
    } catch (err: any) {
      triggerErrorMsg(err.message);
    }
  };

  // Student pre-checkout check or reservation if copies is 0
  const handleReserve = async (resource: Resource) => {
    if (!currentUser) return;
    try {
      const res = await fetch('/api/transactions/reserve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: currentUser.username,
          identifier: resource.identifier
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add queue item.");

      triggerSuccessMsg(data.message);
      addConsoleLog(`Library_System::reserveResource(${currentUser.username}, ${resource.identifier})`);
      addCoutLog(`[C++] Reservation entry queued successfully for priority loan processing.`);
      fetchAllData();
    } catch (err: any) {
      triggerErrorMsg(err.message);
    }
  };

  // Student pay-fine settlement
  const handlePayFine = async () => {
    if (!currentUser) return;
    try {
      const res = await fetch('/api/student/pay-fine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: currentUser.username })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not settle fines.");

      triggerSuccessMsg(data.message);
      addConsoleLog(`Account::payFine()`);
      addCoutLog(`[C++] Payment Successful! Fine paid. Pending Fines: $0`);
      fetchAllData();
    } catch (err: any) {
      triggerErrorMsg(err.message);
    }
  };

  // Student Recharge account balance with sliding values
  const handleRecharge = async () => {
    if (!currentUser) return;
    try {
      const res = await fetch('/api/student/recharge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: currentUser.username,
          amount: rechargeSlider
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not process recharge transaction.");

      triggerSuccessMsg(data.message);
      addConsoleLog(`Account::recharge(${rechargeSlider})`);
      addCoutLog(`[C++] Recharge successful! New physical balance: $${data.balance}`);
      fetchAllData();
    } catch (err: any) {
      triggerErrorMsg(err.message);
    }
  };

  // Process Return of Active Loan with customizable late-days and damages controls input
  const handleReturnSettle = async (e: FormEvent) => {
    e.preventDefault();
    if (!showReturnModal || !currentUser) return;
    try {
      const res = await fetch('/api/transactions/return', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: currentUser.username,
          identifier: showReturnModal.resourceIdentifier,
          returnDateString: returnFormOptions.returnDate,
          isDamaged: returnFormOptions.isDamaged
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to process return checkout.");

      if (data.fineAdded > 0) {
        triggerSuccessMsg(`Returned safely. Fine of $${data.fineAdded} added due to late/damages penalty.`);
      } else {
        triggerSuccessMsg(`Returned resource successfully with zero outstanding damage/overdue rates!`);
      }

      setShowReturnModal(null);
      setReturnFormOptions({ isDamaged: false, returnDate: systemDate });

      addConsoleLog(`Library_System::returnResource(${currentUser.username}, ${showReturnModal.resourceIdentifier})`);
      addCoutLog(`[C++] Returned successfully. Fine penalty calculation completed: $${data.fineAdded}`);
      fetchAllData();
    } catch (err: any) {
      triggerErrorMsg(err.message);
    }
  };

  // Student cancel reservation prioritizer
  const handleCancelReservation = async (identifier: string) => {
    if (!currentUser) return;
    try {
      const res = await fetch('/api/transactions/cancel-reservation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: currentUser.username,
          identifier: identifier
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to cancel reservation.");

      triggerSuccessMsg("Reservation cancelled successfully.");
      addConsoleLog(`Account::cancelReservation()`);
      addCoutLog(`[C++] Cancel reservation processed successfully.`);
      fetchAllData();
    } catch (err: any) {
      triggerErrorMsg(err.message);
    }
  };

  // Execution simulation command shell
  const handleConsoleCommandSubmit = (e: FormEvent) => {
    e.preventDefault();
    const cmd = consoleCommand.trim().toLowerCase();
    if (!cmd) return;

    addConsoleLog(consoleCommand);

    if (cmd === 'help') {
      addCoutLog(`[C++] Available command prompts:`);
      addCoutLog(`  - help                      Display this dynamic lookup list`);
      addCoutLog(`  - stats                     Output stats system summaries`);
      addCoutLog(`  - view                      View all available database resources`);
      addCoutLog(`  - clear                     Flush console stream allocations`);
      addCoutLog(`  - system-date               Show internal time reference`);
    } else if (cmd === 'stats') {
      addCoutLog(`[Stats Report] Total Books: ${stats.totalBooks} | Magazines: ${stats.totalMagazines}`);
      addCoutLog(`               Borrowed: ${stats.borrowedResources} | Overdue count: ${stats.overdueRecords}`);
    } else if (cmd === 'view') {
      addCoutLog(`[C++] resources.txt raw index:`);
      resources.forEach(r => {
        addCoutLog(`  ${r.type.toUpperCase()} | ${r.identifier} | ${r.title} | ${r.availableCopies}/${r.totalCopies} available`);
      });
    } else if (cmd === 'clear') {
      setCppConsoleLogs(["Console cleared."]);
    } else if (cmd === 'system-date') {
      addCoutLog(`[C++] Current system chronological date: ${systemDate}`);
    } else {
      addCoutLog(`[ERROR] Command '${consoleCommand}' unrecognized in this C++ console emulator environment.`);
    }

    setConsoleCommand('');
  };

  // Apply search query metrics
  const filteredResources = resources.filter(res => {
    // Type restriction
    if (searchResourceType !== 'all' && res.type !== searchResourceType) return false;

    const term = searchQuery.toUpperCase();
    if (!term) return true;

    if (searchCriteria === 'title') return res.title.includes(term);
    if (searchCriteria === 'author') return res.author.includes(term);
    if (searchCriteria === 'category') return res.category.includes(term);
    if (searchCriteria === 'identifier') return res.identifier.includes(term);

    return true;
  });

  return (
    <div className="min-h-screen bg-[#070b13] text-slate-100 flex flex-col font-sans selection:bg-teal-500 selection:text-slate-900 relative overflow-x-hidden">
      
      {/* Premium Background Ambient Glow Effects */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-teal-500/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute top-1/3 right-10 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none"></div>
      
      {/* Visual Flash Alert Banners */}
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-emerald-500 text-slate-950 font-medium px-6 py-3 rounded-lg shadow-xl flex items-center gap-3 border border-emerald-400"
          >
            <CheckCircle className="h-5 w-5" />
            <span>{successMessage}</span>
          </motion.div>
        )}

        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-rose-500 text-white font-medium px-6 py-3 rounded-lg shadow-xl flex items-center gap-3 border border-rose-400"
          >
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{errorMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Structural Header */}
      <header className="border-b border-slate-800/60 bg-[#080d15]/80 backdrop-blur-md sticky top-0 z-40 px-4 lg:px-8 py-4 shrink-0">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 bg-gradient-to-tr from-teal-500/10 to-emerald-500/10 border border-teal-500/20 rounded-xl text-teal-400 shadow-md">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-wide bg-gradient-to-r from-teal-200 via-teal-100 to-white bg-clip-text text-transparent font-sans">
                The Scholars Library
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Simulated Time Controller widget */}
            <div className="flex items-center gap-2.5 bg-slate-900/60 border border-slate-800/80 rounded-xl p-1.5 px-3.5 shadow-lg backdrop-blur-sm">
              <Clock className="h-3.5 w-3.5 text-teal-400" />
              <div className="text-xs font-mono">
                <span className="text-slate-500 mr-2 uppercase tracking-wider font-semibold">System Date:</span>
                <span className="text-teal-300 font-extrabold tracking-wide">{systemDate}</span>
              </div>
            </div>

            {currentUser && (
              <div className="flex items-center gap-3 border-l border-slate-800 pl-3">
                <div className="text-right">
                  <div className="text-xs font-semibold text-teal-400 uppercase tracking-widest">
                    {currentUser.role === 'student' ? 'Student Status' : currentUser.role}
                  </div>
                  <div className="text-sm text-slate-200 mt-0.5 font-medium">
                    {currentUser.role === 'student' 
                      ? `${currentUser.firstName} ${currentUser.lastName}` 
                      : `#${currentUser.username}`}
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 bg-slate-900 hover:bg-rose-950/40 text-rose-400 border border-slate-800 hover:border-rose-900/40 rounded-lg transition"
                  title="Logout Console Session"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

        </div>
      </header>

      {/* Main Container Layout */}
      <main className="max-w-7xl w-full mx-auto px-4 lg:px-8 py-6 flex-grow flex flex-col gap-6 overflow-hidden">
        
        {!currentUser ? (
          /* AUTH REGISTER & LOGIN GATE */
          <div className="flex-grow flex items-center justify-center p-4 py-12 md:py-16">
            <div className="w-full max-w-md bg-slate-950/60 border border-slate-800/80 backdrop-blur-xl rounded-2xl p-6 lg:p-8 shadow-2xl relative overflow-hidden transition-all duration-300">
              {/* Decorative Glow Elements */}
              <div className="absolute -top-16 -left-16 w-36 h-36 bg-teal-500/10 rounded-full blur-2xl pointer-events-none"></div>
              <div className="absolute -bottom-16 -right-16 w-36 h-36 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none"></div>
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-teal-500 via-teal-400 to-emerald-500"></div>
              
              <div className="text-center mb-8">
                <div className="inline-block p-3.5 bg-teal-500/10 rounded-2xl text-teal-400 border border-teal-500/20 mb-3.5 shadow-md shadow-teal-500/5">
                  <BookOpen className="h-7 w-7" />
                </div>
                <h2 className="text-2xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-teal-200 via-teal-400 to-white mb-1 font-sans">
                  The Scholars Library
                </h2>
                {isRegistering && (
                  <p className="text-xs font-semibold text-teal-400 uppercase tracking-widest mt-1.5 font-mono">Student Registration</p>
                )}
              </div>

              {/* Hide login switcher during active registration */}
              {!isRegistering && (
                <div className="grid grid-cols-2 gap-2 bg-slate-950/60 border border-slate-800/65 p-1.5 rounded-xl mb-6">
                  <button
                    onClick={() => {
                      setIsRegistering(false);
                      setLoginForm(prev => ({ ...prev, role: 'student' }));
                    }}
                    className={`py-2 rounded-lg font-bold text-xs tracking-wider transition uppercase ${
                      loginForm.role === 'student'
                        ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/10'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
                    }`}
                  >
                    Student
                  </button>
                  <button
                    onClick={() => {
                      setIsRegistering(false);
                      setLoginForm(prev => ({ ...prev, role: 'librarian' }));
                    }}
                    className={`py-2 rounded-lg font-bold text-xs tracking-wider transition uppercase ${
                      loginForm.role === 'librarian'
                        ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/10'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
                    }`}
                  >
                    Librarian
                  </button>
                </div>
              )}

              {isRegistering ? (
                <form onSubmit={handleGateRegisterStudent} className="space-y-4 text-xs font-mono">
                  <div className="grid grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-[10px] text-slate-400 mb-1.5 uppercase tracking-wider font-bold">First Name</label>
                      <input
                        type="text"
                        required
                        value={newStudentForm.firstName}
                        onChange={e => setNewStudentForm(p => ({ ...p, firstName: e.target.value }))}
                        placeholder="First name"
                        className="w-full bg-slate-950/60 border border-slate-800/90 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/40 text-xs font-mono transition-all uppercase"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 mb-1.5 uppercase tracking-wider font-bold">Last Name</label>
                      <input
                        type="text"
                        required
                        value={newStudentForm.lastName}
                        onChange={e => setNewStudentForm(p => ({ ...p, lastName: e.target.value }))}
                        placeholder="Last name"
                        className="w-full bg-slate-950/60 border border-slate-800/90 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/40 text-xs font-mono transition-all uppercase"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1.5 uppercase tracking-wider font-bold">Seat Number Roll (format: XX-XXXXX)</label>
                    <input
                      type="text"
                      required
                      value={newStudentForm.username}
                      onChange={e => setNewStudentForm(p => ({ ...p, username: e.target.value }))}
                      placeholder="e.g. BC-12345"
                      className="w-full bg-slate-950/60 border border-slate-800/90 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/40 text-xs font-bold tracking-widest font-mono transition-all uppercase"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1.5 uppercase tracking-wider font-bold">Department</label>
                    <input
                      type="text"
                      required
                      value={newStudentForm.department}
                      onChange={e => setNewStudentForm(p => ({ ...p, department: e.target.value }))}
                      placeholder="e.g. Computer Science"
                      className="w-full bg-slate-950/60 border border-slate-800/90 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/40 text-xs font-mono transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1.5 uppercase tracking-wider font-bold">Private Key Password</label>
                    <input
                      type="password"
                      required
                      value={newStudentForm.password}
                      onChange={e => setNewStudentForm(p => ({ ...p, password: e.target.value }))}
                      placeholder="Enter a safe password"
                      className="w-full bg-slate-950/60 border border-slate-800/90 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/40 text-xs font-mono transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1.5 uppercase tracking-wider font-bold">Starting Account Deposit ($ Balance)</label>
                    <input
                      type="number"
                      required
                      min="1"
                      max="5000"
                      value={newStudentForm.balance}
                      onChange={e => setNewStudentForm(p => ({ ...p, balance: Number(e.target.value) }))}
                      className="w-full bg-slate-950/60 border border-slate-800/90 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/40 text-xs font-mono transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-teal-500 hover:bg-teal-400 text-slate-950 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg shadow-teal-500/10 hover:shadow-teal-500/25 active:scale-[0.98] transition-all duration-150 mt-6"
                  >
                    Register and Login
                  </button>

                  <div className="text-center mt-5">
                    <button
                      type="button"
                      onClick={() => setIsRegistering(false)}
                      className="text-xs text-teal-400 hover:text-teal-300 font-bold underline font-mono tracking-wide"
                    >
                      Already registered? Click to log in
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <label className="block text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-2">
                        {loginForm.role === 'student' ? 'Seat Roll Number' : 'System Account ID'}
                      </label>
                      <input
                        type="text"
                        required
                        value={loginForm.username}
                        onChange={e => setLoginForm(p => ({ ...p, username: e.target.value }))}
                        placeholder={loginForm.role === 'student' ? "e.g. BC-12345 (XX-XXXXX)" : "e.g. admin"}
                        className="w-full bg-slate-950/60 border border-slate-800/90 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/40 text-xs font-mono transition-all"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                          Account Password
                        </label>
                        <span className="text-[10px] font-mono text-slate-500 font-bold">case-sensitive</span>
                      </div>
                      <input
                        type="password"
                        required
                        value={loginForm.password}
                        onChange={e => setLoginForm(p => ({ ...p, password: e.target.value }))}
                        placeholder="Enter password"
                        className="w-full bg-slate-950/60 border border-slate-800/90 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/40 text-xs font-mono transition-all"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-teal-500 hover:bg-teal-400 text-slate-950 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg shadow-teal-500/10 hover:shadow-teal-500/25 active:scale-[0.98] transition-all duration-150 mt-6"
                    >
                      Enter Library System
                    </button>
                  </form>

                  {loginForm.role === 'student' && (
                    <div className="text-center mt-6 pt-4 border-t border-slate-800/40">
                      <button
                        type="button"
                        onClick={() => {
                          setIsRegistering(true);
                          setNewStudentForm({
                            username: '',
                            firstName: '',
                            lastName: '',
                            department: '',
                            password: '',
                            balance: 100
                          });
                        }}
                        className="text-xs text-teal-400 hover:text-teal-300 font-mono tracking-wider font-bold flex items-center justify-center gap-1.5 mx-auto hover:underline"
                      >
                        <span>NEW STUDENT? REGISTER YOURSELF</span>
                      </button>
                    </div>
                  )}
                </>
              )}


            </div>
          </div>
        ) : (
          /* MAIN AUTHENTICATED WORKSPACES */
          <div className="flex-grow flex flex-col gap-6 overflow-hidden">
            
            {/* 1. LIBRARIAN DASHBOARD INTERFACE */}
            {isLibrarian && (
              <div className="flex-grow flex flex-col gap-6 overflow-y-auto pr-0.5">
                
                {/* Visual STATS Row */}
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                  <div className="bg-slate-950/45 border border-slate-800/80 backdrop-blur-sm p-4 rounded-2xl flex items-center justify-between transition-all duration-300 hover:border-teal-500/30 hover:shadow-lg hover:shadow-teal-500/5 group">
                    <div>
                      <span className="text-[10px] font-sans font-bold text-slate-400 uppercase tracking-wider">Books Total</span>
                      <h3 className="text-2xl font-black text-white mt-1 group-hover:text-teal-400 transition-colors">{stats.totalBooks}</h3>
                    </div>
                    <div className="p-2.5 bg-teal-500/10 rounded-xl text-teal-400 shrink-0 group-hover:scale-105 transition-transform duration-250">
                      <BookIcon className="h-5 w-5" />
                    </div>
                  </div>

                  <div className="bg-slate-950/45 border border-slate-800/80 backdrop-blur-sm p-4 rounded-2xl flex items-center justify-between transition-all duration-300 hover:border-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/5 group">
                    <div>
                      <span className="text-[10px] font-sans font-bold text-slate-400 uppercase tracking-wider">Magazines Total</span>
                      <h3 className="text-2xl font-black text-white mt-1 group-hover:text-indigo-400 transition-colors">{stats.totalMagazines}</h3>
                    </div>
                    <div className="p-2.5 bg-indigo-500/10 rounded-xl text-indigo-400 shrink-0 group-hover:scale-105 transition-transform duration-250">
                      <Layers className="h-5 w-5" />
                    </div>
                  </div>

                  <div className="bg-slate-950/45 border border-slate-800/80 backdrop-blur-sm p-4 rounded-2xl flex items-center justify-between transition-all duration-300 hover:border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/5 group">
                    <div>
                      <span className="text-[10px] font-sans font-bold text-slate-400 uppercase tracking-wider">Active Issued</span>
                      <h3 className="text-2xl font-black text-emerald-400 mt-1">{stats.borrowedResources}</h3>
                    </div>
                    <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-400 shrink-0 group-hover:scale-105 transition-transform duration-250">
                      <ArrowRightLeft className="h-5 w-5" />
                    </div>
                  </div>

                  <div className="bg-slate-950/45 border border-slate-800/80 backdrop-blur-sm p-4 rounded-2xl flex items-center justify-between transition-all duration-300 hover:border-amber-500/30 hover:shadow-lg hover:shadow-amber-500/5 group">
                    <div>
                      <span className="text-[10px] font-sans font-bold text-slate-400 uppercase tracking-wider">Registered</span>
                      <h3 className="text-2xl font-black text-white mt-1 group-hover:text-amber-400 transition-colors">{stats.activeStudents}</h3>
                    </div>
                    <div className="p-2.5 bg-amber-500/10 rounded-xl text-amber-400 shrink-0 group-hover:scale-105 transition-transform duration-250">
                      <UsersIcon className="h-5 w-5" />
                    </div>
                  </div>

                  <div className="bg-slate-950/45 border border-slate-800/80 backdrop-blur-sm p-4 rounded-2xl flex items-center justify-between col-span-2 lg:col-span-1 transition-all duration-300 hover:border-rose-500/30 hover:shadow-lg hover:shadow-rose-500/5 group">
                    <div>
                      <span className="text-[10px] font-sans font-bold text-slate-400 uppercase tracking-wider">Overdue Overlays</span>
                      <h3 className="text-2xl font-black text-rose-400 mt-1">{stats.overdueRecords}</h3>
                    </div>
                    <div className="p-2.5 bg-rose-500/10 rounded-xl text-rose-400 shrink-0 group-hover:scale-105 transition-transform duration-250">
                      <AlertTriangle className="h-5 w-5 animate-pulse" />
                    </div>
                  </div>
                </div>

                {/* Primary Content Row split catalog with Students registry */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  
                  {/* Left panel: Resources Inventory Catalog */}
                  <div className="lg:col-span-8 bg-slate-950/45 border border-slate-800/80 backdrop-blur-sm rounded-2xl overflow-hidden flex flex-col shadow-xl">
                    <div className="p-6 border-b border-slate-800/50 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4 bg-slate-950/20">
                      <div>
                        <h2 className="text-base font-extrabold text-white tracking-wide flex items-center gap-2">
                          <span>RESOURCE INVENTORY CONTROLLER</span>
                          <span className="text-[10px] font-mono font-bold bg-slate-900 border border-slate-800 text-slate-400 py-0.5 px-2 rounded">resources.txt</span>
                        </h2>
                        <p className="text-xs text-slate-400 mt-1">Catalog, modify, or retire items. Uniqueness criteria matches standard ISBN/ISSN requirements.</p>
                      </div>
                      <button
                        onClick={() => setShowAddResourceModal(true)}
                        className="bg-teal-500 hover:bg-teal-400 text-slate-950 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-150 shadow-lg shadow-teal-500/10 hover:shadow-teal-500/25 flex items-center gap-1.5 self-stretch xl:self-auto justify-center active:scale-98"
                      >
                        <Plus className="h-4 w-4 shrink-0" />
                        <span>Add New Resource</span>
                      </button>
                    </div>

                    {/* Quick filter & searches */}
                    <div className="p-4 bg-slate-900/30 border-b border-slate-800/60 grid grid-cols-1 md:grid-cols-12 gap-3.5 items-center">
                      <div className="md:col-span-3">
                        <select
                          value={searchResourceType}
                          onChange={e => setSearchResourceType(e.target.value as any)}
                          className="w-full text-xs font-mono bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 focus:outline-none focus:border-teal-500 text-slate-300"
                        >
                          <option value="all">Format: ALL</option>
                          <option value="book">Format: BOOK</option>
                          <option value="magazine">Format: MAGAZINE</option>
                        </select>
                      </div>

                      <div className="md:col-span-3">
                        <select
                          value={searchCriteria}
                          onChange={e => setSearchCriteria(e.target.value as any)}
                          className="w-full text-xs font-mono bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 focus:outline-none focus:border-teal-500 text-slate-300"
                        >
                          <option value="title">Criteria: Title</option>
                          <option value="author">Criteria: Author</option>
                          <option value="identifier">Criteria: ISBN / ISSN</option>
                          <option value="category">Criteria: Category</option>
                        </select>
                      </div>

                      <div className="md:col-span-6 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={e => setSearchQuery(e.target.value)}
                          placeholder="Search database directory..."
                          className="w-full text-xs bg-slate-950 border border-slate-800 pl-9 pr-4 py-2 rounded-lg focus:outline-none focus:border-teal-500 text-slate-200"
                        />
                      </div>
                    </div>

                    {/* Resources Table body */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="border-b border-slate-800 text-slate-400 uppercase font-mono tracking-wider font-semibold">
                            <th className="p-4">Type</th>
                            <th className="p-4">Identifier (ISBN/ISSN)</th>
                            <th className="p-4">Resource Details</th>
                            <th className="p-4">Category</th>
                            <th className="p-4 text-center">In-Stock Status</th>
                            <th className="p-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-900">
                          {filteredResources.length === 0 ? (
                            <tr>
                              <td colSpan={6} className="text-center p-8 text-slate-500 font-mono text-xs">
                                No verified database records match search parameters.
                              </td>
                            </tr>
                          ) : (
                            filteredResources.map((res) => (
                              <tr key={res.identifier} className="hover:bg-slate-900/60 transition group font-mono">
                                <td className="p-4">
                                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded tracking-widest ${
                                    res.type === 'book'
                                      ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20'
                                      : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                                  }`}>
                                    {res.type.toUpperCase()}
                                  </span>
                                </td>
                                <td className="p-4 font-bold text-slate-300">{res.identifier}</td>
                                <td className="p-4 font-sans max-w-xs">
                                  <div className="font-bold text-white tracking-tight uppercase line-clamp-1">{res.title}</div>
                                  <div className="text-xs text-slate-400 font-mono mt-0.5">{res.author}</div>
                                </td>
                                <td className="p-4 text-xs font-mono text-slate-400">{res.category}</td>
                                <td className="p-4 text-center">
                                  <div className="flex flex-col items-center">
                                    <span className={`font-bold text-xs ${res.availableCopies > 0 ? 'text-teal-400' : 'text-slate-500'}`}>
                                      {res.availableCopies} / {res.totalCopies}
                                    </span>
                                    <span className="text-[10px] text-slate-500">copies left</span>
                                  </div>
                                </td>
                                <td className="p-4 text-right">
                                  <div className="flex items-center justify-end gap-1.5 opacity-90 group-hover:opacity-100 transition">
                                    <button
                                      onClick={() => setShowUpdateResourceModal(res)}
                                      className="p-1 px-2 text-xs bg-slate-900 text-slate-300 border border-slate-800 rounded hover:border-teal-500 hover:text-white transition"
                                    >
                                      Edit
                                    </button>
                                    <button
                                      onClick={() => handleDeleteResource(res.identifier)}
                                      className="p-1 text-slate-400 hover:text-rose-400 hover:bg-rose-950/20 rounded transition"
                                      title="Delete pointer"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>

                  </div>

                  {/* Right panel: Registered Student Registry Card list */}
                  <div className="lg:col-span-4 flex flex-col gap-6">
                    
                    <div className="bg-slate-950/45 border border-slate-800/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl">
                      <div className="p-5 border-b border-slate-800/60 flex items-center justify-between bg-slate-950/20">
                        <div>
                          <h2 className="text-xs font-bold tracking-wider text-slate-200">STUDENTS REGISTRY</h2>
                          <span className="text-[10px] text-slate-500 font-mono">users.txt records directory</span>
                        </div>
                        <button
                          onClick={() => setShowRegisterStudentModal(true)}
                          className="bg-slate-900/80 hover:bg-slate-800 text-teal-400 border border-slate-800 hover:border-teal-500/40 p-2 rounded-xl transition-all"
                          title="Register Student roll"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="p-4 divide-y divide-slate-900/60 max-h-[300px] overflow-y-auto">
                        {studentsList.length === 0 ? (
                          <div className="text-center py-8 text-xs text-slate-500 font-mono">
                            No students registered at this point.
                          </div>
                        ) : (
                          studentsList.map(st => (
                            <div key={st.username} className="py-3 flex items-center justify-between gap-3 group/item">
                              <div>
                                <div className="text-[10.5px] font-mono font-bold text-slate-400">{st.username}</div>
                                <div className="text-xs font-bold text-white uppercase mt-0.5 group-hover/item:text-teal-400 transition-colors">{st.firstName} {st.lastName}</div>
                                <div className="text-[10px] text-slate-500 font-mono mt-0.5">{st.department}</div>
                              </div>
                              <div className="flex gap-2 shrink-0">
                                <button
                                  onClick={() => setShowReportModal(st.username)}
                                  className="text-[9.5px] font-mono font-bold bg-teal-500/10 text-teal-400 border border-teal-500/20 hover:bg-teal-500 hover:text-slate-950 px-2.5 py-1.5 rounded-lg transition-all"
                                >
                                  Report
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Active Circulating Loans List Panel */}
                    <div className="bg-slate-950/45 border border-slate-800/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl">
                      <div className="p-5 border-b border-slate-800/60 flex items-center justify-between bg-slate-950/20">
                        <h2 className="text-xs font-bold tracking-wider text-slate-200 uppercase">ACTIVE ISSUED LOANS</h2>
                        <span className="text-[10px] font-mono text-slate-400 bg-teal-500/10 px-2.5 py-0.5 rounded border border-teal-500/20 font-bold">borrows.txt</span>
                      </div>
                      <div className="p-4 divide-y divide-slate-900/60 max-h-[280px] overflow-y-auto">
                        {transactions.filter(t => !t.returned).length === 0 ? (
                          <div className="text-center py-8 text-xs text-slate-500 font-mono">Correct. No active issued material outstanding.</div>
                        ) : (
                          transactions.filter(t => !t.returned).map(tx => (
                            <div key={tx.id} className="py-3 text-xs font-mono group/loan">
                              <div className="flex items-center justify-between mb-1 gap-2">
                                <span className="font-bold text-slate-400 group-hover/loan:text-teal-400 transition-colors">{tx.username}</span>
                                <span className={`text-[9.5px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${
                                  tx.status === 'overdue'
                                    ? 'bg-rose-500/10 text-rose-400 border-rose-500/25 animate-pulse'
                                    : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25'
                                }`}>
                                  {tx.status}
                                </span>
                              </div>
                              <div className="text-xs font-bold text-white uppercase truncate mt-1">{tx.resourceTitle}</div>
                              <div className="text-[10px] text-slate-500 mt-1.5 flex justify-between items-center bg-slate-900/30 p-1.5 rounded border border-slate-800/20">
                                <span className="text-slate-500 font-medium">DUEDATE: <span className="text-slate-300 font-semibold">{tx.dueDate}</span></span>
                                {tx.fineAmount > 0 && <span className="text-rose-400 font-bold bg-rose-500/5 px-1 rounded">PENALTY: ${tx.fineAmount}</span>}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                  </div>

                </div>

              </div>
            )}

            {/* 2. STUDENT DASHBOARD INTERFACE */}
            {currentUser && currentUser.role === 'student' && (
              <div className="flex-grow flex flex-col gap-6 overflow-y-auto pr-0.5">
                
                {/* ID Card Display grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
                  
                   {/* Account detail profile card */}
                  <div className="md:col-span-2 lg:col-span-4 bg-gradient-to-br from-slate-950 via-[#0a1120] to-slate-900 border border-slate-800/85 p-6 rounded-2xl relative overflow-hidden flex flex-col justify-between shadow-2xl min-h-[220px] group transition-all duration-300 hover:border-teal-500/35">
                    <div className="absolute top-0 right-0 p-8 text-teal-500/5 group-hover:text-teal-500/10 transition-colors pointer-events-none duration-300">
                      <Sparkles className="h-32 w-32" />
                    </div>

                    <div>
                      <div className="flex justify-between items-start mb-6 gap-4">
                        <div className="min-w-0 flex-1">
                          <div className="text-[10px] font-mono font-bold text-teal-400 tracking-wider">OFFICIAL STUDENT ACCOUNT</div>
                          <h2 className="text-xl font-extrabold text-white tracking-wide mt-1 uppercase break-words leading-tight">
                            {currentUser.firstName} {currentUser.lastName}
                          </h2>
                          <div className="text-xs text-slate-400 mt-1">{currentUser.department}</div>
                        </div>
                        <span className="text-[10px] font-mono bg-slate-900 text-teal-300 px-2.5 py-1 rounded-xl tracking-wider border border-slate-800 font-extrabold shrink-0">{currentUser.username}</span>
                      </div>

                      <div className="grid grid-cols-3 gap-2 border-t border-slate-800/60 pt-4 text-center font-mono text-slate-400 text-xs mt-3">
                        <div className="border-r border-slate-800/60">
                          <div className="font-extrabold text-white text-base">{currentUser.account.borrowedResourcesCount}</div>
                          <div className="text-[9px] uppercase tracking-wider text-slate-500 font-bold mt-0.5">Borrowed</div>
                        </div>
                        <div className="border-r border-slate-800/60">
                          <div className="font-extrabold text-white text-base">{currentUser.account.returnedResourcesCount}</div>
                          <div className="text-[9px] uppercase tracking-wider text-slate-500 font-bold mt-0.5">Returned</div>
                        </div>
                        <div>
                          <div className="font-extrabold text-white text-base">{currentUser.account.reservedResourcesCount}</div>
                          <div className="text-[9px] uppercase tracking-wider text-slate-500 font-bold mt-0.5">Reserved</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Financial control balance widget */}
                  <div className="md:col-span-1 lg:col-span-3 bg-slate-950/45 border border-slate-800/80 backdrop-blur-sm p-6 rounded-2xl flex flex-col justify-between shadow-xl transition-all duration-300 hover:border-emerald-500/30">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-sans font-bold text-slate-400 uppercase tracking-wider">Account Cash Balance</span>
                        <h3 className="text-3xl font-black text-white mt-1.5">${currentUser.account.balance.toFixed(2)}</h3>
                      </div>
                      <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/20">
                        <CreditCard className="h-5 w-5" />
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-900/60 flex flex-col gap-3">
                      <div>
                        <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1.5">
                          <span className="font-bold uppercase">RECHARGE SLIDER:</span>
                          <span className="text-emerald-400 font-extrabold">${rechargeSlider}</span>
                        </div>
                        <input
                          type="range"
                          min="10"
                          max="200"
                          step="10"
                          value={rechargeSlider}
                          onChange={e => setRechargeSlider(Number(e.target.value))}
                          className="w-full h-1.5 rounded-lg bg-slate-900 border border-slate-800 appearance-none cursor-pointer accent-teal-500"
                        />
                      </div>
                      <button
                        onClick={handleRecharge}
                        className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold py-2 px-3 rounded-xl transition duration-150 uppercase tracking-wider font-sans shadow-lg shadow-emerald-500/10 active:scale-98"
                      >
                        Recharge
                      </button>
                    </div>
                  </div>

                  {/* Pending fines ledger payment controller */}
                  <div className="md:col-span-1 lg:col-span-2 bg-slate-950/45 border border-slate-800/80 backdrop-blur-sm p-6 rounded-2xl flex flex-col justify-between shadow-xl transition-all duration-300 hover:border-rose-500/30 font-sans">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-sans font-bold text-slate-400 uppercase tracking-wider">Pending Account Fines</span>
                        <h3 className={`text-3xl font-black mt-1.5 ${
                          currentUser.account.fineAmount > 0 ? 'text-rose-400 animate-pulse' : 'text-slate-400'
                        }`}>
                          ${currentUser.account.fineAmount.toFixed(2)}
                        </h3>
                      </div>
                      <div className={`p-2.5 rounded-xl border ${
                        currentUser.account.fineAmount > 0 
                          ? 'bg-rose-500/10 text-rose-400 border-rose-500/20 shadow-md shadow-rose-500/5' 
                          : 'bg-slate-900 text-slate-500 border-slate-800'
                      }`}>
                        <ReceiptIcon className="h-5 w-5" />
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-900/60 flex flex-col gap-2">
                      <div className="text-right text-[10px] text-slate-500 font-mono italic">payFine() core function</div>
                      <button
                        onClick={handlePayFine}
                        disabled={currentUser.account.fineAmount === 0}
                        className={`w-full text-xs font-bold py-2 px-4 rounded-xl transition duration-150 uppercase tracking-wider ${
                          currentUser.account.fineAmount > 0
                            ? 'bg-rose-500 hover:bg-rose-400 text-white font-bold cursor-pointer shadow-lg shadow-rose-500/10 active:scale-98'
                            : 'bg-slate-900/40 border border-slate-900 text-slate-500 cursor-not-allowed'
                        }`}
                      >
                        Settle Fine
                      </button>
                    </div>
                  </div>

                  {/* Time shift warning instructions widget */}
                  <div className="md:col-span-2 lg:col-span-3 bg-slate-950/25 border border-slate-800/65 p-6 rounded-2xl text-xs flex flex-col justify-between shadow-inner">
                    <div>
                      <div className="font-extrabold text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
                        <AlertTriangle className="h-4 w-4" />
                        <span className="font-sans text-[10px]">Circulation Rules</span>
                      </div>
                      <p className="text-slate-400 mt-3 leading-relaxed text-[11px]">
                        Fines accumulate at <strong className="text-slate-200 font-semibold">$10.00/day</strong> once active borrowing surpasses the 7-day limit. Damaged copies invoke a flat fee of <strong className="text-slate-200 font-semibold">$50.00</strong>.
                      </p>
                    </div>
                    <span className="text-[9px] text-slate-500 font-mono italic mt-4 block border-t border-slate-900 pt-2 text-right">Source block: returnResource()</span>
                  </div>

                </div>

                {/* Browse & Circulation Center */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  
                  {/* Left segment Catalog lookup */}
                  <div className="lg:col-span-8 bg-slate-950/45 border border-slate-800/80 backdrop-blur-sm rounded-2xl overflow-hidden flex flex-col shadow-xl">
                    <div className="p-6 border-b border-slate-800/60 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4 bg-slate-950/15">
                      <div>
                        <h2 className="text-base font-extrabold text-white tracking-wide flex items-center gap-2">
                          <span>BROWSER PUBLIC CATALOG</span>
                          <span className="text-[10px] font-mono font-bold bg-slate-900 border border-slate-800 text-teal-400 py-0.5 px-2 rounded-lg">ONLINE DIRECTORY</span>
                        </h2>
                        <span className="text-xs text-slate-400 mt-1 block">Live catalogs. Check real-time resource availability and place instant reservation.</span>
                      </div>
                    </div>

                    {/* Catalog Custom Criteria Search bars */}
                    <div className="p-4 bg-slate-900/40 border-b border-slate-800/60 grid grid-cols-1 md:grid-cols-12 gap-3.5 items-center">
                      <div className="md:col-span-3">
                        <select
                          value={searchCriteria}
                          onChange={e => setSearchCriteria(e.target.value as any)}
                          className="w-full text-xs font-mono bg-slate-950 border border-slate-800/80 p-2.5 rounded-xl focus:outline-none focus:border-teal-500 text-slate-300 font-semibold transition"
                        >
                          <option value="title">C++ Option: Title</option>
                          <option value="author">C++ Option: Author</option>
                          <option value="identifier">C++ Option: ISBN/ISSN</option>
                          <option value="category">C++ Option: Category</option>
                        </select>
                      </div>

                      <div className="md:col-span-3">
                        <select
                          value={searchResourceType}
                          onChange={e => setSearchResourceType(e.target.value as any)}
                          className="w-full text-xs font-mono bg-slate-950 border border-slate-800/80 p-2.5 rounded-xl focus:outline-none focus:border-teal-500 text-slate-300 font-semibold transition"
                        >
                          <option value="all">Resource: ALL</option>
                          <option value="book">Resource: BOOKS Only</option>
                          <option value="magazine">Resource: MAGAZINES Only</option>
                        </select>
                      </div>

                      <div className="md:col-span-6 relative">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={e => setSearchQuery(e.target.value)}
                          placeholder="Execute search stream query..."
                          className="w-full text-xs bg-slate-950 border border-slate-800/80 pl-10 pr-4 py-2.5 rounded-xl text-slate-100 placeholder-slate-650 focus:outline-none focus:border-teal-500 tracking-wide font-mono transition"
                        />
                      </div>
                    </div>

                    {/* Student Catalog cards */}
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto bg-slate-950/20 text-xs">
                      {filteredResources.length === 0 ? (
                        <div className="col-span-2 text-center py-12 text-slate-500 font-mono">No matching resources available in directory.</div>
                      ) : (
                        filteredResources.map(res => {
                          const hasReservationsForThis = reservations.filter(r => r.resourceIdentifier === res.identifier);
                          const userHasReservedThis = hasReservationsForThis.some(r => r.username === currentUser.username);
                          
                          return (
                            <div key={res.identifier} className="bg-[#0b121e]/85 border border-slate-800/70 rounded-2xl p-4.5 flex flex-col justify-between hover:border-slate-700 hover:shadow-lg transitionduration-250 group">
                              <div>
                                <div className="flex items-center justify-between gap-2 mb-3">
                                  <span className={`text-[9px] font-bold font-mono px-2 py-0.5 rounded-lg tracking-widest ${
                                    res.type === 'book' ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20' : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                                  }`}>
                                    {res.type.toUpperCase()}
                                  </span>
                                  <span className="text-[10px] font-mono text-slate-400 font-semibold bg-slate-900/60 p-1 px-2.5 rounded-lg border border-slate-800/20">
                                    {res.type === 'book' ? 'ISBN' : 'ISSN'}: {res.identifier}
                                  </span>
                                </div>

                                <h3 className="text-sm font-bold text-white tracking-wide uppercase line-clamp-1 group-hover:text-teal-400 transition-colors">{res.title}</h3>
                                <div className="text-slate-400 mt-1 font-sans">{res.author}</div>
                                <div className="text-[10px] font-mono text-slate-500 mt-1.5 uppercase font-medium">Cat: {res.category}</div>
                              </div>

                              <div className="mt-5 pt-3.5 border-t border-slate-900/60 flex items-center justify-between">
                                <span className={`text-xs font-bold font-mono ${res.availableCopies > 0 ? 'text-teal-400' : 'text-slate-500'}`}>
                                  {res.availableCopies > 0 ? `${res.availableCopies}/${res.totalCopies} Available` : 'OUT OF STOCK'}
                                </span>

                                <div className="flex gap-2">
                                  {res.availableCopies > 0 ? (
                                    <button
                                      onClick={() => setShowBorrowModal(res)}
                                      className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs uppercase tracking-wider transition duration-150 active:scale-98 shadow-md hover:shadow-teal-500/10"
                                    >
                                      Borrow
                                    </button>
                                  ) : (
                                    <button
                                      onClick={() => handleReserve(res)}
                                      className={`text-xs font-bold px-4 py-2 rounded-xl transition duration-150 uppercase tracking-wider active:scale-98 ${
                                        userHasReservedThis
                                          ? 'bg-slate-900 text-slate-500 cursor-not-allowed border border-slate-800/50'
                                          : 'bg-indigo-500 hover:bg-indigo-400 text-white shadow-md hover:shadow-indigo-500/10'
                                      }`}
                                      disabled={userHasReservedThis}
                                    >
                                      {userHasReservedThis ? 'Reserved' : 'Reserve'}
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>

                  </div>

                  {/* Right segment Student Circulations history */}
                  <div className="lg:col-span-4 flex flex-col gap-6">
                    
                    {/* Active Circulating Loans list */}
                    <div className="bg-slate-950/45 border border-slate-800/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl">
                      <div className="p-5 border-b border-slate-800/60 bg-slate-950/20 flex items-center justify-between">
                        <h2 className="text-xs font-bold tracking-wider text-slate-200 uppercase">MY ACTIVE LOANS</h2>
                        <span className="text-[10px] font-mono text-teal-400 bg-teal-500/10 px-2.5 py-0.5 rounded border border-teal-500/20 font-bold">borrows.txt</span>
                      </div>
                      <div className="p-4 divide-y divide-slate-900/60 max-h-[250px] overflow-y-auto">
                        {transactions.filter(t => t.username.toUpperCase() === currentUser.username.toUpperCase() && !t.returned).length === 0 ? (
                          <div className="text-center py-8 text-xs text-slate-500 font-mono">
                            No active materials checked out. Safe.
                          </div>
                        ) : (
                          transactions.filter(t => t.username.toUpperCase() === currentUser.username.toUpperCase() && !t.returned).map(tx => (
                            <div key={tx.id} className="py-3 text-xs font-mono group/loan-item">
                              <div className="flex justify-between items-start mb-1 gap-2">
                                <span className="font-bold text-white uppercase truncate group-hover/loan-item:text-teal-400 transition-colors">{tx.resourceTitle}</span>
                                <span className={`text-[9px] font-bold px-2 py-0.5 rounded border uppercase shrink-0 tracking-wider ${
                                  tx.status === 'overdue'
                                    ? 'bg-rose-500/10 text-rose-400 border-rose-500/25 animate-pulse'
                                    : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                }`}>
                                  {tx.status}
                                </span>
                              </div>
                              <div className="text-[10px] text-slate-500 flex justify-between items-center mt-2.5 bg-slate-900/30 p-1.5 rounded-lg border border-slate-800/20">
                                <span>DUE: <span className="text-slate-300 font-semibold">{tx.dueDate}</span></span>
                                <button
                                  onClick={() => setShowReturnModal(tx)}
                                  className="bg-slate-950 hover:bg-teal-500 hover:text-slate-950 text-teal-400 border border-slate-800 px-3 py-1 rounded-lg font-bold text-[10px] uppercase transition-all duration-150 active:scale-95"
                                >
                                  Return
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Reservations queues panel */}
                    <div className="bg-slate-950/45 border border-slate-800/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl">
                      <div className="p-5 border-b border-slate-800/60 bg-slate-950/20 flex items-center justify-between">
                        <h2 className="text-xs font-bold tracking-wider text-slate-200 uppercase">MY ACTIVE RESERVATIONS</h2>
                        <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded border border-indigo-500/20 font-bold">reservations.txt</span>
                      </div>
                      <div className="p-4 divide-y divide-slate-900/60 max-h-[200px] overflow-y-auto">
                        {transactions.filter(t => t.username.toUpperCase() === currentUser.username.toUpperCase() && t.returned).length === 450 ? null : (
                          // Reservations are separate
                          reservations.filter(r => r.username.toUpperCase() === currentUser.username.toUpperCase()).length === 0 ? (
                            <div className="text-center py-8 text-xs text-slate-500 font-mono">No active reservations queued.</div>
                          ) : (
                            reservations.filter(r => r.username.toUpperCase() === currentUser.username.toUpperCase()).map(res => (
                              <div key={res.id} className="py-3 text-xs font-mono flex items-center justify-between gap-3 group/res-item">
                                <div className="truncate">
                                  <div className="font-bold text-white uppercase truncate group-hover/res-item:text-indigo-400 transition-colors">{res.resourceTitle}</div>
                                  <div className="text-[9.5px] text-slate-500 mt-0.5 font-bold">ID: {res.resourceIdentifier}</div>
                                </div>
                                <button
                                  onClick={() => handleCancelReservation(res.resourceIdentifier)}
                                  className="text-[10px] font-extrabold text-rose-400 bg-rose-500/5 hover:bg-rose-500 hover:text-white border border-rose-500/20 px-2.5 py-1.5 rounded-lg transition-all duration-150 active:scale-95 shrink-0"
                                >
                                  Cancel
                                </button>
                              </div>
                            ))
                          )
                        )}
                      </div>
                    </div>

                    {/* Historical record ledger */}
                    <div className="bg-slate-950/45 border border-slate-800/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl">
                      <div className="p-5 border-b border-slate-800/60 bg-slate-950/20 flex items-center justify-between">
                        <h2 className="text-xs font-bold tracking-wider text-slate-400 uppercase">CIRCULATION HISTORY</h2>
                        <span className="text-[10px] text-slate-500 font-mono">Returned records</span>
                      </div>
                      <div className="p-4 space-y-3 max-h-[200px] overflow-y-auto">
                        {transactions.filter(t => t.username.toUpperCase() === currentUser.username.toUpperCase() && t.returned).length === 0 ? (
                          <div className="text-center py-8 text-xs text-slate-500 font-mono">No historical returned transactions.</div>
                        ) : (
                          transactions.filter(t => t.username.toUpperCase() === currentUser.username.toUpperCase() && t.returned).map(tx => (
                            <div key={tx.id} className="text-xs font-mono border-l-2 border-emerald-500/40 pl-3 py-1 bg-slate-900/20 rounded-r-lg">
                              <div className="font-bold text-slate-350 uppercase truncate">{tx.resourceTitle}</div>
                              <div className="text-[10px] text-slate-500 flex justify-between mt-1">
                                <span>Returned: <span className="text-slate-400 font-semibold">{tx.returnDate}</span></span>
                                {tx.fineAmount > 0 && <span className="text-emerald-400 font-bold bg-[#10b981]/10 px-1 rounded">${tx.fineAmount} Paid</span>}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                  </div>

                </div>

              </div>
            )}

          </div>
        )}

      </main>

      {/* FOOTER METADATA STATEMENT */}
      <footer className="border-t border-slate-900 bg-slate-950/80 backdrop-blur-md py-6 px-6 text-center shrink-0">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400 text-xs">
          <div>
            &copy; {new Date().getFullYear()} <span className="font-bold text-teal-400 font-sans tracking-wide">The Scholars Library</span>. All academic resources loaded.
          </div>
          <div className="text-[11px] text-slate-500 font-sans tracking-tight">
            Designed as a high-fidelity full-stack C++ Cased File Storage engine simulation.
          </div>
        </div>
      </footer>


      {/* MODAL 1: ADD RESOURCE (Books / Magazine) */}
      <AnimatePresence>
        {showAddResourceModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative"
            >
              <button
                onClick={() => setShowAddResourceModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white transition"
              >
                <X className="h-5 w-5" />
              </button>

              <h3 className="text-lg font-bold text-white mb-1 tracking-tight flex items-center gap-2">
                <span>ADD RESOURCES DETECTOR</span>
                <span className="text-xs font-mono bg-slate-800 text-slate-400 px-2 py-0.5 rounded">Library_System::addResource()</span>
              </h3>
              <p className="text-xs text-slate-400 mb-6">Create a Book with ISBN or Magazine with ISSN. Fields will convert to uppercase.</p>

              <form onSubmit={handleAddResource} className="space-y-4 text-xs font-mono">
                {/* Book / Magazine choice selector switcher */}
                <div>
                  <label className="block text-slate-400 mb-1.5 uppercase">RESOURCE TYPE</label>
                  <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1 rounded-lg border border-slate-800">
                    <button
                      type="button"
                      onClick={() => setNewResourceForm(prev => ({ ...prev, type: 'book' }))}
                      className={`py-1.5 text-center text-xs tracking-wider uppercase rounded-md transition ${
                        newResourceForm.type === 'book' ? 'bg-teal-500 text-slate-950 font-bold' : 'text-slate-450 hover:text-white'
                      }`}
                    >
                      Book (ISBN)
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewResourceForm(prev => ({ ...prev, type: 'magazine' }))}
                      className={`py-1.5 text-center text-xs tracking-wider uppercase rounded-md transition ${
                        newResourceForm.type === 'magazine' ? 'bg-teal-500 text-slate-950 font-bold' : 'text-slate-450 hover:text-white'
                      }`}
                    >
                      Magazine (ISSN)
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1.5 uppercase">
                    {newResourceForm.type === 'book' ? 'ISBN Number' : 'ISSN Number'}
                  </label>
                  <input
                    type="text"
                    required
                    value={newResourceForm.identifier}
                    onChange={e => setNewResourceForm(p => ({ ...p, identifier: e.target.value }))}
                    placeholder={newResourceForm.type === 'book' ? "e.g. 978-3-16-148410-0" : "e.g. 2043-421X"}
                    className="w-full bg-slate-950 border border-slate-800 px-3 py-2 rounded-lg text-slate-100 uppercase focus:outline-none focus:border-teal-500 text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1.5 uppercase">RESOURCE TITLE</label>
                  <input
                    type="text"
                    required
                    value={newResourceForm.title}
                    onChange={e => setNewResourceForm(p => ({ ...p, title: e.target.value }))}
                    placeholder="Enter resource title"
                    className="w-full bg-slate-950 border border-slate-800 px-3 py-2 rounded-lg text-slate-100 uppercase focus:outline-none focus:border-teal-500 text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1.5 uppercase">AUTHOR / PUBLISHER</label>
                  <input
                    type="text"
                    required
                    value={newResourceForm.author}
                    onChange={e => setNewResourceForm(p => ({ ...p, author: e.target.value }))}
                    placeholder="Enter author details"
                    className="w-full bg-slate-950 border border-slate-800 px-3 py-2 rounded-lg text-slate-100 uppercase focus:outline-none focus:border-teal-500 text-xs font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-400 mb-1.5 uppercase">CATEGORY / DEPT</label>
                    <input
                      type="text"
                      required
                      value={newResourceForm.category}
                      onChange={e => setNewResourceForm(p => ({ ...p, category: e.target.value }))}
                      placeholder="e.g. SOFTWARE"
                      className="w-full bg-slate-950 border border-slate-800 px-3 py-2 rounded-lg text-slate-100 uppercase focus:outline-none focus:border-teal-500 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1.5 uppercase">TOTAL COPIES</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={newResourceForm.totalCopies}
                      onChange={e => setNewResourceForm(p => ({ ...p, totalCopies: Number(e.target.value) }))}
                      className="w-full bg-slate-950 border border-slate-800 px-3 py-2 rounded-lg text-slate-100 focus:outline-none focus:border-teal-500 text-xs font-mono"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-teal-500 hover:bg-teal-400 text-slate-950 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest transition mt-6"
                >
                  Confirm New Resource
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>


      {/* MODAL 2: UPDATE RESOURCE DETAILS (Librarian option 2) */}
      <AnimatePresence>
        {showUpdateResourceModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative"
            >
              <button
                onClick={() => setShowUpdateResourceModal(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white transition"
              >
                <X className="h-5 w-5" />
              </button>

              <h3 className="text-lg font-bold text-white mb-1 tracking-tight flex items-center gap-2">
                <span>AMEND RECORD</span>
                <span className="text-xs font-mono bg-slate-800 text-slate-400 px-2 py-0.5 rounded">Library_System::updateResource()</span>
              </h3>
              <p className="text-xs text-slate-400 mb-6">Modify resource details. Uniqueness constraint holds for: {showUpdateResourceModal.identifier}</p>

              <form onSubmit={handleUpdateResource} className="space-y-4 text-xs font-mono">
                <div>
                  <label className="block text-slate-400 mb-1.5 uppercase">Title</label>
                  <input
                    type="text"
                    required
                    value={showUpdateResourceModal.title}
                    onChange={e => {
                      const value = e.target.value;
                      setShowUpdateResourceModal(prev => prev ? ({ ...prev, title: value }) : null);
                    }}
                    className="w-full bg-slate-950 border border-slate-800 px-3 py-2 rounded-lg text-slate-100 uppercase focus:outline-none focus:border-teal-500 text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1.5 uppercase">Author</label>
                  <input
                    type="text"
                    required
                    value={showUpdateResourceModal.author}
                    onChange={e => {
                      const value = e.target.value;
                      setShowUpdateResourceModal(prev => prev ? ({ ...prev, author: value }) : null);
                    }}
                    className="w-full bg-slate-950 border border-slate-800 px-3 py-2 rounded-lg text-slate-100 uppercase focus:outline-none focus:border-teal-500 text-xs font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-400 mb-1.5 uppercase">Category</label>
                    <input
                      type="text"
                      required
                      value={showUpdateResourceModal.category}
                      onChange={e => {
                        const value = e.target.value;
                        setShowUpdateResourceModal(prev => prev ? ({ ...prev, category: value }) : null);
                      }}
                      className="w-full bg-slate-950 border border-slate-800 px-3 py-2 rounded-lg text-slate-100 uppercase focus:outline-none focus:border-teal-500 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1.5 uppercase">Total Copies</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={showUpdateResourceModal.totalCopies}
                      onChange={e => {
                        const value = Number(e.target.value);
                        setShowUpdateResourceModal(prev => prev ? ({ ...prev, totalCopies: value }) : null);
                      }}
                      className="w-full bg-slate-950 border border-slate-800 px-3 py-2 rounded-lg text-slate-100 focus:outline-none focus:border-teal-500 text-xs font-mono"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-teal-500 hover:bg-teal-400 text-slate-950 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest transition mt-6"
                >
                  Save Amendments
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>


      {/* MODAL 3: BORROW DOUBLE CONFIRMATION */}
      <AnimatePresence>
        {showBorrowModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative text-xs font-mono"
            >
              <button
                onClick={() => setShowBorrowModal(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white transition"
              >
                <X className="h-5 w-5" />
              </button>

              <h3 className="text-base font-bold text-white mb-2 uppercase tracking-wide">
                Confirm checkout transaction
              </h3>
              <p className="text-xs text-slate-400 mb-4 font-sans leading-relaxed">
                By clicking proceed, you will borrow a physical copy of this resource under username <strong className="text-white">#{currentUser?.username}</strong>. Return is expected in 7 days.
              </p>

              <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl space-y-2 text-[11px] mb-6">
                <div className="flex justify-between">
                  <span className="text-slate-500">Resource identifier:</span>
                  <span className="font-bold text-slate-200">{showBorrowModal.identifier}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Resource format:</span>
                  <span className="font-bold text-teal-400 uppercase">{showBorrowModal.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Resource Title:</span>
                  <span className="font-bold text-slate-200 uppercase truncate max-w-[150px]">{showBorrowModal.title}</span>
                </div>
                <div className="flex justify-between border-t border-slate-900 pt-2 text-amber-300 font-bold">
                  <span>Current Date:</span>
                  <span>{systemDate}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setShowBorrowModal(null)}
                  className="bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 px-4 py-2 rounded-lg font-bold text-center uppercase tracking-wider transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleBorrow(showBorrowModal)}
                  className="bg-teal-500 hover:bg-teal-400 text-slate-950 px-4 py-2 rounded-lg font-bold text-center uppercase tracking-wider transition"
                >
                  Proceed
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>


      {/* MODAL 4: RETURN RESOURCE CONFIGURATION */}
      <AnimatePresence>
        {showReturnModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative text-xs font-mono"
            >
              <button
                onClick={() => setShowReturnModal(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white transition"
              >
                <X className="h-5 w-5" />
              </button>

              <h3 className="text-base font-bold text-white mb-1 uppercase tracking-wider flex items-center gap-1">
                <span>Return checkout Options</span>
              </h3>
              <p className="text-xs text-slate-400 mb-6 font-sans">Toggle damage rate controls and select simulation return dates to compute fines.</p>

              <form onSubmit={handleReturnSettle} className="space-y-4">
                <div>
                  <label className="block text-slate-500 mb-1.5 uppercase">Current Simulation Date</label>
                  <input
                    type="text"
                    required
                    value={returnFormOptions.returnDate}
                    onChange={e => {
                      const val = e.target.value;
                      setReturnFormOptions(prev => ({ ...prev, returnDate: val }));
                    }}
                    placeholder="DD-MM-YYYY"
                    className="w-full bg-slate-950 border border-slate-800 px-3 py-2 rounded-lg text-slate-100 focus:outline-none focus:border-teal-500 text-xs"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">Default dates to: {systemDate}</span>
                </div>

                <div className="bg-slate-950 border border-slate-800/80 p-3 rounded-lg flex items-center justify-between">
                  <div>
                    <div className="text-slate-300 font-bold uppercase">IS RESOURCE DAMAGED?</div>
                    <div className="text-[10px] text-rose-400/80 font-semibold mt-0.5">Invokes standard $50.00 damage rate charge</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={returnFormOptions.isDamaged}
                    onChange={e => {
                      const val = e.target.checked;
                      setReturnFormOptions(prev => ({ ...prev, isDamaged: val }));
                    }}
                    className="h-4 w-4 rounded accent-rose-500 bg-slate-950 border-slate-800 text-slate-100"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowReturnModal(null)}
                    className="bg-slate-950 border border-slate-800 hover:bg-slate-800 text-slate-300 px-4 py-2.5 rounded-lg font-bold text-center uppercase tracking-wider transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-teal-500 hover:bg-teal-400 text-slate-950 px-4 py-2.5 rounded-lg font-bold text-center uppercase tracking-wider transition"
                  >
                    Confirm Return
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>


      {/* MODAL 5: REGISTER STUDENT ROLL (XX-XXXXX format rule) */}
      <AnimatePresence>
        {showRegisterStudentModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative"
            >
              <button
                onClick={() => setShowRegisterStudentModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white transition"
              >
                <X className="h-5 w-5" />
              </button>

              <h3 className="text-base font-bold text-white mb-1 uppercase tracking-wider flex items-center gap-2">
                <span>Student roll registration</span>
                <span className="text-[10px] font-mono bg-slate-800 px-1.5 py-0.5 rounded text-slate-400 tracking-normal text-xs uppercase">C++ FORM</span>
              </h3>
              <p className="text-xs text-slate-500 mb-6 font-mono">Seat number pattern strictly verified against regex rule mapping check: [XX-XXXXX].</p>

              <form onSubmit={handleRegisterStudent} className="space-y-4 text-xs font-mono">
                <div>
                  <label className="block text-slate-400 mb-1">First Name</label>
                  <input
                    type="text"
                    required
                    value={newStudentForm.firstName}
                    onChange={e => setNewStudentForm(p => ({ ...p, firstName: e.target.value }))}
                    placeholder="Enter first name"
                    className="w-full bg-slate-950 border border-slate-800 px-3 py-2 rounded-lg text-slate-100 uppercase focus:outline-none focus:border-teal-500 text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Last Name</label>
                  <input
                    type="text"
                    required
                    value={newStudentForm.lastName}
                    onChange={e => setNewStudentForm(p => ({ ...p, lastName: e.target.value }))}
                    placeholder="Enter last name"
                    className="w-full bg-slate-950 border border-slate-800 px-3 py-2 rounded-lg text-slate-100 uppercase focus:outline-none focus:border-teal-500 text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Seat number roll (format: XX-XXXXX)</label>
                  <input
                    type="text"
                    required
                    value={newStudentForm.username}
                    onChange={e => setNewStudentForm(p => ({ ...p, username: e.target.value }))}
                    placeholder="e.g. FA-12345"
                    className="w-full bg-slate-950 border border-slate-800 px-3 py-2 rounded-lg text-slate-100 uppercase focus:outline-none focus:border-teal-500 text-xs font-mono tracking-widest font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Department</label>
                  <input
                    type="text"
                    required
                    value={newStudentForm.department}
                    onChange={e => setNewStudentForm(p => ({ ...p, department: e.target.value }))}
                    placeholder="e.g. Computer Science"
                    className="w-full bg-slate-950 border border-slate-800 px-3 py-2 rounded-lg text-slate-100 focus:outline-none focus:border-teal-500 text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Pass Credentials</label>
                  <input
                    type="password"
                    required
                    value={newStudentForm.password}
                    onChange={e => setNewStudentForm(p => ({ ...p, password: e.target.value }))}
                    placeholder="Enter private key password"
                    className="w-full bg-slate-950 border border-slate-800 px-3 py-2 rounded-lg text-slate-100 focus:outline-none focus:border-teal-500 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">starting Account Balance ($)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="5000"
                    value={newStudentForm.balance}
                    onChange={e => setNewStudentForm(p => ({ ...p, balance: Number(e.target.value) }))}
                    className="w-full bg-slate-950 border border-slate-800 px-3 py-2 rounded-lg text-slate-100 focus:outline-none focus:border-teal-500 text-xs font-mono"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-teal-500 hover:bg-teal-400 text-slate-950 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest transition mt-6"
                >
                  Register student roll
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>


      {/* MODAL 6: OFFICIAL STUDENT REPORT AUDIT MODAL (Librarian option 6 printStudentReport) */}
      <AnimatePresence>
        {showReportModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <StudentReportModal
              username={showReportModal}
              onClose={() => setShowReportModal(null)}
              transactionsList={transactions}
              reservationsList={reservations}
              students={studentsList}
            />
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

// Student Report view component (simulating void Library_System::printStudentReport(string username, vector<User *> &users) C++ stdout output in standard tabular graphical design)
interface ReportProps {
  username: string;
  onClose: () => void;
  transactionsList: BorrowRecord[];
  reservationsList: Reservation[];
  students: User[];
}

function StudentReportModal({ username, onClose, transactionsList, reservationsList, students }: ReportProps) {
  const student = students.find(s => s.username.toUpperCase() === username.toUpperCase());
  const studentBorrows = transactionsList.filter(t => t.username.toUpperCase() === username.toUpperCase());
  const studentReservations = reservationsList.filter(r => r.username.toUpperCase() === username.toUpperCase());

  if (!student) {
    return (
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-xs font-mono text-center">
        <p className="text-rose-400 font-bold uppercase mb-4">[ERROR] Student reference point not found in memory stack.</p>
        <button onClick={onClose} className="bg-slate-950 text-slate-300 border border-slate-805 px-4 py-2 rounded">
          Close Report
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="w-full max-w-xl bg-white text-slate-905 p-6 md:p-8 rounded-2xl shadow-2xl relative text-xs font-mono border-4 border-slate-950"
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-slate-400 hover:text-slate-950 transition border border-slate-200 p-1 rounded-md"
      >
        <X className="h-4 w-4" />
      </button>

      {/* Report Header styling to look like official university letter grade layout block */}
      <div className="text-center border-b-2 border-slate-900 pb-5 mb-5 uppercase text-slate-950">
        <div className="text-sm font-black tracking-widest">THE SCHOLARS&apos; UNIVERSITY</div>
        <div className="text-xl font-black mt-1">OFFICIAL EXHAUSTIVE STUDENT REPORT</div>
        <div className="text-[10px] text-slate-500 font-bold mt-1">PRINT DATE: 21-05-2026 // GENERATED FROM LOCALSTACK: users.txt</div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-slate-900 mb-6 border-b border-slate-200 pb-4">
        <div>
          <span className="text-slate-500">Student ID / Seat No:</span>
          <div className="font-bold text-slate-950 text-sm tracking-widest">{student.username}</div>
        </div>
        <div>
          <span className="text-slate-500">Full Name:</span>
          <div className="font-bold text-slate-950 uppercase">{student.firstName} {student.lastName}</div>
        </div>
        <div>
          <span className="text-slate-500">Department / Division:</span>
          <div className="font-bold text-slate-950 uppercase">{student.department || "N/A"}</div>
        </div>
        <div>
          <span className="text-slate-500">Account status verification:</span>
          <div className="font-bold text-emerald-600">ACTIVE REGISTERED STATUS</div>
        </div>
      </div>

      {/* Financials Stack */}
      <div className="bg-slate-100 p-4 rounded-xl border border-slate-200 grid grid-cols-2 gap-4 text-slate-800 mb-6">
        <div>
          <span className="text-slate-500 font-bold uppercase text-[10px]">CURRENT ACCOUNT BALANCE:</span>
          <div className="text-xl font-bold text-slate-950">${student.account.balance.toFixed(2)}</div>
        </div>
        <div>
          <span className="text-slate-500 font-bold uppercase text-[10px]">OUTSTANDING PENDING FINES:</span>
          <div className={`text-xl font-bold ${student.account.fineAmount > 0 ? 'text-rose-600 font-black animate-pulse' : 'text-slate-500'}`}>
            ${student.account.fineAmount.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Borrowing log stack ledger */}
      <div className="mb-6 text-slate-900">
        <h4 className="font-bold text-slate-950 tracking-wider uppercase border-b border-slate-300 pb-1 mb-2">
          Borrowing History Ledger ({studentBorrows.length} loans)
        </h4>
        {studentBorrows.length === 0 ? (
          <p className="text-[11px] text-slate-500">No loan records associated with seat number registry.</p>
        ) : (
          <div className="divide-y divide-slate-100 max-h-[150px] overflow-y-auto">
            {studentBorrows.map(b => (
              <div key={b.id} className="py-2 flex justify-between gap-1">
                <div>
                  <div className="font-bold text-slate-950 uppercase truncate max-w-[280px]">{b.resourceTitle}</div>
                  <div className="text-[10px] text-slate-500">ID: {b.resourceIdentifier} | Issued: {b.issueDate}</div>
                </div>
                <div className="text-right">
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    b.returned ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {b.returned ? 'Returned' : 'Active loan'}
                  </span>
                  {b.fineAmount > 0 && <div className="text-[10.5px] text-rose-600 font-bold mt-1">Fee: ${b.fineAmount}</div>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reservations stacking ledger */}
      <div className="mb-6 text-slate-900">
        <h4 className="font-bold text-slate-950 tracking-wider uppercase border-b border-slate-300 pb-1 mb-2">
          Active Resource Reservations Queue ({studentReservations.length})
        </h4>
        {studentReservations.length === 0 ? (
          <p className="text-[11px] text-slate-500">No active priorities queued in the database reservations logs.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {studentReservations.map(r => (
              <div key={r.id} className="py-2.5 flex justify-between items-center text-xs">
                <div>
                  <div className="font-bold text-slate-950 uppercase">{r.resourceTitle}</div>
                  <div className="text-[10px] text-slate-500">ID Identifier: {r.resourceIdentifier}</div>
                </div>
                <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded tracking-wide font-black uppercase border">Priority queue</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="border-t-2 border-slate-900 pt-4 text-center text-slate-500 text-[10px] uppercase leading-relaxed font-bold">
        Verified official stamp · the scholars library automation stack system. <br />
        This report is a direct digital equivalent of checkout outputs cout displays.
      </div>
    </motion.div>
  );
}
