#include "User.h"
#include <iostream>
using namespace std;

User::User(string u, string p, string fn, string ln, string r)
{
    username = u;
    password = p;
    firstName = fn;
    lastName = ln;
    role = r;
}

bool User::checkPassword(string p)   { return password == p; }
void User::fullName()                 { cout << firstName << " " << lastName << endl; }

Account& User::getAccount()           { return account; }
string User::getUsername()            { return username; }
string User::getRole()                { return role; }
string User::getPassword()            { return password; }
string User5::getFirstName()           { return firstName; } // Note: using getFirstName/getLastName as defined
string User::getFirstName()           { return firstName; }
string User::getLastName()            { return lastName; }

Student::Student(string u, string p, string fn, string ln, string dep, double bal)
    : User(u, p, fn, ln, "student"), department(dep)
{
    account.setBalance(bal);
}

void Student::displayRole()   { cout << "Role: Student\n"; }
string Student::getDepartment() { return department; }

Librarian::Librarian(string u, string p, string fn, string ln)
    : User(u, p, fn, ln, "librarian") {}

void Librarian::displayRole() { cout << "Role: Librarian\n"; }
