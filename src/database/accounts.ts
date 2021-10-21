import { Collection, MongoClient } from "mongodb";
import config from "config";

import { Account } from "../domain/account";
import { Movement } from "../domain/movement";
import { Currency } from "../domain/currency.enum";
import { FixedTerm } from "../domain/fixed-term";

let accounts: Collection;

export default class accountsDB {
    static async injectDB(conn: MongoClient) {
        if (accounts) {
            return;
        }
        try {
            accounts = conn.db(config.get("dbName")).collection("accounts");
        } catch (e) {
            console.error(
                `Unable to establish collection handles in users database: ${e}`
            );
        }
    }

    static async saveAccount(account: Account) {
        try {
            await accounts.insertOne(account);
        } catch (e) {
            console.error(`Error occurred while saving account, ${e}`);
            return { error: e };
        }
    }

    static async findAccount(cbu: string) {
        try {
            return await accounts.findOne({ cbu });
        } catch (e) {
            console.error(`Error occurred while saving account, ${e}`);
            return { error: e };
        }
    }

    static async findUserARSAccount(userId: string) {
        try {
            return await accounts.findOne({
                owner: userId,
                currency: Currency.ARS,
            });
        } catch (e) {
            console.error(`Error occurred while saving account, ${e}`);
            return { error: e };
        }
    }

    static async findUserUSDAccount(userId: string) {
        try {
            return await accounts.findOne({
                owner: userId,
                currency: Currency.USD,
            });
        } catch (e) {
            console.error(`Error occurred while saving account, ${e}`);
            return { error: e };
        }
    }

    static async createFixedTerm(
        cbu: string,
        amount: number,
        since: string,
        until: string
    ) {
        try {
            const fixedTerm: FixedTerm = {
                amount: amount,
                startDate: since,
                endDate: until,
            };
            const extract: Movement = {
                cbu: "to fixed term",
                amount: -Number(amount),
                timestamp: new Date().toISOString(),
            };
            await accounts.updateOne(
                { cbu: cbu },
                {
                    $inc: {
                        availableMoney: -Number(amount),
                    },
                    $push: {
                        fixedTerms: fixedTerm,
                        movements: extract,
                    },
                }
            );
        } catch (e) {
            console.error(`Error occurred while saving account, ${e}`);
            return { error: e };
        }
    }

    static async deleteFixedTerm(
        cbu: string,
        amount: number,
        startDate: string
    ) {
        try {
            const deposit: Movement = {
                cbu: "fixed term cancelled",
                amount: Number(amount),
                timestamp: new Date().toISOString(),
            };
            await accounts.updateOne(
                { cbu: cbu },
                {
                    $inc: {
                        availableMoney: Number(amount),
                    },
                    $push: {
                        movements: deposit,
                    },
                    $pull: {
                        fixedTerms: { startDate },
                    },
                }
            );
        } catch (e) {
            console.error(`Error occurred while saving account, ${e}`);
            return { error: e };
        }
    }

    static async exchange(
        cbuARS: string,
        cbuUSD: string,
        amountARS: number,
        amountUSD: number
    ) {
        try {
            const extract: Movement = {
                cbu: cbuARS,
                amount: -Number(amountARS),
                timestamp: new Date().toISOString(),
            };
            await accounts.updateOne(
                { cbu: cbuARS },
                {
                    $inc: {
                        availableMoney: -Number(amountARS),
                    },
                    $push: {
                        movements: extract,
                    },
                }
            );

            const deposit: Movement = {
                cbu: cbuUSD,
                amount: Number(amountUSD),
                timestamp: new Date().toISOString(),
            };
            await accounts.updateOne(
                { cbu: cbuUSD },
                {
                    $inc: {
                        availableMoney: Number(amountUSD),
                    },
                    $push: {
                        movements: deposit,
                    },
                }
            );
        } catch (e) {
            console.error(`Error occurred while saving account, ${e}`);
            return { error: e };
        }
    }

    static async transfer(from: string, to: string, amount: number) {
        try {
            const extract: Movement = {
                cbu: to,
                amount: -Number(amount),
                timestamp: new Date().toISOString(),
            };
            await accounts.updateOne(
                { cbu: from },
                {
                    $inc: {
                        availableMoney: -Number(amount),
                    },
                    $push: {
                        movements: extract,
                    },
                }
            );

            const deposit: Movement = {
                cbu: from,
                amount: Number(amount),
                timestamp: new Date().toISOString(),
            };
            await accounts.updateOne(
                { cbu: to },
                {
                    $inc: {
                        availableMoney: Number(amount),
                    },
                    $push: {
                        movements: deposit,
                    },
                }
            );
        } catch (e) {
            console.error(`Error occurred while transfering money, ${e}`);
            return { error: e };
        }
    }

    static async deposit(cbu: string, amount: number) {
        try {
            const movement: Movement = {
                cbu: "test",
                amount: Number(amount),
                timestamp: new Date().toISOString(),
            };
            accounts.updateOne(
                { cbu: cbu },
                {
                    $inc: {
                        availableMoney: Number(amount),
                    },
                    $push: {
                        movements: movement,
                    },
                }
            );
        } catch (e) {
            console.error(`Error occurred while saving account, ${e}`);
            return { error: e };
        }
    }
}
