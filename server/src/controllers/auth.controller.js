import { registerUser, loginUser } from "../services/auth.service.js";
import generateToken from "../utils/generateToken.js";
import User from "../models/User.js";

export const register = async(req, res) => {
    try {
        const user = await registerUser(req.body);

        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        res.status(400).json({message: error.message});
    }
};

export const login = async(req, res) => {
    try {
        const user = await loginUser(req.body);
        const token = generateToken(user._id);

        res.status(201).json({
            message: "login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        res.status(400).json({message: error.message});
    }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};