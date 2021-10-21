import { Request, Response } from "express";

import accountsDB from "../../database/accounts";
import usersDB from "../../database/users";

export async function exchange(req: Request, res: Response) {
    try {
        const { amount } = req.query;
        const userInfo = req.query.userInfo;

        if (Number(amount) > 200) {
            return res.status(400).json({
                message:
                    "Bad Request: You can't buy more than USD200 per month",
            });
        }

        const user = await usersDB.findUser((userInfo as any).email);
        const arsAccount: any = await accountsDB.findUserARSAccount(user._id);
        const usdAccount: any = await accountsDB.findUserUSDAccount(user._id);

        let { errorArs } = arsAccount;
        let { errorUsd } = usdAccount;
        if (errorArs || errorUsd) {
            const error = errorArs || errorUsd;
            return res.status(401).json({ error });
        }

        const USD_PRICE = 150;
        const amountToPay = Number(amount) * USD_PRICE;

        if (arsAccount.availableMoney < amountToPay) {
            return res.status(400).json({
                message:
                    "Bad Request: You don't have enough money in your account",
            });
        }

        const now = new Date();
        const month = now.getMonth();
        const year = now.getFullYear();
        const monthTransactions = [];

        for (const movement of usdAccount.movements) {
            const movementYear = new Date(movement.timestamp).getFullYear();
            const movementMonth = new Date(movement.timestamp).getMonth();

            if (movementYear === year && movementMonth === month) {
                monthTransactions.push(movement);
            }
        }

        let totalBought = 0;
        for (const transaction of monthTransactions) {
            totalBought += transaction.amount;
        }
        if (totalBought + Number(amount) > 200) {
            return res.status(400).json({
                message:
                    "Bad Request: You can't buy more than USD200 per month",
            });
        }

        await accountsDB.exchange(
            arsAccount.cbu,
            usdAccount.cbu,
            amountToPay,
            Number(amount)
        );

        return res.status(200).json({ message: "Transaction completed" });
    } catch (error) {
        return res.status(500).json(error);
    }
}
