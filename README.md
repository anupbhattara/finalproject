# Grocery Flow

A full-stack web application for creating and managing grocery lists. Built with Node.js, Express, SQLite, and EJS templates. Deployed on AWS EC2 using Docker and nginx.

---

## What the App Does

Grocery Flow lets users:

- Create named grocery lists with optional descriptions
- View all their lists in a table with created date
- Add items to a list with a name, category, and quantity
- Mark items as purchased with a checkbox toggle
- Delete individual items from a list
- Delete entire lists (all associated items are removed automatically)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Node.js + Express 5 |
| Database | SQLite |
| Frontend | EJS templates + Vanilla CSS |
| Testing | Playwright (Chromium, Firefox, WebKit) |

---

## Running Locally

### Prerequisites

- Node.js 20+
- npm

### Steps

```bash
# Clone the repo
git clone https://github.com/anupbhattara/finalproject
cd finalproject/app

# Install dependencies
npm install

# Start the development server
npm start
```

Visit `http://localhost:3000` in your browser.

---

## Running Tests

Tests use Playwright and run across Chromium, Firefox, and WebKit.

```bash
cd app

# Install Playwright browsers (first time only)
npm run test:setup

# Run all tests
npm test

# Run tests with UI
npm run test:ui
```
---

### Test Coverage

- Landing page loads with correct title and buttons
- Navigation links are present
- Create List form works and redirects to View Lists
- View Lists shows table with correct columns
- View and Delete buttons appear per row
- Delete list removes it from the table
- List detail page loads and shows Add Item form
- Add item appears in the items table
- Purchased checkbox toggles correctly
- Delete item removes it from the table

---

## Project Specification Document
 
[Full project specification on Google Drive](https://docs.google.com/document/d/1t6HOeSYoIzRPWadoTilhHw_mhtUXUa9FxEDmqOTERZk/edit?usp=sharing)
 
---

## Author

Anup Bhattarai — CS 408 Full Stack Web Development, Spring 2026
