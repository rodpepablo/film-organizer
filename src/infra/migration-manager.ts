import { Collection } from "../domain/models/collection";

export interface IMigration {
    version: string;
    migrator: (collection: Collection) => Collection;
}

export class Migration implements IMigration {
    version: string;
    migrator: (collection: Collection) => Collection;

    constructor(
        version: string,
        migrator: (collection: Collection) => Collection,
    ) {
        this.version = version;
        this.migrator = migrator;
    }
}

export interface IMigrationManager {
    currentVersion: string;
    migrations: IMigration[];
    registerMigrations(...migrations: IMigration[]): void;
    applyMigrations(collection: Collection): Collection;
}

export default class MigrationManager implements IMigrationManager {
    currentVersion: string;
    migrations: IMigration[];

    constructor(currentVersion: string) {
        this.currentVersion = currentVersion;
        this.migrations = [];
    }

    registerMigrations(...migrations: IMigration[]): void {
        migrations.forEach((migration) => this.migrations.push(migration));
    }

    applyMigrations(collection: Collection): Collection {
        return {
            ...this.migrations.reduce(
                (migrated: Collection, migration: Migration) => {
                    return migrated.version < migration.version
                        ? migration.migrator(migrated)
                        : migrated;
                },
                collection,
            ),
            version: this.currentVersion,
        };
    }
}
