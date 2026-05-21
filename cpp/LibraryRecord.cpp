#include "LibraryRecord.h"
#include <iostream>
using namespace std;

LibraryRecord::LibraryRecord(string u, string rt, string ri, string type)
    : username(u), resourceTitle(rt), resourceIdentifier(ri), resourceType(type) {}

void LibraryRecord::display()
{
    cout << "User: " << username << endl;
    cout << "Resource: " << resourceTitle << endl;
    cout << "Type: " << resourceType << endl;
    cout << "Identifier: " << resourceIdentifier << endl;
}

BorrowRecord::BorrowRecord() : LibraryRecord(), returned(false) {}

void BorrowRecord::display()
{
    LibraryRecord::display();

    cout << "Issue Date: ";
    issueDate.display();
    cout << "Due Date: ";
    dueDate.display();

    if (returned)
    {
        cout << "Return Date: ";
        returnDate.display();
    }
    else
    {
        cout << "Status: Not returned yet" << endl;
    }
    cout << "----------------------" << endl;
}

Reservation::Reservation() : LibraryRecord() {}

void Reservation::display()
{
    cout << "[RESERVATION RECORD]" << endl;
    LibraryRecord::display();
    cout << "----------------------" << endl;
}
