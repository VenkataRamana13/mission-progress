# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/003590fa-64e4-46dc-892e-07fc2800cf64

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/003590fa-64e4-46dc-892e-07fc2800cf64) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/003590fa-64e4-46dc-892e-07fc2800cf64) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

# Mission Progress Tracking System

A comprehensive mission and task tracking system built with Spring Boot, React, and Electron.

## Features

- Mission management with nested tasks
- Real-time progress tracking
- Beautiful and modern UI with dark mode support
- Cross-platform desktop application
- Secure data storage with SQLite

## Project Structure

```
mission-progress/
├── frontend/           # React/TypeScript/Vite frontend
├── backend/           # Spring Boot backend
├── electron-app/      # Electron wrapper
└── run-command-deck.sh # Main run script
```

## Prerequisites

- Java 17 or later
- Node.js 18 or later
- npm 9 or later
- Maven 3.8 or later

## Quick Start

1. Clone the repository:
```bash
git clone https://github.com/yourusername/mission-progress.git
cd mission-progress
```

2. Make the run script executable:
```bash
chmod +x run-command-deck.sh
```

3. Build the project:
```bash
./run-command-deck.sh --build
```

4. Run in development mode:
```bash
./run-command-deck.sh --mode dev
```

Or run in production mode:
```bash
./run-command-deck.sh --mode prod
```

## Development

### Frontend (React/TypeScript/Vite)

The frontend is built with:
- React 18
- TypeScript
- Vite
- TailwindCSS
- Radix UI components
- React Query for data fetching

To run the frontend separately:
```bash
cd frontend
npm install
npm run dev
```

### Backend (Spring Boot)

The backend uses:
- Spring Boot 3.2
- SQLite database
- JPA/Hibernate
- RESTful API design

To run the backend separately:
```bash
cd backend
mvn spring-boot:run
```

### Electron App

The Electron app wraps the frontend for desktop use:
```bash
cd electron-app
npm install
npm start
```

## API Endpoints

### Missions

- `GET /api/missions` - Get all missions
- `GET /api/missions/{id}` - Get a specific mission
- `POST /api/missions` - Create a new mission
- `PUT /api/missions/{id}` - Update a mission
- `DELETE /api/missions/{id}` - Delete a mission

### Tasks

- `POST /api/missions/{missionId}/tasks` - Add a task to a mission
- `PUT /api/missions/{missionId}/tasks/{taskId}` - Update a task
- `DELETE /api/missions/{missionId}/tasks/{taskId}` - Delete a task

## Data Storage

The application stores its data in:
```
~/.local/share/command-deck/command-deck.db
```

Logs are stored in:
```
~/.local/share/command-deck/command-deck.log
```

## Building for Production

To build the entire application for production:
```bash
./run-command-deck.sh --build --mode prod
```

This will:
1. Build the React frontend
2. Package the Spring Boot backend
3. Create the Electron desktop application

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
