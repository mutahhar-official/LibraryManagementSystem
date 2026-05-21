export interface Account {
  borrowedResourcesCount: number;
  returnedResourcesCount: number;
  reservedResourcesCount: number;
  fineAmount: number;
  balance: number;
}

export interface User {
  username: string; // Seat number (XX-XXXXX) or admin
  firstName: string;
  lastName: string;
  role: 'student' | 'librarian';
  password?: string; // Credentials passcode
  department?: string;
  account: Account;
}

export interface Resource {
  id: string; // identifier ISBN or ISSN
  identifier: string; // ISBN (Book) or ISSN (Magazine)
  title: string;
  author: string;
  category: string;
  totalCopies: number;
  availableCopies: number;
  type: 'book' | 'magazine';
}

export interface DateModel {
  day: number;
  month: number;
  year: number;
}

export interface BorrowRecord {
  id: string;
  username: string;
  resourceIdentifier: string;
  resourceTitle: string;
  resourceType: 'book' | 'magazine';
  issueDate: string; // DD-MM-YYYY
  dueDate: string; // DD-MM-YYYY
  returnDate?: string; // DD-MM-YYYY
  returned: boolean;
  damaged?: boolean;
  fineAmount: number;
  status: 'active' | 'returned' | 'overdue';
}

export interface Reservation {
  id: string;
  username: string;
  resourceTitle: string;
  resourceIdentifier: string;
  resourceType: 'book' | 'magazine';
}

export interface SystemStats {
  totalBooks: number;
  totalMagazines: number;
  borrowedResources: number;
  activeStudents: number;
  overdueRecords: number;
}
