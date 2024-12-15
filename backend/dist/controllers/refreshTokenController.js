import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import RefreshToken from "../models/RefreshToken.js"; // Import your RefreshToken model
dotenv.config();
export const handleRefreshToken = async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        res.status(401).json({ message: "Refresh token is required" });
        return;
    }
    try {
        // Check if the refresh token exists in the database
        const storedToken = await RefreshToken.findOne({ refreshToken });
        if (!storedToken) {
            res.status(403).json({ message: "Invalid refresh token" });
            return;
        }
        // Verify the refresh token
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                console.error("Refresh token verification failed:", err);
                res.sendStatus(403); // Invalid token
                return;
            }
            console.log("Decoded payload from refreshToken:", decoded);
            // Remove `exp` and add a new `iat` for the access token
            const { exp, ...newPayload } = decoded;
            newPayload.iat = Math.floor(Date.now() / 1000); // New issue time
            const accessToken = jwt.sign(newPayload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" } // Change to "1h" for extended testing if needed
            );
            console.log("New accessToken generated:", accessToken);
            res.json({ accessToken });
        });
    }
    catch (error) {
        console.error("Error in handleRefreshToken:", error);
        res.status(500).json({ message: "Server Error" });
    }
};
