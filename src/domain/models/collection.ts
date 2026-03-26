import { z } from "zod";
import { Film } from "./film";

export interface Collection {
    name: string;
    path: string;
    films: Film[];
}

export const ZCollection = z.object({
    name: z.string(),
    path: z.string(),
    films: z.array(
        z.object({
            id: z.string(),
            name: z.string(),
            path: z.string(),
            info: z.object({
                camera: z.string(),
                lens: z.string(),
                filmStock: z.string(),
                shotISO: z.string(),
                filmStockExpiration: z.string(),
            }),
            images: z.array(
                z.object({
                    id: z.string(),
                    filmId: z.string(),
                    name: z.string(),
                    ext: z.string(),
                    path: z.string(),
                }),
            ),
        }),
    ),
});
