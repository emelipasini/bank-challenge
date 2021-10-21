import { Request, Response } from "express";

import { Account } from "../../domain/account";
import { Currency } from "../../domain/currency.enum";

import accountsDB from "../../database/accounts";

export async function createAccount(req: Request, res: Response) {
    try {
        const userId = req.query.userId;

        const arsAccount = new Account(userId as string, Currency.ARS);
        const usdAccount = new Account(userId as string, Currency.USD);

        await accountsDB.saveAccount(arsAccount);
        await accountsDB.saveAccount(usdAccount);

        const response = {
            message: "User created succesfully",
            accounts: [
                {
                    type: "ARS",
                    cbu: arsAccount.cbu,
                },
                {
                    type: "USD",
                    cbu: usdAccount.cbu,
                },
            ],
        };

        res.status(200).json(response);
    } catch (error) {
        return res.status(500).json(error);
    }
}
