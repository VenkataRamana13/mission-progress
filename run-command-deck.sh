#!/bin/bash

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

# Change to the script directory
cd "$SCRIPT_DIR"

# Check if Java is installed
if ! command -v java &> /dev/null; then
    echo "Java is not installed. Please install Java 17 or later."
    exit 1
fi

# Check if JAR exists
if [ ! -f "command-deck.jar" ]; then
    echo "Error: command-deck.jar not found in $SCRIPT_DIR"
    exit 1
fi

# Run the application
nohup java -jar command-deck.jar > /dev/null 2>&1 &

echo "CommandDeck is starting..."
sleep 2
echo "CommandDeck is running in the background." 