#include "Account.h"
#include <iostream>
#include <stdexcept>
using namespace std;

Account::Account()
{
    borrowedResourcesCount = 0;
    returnedResourcesCount = 0;
    reservedResourcesCount = 0;
    fineAmount = 0.0;
    balance = 0.0;
}

void Account::cancelReservation()
{
    if (reservedResourcesCount > 0)
        reservedResourcesCount--;
}

void Account::returnResourceCount()
{
    if (borrowedResourcesCount > 0)
        borrowedResourcesCount--;
    returnedResourcesCount++;
}

void Account::borrowResourceCount() { borrowedResourcesCount++; }
void Account::reserveResourcesCount() { reservedResourcesCount++; }

void Account::fineProcessing(double f)
{
    fineAmount += f;
}

bool Account::payFine()
{
    if (fineAmount <= 0)
    {
        cout << "No fine" << endl;
        return false;
    }

    if (balance >= fineAmount)
    {
        balance -= fineAmount;
        cout << "Payment Successful! Fine paid: " << fineAmount << " $" << endl;
        fineAmount = 0;
        return true;
    }
    else
    {
        throw runtime_error("Insufficient balance to pay fine.");
        return false;
    }
}

void Account::recharge(double amount)
{
    if (amount <= 0)
        throw invalid_argument("Recharge amount must be positive!");
    balance += amount;
    cout << "Recharge successful! New Balance: " << balance << endl;
}

void Account::display()
{
    cout << "Resources currently borrowed: " << borrowedResourcesCount << endl;
    cout << "Resources returned to date  : " << returnedResourcesCount << endl;
    cout << "Books reserved          : " << reservedResourcesCount << endl;
    cout << "Pending Fines           : $" << fineAmount << endl;
    cout << "Current Account Balance : $" << balance << endl;
}

void Account::setBalance(double b) { balance = b; }
void Account::setFine(double f) { fineAmount = f; }
int Account::getBorrowedCount() { return borrowedResourcesCount; }
int Account::getReturnedCount() { return returnedResourcesCount; }
int Account::getReservedCount() { return reservedResourcesCount; }
void Account::setBorrowedCount(int c) { borrowedResourcesCount = c; }
void Account::setReturnedCount(int c) { returnedResourcesCount = c; }
void Account::setReservedCount(int c) { reservedResourcesCount = c; }
double Account::getFine() { return fineAmount; }
double Account::getBalance() { return balance; }
