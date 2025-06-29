#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default values
MODE="dev"
BUILD=false
FRONTEND_PID=""
BACKEND_PID=""
ELECTRON_PID=""

# Function to print colored output
print_message() {
    local color=$1
    local message=$2
    echo -e "${color}${message}${NC}"
}

# Function to check if a command exists
check_command() {
    if ! command -v $1 &> /dev/null; then
        print_message "$RED" "Error: $1 is required but not installed."
        exit 1
    fi
}

# Function to check prerequisites
check_prerequisites() {
    print_message "$BLUE" "Checking prerequisites..."
    check_command "node"
    check_command "npm"
    check_command "java"
    check_command "mvn"
}

# Function to build the project
build_project() {
    print_message "$BLUE" "Building project..."
    
    # Build frontend
    print_message "$YELLOW" "Building frontend..."
    cd frontend
    npm install
    npm run build
    cd ..
    
    # Build backend
    print_message "$YELLOW" "Building backend..."
    cd backend
    mvn clean package
    cd ..
    
    # Build electron app
    print_message "$YELLOW" "Building electron app..."
    cd electron-app
    npm install
    cd ..
}

# Function to start the development servers
start_dev() {
    # Start frontend
    print_message "$YELLOW" "Starting frontend development server..."
    cd frontend
    npm run dev &
    FRONTEND_PID=$!
    cd ..
    
    # Start backend
    print_message "$YELLOW" "Starting backend development server..."
    cd backend
    mvn spring-boot:run &
    BACKEND_PID=$!
    cd ..
    
    # Start electron app
    print_message "$YELLOW" "Starting electron app..."
    cd electron-app
    NODE_ENV=development npm start &
    ELECTRON_PID=$!
    cd ..
}

# Function to start production servers
start_prod() {
    # Start backend
    print_message "$YELLOW" "Starting backend server..."
    cd backend
    java -jar target/*.jar &
    BACKEND_PID=$!
    cd ..
    
    # Start electron app
    print_message "$YELLOW" "Starting electron app..."
    cd electron-app
    NODE_ENV=production npm start &
    ELECTRON_PID=$!
    cd ..
}

# Function to cleanup processes
cleanup() {
    print_message "$YELLOW" "Cleaning up processes..."
    
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null
    fi
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null
    fi
    if [ ! -z "$ELECTRON_PID" ]; then
        kill $ELECTRON_PID 2>/dev/null
    fi
    
    print_message "$GREEN" "Cleanup complete"
    exit 0
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --mode)
            MODE="$2"
            shift
            shift
            ;;
        --build)
            BUILD=true
            shift
            ;;
        *)
            print_message "$RED" "Unknown option: $1"
    exit 1
            ;;
    esac
done

# Set up cleanup trap
trap cleanup SIGINT SIGTERM

# Check prerequisites
check_prerequisites

# Build if requested
if [ "$BUILD" = true ]; then
    build_project
fi

# Start servers based on mode
if [ "$MODE" = "dev" ]; then
    print_message "$GREEN" "Starting in development mode..."
    start_dev
elif [ "$MODE" = "prod" ]; then
    print_message "$GREEN" "Starting in production mode..."
    start_prod
else
    print_message "$RED" "Invalid mode: $MODE"
    exit 1
fi

print_message "$GREEN" "All services started. Press Ctrl+C to stop."

# Wait for all background processes
wait 