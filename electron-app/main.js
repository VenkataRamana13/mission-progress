const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
let mainWindow;
let javaProcess;

// Configure logging
function log(message) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}`;
    console.log(logMessage);
    
    // Also write to a log file
    const logDir = path.join(process.env.HOME, '.local', 'share', 'command-deck');
    const logFile = path.join(logDir, 'electron.log');
    
    try {
        if (!fs.existsSync(logDir)) {
            fs.mkdirSync(logDir, { recursive: true });
        }
        fs.appendFileSync(logFile, logMessage + '\n');
    } catch (err) {
        console.error('Failed to write to log file:', err);
    }
}

// Ensure required directories exist
function ensureDirectories() {
    const dataDir = path.join(process.env.HOME, '.local', 'share', 'command-deck');
    log('Checking data directory: ' + dataDir);
    log('Current working directory: ' + process.cwd());
    log('App path: ' + app.getAppPath());
    log('User data path: ' + app.getPath('userData'));
    
    if (!fs.existsSync(dataDir)) {
        log('Creating data directory: ' + dataDir);
        try {
            fs.mkdirSync(dataDir, { recursive: true });
            log('Data directory created successfully');
        } catch (err) {
            log('Error creating data directory: ' + err.message);
            throw err;
        }
    } else {
        log('Data directory already exists');
    }
    
    // Log environment variables
    log('=== Environment Variables ===');
    Object.entries(process.env).forEach(([key, value]) => {
        if (key.toLowerCase().includes('home') || key.toLowerCase().includes('path')) {
            log(`${key}: ${value}`);
        }
    });
}

function checkBackendHealth() {
    return new Promise((resolve) => {
        const req = http.get('http://localhost:8085/api/missions', (res) => {
            if (res.statusCode === 200) {
                resolve(true);
            } else {
                resolve(false);
            }
        });
        req.on('error', () => {
            resolve(false);
        });
        req.end();
    });
}

async function waitForBackend(retries = 20, interval = 1000) {
    for (let i = 0; i < retries; i++) {
        console.log(`Attempting to connect to backend (attempt ${i + 1}/${retries})...`);
        const isHealthy = await checkBackendHealth();
        if (isHealthy) {
            console.log('Backend is ready!');
            return true;
        }
        await new Promise(resolve => setTimeout(resolve, interval));
    }
    console.error('Backend failed to start');
    return false;
}

function startJavaBackend() {
    return new Promise((resolve, reject) => {
        const fs = require('fs');
        
        // Try multiple possible locations for the JAR
        const possibleJarPaths = [
            path.join(process.resourcesPath, 'command-deck.jar'),
            path.join(__dirname, '..', 'target', 'command-deck.jar'), // For development
            path.join(process.cwd(), 'target', 'command-deck.jar')    // Another fallback
        ];

        let jarPath = null;
        for (const testPath of possibleJarPaths) {
            log('Checking JAR path: ' + testPath);
            if (fs.existsSync(testPath)) {
                jarPath = testPath;
                log('Found JAR at: ' + jarPath);
                break;
            }
        }

        if (!jarPath) {
            const error = 'JAR file not found in any of these locations: ' + possibleJarPaths.join(', ');
            log(error);
            reject(new Error(error));
            return;
        }

        log('Starting Java backend using JAR at: ' + jarPath);
        
        javaProcess = spawn('java', ['-jar', jarPath]);

        javaProcess.stdout.on('data', (data) => {
            log(`Backend stdout: ${data}`);
        });

        javaProcess.stderr.on('data', (data) => {
            log(`Backend stderr: ${data}`);
        });

        javaProcess.on('error', (err) => {
            log('Failed to start Java backend: ' + err.message);
            reject(err);
        });

        javaProcess.on('exit', (code, signal) => {
            if (code !== 0) {
                const error = `Backend exited with code ${code}, signal: ${signal}`;
                log(error);
                reject(new Error(error));
            }
        });

        // Wait a bit before starting health checks
        setTimeout(() => resolve(), 2000);
    });
}

async function createWindow() {
    try {
        // Ensure directories exist before starting the backend
        ensureDirectories();
        await startJavaBackend();
        const backendReady = await waitForBackend();
        if (!backendReady) {
            throw new Error('Backend failed to start');
        }
        
        mainWindow = new BrowserWindow({
            width: 1200,
            height: 800,
            webPreferences: {
                nodeIntegration: false,
                contextIsolation: true
            },
            icon: path.join(process.resourcesPath, 'commandDesk.png')
        });

        // Open DevTools by default (for debugging)
        mainWindow.webContents.openDevTools();

        try {
            // Get the correct path to index.html
            let indexPath;
            if (app.isPackaged) {
                // When running in AppImage
                indexPath = path.join(app.getAppPath(), 'index.html');
                
                // Fallback paths if the above doesn't exist
                if (!fs.existsSync(indexPath)) {
                    const alternativePaths = [
                        path.join(process.resourcesPath, 'app', 'index.html'),
                        path.join(__dirname, 'index.html')
                    ];
                    
                    for (const altPath of alternativePaths) {
                        if (fs.existsSync(altPath)) {
                            indexPath = altPath;
                            break;
                        }
                    }
                }
            } else {
                // Development mode
                indexPath = path.join(__dirname, 'index.html');
            }
            
            log('Loading frontend from: ' + indexPath);
            if (!fs.existsSync(indexPath)) {
                throw new Error(`index.html not found at ${indexPath}`);
            }
            
            await mainWindow.loadFile(indexPath);
            log('Frontend loaded successfully');
        } catch (err) {
            console.error('Failed to load frontend:', err);
            log('Failed to load frontend: ' + err.message);
            mainWindow.webContents.executeJavaScript(`
                document.body.innerHTML = '<div style="padding: 20px; font-family: Arial, sans-serif;">
                    <h2>Error Loading CommandDeck</h2>
                    <p>Failed to load the application. Please check the logs or restart the application.</p>
                    <pre>${err.message}</pre>
                </div>';
            `);
        }

        mainWindow.on('closed', function () {
            mainWindow = null;
        });
    } catch (err) {
        console.error('Failed to create window:', err);
        app.quit();
    }
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function () {
    if (mainWindow === null) {
        createWindow();
    }
});

app.on('before-quit', () => {
    if (javaProcess) {
        javaProcess.kill();
    }
}); 