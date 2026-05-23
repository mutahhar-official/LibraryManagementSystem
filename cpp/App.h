#pragma once
#include "LibraryManagementSystem.h"

// handles all UI, menus, and screen flow
class App
{
private:
    LibraryManagementSystem lms;

    void setColor(int color);
    void clearScreen();
    void pauseScreen();
    void showLogo();
    void studentMenu(User* user);
    void librarianMenu(User* user);
    void mainLoop();

public:
    void run();
};