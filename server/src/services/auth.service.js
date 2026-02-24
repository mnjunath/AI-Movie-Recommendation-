import User from "../models/User.js";
import bcrypt from "bcryptjs";

export const registerUser = async({ name, email, password }) => {
    if (!name || !email || !password){
        throw new Error ("All fields are required");
    }

    const existingUser = await User.findOne({ email });
    if(existingUser) {
        throw new Error ("user already exist");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        name,
        email,
        password: hashedPassword
    });

    return user;
}

export const loginUser = async({ email, password }) => {
    if(!email || !password) {
        throw new Error ("Email and password are required");
    }

    const user = await User.findOne({ email });
    if(!user) {
        throw new Error ("user does not exist");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) {
        throw new Error ("Invalid email or password");
    }

    return user;
}