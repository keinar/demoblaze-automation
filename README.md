# Demoblaze QA Automation Home Task

[![Playwright Tests](https://github.com/keinar/demoblaze-automation/actions/workflows/playwright.yml/badge.svg)](https://github.com/keinar/demoblaze-automation/actions/workflows/playwright.yml)

This repository contains an automated testing suite for the **Demoblaze** e-commerce website (UI) and a Mock API (Backend), developed using **Playwright** with **TypeScript**.

## Features

* **UI Automation:** Validates Product Catalog, Product Details, and Cart functionality using the **Page Object Model (POM)** design pattern.
* **API Automation:** Tests a mock REST API (using `json-server`) including GET, POST, and DELETE operations with strict data validation.
* **Robust Infrastructure:**
    * **BasePage** implementation for shared logic and reporting.
    * **Data-Driven Tests** for category validation.
    * **Independent Tests:** API tests include automatic cleanup mechanisms (`beforeEach`) to ensure idempotency.
    * **Centralized Configuration:** URL and Selector management in separate files.

## Prerequisites

* **Node.js** (v14 or higher)
* **npm**

## Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/keinar/demoblaze-automation.git
    ```
2.  Navigate to the project directory:
    ```bash
    cd demoblaze-automation
    ```
3.  Install dependencies:
    ```bash
    npm install
    ```
4.  Install Playwright browsers:
    ```bash
    npx playwright install
    ```

## How to Run

### 1. Start the Mock API Server
Since the backend tests run against a local server, you must start it first.
Open a terminal and run:

```bash
npm run api
```
This will start json-server on http://localhost:3000 watching db.json.

### 2. Run the Tests
Open a new terminal window and use one of the following commands:
#### Run All Tests (UI & API):
```bash
npx playwright test
```
#### Run Only UI Tests:
```bash
npx playwright test tests/ui
```
#### Run Only API Tests:
```bash
npx playwright test tests/api
```
#### View HTML Report:
```bash
npx playwright show-report
```

## Project Structure
```bash
├── src
│   ├── consts      # Static data (URLs, Selectors, Expected Data)
│   ├── pages       # Page Object Models (HomePage, ProductPage, BasePage)
│   └── utils       # Utilities (ApiUtils for backend testing)
├── tests
│   ├── ui          # UI Spec files (catalog, cart flows)
│   └── api         # API Spec files (products, cart CRUD)
├── db.json         # Database file for the Mock API
├── playwright.config.ts
└── README.md
```

## Assumptions & Design Decisions
1. Mock API Cleanup: The API tests are designed to be independent. A `beforeEach` hook cleans up the cart in the mock DB before every test run to prevent state leakage between tests.
2. Demoblaze Latency: The demo website (demoblaze.com) does not always update the URL upon navigation. 
The framework uses explicit waits (`waitFor`) and network handling strategies to ensure stability despite these UI behaviors.
3. Selectors: All selectors are managed in `src/consts/selectors.ts` to avoid hardcoded strings in the test logic, making maintenance easier.