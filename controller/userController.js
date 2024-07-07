
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/userModel.js';
import Organization from '../models/organizationModel.js';
import UserOrganization from '../models/userOrgModel.js';
import { v4 as uuidv4 } from 'uuid'

dotenv.config();

const register = async (req, res) => {
    const { firstName, lastName, email, password, phone } = req.body;
    try {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(422).json({
                errors: [{ field: 'email', message: 'Email already in use' }],
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ firstName, lastName, email, password: hashedPassword, phone });

        const orgName = `${firstName}'s Organisation`;
        const org = await Organization.create({ name: orgName });
        // await UserOrganization.create({ userId: user.userId, orgId: org.orgId });

        const token = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(201).json({
            status: 'success',
            message: 'Registration successful',
            data: {
                accessToken: token,
                user: {
                    userId: user.userId,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    phone: user.phone,
                },
            },
        });
    } catch (error) {
        console.log(error.message)
        res.status(400).json({ status: 'Bad request', message: 'Registration unsuccessful', statusCode: 400 });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ status: 'Bad request', message: 'Authentication failed', statusCode: 401 });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ status: 'Bad request', message: 'Authentication failed', statusCode: 401 });
        }

        const token = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({
            status: 'success',
            message: 'Login successful',
            data: {
                accessToken: token,
                user: {
                    userId: user.userId,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    phone: user.phone,
                },
            },
        });
    } catch (error) {
        res.status(400).json({ status: 'Bad request', message: 'Authentication failed', statusCode: 401 });
    }
};


const getUser = async (req, res) => {
    const { userId } = req.params;
    const { user } = req;

    console.log(user)
    // Check if the authenticated user is trying to access their own profile
    if (user.userId !== userId) {
        return res.status(403).json({
            status: 'error',
            message: 'Forbidden: You can only access your own profile'
        });
    }

    try {
        const userProfile = await User.findByPk(userId, {
            attributes: ['userId', 'firstName', 'lastName', 'email', 'phone']
        });

        if (!userProfile) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found'
            });
        }

        res.status(200).json({
            status: 'success',
            data: userProfile
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'An error occurred while retrieving the profile'
        });
    }
}

export { register, login, getUser };
