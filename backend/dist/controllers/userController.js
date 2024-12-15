//Models
import User from "../models/User.js";
import RefreshToken from "../models/RefreshToken.js";
import jwt from "jsonwebtoken";
import { hashPassword } from "../utils/hashPassword.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
dotenv.config();
// Generate Access Token
const generateAccessToken = (user) => {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "15m",
    });
};
// Generate Refresh Token
const generateRefreshToken = async (user) => {
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "30d" });
    return refreshToken;
};
export const createUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password, imageUrl } = req.body;
        const newUser = new User({
            firstName,
            lastName,
            email,
            password,
            imageUrl,
        });
        if (!firstName) {
            res.status(400).json({ message: "firstName is required" });
            return;
        }
        if (!lastName) {
            res.status(400).json({ message: "lastName is required" });
            return;
        }
        if (!email) {
            res.status(400).json({ message: "Email is required" });
            return;
        }
        if (!req.file) {
            newUser.imageUrl = "default_avatar.png";
        }
        else {
            newUser.imageUrl = req.file.filename;
        }
        newUser.password = await hashPassword(password);
        const user = await newUser.save();
        if (!user) {
            res.status(400).json({ message: "User not created" });
            return;
        }
        const accessToken = generateAccessToken({
            _id: user._id.toString(),
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            imageUrl: user.imageUrl,
        });
        const refreshToken = await generateRefreshToken({
            _id: user._id.toString(),
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            imageUrl: user.imageUrl,
        });
        console.log(accessToken, ": access token");
        console.log(refreshToken, ": refresh token");
        // Store accesstoken token in cookie
        // res.setHeader('Set-Cookie', serialize('accessToken', accessToken, {
        //     httpOnly: true,
        //     secure: process.env.NODE_ENV === 'production',
        //     sameSite: 'strict',
        //     maxAge: 15 * 60 * 1000, // 15min -> 1000ms equal to 1second * 60 equal to 1minute * 15 equal to 15minute
        //     path: '/',
        // }));
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            sameSite: "none",
            secure: Boolean(process.env.production),
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });
        res.status(200).json({ accessToken, refreshToken, user });
        // Create a new instance of the RefreshToken model
        const newRefreshToken = new RefreshToken({
            userId: user._id,
            refreshToken: refreshToken,
            expiration: "30d",
        });
        // Save the instance to the database
        await newRefreshToken.save();
    }
    catch (error) {
        res.status(500).json({ message: error });
    }
};
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            res.status(400).json({ message: "Invalid Email or Password" });
            return;
        }
        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(400).json({ message: "Invalid Email or Password" });
            return;
        }
        const accessToken = generateAccessToken({
            _id: user._id.toString(),
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            imageUrl: user.imageUrl,
        });
        const refreshToken = await generateRefreshToken({
            _id: user._id.toString(),
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            imageUrl: user.imageUrl,
        });
        console.log(accessToken, ": access token");
        console.log(refreshToken, ": refresh token");
        // Store accesstoken token in cookie
        // res.setHeader('Set-Cookie', serialize('accessToken', accessToken, {
        //     httpOnly: true,
        //     secure: process.env.NODE_ENV === 'production',
        //     sameSite: 'strict',
        //     maxAge: 24 * 60 * 60, // 1 days
        //     path: '/home',
        // }));
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            sameSite: "none",
            secure: Boolean(process.env.production),
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });
        // Send access token and user info in response
        res.status(200).json({ accessToken, refreshToken, user });
        const refreshTokenExistant = await RefreshToken.findOne({
            userId: user._id,
        });
        if (!refreshTokenExistant) {
            // Create a new instance of the RefreshToken model
            new RefreshToken({
                userId: user._id,
                refreshToken: refreshToken,
                expiration: "30d",
            }).save();
        }
        else {
            // Create a new instance of the RefreshToken model
            await RefreshToken.findOneAndUpdate({
                userId: user._id,
            }, { refreshToken: refreshToken });
        }
    }
    catch (error) {
        console.error("Error in loginUser:", error);
        res.status(500).json({ message: "Server Error" });
    }
};
export const udpateUser = async (req, res) => {
    try {
        let data = req.body;
        // if (!data.firstName) {
        //     return res.status(400).json({ message: "firstName is required" });
        // }
        // if (!data.lastName) {
        //     return res.status(400).json({ message: "lastName is required" });
        // }
        // if (!data.email) {
        //     return res.status(400).json({ message: "Email is required" });
        // }
        // if (!data.password) {
        //     res.status(400).json({ message: "Password is required" });
        //     return;
        // }
        // if (!req.file) {
        //     return res.status(400).json({ message: "Image is required" });
        // }else{
        //     data.imageUrl = req.file.filename
        // };
        const updatedUser = await User.findByIdAndUpdate(req.params.id, data, {
            new: true,
        });
        if (!updatedUser) {
            return res.status(400).json({ message: "User not updated" });
        }
        res.status(200).json({ message: updatedUser });
    }
    catch (error) {
        res.status(500).json({ message: error });
    }
};
export const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            res.status(400).json({ message: "User not found" });
            return;
        }
        res.status(200).json({ user: user });
    }
    catch (error) {
        res.status(500).json({ message: error });
    }
};
export const getUsersByUserEmails = async (req, res) => {
    try {
        const { userIds } = req.body;
        const data = await User.find({ email: {
                $in: userIds,
            } });
        const users = data.map((user) => ({
            id: user._id,
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
            avatar: `${process.env.BASE_URL}${user.imageUrl}`,
        }));
        res.status(200).json({ users: users });
        return;
    }
    catch (error) {
        res.status(500).json({ message: "Failed when we try to getting the users", error });
        return;
    }
};
