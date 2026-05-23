#pragma once
#include <vector>
#include "Resource.h"
#include "LibraryRecord.h"
#include "User.h"
using namespace std;

class Library_System
{
private:
    vector<Resource*> resources;
    vector<BorrowRecord> borrows;  //Stores all borrowed resources 
    vector<Reservation> reservations;  //Stores all reserved resources

public:
    ~Library_System();

    
     // Librarian operations
    void addResource();
    void deleteResource();
    void viewAllResources();
    void updateResource();
    void issuedReport();
    void printStudentReport(string username, vector<User *> &users);

    // Student operations
    void showMyReservations(User &u);
    void reserveResource(User &u);
    void showAvailableResources();
    void borrowResource(User &u);
    void returnResource(User &u);
    void showUserHistory(User &u);
    void Account_Info(User &u);

    // File I/O
    void saveResources();
    void loadResources();
    void saveBorrows();
    void loadBorrows();
    void saveReservations();
    void loadReservations();
};
