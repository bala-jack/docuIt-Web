# DocuIt Admin

Welcome to the **DocuIt Admin**. This aims to provide administrative functionalities for managing and overseeing document-related operations.

## Features

- Category management: Add and update categories.
- Analytics: Gain insights from the dashboard on no. of documents uploaded and user additions count.

## Getting Started

### Prerequisites

Ensure you have the following installed on your system:

- Node.js (version 14.x or newer)
- npm (usually comes with Node.js)
- React (version 17.x or newer)

### Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/dockit75/docu-it-web.git
    cd docu-it-web
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Start the development server:
    ```bash
    npm start
    ```

The application should now be running on `http://localhost:3000`.

### Building for Production

1. Generate a production-ready build:

    ```bash
    npm run build
    ```

2. To view your production-ready app locally, you can serve the build directory:

    - First, if you haven't already, install the serve tool:

    ```bash
    npm install -g serve
    ```

    - Next, serve your build:

    ```bash
    serve -s build
    ```

Your production-ready application will now be available at http://localhost:5000 or a similar local address.

## Usage

Navigate to the dashboard to overview the document analytics. You can also access category management for account-level operations.
