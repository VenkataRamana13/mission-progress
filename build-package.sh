#!/bin/bash

# Exit on error
set -e

echo "🚀 Building CommandDeck Package..."

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
cd "$SCRIPT_DIR"

# Check for required tools
echo "📋 Checking requirements..."

if ! command -v java &> /dev/null; then
    echo "❌ Java not found. Please install Java 17 or later."
    exit 1
fi

if ! command -v mvn &> /dev/null; then
    echo "❌ Maven not found. Please install Maven."
    exit 1
fi

if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js."
    exit 1
fi

# Build Spring Boot application
echo "🔨 Building Java backend..."
mvn clean package -DskipTests

# Build Electron application
echo "🔨 Building Electron frontend..."
cd electron-app
npm install
npm run build
cd ..

# Create installation directory
INSTALL_DIR="/opt/command-deck"
echo "📦 Creating installation package..."

# Create AppImage directory if it doesn't exist
mkdir -p ~/.local/bin
mkdir -p ~/.local/share/applications
mkdir -p ~/.local/share/icons

# Copy AppImage to user's bin directory
cp electron-app/dist/*.AppImage ~/.local/bin/commanddeck.AppImage
chmod +x ~/.local/bin/commanddeck.AppImage

# Copy icon
cp commandDesk.png ~/.local/share/icons/commanddeck.png

# Create desktop entry in user's local applications
cat > ~/.local/share/applications/commanddeck.desktop << EOL
[Desktop Entry]
Version=1.0
Type=Application
Name=CommandDeck
Comment=Mission Progress Tracking Application
Exec=commanddeck.AppImage
Icon=commanddeck
Terminal=false
Categories=Utility;Development;
Keywords=mission;progress;tracking;
StartupWMClass=CommandDeck
EOL

echo "✅ Installation complete!"
echo "🎉 You can now launch CommandDeck from your application menu!" 