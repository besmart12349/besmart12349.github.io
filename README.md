# ArsisOS v2.5 Maverick

ArsisOS is a fully functional MacOS-like desktop environment built in React and TypeScript. It features a draggable window manager, a dock, a top menu bar, and several working applications including a web browser, AI assistant, file explorer, and more. The entire OS runs in your web browser and is designed to be a performant and aesthetically pleasing web-based operating system.

## ✨ Features

-   **MacOS-like UI**: A familiar and intuitive desktop interface with a top bar, dock, and desktop icons.
-   **Window Management**: Draggable, resizable, minimizable, and maximizable windows.
-   **App Ecosystem**: A suite of built-in applications:
    -   **Maverick Browser**: A web browser with proxy and AI-powered page reconstruction.
    -   **Houston AI**: A chat-based AI assistant powered by the Gemini API.
    -   **MyDocs**: A file explorer to browse local files and install `.arsapp` packages.
    -   **Imaginarium**: An AI image and video generator.
    -   **DefenseIOS**: A security center to manage a mock VPN, Firewall, and other security settings.
    -   And many more including Terminal, Notes, Calculator, Weather, Music, etc.
-   **Persistence**: User accounts (Arsis ID) and data persistence through a service layer.
-   **Customization**: Change wallpapers and switch between light and dark themes. Your layout, settings, and app data are saved to your profile.
-   **PWA Support**: Install ArsisOS as a Progressive Web App for an offline, app-like experience.
-   **Responsive**: Designed to work on various screen sizes.

## 🚀 Live Demo

You can deploy your own version to GitHub Pages. The live demo will be available at: `https://<your-username>.github.io/<your-repo-name>/`

## 📦 Getting Started

This project is a static web application and does not require a complex build process.

### Running Locally

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/<your-username>/<your-repo-name>.git
    cd <your-repo-name>
    ```

2.  **Serve the files:**
    You can use any simple static server. For example, using Python:
    ```bash
    python -m http.server
    ```
    Or using `npx`:
    ```bash
    npx serve
    ```

3.  Open your browser and navigate to the local address provided by the server (e.g., `http://localhost:8000`).

**Note on API Keys**: This application requires API keys to be available as environment variables. The execution environment where you deploy the app must have these variables configured:
-   `API_KEY`: A Google Gemini API key.
-   `GIST_ID`: The ID of the GitHub Gist used for remote data storage.
-   `GITHUB_PAT`: A GitHub Personal Access Token with `gist` scope for storage access.

## 💾 Data Persistence

User data, including desktop layout, settings, and application data (like notes, calendar events, etc.), is saved remotely using the **GitHub Gist API**. This allows your ArsisOS environment to be persistent across different devices.

-   **How it Works**: All user profiles are stored in a single JSON file (`arsisOS.json`) within a private GitHub Gist. When you log in with your Arsis ID, the system fetches your data from this file. If the ID is new, a profile is created for you. All subsequent changes are saved back to the Gist.
-   **Configuration**: To use this feature, you must configure two environment variables in your deployment environment:
    -   `GIST_ID`: The ID of the GitHub Gist you want to use for storage.
    -   `GITHUB_PAT`: A GitHub Personal Access Token with the `gist` scope to allow the application to read and write to your Gist.
-   **Security Note**: This method is for demonstration and personal use. The Personal Access Token is used on the client-side, which is not secure for a public-facing production application. In a real-world scenario, this logic would be handled by a secure backend server that communicates with the Gist API.

## 🌐 Deploying to GitHub Pages

1.  Push the code to your GitHub repository.
2.  In your repository, go to **Settings** > **Pages**.
3.  Under the **Build and deployment** section, for the **Source**, select **Deploy from a branch**.
4.  Choose your branch (e.g., `main`) and the folder (`/ (root)`).
5.  Click **Save**.
6.  GitHub will build and deploy your site. It might take a few minutes for the site to become available at the provided URL.

## 🛠️ Tech Stack

-   **Frontend**: [React](https://reactjs.org/), [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/) (via CDN)
-   **AI**: [Google Gemini API](https://ai.google.dev/) (`@google/genai`)
-   **PWA**: Service Worker, Web App Manifest

## 📁 Project Structure

```
/
├── apps/             # Contains components for each individual application
├── components/       # Reusable UI components (Window, Dock, etc.)
├── contexts/         # React Context providers (Music, Security)
├── hooks/            # Custom React Hooks (useDraggable)
├── services/         # Abstracted services (e.g., user profile persistence)
├── App.tsx           # Main application component, manages windows and state
├── index.html        # Main HTML entry point
├── index.tsx         # React root renderer
├── sw.js             # Service Worker for PWA offline capabilities
├── manifest.json     # PWA configuration
├── README.md         # This file
└── ...
```