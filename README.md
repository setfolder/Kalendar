# Kalendar Manual

## Program Features

- Yearly calendar.
- Navigate to previous/next year.
- Double-click the year number to jump to the current year.
- Traditional and seasonal calendar view.
- Color and monochrome calendar (colors reflect seasons).
- Option to show/hide month numbers.
- Week can start on Monday or Sunday.
- Print calendar in color, monochrome, or black & white.
- Events and achievements: you can assign a color and description to any day of the event.
    To do this:
    - Click on the day in the Kalendar.
    - Select the background color of the event (except white - it is not visible) and the description of the event.
    - Click Save.
    To delete an event:
    - Click on the event.
    - Delete the description of the event.
    - Click Save.
- Each user has a personal calendar, events, and settings.
- Use as a website: install on server.
- Use as an application: just launch it. The application is portable: copy/move the folder with the application to another location.

## Installed example

https://kalendar-crk8.onrender.com

[Kalendar ↗](https://kalendar-crk8.onrender.com)

## Installation

Requires Node.js and a browser.

1. Navigate to the program folder.
2. Run in console:

   ```bash
   npm -i
   ```

## Logging In and Out

- No login needed to use without events.
- To use events, register as a new user and log in with your username and password.
- To log out of your account, use the "Log out" button in the lower left corner.

## Launch as Website

- Install on any hosting with Node.js support.
- In the browser, go to the website address, port 3000. For example, https://kalendar.net:3000

## Launch as Program

- On **Windows**: run `start.vbs`
- On **Linux / macOS**:

  ```bash
  chmod +x start.sh
  start.sh
  ```

- Close the app using the **X** in the upper-right corner.
- To use a specific browser: open it before running the script.

## Automatic Testing

To enable tests, uncomment lines like <!-- <script src="tests/....></script> --> in the `<head>` section of `index.html`:

## Copyright

(c) Kalendar by Serhii Voznytsia.