#include "LibraryManagementSystem.h"
#include "Upper_Case.h"
#include <iostream>
#include <fstream>
#include <sstream>
#include <limits>
using namespace std;

void LibraryManagementSystem::saveUsers()
{
    ofstream file("users.txt");
    for (auto u : users)
    {
        if (u->getRole() == "student")
        {
            Student *s = (Student *)u;
            file << u->getUsername() << "|"
                 << u->getPassword() << "|"
                 << u->getFirstName() << "|"
                 << u->getLastName() << "|"
                 << s->getDepartment() << "|"
                 << u->getAccount().getBalance() << "|"
                 << u->getAccount().getFine() << "|"
                 << u->getAccount().getBorrowedCount() << "|"
                 << u->getAccount().getReturnedCount() << "|"
                 << u->getAccount().getReservedCount()
                 << "\n";
        }
    }
}

void LibraryManagementSystem::loadUsers()
{
    ifstream file("users.txt");
    if (!file)
        return;

    string line;
    while (getline(file, line))
    {
        stringstream ss(line);
        string username, password, fn, ln, dept;
        double balance, fine;
        int borrowed, returned, reserved;

        getline(ss, username, '|');
        getline(ss, password, '|');
        getline(ss, fn, '|');
        getline(ss, ln, '|');
        getline(ss, dept, '|');
        ss >> balance;
        ss.ignore();

        ss >> fine;
        ss.ignore();

        ss >> borrowed;
        ss.ignore();

        ss >> returned;
        ss.ignore();

        ss >> reserved;
        Student *s = new Student(username, password, fn, ln, dept, balance);
        s->getAccount().setFine(fine);
        s->getAccount().setBorrowedCount(borrowed);
        s->getAccount().setReturnedCount(returned);
        s->getAccount().setReservedCount(reserved);
        users.push_back(s);
    }
}

LibraryManagementSystem::LibraryManagementSystem()
{
    users.push_back(new Librarian("admin", "admin", "Main", "Librarian"));
    loadUsers();
    database.loadResources();
    database.loadBorrows();
    database.loadReservations();
}

LibraryManagementSystem::~LibraryManagementSystem()
{
    saveUsers();
    database.saveResources();
    database.saveBorrows();
    database.saveReservations();
    for (auto u : users)
        delete u;
}

void LibraryManagementSystem::registerUser()
{
    string seatno, pass, fn, ln, dept;
    double bal;

    cin.ignore(numeric_limits<streamsize>::max(), '\n');

    cout << "First name: ";
    getline(cin, fn);
    fn = ToUpper(fn);

    cout << "Last name: ";
    getline(cin, ln);
    ln = ToUpper(ln);

    cout << "Department: ";
    getline(cin, dept);

    bool alreadyexist;
    bool isValid;  

    do
    {
        alreadyexist = false;
        isValid = false;

        cout << "Seat number (XX-XXXXX): ";
        getline(cin, seatno);

        if (seatno.length() == 8 &&
            isalpha(seatno[0]) && isalpha(seatno[1]) &&
            seatno[2] == '-' &&
            isdigit(seatno[3]) && isdigit(seatno[4]) && isdigit(seatno[5]) &&
            isdigit(seatno[6]) && isdigit(seatno[7]))
        {
            isValid = true;
        }
        else
        {
            cout << "Wrong format! Please follow XX-XXXXX." << endl;
            continue;
        }

        for (auto u : users)
        {
            if (u->getUsername() == seatno)
            {
                cout << "Seat no already exist!" << endl;
                alreadyexist = true;
                break;
            }
        }
    } while (!isValid || alreadyexist);

    cout << "Username is : " << seatno << endl;

    cout << "Password: ";
    getline(cin, pass);

    cout << "Enter Balance: ";
    cin >> bal;
    if (bal <= 0)
    {
        throw runtime_error("Invalid Balance\n");
    }

    users.push_back(new Student(seatno, pass, fn, ln, dept, bal));
    cout << "Student registered\n";
}

User *LibraryManagementSystem::login()
{
    string uname, pass;

    cout << "Username: ";
    cin >> uname;

    cout << "Password: ";
    cin >> pass;

    for (auto u : users)
    {
        if (u->getUsername() == uname && u->checkPassword(pass))
        {
            cout << "Login successful\n";
            return u;
        }
    }

    throw runtime_error("Invalid Username or Password");
}

vector<User *> &LibraryManagementSystem::getUsers() { return users; }
Library_System &LibraryManagementSystem::getDatabase() { return database; }
