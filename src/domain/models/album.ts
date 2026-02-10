import { z } from "zod";
import { Film } from "./film";

export interface Album {
    name: string;
    path: string;
    films: Film[];
}

export const ZAlbum = z.object({
    name: z.string(),
    path: z.string(),
    films: z.array(
        z.object({
            id: z.string(),
            name: z.string(),
            path: z.string(),
            images: z.array(
                z.object({
                    id: z.string(),
                    name: z.string(),
                    ext: z.string(),
                    path: z.string(),
                }),
            ),
        }),
    ),
});
