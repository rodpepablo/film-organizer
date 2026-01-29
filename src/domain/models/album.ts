import { z } from "zod";

export interface Album {
    name: string;
    path: string;
}

export const ZAlbum = z.object({
    name: z.string(),
    path: z.string(),
});
