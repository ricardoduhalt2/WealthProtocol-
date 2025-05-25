
# Wealth Protocol - Ordinal NFT Marketplace

## Description

A web application to display Ordinal NFTs from the Wealth Protocol collection, showcasing hypermodern interactive cards with real-time data from Ordiscan. The application allows users to view details of specific Ordinals, including their metadata, attributes, and content. For certain featured NFTs, it provides a "BUY NOW" link that opens the Gamma.io marketplace page in a modal.

## Features

*   Displays Ordinal NFTs with images, descriptions, and attributes.
*   Fetches real-time data for Ordinals using the Ordiscan API.
*   Custom metadata handling for specific, featured NFTs ("Bitcoin Drip Kimono", "BTC Tracksuit").
*   "BUY NOW" buttons that open Gamma.io or Ordiscan pages in a responsive modal.
*   Separate page for the "C.H.I.D.O." NFT.
*   Responsive design with Tailwind CSS.
*   Navigation bar with links to different sections and external collections.
*   Modern UI with gradient text, hover effects, and loading/error states.

## Prerequisites

To run this application locally, you will need:

*   A modern web browser (e.g., Chrome, Firefox, Safari, Edge).
*   A simple HTTP server to serve the `index.html` file and its associated assets. Node.js comes with `npx serve` or `http-server`, or you can use Python's `http.server`.

## Getting Started

### 1. Setup

Since this project does not use a traditional `package.json` for managing frontend dependencies (it uses ES modules via CDN and `importmap`), there's no `npm install` step for these specific libraries. The browser will fetch them directly.

1.  **Ensure you have all the project files:**
    Make sure you have the following files and directories structured as provided:
    ```
    .
    ├── App.tsx
    ├── components/
    │   ├── ChidoPage.tsx
    │   ├── ContentModal.tsx
    │   ├── Navbar.tsx
    │   ├── OrdinalCard.tsx
    │   └── OrdinalsPage.tsx
    ├── index.html
    ├── index.tsx
    ├── metadata.json
    ├── services/
    │   └── ordiscanApi.ts
    └── types.ts
    ```

### 2. API Keys

*   **Ordiscan API Key:**
    The application uses the Ordiscan API to fetch Ordinal data. The API key is currently hardcoded in `services/ordiscanApi.ts`:
    ```typescript
    const ORDISCAN_API_KEY = 'b3ef6298-cad9-4b1b-8a17-cfee82d66af1';
    ```
    If this key expires or needs to be changed, you must update it in this file.

*   **Gemini API Key (Note for future development):**
    While not currently used in the provided code, if you intend to integrate Gemini API functionalities, ensure the API key is sourced exclusively from an environment variable `process.env.API_KEY`. The application **must not** include UI elements for entering or managing this key.

### 3. Running the Application

Because this project uses ES modules (`.tsx` files) directly in the browser via an `importmap` and does not have a build step (like Webpack or Parcel), you need to serve the `index.html` file using a local HTTP server.

**Option A: Using `npx serve` (requires Node.js)**

1.  Open your terminal or command prompt.
2.  Navigate to the root directory of the project (where `index.html` is located).
3.  Run the command:
    ```bash
    npx serve
    ```
4.  The server will typically start on `http://localhost:3000` or a similar port. Open this URL in your web browser.

**Option B: Using Python's HTTP server (requires Python)**

1.  Open your terminal or command prompt.
2.  Navigate to the root directory of the project.
3.  If you have Python 3:
    ```bash
    python -m http.server
    ```
    If you have Python 2:
    ```bash
    python -m SimpleHTTPServer
    ```
4.  The server will typically start on `http://localhost:8000`. Open this URL in your web browser.

**Option C: Using a VS Code Extension**
    If you are using VS Code, you can install an extension like "Live Server" by Ritwick Dey, right-click on `index.html`, and choose "Open with Live Server".

## Dependencies and Versions

This project leverages modern JavaScript features and ES modules. Dependencies are loaded via an `importmap` in `index.html` from `esm.sh` (a CDN for ES modules) or directly via CDN links.

*   **React**: `^19.1.0` (via esm.sh)
    *   A JavaScript library for building user interfaces.
*   **React DOM**: `^19.1.0` (via esm.sh)
    *   Serves as the entry point to the DOM and server renderers for React.
*   **Ordiscan SDK**: (latest via esm.sh, e.g., `ordiscan`)
    *   JavaScript SDK for interacting with the Ordiscan API to fetch Ordinal data.
*   **Tailwind CSS**: (latest v3 via CDN - `https://cdn.tailwindcss.com`)
    *   A utility-first CSS framework for rapid UI development.
*   **Google Fonts (Inter)**: Loaded via `@import` in `index.html`.
    *   Used as the primary font for the application.

## Project Structure

```
.
├── App.tsx                 # Main application component, handles routing.
├── components/             # UI components directory
│   ├── ChidoPage.tsx       # Page component for displaying the C.H.I.D.O. NFT.
│   ├── ContentModal.tsx    # Modal component for displaying content (e.g., iframes).
│   ├── Navbar.tsx          # Navigation bar component.
│   ├── OrdinalCard.tsx     # Component for displaying individual Ordinal NFT cards.
│   └── OrdinalsPage.tsx    # Page component for displaying the marketplace of Ordinals.
├── index.html              # Main HTML file, entry point of the application.
├── index.tsx               # Main TypeScript file, renders the React app.
├── metadata.json           # Application metadata (name, description).
├── services/               # Services directory
│   └── ordiscanApi.ts      # Service for interacting with the Ordiscan API.
└── types.ts                # TypeScript type definitions.
```

## Styling

*   The application uses **Tailwind CSS** for styling, loaded via a CDN link in `index.html`.
*   Custom global styles, including a custom scrollbar and the Inter font import, are also defined in the `<style>` tag within `index.html`.

## Font

*   The primary font used is **Inter**, imported from Google Fonts.

This README should provide a comprehensive guide for anyone looking to understand, set up, and run your application.
