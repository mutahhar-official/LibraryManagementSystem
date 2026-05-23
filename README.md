# 📚 Library Management System

A comprehensive **console-based Library Management System** built in C++ that simulates the complete workflow of a real-world library. The system supports two types of users — **Students** and **Librarians** — and provides a full suite of features including resource management, borrowing and returning, fine handling, reservations, and detailed reporting. The project demonstrates core object-oriented programming principles including **Inheritance**, **Polymorphism (Runtime & Compile-time)**, **Encapsulation**, **Exception Handling**, **File Handling**, and more.

---

## Funtionality

### User Account Management
- Register a new student account with username, password, first/last name, address, and balance
- Secure login with username and password authentication
- View and update account details
- Recharge account balance
- Pay fines directly from account balance

### Resource Management
- Store and display library resources: **Books** (ISBN) and **Magazines** (ISSN)
- Each resource includes: title, author, category (Literature, Science & Technology, Arts, Education, etc.), total copies, and availability status
- Students can only view **available** resources for borrowing
- Librarians can **add**, **update**, and **remove** resources

### Borrowing System
- Borrow available resources based on real-time availability
- A user **cannot borrow more than 2 resources per day**
- Automatic tracking of **issue date** and **due date**
- Resource availability is updated instantly upon borrowing

### Return & Fine System
- Return borrowed resources and update availability
- Automatic **fine calculation** for late returns based on days overdue or resource damaged.
- Fines are deducted from the user's account balance
- An exception is thrown if the balance is insufficient to cover the fine

### Reservation System
- Reserve a resource that is currently unavailable
- Check if the resource is currently borrowed by the user, if yes, it will show an error message that the user has already borrowed the resource.
- Reservations are automatically removed when the user borrows the reserved resource

### Search
- Search for resources based on different criteria (title, author, category, etc.)

### Borrowing History
- View complete borrowing history: resource name, issue date, due date, return date, and return status
- View active reservations

### Administrator (Librarian) Reports
- Generate a **full student report** including student details, borrowing history and current borrows
- Generate a report of **all currently issued or overdue resources**
- View all resources in the system

### Persistent File Storage
- All data (users, resources, borrow records, reservations) is saved to and loaded from text files automatically

---

## Features Implemented

### Encapsulation

The program uses encapsulation by keeping class data members private or protected and allowing access only through public functions. For example, the `Account` class manages balance and fine amounts using controlled methods like `payFine()` and `recharge()`.

### Inheritance

Inheritance is used to create relationships between classes and reduce code duplication. Classes like `Book` and `Magazine` inherit from `Resource`, while `Student` and `Librarian` inherit from `User`.

### Composition

Composition is used by creating objects of one class inside another class. For example, the `User` class contains an `Account` object, while the library system stores collections of resources, borrow records, and reservations.

### Runtime Polymorphism

Runtime polymorphism is implemented using virtual functions in the `Resource` class. Derived classes override these functions, allowing the correct function to execute based on the actual object type during runtime.

### STL Vectors

The program uses `std::vector` to dynamically manage collections of users, resources, and records. This allows the system to store data efficiently without using fixed-size arrays.

### Abstract Classes and Pure Virtual Functions

The program uses abstract classes such as `Resource` and `User` with pure virtual functions. These classes cannot be instantiated directly and ensure that derived classes implement required methods.

### Exception Handling

The system uses `try-catch` blocks to handle runtime errors safely. Exceptions are used for invalid login attempts, exceeding borrow limits, insufficient balance, and invalid user input.

### File Handling

File handling is used to save and load system data using text files. The program uses `fstream` and `stringstream` to store and retrieve users, resources, borrow records, and reservations.

---

## Project Structure & File Descriptions

### `Account.cpp`
Represents a user's library account. Tracks the number of resources borrowed, returned, and reserved, along with the account balance and any pending fines. Provides methods to borrow, return, and reserve resources. Handles fine addition and payment — throwing an exception if the balance is insufficient. Also supports balance recharging and displays a full account summary.

### `Date.cpp`
Manages all date-related operations. Supports date validation (including leap year logic), formatted input, and calculation of total elapsed days from a base date. The `Tdays()` function is used to compute differences between dates for fine calculations. Displays dates in `day-month-year` format.

### `Resource.cpp`
Defines the `Resource` base class with shared fields: title, author, category, total copies, and available copies. Provides methods to input/display details and manage copy availability. Two derived classes — `Book` (adds ISBN) and `Magazine` (adds ISSN) — override input and display functions, demonstrating **runtime polymorphism**.

### `User.cpp`
Defines the `User` base class storing credentials (username, password), personal info (first/last name), role, and an embedded `Account` object. Derived classes `Student` (adds department, balance) and `Librarian` extend this via inheritance. Demonstrates **encapsulation** and **compile-time polymorphism** through constructor overloading.

### `App.cpp`
The App.cpp file controls the overall flow and user interaction of the Library Management System. 
- It manages console features such as screen clearing, text coloring, pause functionality, and displaying the library logo.
- The file contains separate menus for students and librarians, allowing them to perform operations like managing resources, viewing reports, paying fines, and handling account details.
- The `mainLoop()` function controls registration, login, role verification, and program navigation, while the `run()` function starts the application execution.

### `LibraryRecord.cpp`
Defines the `LibraryRecord` base class holding common transaction info: username, resource title, identifier, and type. Two derived classes extend it:
- **`BorrowRecord`**: Adds issue date, due date, return date, and a returned flag.
- **`Reservation`**: Represents a pending reservation for an unavailable resource.

### `Library_System.cpp`
The core engine of the system. Manages collections of resources, borrow records, and reservations using **pointer-based polymorphism**. Handles the full lifecycle of borrowing (availability check, copy management, reservation removal, record creation), returning (availability restore, fine calculation), and searching. Also manages file I/O for resources, borrow records, and reservations.

### `LibraryManagementSystem.cpp`
Manages the user registry. Loads/saves student data from a file. Handles **student registration** (with seat number format validation and duplicate prevention) and **login authentication** (throwing an exception on invalid credentials). A default librarian account is pre-loaded. Automatically loads all system data on startup and saves everything on shutdown.

### `main.cpp`
The entry point and user interface driver. Displays a styled ASCII logo using Windows Console API with colored text. Presents a main menu for Register, Login, and Exit. After login, routes to either the **Student Menu** or **Librarian Menu**. Uses `try-catch` blocks throughout to handle runtime errors and invalid inputs gracefully without crashing.

---

## How to Use

### Compilation
Compile all `.cpp` files together by writing following command on terminal:
- g++ main.cpp App.cpp LibraryManagementSystem.cpp Library_System.cpp Resource.cpp User.cpp Account.cpp Date.cpp LibraryRecord.cpp -o library
- .\library

### First-Time Use

1. **Launch** the program — the system loads any existing saved data automatically.
2. **Register** a new student account from the main menu.
3. **Login** with your credentials.
4. As a **Student**, you can:
   - Browse available resources
   - Borrow up to 2 resources per day
   - Return resources
   - Reserve unavailable resources
   - View borrowing history
   - Pay fines and recharge your balance
5. As a **Librarian** (default credentials are pre-loaded), you can:
   - Add, update, or remove resources
   - View all resources
   - Generate student reports
   - View currently issued or overdue resources

> **Note:** All data is saved automatically when the program exits.

---

## How the Program Works

### Step 1: Program Start
When the program starts, the main menu is displayed with the following options:

1. Register Student  
2. Login  
3. Exit  

---

### Step 2: Register Student
If the user selects **Register Student**, the program asks the student to enter the following details:

- First Name  
- Last Name  
- Roll Number  
- Department  
- Password  

After entering all required information, the student account is successfully created and stored in the system.

---

### Step 3: Login
If the user selects **Login**, the system asks the user to choose the login type:

1. Login as Student  
2. Login as Librarian  

**Student Login**<br>
The user must enter:

- Username  
- Password  

If the account exists and credentials are correct, the system displays:

```text
Login Successfully
```

**Invalid Librarian Login**<br>
If a student account is used to log in as a librarian, the system displays an error message:

```text
This account is not a librarian account
```

---

### Step 4: Main Menu After Login
After successful login, the system displays the following 10 options:

1. View Resources  
2. Borrow Resources  
3. Return Resources  
4. Reserve Resources  
5. My History  
6. My Reservations  
7. Pay Fine  
8. Recharge Balance  
9. Account Info  
10. Log Out  

---

## Detailed Flow of Each Feature

### 1. View Resources
This option allows the user to view available library resources.

The system provides two choices:

- View Books  
- View Magazines  

After selecting an option, all available books or magazines are displayed on the screen.

---

### 2. Borrow Resources
This option allows the user to borrow a book or magazine.

The user first selects:

- Borrow Book  
- Borrow Magazine  

The system then allows searching by:

- ISBN Number  
- ISSN Number  
- Author Name  
- Title Name  

After searching, the selected resource can be borrowed if available.

---

### 3. Return Resources
This option allows the user to return borrowed resources.

The user enters:

- ISBN number for a book  
- ISSN number for a magazine  

The system processes the return and updates the library records.

---

### 4. Reserve Resources
This option allows the user to reserve a book or magazine.

The user can search resources using:

- ISBN Number  
- ISSN Number  
- Author Name  
- Title Name  

The system displays complete details of the searched resource.

**Reservation Condition**<br>
- If the resource is unavailable, the user can reserve it.
- If enough quantity is available, the system displays:

```text
The product is available and you can borrow it instead of reservation.
```
- If the user has currently borrowed the same resource and has not returned it yet, reservation will be cancelled.
---

### 5. My History
This option displays the borrowing history of the user.

The system shows all books and magazines previously borrowed by the user.

---

### 6. My Reservations
This option displays all reserved books and magazines associated with the user account.

---

### 7. Pay Fine
If the due date of a borrowed resource has passed and the user failed to return it on time, a fine is generated.

This option allows the user to pay the pending fine for:

- Books  
- Magazines  

---

### 8. Recharge Balance
This option allows the user to add balance to their account.

**Process**
1. The user enters the recharge amount.
2. The entered amount is added to the current balance.
3. The system displays:

```text
Recharge successful. New balance is: [Amount]
```

---

### 9. Account Info
This option displays complete account details of the user, including:

- Name  
- Username  
- Currently Borrowed Resources  
- Returned Resources History  
- Reserved Books/Magazines  
- Pending Fine  
- Current Balance  

---

### 10. Log Out
This option allows the user to safely log out from the account.

After logout, the system displays:

```text
Log out successfully
```

---

## Exit Option
If the user selects the **Exit** option from the main menu, the program closes and displays the appreciation message:

```text
Thank you for using the library! Goodbye!
```

---

## Features Summary

- Student Registration  
- Secure Login System  
- Book and Magazine Management  
- Borrow and Return Functionality  
- Reservation System  
- Fine Management  
- Balance Recharge System  
- Account Information Management  
- User History Tracking  
- Logout and Exit Features  

---

## Real-World Applications

This Library Management System models modern libraries in universities, schools, and public institutions. It automates cataloguing, simplifies check-out and returns, enforces borrowing rules, and reduces administrative work. Features like automatic fine calculation, reservations, and detailed borrowing records improve accountability, accessibility, and resource management—tasks that would otherwise require extensive manual effort.


---

## Authors

- **Muhammad Ahsan (CS-25125)**
- **Muhammad Hasan (CS-25132)**
- **Muhammad Mutahhar Khan (CS-25131)**
- **Muhammad Ubaidullah (CS-25128)**


