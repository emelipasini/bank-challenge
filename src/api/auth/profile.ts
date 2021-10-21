import { Request, Response } from "express";

import accountsDB from "../../database/accounts";
import usersDB from "../../database/users";

export async function getProfile(req: Request, res: Response) {
    try {
        const userInfo = req.query.userInfo;
        const user = await usersDB.findUser((userInfo as any).email);

        const account: any = await accountsDB.findUserARSAccount(user._id);
        let { error } = account;
        if (error) {
            return res.status(401).json({ error });
        }

        const fiveDaysAgo = new Date();
        fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);
        const lastMovements = [];
        for (const movement of account.movements) {
            if (movement.timestamp > fiveDaysAgo.toISOString()) {
                lastMovements.push(movement);
            }
        }

        const days: Record<number, any> = {
            0: [],
            1: [],
            2: [],
            3: [],
            4: [],
            5: [],
        };
        for (let i = 0; i < 6; i++) {
            const date = new Date();
            date.setDate(date.getDate() - i);

            for (const movement of lastMovements) {
                movement.timestamp = new Date(movement.timestamp);

                if (movement.timestamp.getDate() === date.getDate()) {
                    days[i].push(movement);
                }
            }
        }

        const finalBalance = [];
        for (const key in days) {
            let balance: number = 0;

            if (days[key].length === 0) {
                continue;
            }

            for (const movement of days[key]) {
                balance += movement.amount;
            }

            finalBalance.push({
                day: days[key][0].timestamp,
                balance: balance,
            });
        }

        let response: Record<string, any> = {
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            account: {
                cbu: account.cbu,
                currency: "ARS",
                availableMoney: account.availableMoney,
            },
            lastWeekBalance: finalBalance,
        };

        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json(error);
    }
}
