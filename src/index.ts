import { app, BrowserWindow, protocol, session } from "electron";
import path from "path";
import loadServices from "./domain/services";
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
    app.quit();
}

const createWindow = (): void => {
    const mainWindow = new BrowserWindow({
        height: 800,
        width: 1200,
        webPreferences: {
            preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
        },
    });

    mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

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
        const filePath = request.url.replace("safe-file://", "");
        callback(path.normalize(filePath));
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
