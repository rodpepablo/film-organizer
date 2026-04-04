import { describe, expect, it } from "vitest";
import { Collection } from "../../src/domain/models/collection";
import MigrationManager, { Migration } from "../../src/infra/migration-manager";

describe("Migration Manager", () => {
    it("Should apply migrations", () => {
        const pastMigration = new Migration("0.0.1", (collection: Collection) => ({
            ...collection,
            app: "old-app-name",
        }));
        const migrationToBeApplied = new Migration(
            "0.0.10",
            (collection: Collection) => ({
                ...collection,
                name: "new version",
            }),
        );

        const migrationManager = new MigrationManager("0.0.11");
        migrationManager.registerMigrations(pastMigration, migrationToBeApplied);

        const collection = migrationManager.applyMigrations({
            version: "0.0.1",
            app: "film-organizer",
        } as Collection);

        expect(collection).toStrictEqual({
            version: "0.0.11",
            app: "film-organizer",
            name: "new version",
        });
    });
});
