import { Request, Response } from "express";

import accountsDB from "../../database/accounts";
import usersDB from "../../database/users";

export async function createFixedTerm(req: Request, res: Response) {
    try {
        const { amount, period } = req.query;
        const userInfo = req.query.userInfo;
        const user = await usersDB.findUser((userInfo as any).email);

        const account: any = await accountsDB.findUserARSAccount(user._id);
        let { error } = account;
        if (error) {
            return res.status(401).json({ error });
        }

        if (account.availableMoney < amount) {
            return res.status(400).json({
                message:
                    "Bad Request: You don't have enough money in your account",
            });
        }

        const since = new Date();
        const until = new Date();
        until.setDate(until.getDate() + Number(period));

        await accountsDB.createFixedTerm(
            account.cbu,
            Number(amount),
            since.toISOString(),
            until.toISOString()
        );

        return res
            .status(200)
            .json({ message: "Fixed term created successfully" });
    } catch (error) {
        return res.status(500).json(error);
    }
}
