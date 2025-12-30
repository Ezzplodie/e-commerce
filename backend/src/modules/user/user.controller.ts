import { Request, Response, NextFunction } from "express";
import { UserService } from "./user.service";

const userService = new UserService();

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await userService.register(req.body);
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};
