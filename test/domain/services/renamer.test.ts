import { describe, it, expect } from "vitest";
import { aCollection, aFilm, anImage } from "../../test-util/fixtures";
import {
    NonInjectiveTemplateError,
    UnregisteredPropExtractorError,
    ImageRenamerService,
} from "../../../src/domain/services/renamer";

describe("Image Renamer Service", () => {
    it("Should rename images of a film", () => {
        const film = aFilm();
        const anotherFilm = aFilm();
        const image1 = anImage({ filmId: film.id });
        const image2 = anImage({ filmId: film.id });
        film.images = [image1, image2];
        film.info.camera = "Canon";
        film.info.lens = "50mm-f1.2";
        film.info.filmStock = "Ultramax400";
        film.info.shotISO = "125";
        film.info.filmStockExpiration = "2025";
        const collection = aCollection({ films: [anotherFilm, film] });

        const imageRenamerService = new ImageRenamerService(collection);

        const renamed = imageRenamerService.rename(
            film.images,
            "%c-%l-%fs-%iso-%fe-%fi-%ii",
        );

        expect(renamed[0].name).toEqual("Canon-50mm-f1.2-Ultramax400-125-2025-2-1");
        expect(renamed[1].name).toEqual("Canon-50mm-f1.2-Ultramax400-125-2025-2-2");
    });

    it("Sould raise an error if the template is not registered", () => {
        const film = aFilm();
        const image = anImage({ filmId: film.id });
        film.images = [image];
        const collection = aCollection({ films: [film] });

        const imageRenamerService = new ImageRenamerService(collection);

        expect(() => imageRenamerService.rename(film.images, "%xx")).toThrow(
            UnregisteredPropExtractorError,
        );
    });

    it("Should raise an error if the template generates duplicated names", () => {
        const film = aFilm();
        const image1 = anImage({ filmId: film.id, name: "image1" });
        const image2 = anImage({ filmId: film.id, name: "image2" });
        film.images = [image1, image2];
        const collection = aCollection({ films: [film] });

        const imageRenamerService = new ImageRenamerService(collection);

        expect(() => imageRenamerService.rename(film.images, "%fi")).toThrow(
            NonInjectiveTemplateError,
        );
    });

    it("Should provide a summary with the available extractors", () => {
        expect(ImageRenamerService.getAvailableOptions()).toStrictEqual([
            { name: "%ii", value: "Image index" },
            { name: "%fi", value: "Film index" },
            { name: "%c", value: "Camera" },
            { name: "%fs", value: "Film Stock" },
            { name: "%l", value: "Lens" },
            { name: "%iso", value: "Shot ISO" },
            { name: "%fe", value: "Film Stock Expiration" },
        ]);
    });
});
