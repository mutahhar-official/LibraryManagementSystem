#include "Library_System.h"
#include "Upper_Case.h"
#include <iostream>
#include <ctime>
#include <fstream>
#include <sstream>
#include <limits>
#include <algorithm>
using namespace std;

Library_System::~Library_System()
{
    for (auto r : resources)
        delete r;
}

void Library_System::showMyReservations(User &u)
{
    cout << "\n--- My Reservations ---\n";
    bool found = false;

    for (auto &r : reservations)
    {
        if (r.username == u.getUsername())
        {
            r.display();
            found = true;
        }
    }

    if (!found)
        cout << "No reservations found\n";
}

void Library_System::reserveResource(User &u)
{
    int resourceType;
    cout << "\nWhat would you like to reserve?\n";
    cout << "1 -> Book\n";
    cout << "2 -> Magazine\n";
    cout << "Choice: ";
    cin >> resourceType;

    if (resourceType != 1 && resourceType != 2)
    {
        cout << "Invalid choice\n";
        return;
    }

    string typeStr = (resourceType == 1) ? "book" : "magazine";

    int searchChoice;
    cout << "\nHow would you like to search?\n";
    if (resourceType == 1)
        cout << "1 -> Search by ISBN\n";
    else
        cout << "1 -> Search by ISSN\n";

    cout << "2 -> Search by Author\n";
    cout << "3 -> Search by Title\n";
    cout << "Choice: ";
    cin >> searchChoice;

    if (searchChoice < 1 || searchChoice > 3)
    {
        cout << "Invalid choice\n";
        return;
    }

    string searchQuery;
    cin.ignore(numeric_limits<streamsize>::max(), '\n');

    if (searchChoice == 1)
    {
        if (resourceType == 1)
            cout << "Enter ISBN: ";
        else
            cout << "Enter ISSN: ";
    }
    else if (searchChoice == 2)
    {
        cout << "Enter Author: ";
    }
    else
    {
        cout << "Enter Title: ";
    }

    getline(cin, searchQuery);
    searchQuery = ToUpper(searchQuery);

    vector<Resource *> matched;

    for (auto r : resources)
    {
        if (r->getType() != typeStr)
            continue;

        bool found = false;

        if (searchChoice == 1 && r->getIdentifier() == searchQuery)
            found = true;
        else if (searchChoice == 2 && r->getAuthor() == searchQuery)
            found = true;
        else if (searchChoice == 3 && r->getTitle() == searchQuery)
            found = true;

        if (found)
            matched.push_back(r);
    }

    if (matched.empty())
    {
        cout << "No matching resource found.\n";
        return;
    }

    cout << "\n--- Search Results ---\n";
    for (int i = 0; i < (int)matched.size(); i++)
    {
        cout << i + 1 << ". ";
        matched[i]->display();
    }

    int selectChoice;
    cout << "Which one do you want to reserve? 0 to cancel: ";
    cin >> selectChoice;

    if (selectChoice == 0)
    {
        cout << "Reservation cancelled.\n";
        return;
    }

    if (selectChoice < 1 || selectChoice > (int)matched.size())
    {
        cout << "Invalid selection.\n";
        return;
    }

    Resource *selected = matched[selectChoice - 1];

    for (auto &b : borrows)
    {
        if (b.username == u.getUsername() &&
            b.resourceIdentifier == selected->getIdentifier() &&
            b.resourceType == selected->getType() &&
            !b.returned)
        {
            cout << "You already have this resource borrowed. No need to reserve.\n";
            return;
        }
    }

    if (selected->getAvailableCopies() > 0)
    {
        cout << "This resource is currently available. Please borrow it directly.\n";
        return;
    }

    for (auto &res : reservations)
    {
        if (res.username == u.getUsername() &&
            res.resourceIdentifier == selected->getIdentifier() &&
            res.resourceType == selected->getType())
        {
            cout << "You have already reserved this resource.\n";
            return;
        }
    }

    Reservation res;
    res.username = u.getUsername();
    res.resourceTitle = selected->getTitle();
    res.resourceIdentifier = selected->getIdentifier();
    res.resourceType = selected->getType();

    reservations.push_back(res);
    u.getAccount().reserveResourcesCount();

    cout << "Resource reserved successfully. You will get priority when it is returned.\n";
}

void Library_System::addResource()
{
    Resource *r = nullptr;
    int choice;
    cout << "\n1 -> Book ";
    cout << "\n2 -> Magazine ";
    cout << "\nEnter your choice: ";
    cin >> choice;

    if (choice == 1)
    {
        r = new Book();
        r->input();
    }
    else if (choice == 2)
    {
        r = new Magazine();
        r->input();
    }

    if (r != nullptr)
    {
        for (auto existing : resources)
        {
            if (existing->getIdentifier() == r->getIdentifier())  
            {
                cout << "\nResource with ISBN/ISSN [ " << existing->getIdentifier() << " ] already exists!\n";
                delete r;
                return;
            }
        }

        resources.push_back(r);
        cout << "\nResource added successfully!\n";
    }
    else
    {
        cout << "\nInvalid choice!\n";
    }
}

void Library_System::viewAllResources()
{
    cout << "\n---- All Resources ----\n";
    for (auto r : resources)
        r->display();
}

void Library_System::showAvailableResources()
{
    int ch;
    cout << "1 Books\n2 Magazines\nChoose: ";
    cin >> ch;
    if (ch > 2 || ch < 1)
    {
        throw runtime_error("Choose Correct Option!");
    }
    string type = (ch == 1) ? "book" : "magazine";

    cout << "\n=========================" << endl;
    cout << "    Available Resources   " << endl;
    cout << "=========================" << endl;
    for (auto r : resources)
    {
        if (r->getType() == type && r->getAvailableCopies() > 0)
            r->display();
    }
}

void Library_System::borrowResource(User &u)
{
    time_t t = time(0);
    tm *now = localtime(&t);

    Date today;
    today.set(now->tm_mday, now->tm_mon + 1, now->tm_year + 1900);

    cout << "Today's Date: ";
    today.display();

    int todaysBorrows = 0;
    for (auto &b : borrows)
    {
        if (b.username == u.getUsername() &&
            b.issueDate.getDay() == today.getDay() &&
            b.issueDate.getMonth() == today.getMonth() &&
            b.issueDate.getYear() == today.getYear())
        {
            todaysBorrows++;
        }
    }

    if (todaysBorrows >= 2)
    {
        throw runtime_error("Borrow limit reached! Max 2 resources per day.");
    }

    int resourceType;
    cout << "\nWhat would you like to borrow?\n";
    cout << "1 -> Book\n";
    cout << "2 -> Magazine\n";
    cout << "Choice: ";
    cin >> resourceType;

    if (resourceType != 1 && resourceType != 2)
    {
        cout << "Invalid choice\n";
        return;
    }

    string typeStr = (resourceType == 1) ? "book" : "magazine";

    int searchChoice;
    cout << "\nHow would you like to search?\n";
    if (resourceType == 1)
        cout << "1 -> Search by ISBN\n";
    else
        cout << "1 -> Search by ISSN\n";

    cout << "2 -> Search by Author\n";
    cout << "3 -> Search by Title\n";
    cout << "Choice: ";
    cin >> searchChoice;

    if (searchChoice < 1 || searchChoice > 3)
    {
        cout << "Invalid choice\n";
        return;
    }

    string searchQuery;
    cin.ignore(numeric_limits<streamsize>::max(), '\n');

    if (searchChoice == 1)
        cout << ((resourceType == 1) ? "Enter ISBN: " : "Enter ISSN: ");
    else if (searchChoice == 2)
        cout << "Enter Author: ";
    else
        cout << "Enter Title: ";

    getline(cin, searchQuery);
    searchQuery = ToUpper(searchQuery);

    vector<Resource *> matched;

    for (auto r : resources)
    {
        if (r->getType() != typeStr)
            continue;

        if (!r->getAvailability())
            continue;

        bool found = false;

        if (searchChoice == 1 && r->getIdentifier() == searchQuery)
            found = true;
        else if (searchChoice == 2 && r->getAuthor() == searchQuery)
            found = true;
        else if (searchChoice == 3 && r->getTitle() == searchQuery)
            found = true;

        if (found)
            matched.push_back(r);
    }

    if (matched.empty())
    {
        cout << "\nNo available " << typeStr << " found matching this search.\n";
        return;
    }

    cout << "\n--- Search Results ---\n";
    for (int i = 0; i < (int)matched.size(); i++)
    {
        cout << i + 1 << ". ";
        matched[i]->display();
    }

    int selectChoice;
    cout << "Enter the number to borrow or 0 to cancel: ";
    cin >> selectChoice;

    if (selectChoice == 0)
    {
        cout << "Borrow cancelled\n";
        return;
    }

    if (selectChoice < 1 || selectChoice > (int)matched.size())
    {
        cout << "Invalid selection\n";
        return;
    }

    Resource *selected = matched[selectChoice - 1];

    for (auto &b : borrows)
    {
        if (b.username == u.getUsername() &&
            b.resourceIdentifier == selected->getIdentifier() &&
            b.resourceType == selected->getType() &&
            !b.returned)
        {
            cout << "You already have this resource borrowed.\n";
            return;
        }
    }

    int reservedIndex = -1;

    for (int i = 0; i < (int)reservations.size(); i++)
    {
        if (reservations[i].resourceIdentifier == selected->getIdentifier() &&
            reservations[i].resourceType == selected->getType())
        {
            reservedIndex = i;
            break;
        }
    }

    if (reservedIndex != -1 &&
        reservations[reservedIndex].username != u.getUsername())
    {
        cout << "This resource is reserved for another user. You cannot borrow it right now.\n";
        return;
    }

    if (selected->getAvailableCopies() > 0)
    {
        selected->reduceAvailable();
    }
    else
    {
        cout << "No copies available to borrow.\n";
        return;
    }

    if (reservedIndex != -1 &&
        reservations[reservedIndex].username == u.getUsername())
    {
        reservations.erase(reservations.begin() + reservedIndex);
        u.getAccount().cancelReservation();
    }

    BorrowRecord b;
    b.username = u.getUsername();
    b.resourceTitle = selected->getTitle();
    b.resourceIdentifier = selected->getIdentifier();
    b.resourceType = selected->getType();
    b.issueDate = today;

    time_t due = t + (7 * 24 * 60 * 60);
    tm *dueNow = localtime(&due);

    b.dueDate.set(
        dueNow->tm_mday,
        dueNow->tm_mon + 1,
        dueNow->tm_year + 1900);

    cout << "Due Date: ";
    b.dueDate.display();
    cout << "\n";

    b.returned = false;
    borrows.push_back(b);

    u.getAccount().borrowResourceCount();

    cout << typeStr << " borrowed successfully.\n";
}

void Library_System::returnResource(User &u)
{
    string id;

    cin.ignore(numeric_limits<streamsize>::max(), '\n');
    cout << "Enter ISBN / ISSN: ";
    getline(cin, id);
    id = ToUpper(id);

    for (auto &b : borrows)
    {
        if (b.username == u.getUsername() &&
            b.resourceIdentifier == id &&
            !b.returned)
        {
            cout << "Enter Return Date:\n";
            b.returnDate.input();
            b.returned = true;

            for (auto &r : resources)
            {
                if (r->getIdentifier() == id)
                {
                    r->increaseAvailable();
                    break;
                }
            }

            double fine = 0;

            int lateDays = b.returnDate.Tdays() - b.dueDate.Tdays();
            if (lateDays > 0)
                fine += lateDays * 10;

            int ch;
            cout << "Is The Resource Damaged?\n1.Yes\n2.No\n";
            cin >> ch;

            if (ch == 1)
                fine += 50;

            if (fine > 0)
            {
                u.getAccount().fineProcessing(fine);
                cout << "Late By " << lateDays << " Day(s)" << endl;
                cout << "Fine = " << fine << "\tAdded To Your Account" << endl;
            }

            u.getAccount().returnResourceCount();

            cout << "Returned Successfully\n";
            return;
        }
    }

    cout << "Record not found\n";
}

void Library_System::updateResource()
{
    string search;
    cin.ignore(numeric_limits<streamsize>::max(), '\n');
    cout << "Enter the ISBN/ISSN of the resource you want to update: ";
    getline(cin, search);
    search = ToUpper(search);

    bool found = false;
    for (auto r : resources)
    {
        if (r->getIdentifier() == search)
        {
            r->display();
            found = true;
            int choice;
            cout << "1. Update Title\n";
            cout << "2. Update Author\n";
            cout << "3. Update Category\n";
            cout << "4. Update Total Copies\n";
            cout << "Choice: ";
            cin >> choice;
            cin.ignore(numeric_limits<streamsize>::max(), '\n');

            if (choice == 1)
            {
                string newTitle;
                cout << "Enter new Title: ";
                getline(cin, newTitle);
                r->setTitle(ToUpper(newTitle));
            }
            else if (choice == 2)
            {
                string newAuthor;
                cout << "Enter new Author: ";
                getline(cin, newAuthor);
                r->setAuthor(ToUpper(newAuthor));
            }
            else if (choice == 3)
            {
                string newCategory;
                cout << "Enter new Category: ";
                getline(cin, newCategory);
                r->setCategory(ToUpper(newCategory));
            }
            else if (choice == 4)
            {
                int newCopies;
                cout << "Enter new Total Copies: ";
                cin >> newCopies;

                int borrowed = r->getTotalCopies() - r->getAvailableCopies();
                if (newCopies < borrowed)
                {
                    cout << "Cannot set total copies less than currently borrowed copies.\n";
                    return;
                }

                r->setTotalCopies(newCopies);
                r->setAvailableCopies(newCopies - borrowed);
            }
            else
            {
                cout << "Invalid choice.\n";
                return;
            }
            cout << "Resource updated successfully!\n";
            return;
        }
    }

    if (!found)
        cout << "Resource not found.\n";
}

void Library_System::deleteResource()
{
    string search;
    cin.ignore(numeric_limits<streamsize>::max(), '\n');
    cout << "Enter ISBN/ISSN to delete: ";
    getline(cin, search);
    search = ToUpper(search);

    for (int i = 0; i < (int)resources.size(); i++)
    {
        if (resources[i]->getIdentifier() == search)
        {
            reservations.erase(
                remove_if(reservations.begin(), reservations.end(),
                    [&](const Reservation& r) {
                        return r.resourceIdentifier == search;
                    }),
                reservations.end()
            );

            delete resources[i];
            resources.erase(resources.begin() + i);

            saveResources();
            saveReservations();

            cout << "Resource and its reservations deleted successfully.\n";
            return;
        }
    }

    cout << "Resource not found.\n";
}

void Library_System::showUserHistory(User &u)
{
    cout << "\n=================================================================";
    cout << "\n                      CURRENT BORROW RECORDS";
    cout << "\n=================================================================" << endl;

    for (auto b : borrows)
        if (b.username == u.getUsername())
            b.display();
}

void Library_System::printStudentReport(string username, vector<User *> &users)
{
    bool studentFound = false;

    for (auto u : users)
    {
        if (u->getUsername() == username)
        {
            studentFound = true;

            cout << "\n====================================" << endl;
            cout << "       OFFICIAL STUDENT REPORT      " << endl;
            cout << "====================================" << endl;
            cout << "Student ID: " << u->getUsername() << endl;
            cout << "Student Name: ";
            u->fullName();

            u->getAccount().display();

            cout << "\n=========================" << endl;
            cout << "    Borrowing History    " << endl;
            cout << "=========================" << endl;
            bool hasBorrows = false;
            for (auto &b : borrows)
            {
                if (b.username == username)
                {
                    b.display();
                    hasBorrows = true;
                }
            }
            if (!hasBorrows)
                cout << "No borrow history found for this user.\n";

            cout << "\n=========================" << endl;
            cout << "      Reservations    " << endl;
            cout << "=========================" << endl;
            bool hasReservations = false;
            for (auto &r : reservations)
            {
                if (r.username == username)
                {
                    r.display();
                    hasReservations = true;
                }
            }
            if (!hasReservations)
                cout << "No reservations found for this user.\n";

            cout << "====================================" << endl;
            return;
        }
    }

    if (!studentFound)
        cout << "User not found in system.\n";
}

void Library_System::issuedReport()
{
    cout << "\n=========================\n";
    cout << "     Issued Resources     \n";
    cout << "=========================\n";
    for (auto b : borrows)
        if (!b.returned)
            b.display();
}

void Library_System::saveResources()
{
    ofstream file("resources.txt");
    for (auto r : resources)
    {
        file << r->getType() << "|"
             << r->getIdentifier() << "|"
             << r->getTitle() << "|"
             << r->getAuthor() << "|"
             << r->getCategory() << "|"
             << r->getTotalCopies() << "|"
             << r->getAvailableCopies() << "\n";
    }
}

void Library_System::loadResources()
{
    ifstream file("resources.txt");
    if (!file)
        return;

    string line;
    while (getline(file, line))
    {
        stringstream ss(line);
        string type, id, title, author, category;
        int total, available;

        getline(ss, type, '|');
        getline(ss, id, '|');
        getline(ss, title, '|');
        getline(ss, author, '|');
        getline(ss, category, '|');
        ss >> total;
        ss.ignore();
        ss >> available;

        Resource *r = nullptr;
        if (type == "book")
            r = new Book();
        else if (type == "magazine")
            r = new Magazine();

        if (r)
        {
            r->setIdentifier(id);
            r->setTitle(title);
            r->setAuthor(author);
            r->setCategory(category);
            r->setTotalCopies(total);
            r->setAvailableCopies(available);
            resources.push_back(r);
        }
    }
}

void Library_System::saveBorrows()
{
    ofstream file("borrows.txt");
    for (auto &b : borrows)
    {
        file << b.username << "|"
             << b.resourceTitle << "|"
             << b.resourceIdentifier << "|"
             << b.resourceType << "|"
             << b.returned << "|"
             << b.issueDate.getDay() << "|" << b.issueDate.getMonth() << "|" << b.issueDate.getYear() << "|"
             << b.dueDate.getDay() << "|" << b.dueDate.getMonth() << "|" << b.dueDate.getYear() << "|"
             << b.returnDate.getDay() << "|" << b.returnDate.getMonth() << "|" << b.returnDate.getYear() << "\n";
    }
}

void Library_System::loadBorrows()
{
    ifstream file("borrows.txt");
    if (!file)
        return;

    string line;
    while (getline(file, line))
    {
        stringstream ss(line);
        BorrowRecord b;
        int returned, d, m, y;

        getline(ss, b.username, '|');
        getline(ss, b.resourceTitle, '|');
        getline(ss, b.resourceIdentifier, '|');
        getline(ss, b.resourceType, '|');
        ss >> returned;
        ss.ignore();
        b.returned = returned;

        ss >> d;
        ss.ignore();
        ss >> m;
        ss.ignore();
        ss >> y;
        ss.ignore();
        b.issueDate.set(d, m, y);

        ss >> d;
        ss.ignore();
        ss >> m;
        ss.ignore();
        ss >> y;
        ss.ignore();
        b.dueDate.set(d, m, y);

        ss >> d;
        ss.ignore();
        ss >> m;
        ss.ignore();
        ss >> y;
        b.returnDate.set(d, m, y);

        borrows.push_back(b);
    }
}

void Library_System::saveReservations()
{
    ofstream file("reservations.txt");
    for (auto &r : reservations)
    {
        file << r.username << "|"
             << r.resourceTitle << "|"
             << r.resourceIdentifier << "|"
             << r.resourceType << "\n";
    }
}

void Library_System::loadReservations()
{
    ifstream file("reservations.txt");
    if (!file)
        return;

    string line;
    while (getline(file, line))
    {
        stringstream ss(line);
        Reservation r;

        getline(ss, r.username, '|');
        getline(ss, r.resourceTitle, '|');
        getline(ss, r.resourceIdentifier, '|');
        getline(ss, r.resourceType, '|');

        reservations.push_back(r);
    }
}

void Library_System::Account_Info(User &u)
{
    cout << "\n\n=========================\n";
    cout << "      Account Details     \n";
    cout << "=========================\n";
    cout << "\nName :";
    u.fullName();
    cout << "Username: " << u.getUsername() << endl;
    u.getAccount().display();
}
