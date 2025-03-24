"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const migrator_1 = require("drizzle-orm/postgres-js/migrator");
const schema_1 = require("./schema");
(0, migrator_1.migrate)(schema_1.db, { migrationsFolder: "drizzle" })
    .then(() => {
    console.log("migrations finished!");
    process.exit(0);
})
    .catch((err) => {
    console.log(err);
    process.exit(1);
});
