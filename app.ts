import { MongoClient } from "mongodb";
import express from "express";
import cors from "cors";
import http from "http";
import config from "config";

import usersDB from "./src/database/users";
import accountsDB from "./src/database/accounts";

import { authController } from "./src/api/auth";
import { accountsController } from "./src/api/accounts";

import { tokenMiddleware } from "./src/middlewares/verify-token";
import { registerMiddleware } from "./src/middlewares/register";

export const app = express();
const server = http.createServer(app);

app.use(cors());

app.get("/profile", tokenMiddleware, authController.getProfile);
app.post(
    "/register",
    registerMiddleware,
    authController.register,
    accountsController.createAccount
);
app.post("/login", authController.login);
app.post("/logout", tokenMiddleware, authController.logout);

app.get("/account/movements", tokenMiddleware, accountsController.getMovements);
app.put("/account/deposit", accountsController.deposit);
app.put("/account/transfer", tokenMiddleware, accountsController.transfer);
app.put("/account/exchange", tokenMiddleware, accountsController.exchange);
app.post(
    "/account/fixed-term",
    tokenMiddleware,
    accountsController.createFixedTerm
);
app.delete(
    "/account/fixed-term",
    tokenMiddleware,
    accountsController.deleteFixedTerm
);

MongoClient.connect(config.get("dbURI"))
    .then(async (client) => {
        await usersDB.injectDB(client);
        await accountsDB.injectDB(client);
        server.listen("4200", () => {
            console.log("SERVER RUNNING IN PORT 4200...");
        });
    })
    .catch((err) => {
        console.error(err.stack);
        process.exit(1);
    });
