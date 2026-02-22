export interface IImageProcessing {
    getTmpFolder(): Promise<string>;
    transformToJPG(inputPath: string, outputPath: string): Promise<void>;
}
