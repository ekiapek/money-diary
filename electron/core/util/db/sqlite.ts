import { appDirectory } from "../../common/constants";
import { join } from "path";
import { knex } from "knex";
import type { Knex } from "knex";
import { logger } from "../logging/winston";
import { stat } from "fs";
import pkg from "../../../../package.json";

stat(appDirectory, (err) => {
  if (err) logger.error(pkg.name + " folder not found");
  else logger.info(pkg.name + " folder found");
});

const config: Knex.Config = {
  client: "sqlite3",
  connection: {
    filename: join(appDirectory, "storage.db"),
  },
  useNullAsDefault: true,
};

export const db = knex(config);

db.schema.hasTable("wallet").then((exists) => {
    if (!exists) {
        logger.warn("wallet table not found. creating...");
        db.schema
            .createTable("wallet", (table) => {
                table.uuid("id").primary();
                table.string("name").notNullable().unique();
                table.string("description");
                table.double("balance");
                table.string("icon");
                table.string("color");
                table.dateTime("createdAt");
                table.dateTime("updatedAt");
                table.boolean("isDeleted");
            })
            .catch((err) => logger.error("Failed creating wallet table. reason : " + err.message));
    } else {
        logger.info("wallet table already exists. not creating new one.");
    }
});

db.schema.hasTable("categories").then((exists) => {
    if (!exists) {
        logger.warn("categories table not found. creating...");
        db.schema
            .createTable("categories", (table) => {
                table.uuid("id").primary();
                table.string("name").notNullable().unique();
                table.string("description");
                table.string("icon");
                table.string("color");
                table.dateTime("createdAt");
                table.dateTime("updatedAt");
                table.boolean("isDeleted");
            })
            .catch((err) => logger.error("Failed creating categories table. reason : " + err.message));
    } else {
        logger.info("categories table already exists. not creating new one.");
    }
});

db.schema.hasTable("transactions").then((exists) => {
    if (!exists) {
        logger.warn("transactions table not found. creating...");
        db.schema
            .createTable("transactions", (table) => {
                table.uuid("id").primary();
                table.string("name").notNullable().unique();
                table.string("description");
                table.string("icon");
                table.string("color");
                table.double("amount").notNullable();
                table.integer("type").notNullable();
                table.uuid("walletId");
                table.uuid("categoryId");
                table.dateTime("createdAt");
                table.dateTime("updatedAt");
                table.boolean("isDeleted");
            })
            .catch((err) => logger.error("Failed creating transactions table. reason : " + err.message));
    } else {
        logger.info("transactions table already exists. not creating new one.");
    }
});