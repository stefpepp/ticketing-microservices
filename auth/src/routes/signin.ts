import express, { Request, Response, NextFunction } from 'express';
import { body } from 'express-validator';
import jwt from "jsonwebtoken";
//Handling erros
import { BadRequestError, validateRequest } from '@opasnikod/common';
// MODELS
import { User } from '../models/user';
import { Password } from '../services/password';

const router = express.Router();

router.post('/api/users/signin', [body('email').isEmail().withMessage('email is not valid'),
body('password').trim().notEmpty().withMessage('Password have to be filled')],
    validateRequest,
    async (req: Request, res: Response, next: NextFunction) => {
        const { email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            throw new BadRequestError(`Login failed`);
        }

        const passwordMatch = await Password.compare(existingUser.password, password);
        if (!passwordMatch) {
            throw new BadRequestError("Invalid credentials");
        }

        // Generate JWT
        const userJwt = jwt.sign({ id: existingUser.id, email: existingUser.email }, process.env.JWT_KEY!);
        req.session = {
            jwt: userJwt
        }

        res.status(200).send(existingUser);
    })

export { router as signinRouter };