import fs from "fs";
import os from "os";
import { join } from "path";

export function createTemporalDirectory(): string {
    return fs.mkdtempSync(join(os.tmpdir(), "vitest"));
}

export function removeDirectory(directory: string) {
    fs.rmSync(directory, { recursive: true, force: true });
}

export function loadJSON<T>(file: string) {
    return JSON.parse(fs.readFileSync(file, "utf-8")) as T;
}

export function saveJSON(path: string, content: Object): void {
    fs.writeFileSync(path, JSON.stringify(content));
}

export function createFolder(...path: string[]): void {
    fs.mkdirSync(join(...path));
}

export function createDummyFile(...path: string[]): void {
    fs.writeFileSync(join(...path), "");
}
