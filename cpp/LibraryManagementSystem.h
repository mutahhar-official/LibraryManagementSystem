#pragma once
#include <vector>
#include "User.h"
#include "Library_System.h"
using namespace std;

class LibraryManagementSystem
{
private:
    vector<User*> users;
    Library_System database;

    void saveUsers();
    void loadUsers();

public:
    LibraryManagementSystem();
    ~LibraryManagementSystem();

    void registerUser();
    User* login();

    vector<User*>& getUsers();
    Library_System& getDatabase();
};
