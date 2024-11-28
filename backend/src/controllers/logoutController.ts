import { Request, Response } from "express";
import RefreshToken from "../models/RefreshToken.js";

export const handleLogout = async (req: Request, res: Response): Promise<void> => {
  // On client, also delete the accessToken

  const cookies = req.cookies;
  //req.cookies contain only the refreshToken because i use in the createUser and in the loginUser this one
  // res.cookie("refreshToken", refreshToken, {
  //    httpOnly: true,
  //    sameSite: "none",
  //    secure: Boolean(process.env.production),
  //    maxAge: 30 * 24 * 60 * 60 * 1000,
  //  });

  if (!cookies?.refreshToken) {
    res.sendStatus(204); // successsfull request because that's what we want to make and if there isn't refreshToken that's okay
    return;
  }
  
  // Is refreshToken in database?
  try {
    // Delete the refresh token from the database
    const deleteRefreshToken = await RefreshToken.findOneAndDelete({
      userId: req.user._id,
    });
    if (!deleteRefreshToken) {
      res.status(404).json({ message: "Refresh Token not deleted" });
    }
    console.log(deleteRefreshToken, " : deleteRefreshToken");
  } catch (error) {
    console.error("Error deleting refresh token:", error);
    res.sendStatus(500); // Internal server error
    return;
  }

  // Clear the refresh token cookie
  res.clearCookie("refreshToken", {
    httpOnly: true, // Protect against XSS attacks
    sameSite: "none",
    secure: Boolean(process.env.production),
  });

  res.sendStatus(204);
  return;
};
