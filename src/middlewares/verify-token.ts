import { NextFunction, Request, Response } from "express";

import { User } from "../domain/user";

export function tokenMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
) {
    if (!req.get("Authorization")) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const userJwt = req.get("Authorization").slice("Bearer ".length);
    const userInfo: any = User.validateToken(userJwt);

    let { error } = userInfo;
    if (error) {
        return res.status(401).json({ error });
    }

    req.query.userInfo = userInfo;
    next();
}
