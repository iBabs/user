import { Router } from 'express';
import { check } from 'express-validator';
import { register, login, getUser } from '../controller/userController.js';
import  validate  from '../middleware/validation.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.post(
    '/auth/register',
    [
        check('firstName').not().isEmpty().withMessage('First name is required'),
        check('lastName').not().isEmpty().withMessage('Last name is required'),
        check('email').isEmail().withMessage('Email is invalid'),
        check('password').not().isEmpty().withMessage('Password is required'),
    ],
    validate,
    register
);

router.post(
    '/auth/login',
    [
        check('email').isEmail().withMessage('Email is invalid'),
        check('password').not().isEmpty().withMessage('Password is required'),
    ],
    validate,
    login
);

router.get('/api/user/:userId', authenticate, getUser)

export default router;
