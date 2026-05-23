#pragma once
#include <string>
#include "Date.h"
using namespace std;

/* ================= LIBRARY RECORD ================= */

class LibraryRecord
{
public:
    string username;
    string resourceTitle;
    string resourceIdentifier;
    string resourceType;

    LibraryRecord(string u = "", string rt = "", string ri = "", string type = "");

    virtual void display();
    virtual ~LibraryRecord() {}
};

/* ================= BORROW RECORD ================= */

class BorrowRecord : public LibraryRecord
{
public:
    Date issueDate;
    Date dueDate;
    Date returnDate;
    bool returned;

    BorrowRecord();
    void display() override;
};

/* ================= RESERVATION ================= */

class Reservation : public LibraryRecord
{
public:
    Reservation();
    void display() override;
};
