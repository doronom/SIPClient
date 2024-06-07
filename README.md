# SIP Client

A React and Node.js application for SIP client functionalities, such as registration, making calls, and handling incoming calls using the `sip.js` library.

## Table of Contents
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## Features
- Create and configure a SIP user agent
- Register and unregister the SIP user agent
- Make outbound SIP calls
- Handle incoming SIP calls and answer them
- Hang up ongoing calls

## Installation

### Prerequisites
- Node.js (>=14.x)
- npm or yarn

### Steps
1. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/sip-client-automation.git
    cd sip-client-automation
    ```

2. Install the dependencies:
    ```bash
    npm install
    ```
    or
    ```bash
    yarn install
    ```

## Usage
1. Start the development server:
    ```bash
    npm start
    ```
    or
    ```bash
    yarn start
    ```

2. Open your browser and navigate to `http://localhost:3000`.

3. Fill in the SIP user credentials and domain, and use the UI to register, make calls, and handle incoming calls.

## Project Structure
```plaintext
sip-client-automation/
│
├── src/
│   ├── AgentServiceStore.js  # Contains the core SIP user agent logic
│   ├── App.css               # Styling for the React components
│   ├── App.js                # Main React component
│   ├── AgentInterface.js     # UI component for SIP client interactions
│   ├── index.js              # Entry point for the React application
│   └── index.css             # Global styles
│
├── public/
│   ├── index.html            # HTML template
│   └── ...                   # Other static assets
│
├── .gitignore                # Git ignore file
├── package.json              # Project dependencies and scripts
├── README.md                 # Project documentation
└── ...                       # Other configuration files
