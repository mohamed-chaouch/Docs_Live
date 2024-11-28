import bcrypt from "bcryptjs";
export const hashPassword = async (password) => {
    try {
        const hashPassword = await bcrypt.hash(password, 10);
        return hashPassword;
    }
    catch (e) {
        throw new Error("Error hashing password");
    }
};
