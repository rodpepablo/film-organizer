import fs from "fs";
import { join } from "path";
import { describe, it, expect, beforeEach, afterEach, Mocked } from "vitest";
import {
    createFolder,
    createTemporalDirectory,
    removeDirectory,
} from "../../test-util/file-system";
import SharpImageProcessing from "../../../src/infra/adapters/sharp-image-processing";
import sharp from "sharp";
import { mock } from "vitest-mock-extended";

let tmpDir: string;

beforeEach(() => {
    tmpDir = createTemporalDirectory();
});

afterEach(() => {
    removeDirectory(tmpDir);
});

describe("Sharp Image Processing", () => {
    describe("Get temporal folder", () => {
        it("Should create a film-organizer tmp folder if it doesnt exist", async () => {
            const sharpImageProcessing = new SharpImageProcessing(tmpDir);

            const folder = await sharpImageProcessing.getTmpFolder();

            const expectedFolder = join(tmpDir, "film-organizer");
            expect(folder).toEqual(expectedFolder);
            expect(fs.statSync(expectedFolder).isDirectory()).toBeTruthy();
        });

        it("Should not fail if folder already exists", async () => {
            createFolder(tmpDir, "film-organizer");
            const sharpImageProcessing = new SharpImageProcessing(tmpDir);

            const folder = await sharpImageProcessing.getTmpFolder();

            const expectedFolder = join(tmpDir, "film-organizer");
            expect(folder).toEqual(expectedFolder);
            expect(fs.statSync(expectedFolder).isDirectory()).toBeTruthy();
        });
    });

    it("Should create a jpg image of the input", async () => {
        const sharpImageProcessing = new TestableSharpImageProcessing(tmpDir);
        const inputpath = "/input/path.tif";
        const outputPath = "/output/path.jpg";

        await sharpImageProcessing.transformToJPG(inputpath, outputPath);

        const sharpMock = sharpImageProcessing.mock;
        expect(sharpImageProcessing.input).toEqual(inputpath);
        expect(sharpMock.jpeg).toHaveBeenCalledOnce();
        expect(sharpMock.toFile).toHaveBeenCalledWith(outputPath);
    });
});

class TestableSharpImageProcessing extends SharpImageProcessing {
    mock: Mocked<sharp.Sharp>;
    input: string;
    protected sharp(input: string): sharp.Sharp {
        this.input = input;
        const sharpMock = mock<sharp.Sharp>();
        sharpMock.jpeg.mockReturnThis();
        this.mock = sharpMock;
        return sharpMock;
    }
}
