import { app, BrowserWindow, protocol, session } from "electron";
import path from "path";
import loadServices from "./domain/services";

const createWindow = (): void => {
    const mainWindow = new BrowserWindow({
        height: 800,
        width: 1200,
        webPreferences: {
            preload: path.join(__dirname, "../preload/index.js"),
        },
    });

    if (process.env.ELECTRON_RENDERER_URL) {
        mainWindow.loadURL(process.env.ELECTRON_RENDERER_URL);
    } else {
        mainWindow.loadFile(path.join(__dirname, "../renderer/index.html"));
    }

    mainWindow.webContents.openDevTools();
};

app.whenReady().then(() => {
    // Dynamically set content policies (CPS) so that it doesn't
    // interfere with webpacks dev server
    session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
        const isDev = process.env.NODE_ENV === "development";

        callback({
            responseHeaders: {
                ...details.responseHeaders,
                "Content-Security-Policy": [
                    isDev
                        ? "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: ws:; img-src 'self' data: safe-file:;"
                        : "default-src 'self' 'unsafe-inline'; img-src 'self' data: safe-file:;",
                ],
            },
        });
    });

    // Register save file protocol for loading the images in the app
    protocol.registerFileProtocol("safe-file", (request, callback) => {
        const url = new URL(request.url);
        callback({ path: url.pathname });
    });

    // load services
    loadServices();
    createWindow();
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
