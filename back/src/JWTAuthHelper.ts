import { Express } from "express";
import express from 'express';
import mongoose from 'mongoose';
import passport from 'passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import LoginInfo from "./models/LoginInfo.js";
dotenv.config();

// Set up passport-jwt strategy
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'secret',
    expiresIn: '5h'
};
export const VerifyLoginInfo = () => {
    return passport.authenticate('jwt', { session: false })
}

export default function JwtAuthHelper(app: Express,) {

    passport.use(new Strategy(jwtOptions, async (payload, done) => {
        try {
            const info = await LoginInfo.findById(payload.sub);
            if (info) {
                return done(null, info);
            } else {
                return done(null, false);
            }
        } catch (err) {
            return done(err, false);
        }
    }));
    app.use(passport.initialize());
    app.post('/auth/register', async (req, res) => {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ error: 'required both email and password' });
            }

            if ((await LoginInfo.findOne({ email }))) {
                return res.status(400).json({ error: 'email already exists' });
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const info = new LoginInfo({ email: email, password: hashedPassword });
            await info.save();
            res.status(200).json({ result: info, message: ' registered successfully' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Error registering user' });
        }
    });
    app.post('/auth/login', async (req, res) => {
        try {
            const { email, password } = req.body as any;
            const info = await LoginInfo.findOne({ email });
            if (!info) {
                return res.status(400).json({ error: 'email not exist exists' });
            }
            if (!(await bcrypt.compare(password, info.password as string))) {
                return res.status(401).json({ error: 'wrong password' });
            }
            const payload = { sub: info._id };
            const token = jwt.sign(payload, jwtOptions.secretOrKey, { expiresIn: jwtOptions.expiresIn });
            res.status(200).json({ message: 'Login successful', result: token });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Error logging in' });
        }
    });
    app.get('/auth/info', VerifyLoginInfo(), (req, res) => {
        res.status(200).json({ message: 'Authenticated user', result: req.user });
    });
}