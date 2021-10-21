import { Request, Response } from "express";

import accountsDB from "../../database/accounts";
import usersDB from "../../database/users";

export async function getMovements(req: Request, res: Response) {
    try {
        const userInfo = req.query.userInfo;
        const user = await usersDB.findUser((userInfo as any).email);

        const account: any = await accountsDB.findUserARSAccount(user._id);
        let { error } = account;
        if (error) {
            return res.status(401).json({ error });
        }
        account.movements = account.movements.reverse();

        const totalMovements = account.movements.length;
        let paged = 5;
        if (paged > totalMovements) {
            paged = totalMovements;
        }
        const totalPages = Math.ceil(totalMovements / paged);

        let { page } = req.query as any;
        let lastMovements = [];
        if (!page) {
            page = 1;
            lastMovements = account.movements.slice(0, paged);
        } else {
            let end = paged * page;
            let start = end - paged;

            if (end > totalMovements) {
                end = totalMovements;
                start = paged * (page - 1) + 1;
                if (start === end) {
                    start = end - 1;
                }
            }
            lastMovements = account.movements.slice(start, end);
        }

        let nextPage = `localhost:4200/account/movements?page=${page + 1}`;
        let previousPage = `localhost:4200/account/movements?page=${page - 1}`;
        if (page == 1) {
            previousPage = null;
        }
        if (page == totalPages) {
            nextPage = null;
        }

        const response = {
            meta: {
                nextPage,
                previousPage,
                amountShown: lastMovements.length,
                totalMovements: totalMovements,
                period: {
                    since: lastMovements[0].timestamp,
                    until: lastMovements[lastMovements.length - 1].timestamp,
                },
            },
            movements: lastMovements,
        };

        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json(error);
    }
}
