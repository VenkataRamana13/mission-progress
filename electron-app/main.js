const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const http = require('http');
let mainWindow;
let javaProcess;

function checkBackendHealth() {
    return new Promise((resolve) => {
        const req = http.get('http://localhost:8085', (res) => {
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
            console.log('Checking JAR path:', testPath);
            if (fs.existsSync(testPath)) {
                jarPath = testPath;
                break;
            }
        }

        if (!jarPath) {
            console.error('JAR file not found in any of these locations:', possibleJarPaths);
            console.log('Contents of resources directory:', fs.readdirSync(process.resourcesPath));
            reject(new Error('JAR file not found'));
            return;
        }

        console.log('Starting Java backend using JAR at:', jarPath);
        
        javaProcess = spawn('java', ['-jar', jarPath]);

        javaProcess.stdout.on('data', (data) => {
            console.log(`Backend stdout: ${data}`);
        });

        javaProcess.stderr.on('data', (data) => {
            console.error(`Backend stderr: ${data}`);
        });

        javaProcess.on('error', (err) => {
            console.error('Failed to start Java backend:', err);
            reject(err);
        });

        javaProcess.on('exit', (code, signal) => {
            if (code !== 0) {
                console.error(`Backend exited with code ${code}, signal: ${signal}`);
                reject(new Error(`Backend exited with code ${code}`));
            }
        });

        // Wait a bit before starting health checks
        setTimeout(() => resolve(), 2000);
    });
}

async function createWindow() {
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
        await mainWindow.loadURL('http://localhost:8085');
        console.log('Frontend loaded successfully');
    } catch (err) {
        console.error('Failed to load frontend:', err);
        mainWindow.webContents.executeJavaScript(`
            document.body.innerHTML = '<div style="padding: 20px; font-family: Arial, sans-serif;">
                <h2>Error Loading CommandDeck</h2>
                <p>Failed to connect to the backend. Please check the logs or restart the application.</p>
                <pre>${err.message}</pre>
            </div>';
        `);
    }

    mainWindow.on('closed', function () {
        mainWindow = null;
    });
}

app.on('ready', async () => {
    try {
        await startJavaBackend();
        const backendReady = await waitForBackend();
        if (!backendReady) {
            throw new Error('Backend failed to start');
        }
        await createWindow();
    } catch (err) {
        console.error('Failed to start application:', err);
        app.quit();
    }
});

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