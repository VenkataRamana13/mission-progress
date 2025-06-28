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

# Mission Progress

A mission progress tracking application with a modern tech stack:
- Frontend: React + TypeScript + Vite + Tailwind CSS
- Backend: Spring Boot + Java 17 + SQLite
- Desktop: Electron

## Project Structure

```
mission-progress/
├── frontend/           # React frontend application
├── backend/           # Spring Boot backend application
└── electron-app/      # Electron desktop application
```

## Development Setup

### Prerequisites
- Node.js 18+ and npm
- Java 17 JDK
- Maven 3.8+

### Frontend Development
```bash
# Install dependencies
cd frontend
npm install

# Start development server
npm run dev
```

### Backend Development
```bash
# Build and run the backend
cd backend
mvn spring-boot:run
```

### Electron App Development
```bash
# Install dependencies
cd electron-app
npm install

# Start development
npm run dev
```

## Building for Production

### Build Everything
```bash
# From root directory
npm run build
```

### Build Individual Components
```bash
# Build frontend
npm run build:frontend

# Build backend
cd backend
mvn clean package

# Build electron app
npm run build:electron
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.
