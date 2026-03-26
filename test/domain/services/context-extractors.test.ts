import { describe, it, expect } from "vitest";
import {
    FilmInfoExtractor,
    ContextPropExtractorError,
    FilmIndexExtractor,
    ImageIndexExtractor,
} from "../../../src/domain/services/context-extractors";
import { aCollection, aFilm, anImage } from "../../test-util/fixtures";

describe("Context extractors", () => {
    describe("Image index extractor", () => {
        it("Should expose correct template element", () => {
            expect(new ImageIndexExtractor().templateElement).toEqual("ii");
        });

        it("Should extract the information from the collection", () => {
            const film = aFilm();
            const image1 = anImage({ filmId: film.id });
            const image2 = anImage({ filmId: film.id });
            film.images = [image1, image2];
            const anotherFilm = aFilm();
            const collection = aCollection({ films: [film, anotherFilm] });

            const extractor = new ImageIndexExtractor();

            expect(extractor.extract(collection, image1)).toEqual("1");
            expect(extractor.extract(collection, image2)).toEqual("2");
        });

        it("Should raise an error if the film is not found for the image", () => {
            const image = anImage();
            const film = aFilm({ images: [image] });
            const collection = aCollection({ films: [film] });

            const extractor = new ImageIndexExtractor();

            expect(() => extractor.extract(collection, image)).toThrow(
                ContextPropExtractorError,
            );
        });
    });

    describe("Film index extractor", () => {
        it("Should expose correct template element", () => {
            expect(new FilmIndexExtractor().templateElement).toEqual("fi");
        });

        it("Should extract the information from the collection", () => {
            const film = aFilm();
            const anotherFilm = aFilm();
            const image = anImage({ filmId: film.id });
            film.images = [image];
            const collection = aCollection({ films: [anotherFilm, film] });

            const extractor = new FilmIndexExtractor();

            expect(extractor.extract(collection, image)).toEqual("2");
        });

        it("Should raise an error if film is not found", () => {
            const image = anImage();
            const film = aFilm({ images: [image] });
            const collection = aCollection({ films: [film] });

            const extractor = new FilmIndexExtractor();

            expect(() => extractor.extract(collection, image)).toThrow(
                ContextPropExtractorError,
            );
        });
    });

    describe("Film Info extractor", () => {
        it("Should expose correct template element depending on configuration", () => {
            expect(new FilmInfoExtractor("c", "camera").templateElement).toEqual("c");
            expect(new FilmInfoExtractor("iso", "shotISO").templateElement).toEqual(
                "iso",
            );
        });

        it("Should extract the information from the collection", () => {
            const film = aFilm();
            const image = anImage({ filmId: film.id });
            film.images = [image];
            const collection = aCollection({ films: [film] });

            const cameraExtractor = new FilmInfoExtractor("c", "camera");
            const filmExtractor = new FilmInfoExtractor("f", "filmStock");

            expect(cameraExtractor.extract(collection, image)).toEqual(
                film.info.camera,
            );
            expect(filmExtractor.extract(collection, image)).toEqual(
                film.info.filmStock,
            );
        });

        it("Should raise an error if film is not found", () => {
            const image = anImage();
            const film = aFilm({ images: [image] });
            const collection = aCollection({ films: [film] });

            const extractor = new FilmInfoExtractor("c", "camera");

            expect(() => extractor.extract(collection, image)).toThrow(
                ContextPropExtractorError,
            );
        });
    });
});
