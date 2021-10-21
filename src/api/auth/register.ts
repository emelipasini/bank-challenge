import { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";

import { User } from "../../domain/user";

import usersDB from "../../database/users";

export async function register(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const userFromBody = req.query as any as User;

        const password = await bcrypt.hash(userFromBody.password, 10);
        const user = new User(
            userFromBody.firstname,
            userFromBody.lastname,
            userFromBody.email,
            password
        );

        await usersDB.addUser(user);

        req.query.userId = (user as any)._id;
        next();
    } catch (error) {
        return res.status(500).json(error);
    }
}
