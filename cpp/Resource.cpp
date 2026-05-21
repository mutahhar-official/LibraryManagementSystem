#include "Resource.h"
#include "Upper_Case.h"
#include <iostream>
#include <limits>
using namespace std;

Resource::Resource()
{
    totalCopies = 1;
    availableCopies = 1;
}

void Resource::input()
{
    cout << "Title: ";
    getline(cin, title);
    title = ToUpper(title);

    cout << "Author: ";
    getline(cin, author);
    author = ToUpper(author);

    cout << "Category: ";
    getline(cin, category);
    category = ToUpper(category);
    do
    {
        cout << "Total Copies: ";
        cin >> totalCopies;
        if (totalCopies < 0)
            cout << "\nEnter non negative !" << endl;
    } while (totalCopies < 0);

    availableCopies = totalCopies;
}

void Resource::display()
{
    cout << "\n==============================\n";
    cout << "         RESOURCE DETAILS\n";
    cout << "==============================\n";
    cout << "Title        : " << title << endl;
    cout << "Author       : " << author << endl;
    cout << "Category     : " << category << endl;
    cout << "Availability : " << (availableCopies > 0 ? "Available" : "Unavailable") << endl;
    cout << "Available Copies: " << availableCopies << " out of " << totalCopies << endl;
    cout << "==============================\n";
}

void Resource::reduceAvailable()
{
    if (availableCopies > 0)
        availableCopies--;
}

void Resource::increaseAvailable()
{
    if (availableCopies < totalCopies)
        availableCopies++;
}

void Resource::setTotalCopies(int t)    { totalCopies = t; }
void Resource::setTitle(string t)       { title = t; }
void Resource::setAuthor(string a)      { author = a; }
void Resource::setCategory(string c)    { category = c; }
void Resource::setAvailableCopies(int q){ availableCopies = q; }

int Resource::getTotalCopies()          { return totalCopies; }
string Resource::getTitle()             { return title; }
string Resource::getAuthor()            { return author; }
string Resource::getCategory()          { return category; }
bool Resource::getAvailability()        { return availableCopies > 0; }
int Resource::getAvailableCopies()      { return availableCopies; }

void Book::input()
{
    cin.ignore(numeric_limits<streamsize>::max(), '\n');
    cout << "ISBN: ";
    getline(cin, ISBN);
    ISBN = ToUpper(ISBN);
    Resource::input();
}

void Book::display()
{
    cout << "\n----- Book -----\n";
    cout << "ISBN: " << ISBN << endl;
    Resource::display();
}

string Book::getIdentifier()         { return ISBN; }
string Book::getType()               { return "book"; }
void Book::setIdentifier(string id)  { ISBN = id; }

void Magazine::input()
{
    cin.ignore(numeric_limits<streamsize>::max(), '\n');
    cout << "ISSN: ";
    getline(cin, ISSN);
    ISSN = ToUpper(ISSN);
    Resource::input();
}

void Magazine::display()
{
    cout << "\n----- Magazine -----\n";
    cout << "ISSN: " << ISSN << endl;
    Resource::display();
}

string Magazine::getIdentifier()         { return ISSN; }
string Magazine::getType()               { return "magazine"; }
void Magazine::setIdentifier(string id)  { ISSN = id; }
