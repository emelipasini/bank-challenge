import { Request, Response } from "express";
import bcrypt from "bcryptjs";

import usersDB from "../../database/users";
import { User } from "../../domain/user";

export async function login(req: Request, res: Response) {
    try {
        const { email, password } = req.query as any as User;

        let userData = await usersDB.findUser(email);
        if (!userData) {
            return {
                status: 401,
                message: "Invalid credentials",
            };
        }

        const passwordIsValid = await bcrypt.compare(
            password,
            userData.password
        );
        if (!passwordIsValid) {
            return {
                status: 401,
                message: "Invalid credentials",
            };
        }

        const user = new User(
            userData.firstname,
            userData.lastname,
            userData.email
        );
        const jwt = user.generateToken();

        const response = {
            message: "User logged in",
            token: jwt,
        };

        res.status(200).json(response);
    } catch (error) {
        return res.status(500).json(error);
    }
}
