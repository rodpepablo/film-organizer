import { z } from "zod";
export interface Album {
    name: string;
}

export const ZAlbum = z.object({
    name: z.string(),
});
