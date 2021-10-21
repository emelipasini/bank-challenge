import { Request, Response } from "express";

import accountsDB from "../../database/accounts";
import usersDB from "../../database/users";

export async function transfer(req: Request, res: Response) {
    try {
        const { from, to, amount, pin } = req.query;
        const userInfo = req.query.userInfo;

        const accountFrom = await accountsDB.findAccount(from as string);
        const accountTo = await accountsDB.findAccount(to as string);
        const user = await usersDB.findUser((userInfo as any).email);

        if (Number(amount) > 10000) {
            if (user.pin !== pin) {
                return res
                    .status(400)
                    .json({ message: "The pin is not correct" });
            }
        }

        if (!accountFrom.owner.equals(user._id)) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        if (!accountFrom || !accountTo) {
            return res.status(404).json({ message: "Account not found" });
        }

        if (accountFrom.currency !== accountTo.currency) {
            return res.status(406).json({
                message:
                    "Cannot be transferred to accounts of a different currency",
            });
        }

        if (accountFrom.availableMoney < amount) {
            return res.status(400).json({
                message: "You don't have enough money in that account",
            });
        }

        await accountsDB.transfer(
            from as string,
            to as string,
            amount as unknown as number
        );

        res.status(200).json({ message: "Transfer accepted" });
    } catch (error) {
        return res.status(500).json(error);
    }
}
