import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
// Models
import { User } from '../models/user'
// Utils
import { BadRequestError, validateRequest } from '@opasnikod/common';

const router = express.Router();

router.post('/api/users/signup',
    [body('email').isEmail().withMessage('email is not valid'),
    body('password').trim().isLength({ min: 4, max: 20 }).withMessage('Password must be min 4 characters, and max 20')],
    validateRequest,
    async (req: Request, res: Response) => {
        const { email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new BadRequestError(`User with email: ${email} already exists`);
        }

        const user = User.build({ email, password })
        await user.save();

        // Generate JWT
        const userJwt = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_KEY!);
        req.session = {
            jwt: userJwt
        }
        res.status(201).send(user);
    })

export { router as signupRouter };