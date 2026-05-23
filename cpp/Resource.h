#pragma once
#include <string>
#include <limits>
#include <iostream>
using namespace std;

/* ================= RESOURCE ================= */
// Abstract Class
class Resource
{
protected:
    string title;
    string author;
    string category;
    int totalCopies;
    int availableCopies;

public:
    Resource();

    virtual void input();
    virtual void display();

    void reduceAvailable();
    void increaseAvailable();

    // Setters
    void setTotalCopies(int t);
    void setTitle(string t);
    void setAuthor(string a);
    void setCategory(string c);
    void setAvailableCopies(int q);

    // Getters
    int getTotalCopies();
    string getTitle();
    string getAuthor();
    string getCategory();
    bool getAvailability();
    int getAvailableCopies();

    // Pure virtual functions
    virtual string getIdentifier() = 0;
    virtual string getType() = 0;
    virtual void setIdentifier(string id) = 0;

    virtual ~Resource() {}
};

/* ================= BOOK ================= */

class Book : public Resource
{
private:
    string ISBN;

public:
    void input() override;
    void display() override;

    string getIdentifier() override;
    string getType() override;
    void setIdentifier(string id) override;
};

/* ================= MAGAZINE ================= */

class Magazine : public Resource
{
private:
    string ISSN;

public:
    void input() override;
    void display() override;

    string getIdentifier() override;
    string getType() override;
    void setIdentifier(string id) override;
};
