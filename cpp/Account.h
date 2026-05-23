#pragma once
#include <iostream>
using namespace std;
// Controls Fine payment, Account details
class Account
{
private:
    int borrowedResourcesCount;
    int returnedResourcesCount;
    int reservedResourcesCount;
    double fineAmount;
    double balance;

public:
    Account();

    void cancelReservation();
    void returnResourceCount();
    void borrowResourceCount();
    void reserveResourcesCount();
    void fineProcessing(double f);
    bool payFine();
    void recharge(double amount);
    void display();

    //Getters
    double getFine();
    double getBalance();
    int getBorrowedCount();
    int getReturnedCount();
    int getReservedCount();
    //Setters
    void setBalance(double b);
    void setFine(double f);
    void setBorrowedCount(int c);
    void setReturnedCount(int c);
    void setReservedCount(int c);
};
