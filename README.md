>_Source repository: mutahhar-official_

# 📚 Library Management System

A comprehensive **full-stack Library Management System** built in C++ backent and react.js frontend that simulates the complete workflow of a real-world library. The system supports two types of users — **Students** and **Librarians** — and provides a full suite of features including resource management, borrowing and returning, fine handling, reservations, and detailed reporting. The project demonstrates core object-oriented programming principles including **Inheritance**, **Polymorphism (Runtime & Compile-time)**, **Encapsulation**, **Exception Handling**, **File Handling**, later enhanced with interactive Web Interface to give a Full-Stack touch..

---

## Funtionality

### User Account Management
- Register a new student account with username, password, first/last name, address, and balance
- Secure login with username and password authentication
- View account details
- Recharge account balance
- Pay fines directly from account balance

### Resource Management
- Add, Update, Remove, Store and Display library resources: **Books** (ISBN) and **Magazines** (ISSN)
- Each resource includes: title, author, category (Literature, Science & Technology, Arts, Education, etc.), total copies, and availability status
- Students can only view **available** resources for borrowing

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

## Web Interface Features Implemented

- React.js and TypeScript
- Talwind CSS Responsive UI
- Glassmorphism Dashboard
- Node.js and Express.js Server
- Real-time Account and Ledger Widgets


## C++ Features Implemented

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

## Project Structure & File Descriptions ( C++ Files )

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

## Real-World Applications

This Library Management System models modern libraries in universities, schools, and public institutions. It automates cataloguing, simplifies check-out and returns, enforces borrowing rules, and reduces administrative work. Features like automatic fine calculation, reservations, and detailed borrowing records improve accountability, accessibility, and resource management—tasks that would otherwise require extensive manual effort.

---

## Individual Contribution

| Member | Contribution |
|------|-------------|
| Muhammad Mutahhar Khan | Designed responsive UI Wb App including tools (Node.js, React.js, APIs) <br> Built the Date class which deals with system date + leap year in backend C++ files. |
| Muhammad Ahsan | Managed the complete Resource functionality including polymorphic resource loading <br> Built issuedReport() and printStudentReport() for the librarian panel |
| Muhammad Hasan | Implemented borrowResource() and returnResource() with daily borrow limit enforcement (max 2 per day) including fine calculation <br> Designed and Implemented User class. |
| Muhammad Ubaidullah | Designed and Implemented Reservation System, Library Records and Account class <br> Wrote and executed test cases to verify integration between borrow and reservation modules |

---

## Authors

- Muhammad Mutahhar Khan (CS-25131)
- Muhammad Ahsan (CS-25125)
- Muhammad Hasan (CS-25132)
- Muhammad Ubaidullah (CS-25128)
> _Students of CIS Department, NED University of Engineering and Technology, Karachi, Pakistan_

