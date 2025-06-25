#!/bin/bash

# Exit on any error
set -e

# Define paths
INSTALL_DIR="/opt/command-deck"
DESKTOP_FILE_PATH="$HOME/.local/share/applications/CommandDeck.desktop"
APP_IMAGE_PATH="electron-app/dist/CommandDeck-1.0.0.AppImage"
ICON_PATH="commandDesk.png"

# Create installation directory
echo "Creating installation directory..."
sudo mkdir -p "$INSTALL_DIR"

# Copy files
echo "Copying application files..."
sudo cp "$APP_IMAGE_PATH" "$INSTALL_DIR/CommandDeck.AppImage"
sudo cp "$ICON_PATH" "$INSTALL_DIR/commandDesk.png"

# Create launcher script
echo "Creating launcher script..."
cat << EOF | sudo tee "$INSTALL_DIR/run-command-deck.sh"
#!/bin/bash
"$INSTALL_DIR/CommandDeck.AppImage" "\$@"
EOF

# Set permissions
echo "Setting permissions..."
sudo chmod +x "$INSTALL_DIR/CommandDeck.AppImage"
sudo chmod +x "$INSTALL_DIR/run-command-deck.sh"
sudo chmod 644 "$INSTALL_DIR/commandDesk.png"
sudo chown -R root:root "$INSTALL_DIR"

# Create desktop entry
echo "Creating desktop entry..."
mkdir -p "$HOME/.local/share/applications"
cat << EOF > "$DESKTOP_FILE_PATH"
[Desktop Entry]
Version=1.0
Type=Application
Name=CommandDeck
Comment=Mission Progress Tracking Application
Exec=$INSTALL_DIR/CommandDeck.AppImage
Icon=$INSTALL_DIR/commandDesk.png
Terminal=false
Categories=Utility;Development;
Keywords=mission;progress;tracking;
StartupWMClass=CommandDeck
EOF

# Set desktop file permissions
chmod +x "$DESKTOP_FILE_PATH"

echo "Installation complete! You should now see CommandDeck in your applications menu."
echo "If not, try logging out and back in, or run: update-desktop-database ~/.local/share/applications" 