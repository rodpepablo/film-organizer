import sharp from "sharp";
import fs from "fs/promises";
import { join } from "path";
import { IImageProcessing } from "../../domain/ports/image-processing";

export default class SharpImageProcessing implements IImageProcessing {
    systemTmpPath: string;

    constructor(systemTmpPath: string) {
        this.systemTmpPath = systemTmpPath;
    }

    async getTmpFolder(): Promise<string> {
        const path = join(this.systemTmpPath, "film-organizer");
        await fs.mkdir(path, { recursive: true });

        return path;
    }

    async transformToJPG(inputPath: string, outputPath: string): Promise<void> {
        await this.sharp(inputPath).jpeg().toFile(outputPath);
    }

    protected sharp(input: string): sharp.Sharp {
        return sharp(input);
    }
}
