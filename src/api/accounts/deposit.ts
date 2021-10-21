import { Request, Response } from "express";
import accountsDB from "../../database/accounts";

export async function deposit(req: Request, res: Response) {
    try {
        const { cbu, amount } = req.query;

        let account = await accountsDB.findAccount(cbu as string);
        if (!account) {
            res.status(400).json({ message: "Can't find the account" });
        }

        await accountsDB.deposit(cbu as string, amount as unknown as number);

        res.status(202).json({ message: "Deposit accepted" });
    } catch (error) {
        return res.status(500).json(error);
    }
}
