#pragma once
#include <string>
#include "Account.h"
using namespace std;

/* ================= USER ================= */
                // Abstract Class
class User
{
protected:
    string username;
    string password;
    string firstName;
    string lastName;
    string role;
    Account account;

public:
    User(string u, string p, string fn, string ln, string r);

    bool checkPassword(string p);
    void fullName();

    Account& getAccount();
    string getUsername();
    string getRole();
    string getPassword();
    string getFirstName();
    string getLastName();

    virtual void displayRole() = 0;
    virtual ~User() {}
};

/* ================= STUDENT ================= */

class Student : public User
{
private:
    string department;

public:
    Student(string u, string p, string fn, string ln, string dep, double bal);

    void displayRole() override;
    string getDepartment();
};

/* ================= LIBRARIAN ================= */

class Librarian : public User
{
public:
    Librarian(string u, string p, string fn, string ln);

    void displayRole() override;
};
