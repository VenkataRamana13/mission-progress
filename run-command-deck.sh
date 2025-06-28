#!/bin/bash

# Exit on error
set -e

# Script location
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
cd "$SCRIPT_DIR"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}==>${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}WARNING:${NC} $1"
}

print_error() {
    echo -e "${RED}ERROR:${NC} $1"
}

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
check_prerequisites() {
    local missing_deps=0

    if ! command_exists java; then
        print_error "Java not found. Please install Java 17 or later."
        missing_deps=1
    fi

    if ! command_exists mvn; then
        print_error "Maven not found. Please install Maven."
        missing_deps=1
    fi

    if ! command_exists node; then
        print_error "Node.js not found. Please install Node.js."
        missing_deps=1
    fi

    if ! command_exists npm; then
        print_error "npm not found. Please install npm."
        missing_deps=1
    fi

    if [ $missing_deps -eq 1 ]; then
        exit 1
    fi
}

# Function to build the project
build_project() {
    # Build backend
    print_status "Building backend..."
    cd "$SCRIPT_DIR/backend"
    mvn clean package -DskipTests

    # Build frontend
    print_status "Building frontend..."
    cd "$SCRIPT_DIR/frontend"
    npm install
    npm run build

    # Build electron app
    print_status "Building electron app..."
    cd "$SCRIPT_DIR/electron-app"
    npm install
    npm run build

    cd "$SCRIPT_DIR"
}

# Function to run in development mode
run_dev() {
    print_status "Starting in development mode..."
    
    # Start backend
    cd "$SCRIPT_DIR/backend"
    mvn spring-boot:run &
    BACKEND_PID=$!

    # Wait for backend to start
    sleep 5

    # Start electron app
    cd "$SCRIPT_DIR/electron-app"
    npm run dev &
    ELECTRON_PID=$!

    # Function to cleanup processes on exit
    cleanup() {
        print_status "Shutting down..."
        kill $BACKEND_PID 2>/dev/null
        kill $ELECTRON_PID 2>/dev/null
        exit 0
    }

    # Set up trap for cleanup
    trap cleanup SIGINT SIGTERM

    # Wait for either process to exit
    wait $BACKEND_PID $ELECTRON_PID
}

# Function to run in production mode
run_prod() {
    print_status "Starting in production mode..."
    
    # Start backend
    cd "$SCRIPT_DIR/backend"
    java -jar target/command-deck-backend.jar &
    BACKEND_PID=$!

    # Wait for backend to start
    sleep 5

    # Start electron app
    cd "$SCRIPT_DIR/electron-app"
    npm start &
    ELECTRON_PID=$!

    # Function to cleanup processes on exit
    cleanup() {
        print_status "Shutting down..."
        kill $BACKEND_PID 2>/dev/null
        kill $ELECTRON_PID 2>/dev/null
        exit 0
    }

    # Set up trap for cleanup
    trap cleanup SIGINT SIGTERM

    # Wait for either process to exit
    wait $BACKEND_PID $ELECTRON_PID
}

# Parse command line arguments
MODE="dev"
BUILD=0

while [[ $# -gt 0 ]]; do
    case $1 in
        --prod)
            MODE="prod"
            shift
            ;;
        --build)
            BUILD=1
            shift
            ;;
        --help)
            echo "Usage: $0 [--prod] [--build]"
            echo "  --prod   Run in production mode"
            echo "  --build  Build the project before running"
            exit 0
            ;;
        *)
            print_error "Unknown option: $1"
            exit 1
            ;;
    esac
done

# Main execution
check_prerequisites

if [ $BUILD -eq 1 ]; then
    build_project
fi

if [ "$MODE" = "prod" ]; then
    run_prod
else
    run_dev
fi 