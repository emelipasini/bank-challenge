import { Request, Response } from "express";

import accountsDB from "../../database/accounts";
import usersDB from "../../database/users";

export async function deleteFixedTerm(req: Request, res: Response) {
    try {
        const fixedTerm = req.query as any;
        const userInfo = req.query.userInfo;
        const user = await usersDB.findUser((userInfo as any).email);

        const account: any = await accountsDB.findUserARSAccount(user._id);
        let { error } = account;
        if (error) {
            return res.status(401).json({ error });
        }

        const FEE = 20;
        fixedTerm.amount = fixedTerm.amount - (FEE * fixedTerm.amount) / 100;

        await accountsDB.deleteFixedTerm(
            account.cbu,
            fixedTerm.amount,
            fixedTerm.startDate
        );

        return res
            .status(200)
            .json({ message: "Fixed term cancelled successfully" });
    } catch (error) {
        return res.status(500).json(error);
    }
}
