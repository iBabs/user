import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import dotenv from 'dotenv';

dotenv.config()

const auth = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ message: 'Access Denied' });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).json({ message: 'Invalid Token' });
    }
};

export const authenticate = async (req, res, next) => {

    const { authorization } = req.headers;
    

    if (!authorization) {
        return res.status(401).json({ error: "Authorization Token Required" });
    }

    const token = authorization.split(' ')[1];
    if (!token) {
        return res.status(401).json({
            status: 'error',
            message: 'No token provided'
        });
    }

    try {
        const {userId} = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(401).json({
                status: 'error',
                message: 'Unauthorized'
            });
        }
        req.user = user;

        // console.log(req.user)
        next();

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            status: 'error',
            message: 'Failed to authenticate token'
        });
    }
};

export default auth;