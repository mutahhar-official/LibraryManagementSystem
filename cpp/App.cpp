#include <windows.h>
#include "App.h"
#include <iostream>
#include <limits>
using namespace std;
/* ================= APP ================= */
void App::setColor(int color)
{
    SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE), color);
}

void App::clearScreen()
{
    system("cls");
}

void App::pauseScreen()
{
    cout << "\n  Press Enter to continue...";
    cin.ignore(numeric_limits<streamsize>::max(), '\n');
    cin.get();
}

void App::showLogo()
{
    setColor(11);
    cout << "\n";
    cout << "  _      ___ ____  ____      _    ____  __   __\n";
    cout << " | |    |_ _| __ )|  _ \\    / \\  |  _ \\ \\ \\ / /\n";
    cout << " | |     | ||  _ \\| |_) |  / _ \\ | |_) | \\ V / \n";
    cout << " | |___  | || |_) |  _ <  / ___ \\|  _ <   | |  \n";
    cout << " |_____| |___|____/|_| \\_\\/_/   \\_\\_| \\_\\  |_|  \n";
    cout << "\n";
    cout << "=============================================\n";
    cout << "            THE SCHOLARS' LIBRARY            \n";
    cout << "=============================================\n";
    setColor(7);
}

void App::studentMenu(User* user)
{
    int op;
    do
    {
        clearScreen();
        cout << "\n+--------------------------------------+\n";
        cout << "|            STUDENT MENU              |\n";
        cout << "+--------------------------------------+\n";
        cout << "|  Welcome : ";
        user->fullName();
        cout << "+--------------------------------------+\n";
        cout << "|  [1]  View Resources                 |\n";
        cout << "|  [2]  Borrow Resource                |\n";
        cout << "|  [3]  Return Resource                |\n";
        cout << "|  [4]  Reserve Resource               |\n";
        cout << "|  [5]  My History                     |\n";
        cout << "|  [6]  My Reservations                |\n";
        cout << "|  [7]  Pay Fine                       |\n";
        cout << "|  [8]  Recharge Balance               |\n";
        cout << "|  [9]  Account Info                   |\n";
        cout << "|  [10] Logout                         |\n";
        cout << "+--------------------------------------+\n";
        cout << "  >> ";
        cin >> op;
        clearScreen();

        try
        {
            if      (op == 1)  lms.getDatabase().showAvailableResources();
            else if (op == 2)  lms.getDatabase().borrowResource(*user);
            else if (op == 3)  lms.getDatabase().returnResource(*user);
            else if (op == 4)  lms.getDatabase().reserveResource(*user);
            else if (op == 5)  lms.getDatabase().showUserHistory(*user);
            else if (op == 6)  lms.getDatabase().showMyReservations(*user);
            else if (op == 7)  user->getAccount().payFine();
            else if (op == 8)
            {
                double amount;
                cout << "Enter amount to recharge: ";
                cin >> amount;
                user->getAccount().recharge(amount);
            }
            else if (op == 9)  lms.getDatabase().Account_Info(*user);
            else if (op == 10) cout << "\n  [OK]  Logged out successfully!\n";
            else               cout << "\n  [ERROR]  Invalid choice!\n";
        }
        catch (exception& e)
        {
            cout << "\n  [ERROR]  " << e.what() << "\n";
        }

        pauseScreen();

    } while (op != 10);
}

void App::librarianMenu(User* user)
{
    int op;
    do
    {
        clearScreen();
        cout << "\n+--------------------------------------+\n";
        cout << "|           LIBRARIAN MENU             |\n";
        cout << "+--------------------------------------+\n";
        cout << "|  [1]  Add Resource                   |\n";
        cout << "|  [2]  Update Resource                |\n";
        cout << "|  [3]  Delete Resource                |\n";
        cout << "|  [4]  View All Resources             |\n";
        cout << "|  [5]  Issued Report                  |\n";
        cout << "|  [6]  Student Report                 |\n";
        cout << "|  [7]  Logout                         |\n";
        cout << "+--------------------------------------+\n";
        cout << "  >> ";
        cin >> op;
        clearScreen();

        try
        {
            if      (op == 1)  lms.getDatabase().addResource();
            else if (op == 2)  lms.getDatabase().updateResource();
            else if (op == 3)  lms.getDatabase().deleteResource();
            else if (op == 4)  lms.getDatabase().viewAllResources();
            else if (op == 5)  lms.getDatabase().issuedReport();
            else if (op == 6)
            {
                string uname;
                cout << "Enter student username: ";
                cin >> uname;
                lms.getDatabase().printStudentReport(uname, lms.getUsers());
            }
            else if (op == 7)  cout << "\n  [OK]  Logged out successfully!\n";
            else               cout << "\n  [ERROR]  Invalid choice!\n";
        }
        catch (exception& e)
        {
            cout << "\n  [ERROR]  " << e.what() << "\n";
        }

        pauseScreen();

    } while (op != 7);
}

void App::mainLoop()
{
    int choice;
    while (true)
    {
        clearScreen();
        showLogo();
        cout << "\n===== LIBRARY SYSTEM =====\n";
        cout << "1 Register Student\n";
        cout << "2 Login\n";
        cout << "3 Exit\n";
        cout << "Choice: ";
        cin >> choice;
        clearScreen();

        try
        {
            if (choice == 1)
            {
                lms.registerUser();
                pauseScreen();
            }
            else if (choice == 2)
            {
                int loginType;
                cout << "\n===== LOGIN AS =====\n";
                cout << "1 Student\n";
                cout << "2 Librarian\n";
                cout << "Choice: ";
                cin >> loginType;

                if (loginType != 1 && loginType != 2)
                {
                    cout << "\n  [ERROR]  Invalid choice!\n";
                    pauseScreen();
                    continue;
                }

                clearScreen();

                User* user = lms.login();

                string expectedRole = (loginType == 1) ? "student" : "librarian";
                if (user->getRole() != expectedRole)
                {
                    cout << "\n  [ERROR]  This account is not a " << expectedRole << " account!\n";
                    pauseScreen();
                    continue;
                }

                if      (user->getRole() == "student")   studentMenu(user);
                else if (user->getRole() == "librarian") librarianMenu(user);
            }
            else if (choice == 3)
            {
                setColor(11);
                cout << "\n  Thankyou for using The Scholars Library!\n";
                cout << "  Goodbye!\n\n";
                setColor(7);
                break;
            }
            else
            {
                cout << "\n  [ERROR]  Invalid choice!\n";
                pauseScreen();
            }
        }
        catch (exception& e)
        {
            cout << "\n  [ERROR]  " << e.what() << "\n";
            pauseScreen();
        }
    }
}

void App::run()
{
    mainLoop();
}
