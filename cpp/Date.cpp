#include "Date.h"
#include <iostream>
using namespace std;

bool Date::isLeapYear(int y)
{
    return (y % 400 == 0) || (y % 4 == 0 && y % 100 != 0);
}

int Date::daysInMonth(int m, int y)
{
    if (m == 2)
        return isLeapYear(y) ? 29 : 28;
    else if (m == 4 || m == 6 || m == 9 || m == 11)
        return 30;
    else
        return 31;
}

Date::Date()
{
    day = 0;
    month = 0;
    year = 0;
}

Date::Date(int d, int m, int y) : day(d), month(m), year(y) {}

void Date::input()
{
    do
    {
        cout << "Year: ";
        cin >> year;
        if (year < 1)
            cout << "Enter a valid year" << endl;
    } while (year < 1);

    do
    {
        cout << "Month: ";
        cin >> month;
        if (month < 1 || month > 12)
            cout << "Enter the correct month" << endl;
    } while (month < 1 || month > 12);

    do
    {
        cout << "Day: ";
        cin >> day;
        if (day < 1 || day > daysInMonth(month, year))
            cout << "Enter the correct day" << endl;
    } while (day < 1 || day > daysInMonth(month, year));
}

int Date::Tdays()
{
    int totalDays = 0;

    for (int y = 1; y < year; y++)
        totalDays += isLeapYear(y) ? 366 : 365;

    for (int m = 1; m < month; m++)
        totalDays += daysInMonth(m, year);

    totalDays += day;
    return totalDays;
}

void Date::display()
{
    cout << day << "-" << month << "-" << year << endl;
}

int Date::getDay() { return day; }
int Date::getMonth() { return month; }
int Date::getYear() { return year; }

void Date::set(int d, int m, int y)
{
    day = d;
    month = m;
    year = y;
}
