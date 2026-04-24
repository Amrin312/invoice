import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
};

export const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    if(!name || !email || !password){
        return res.status(400).json({message: "Please fill all fields!"});
    }

    try{

        //check if user exists

        const userExists = await User.findOne({email});

        if(userExists){
            return res.status(400).json({message: "User already exists!"});
        }

        const user = await User.create({name, email, password});

        if(user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id)
            });
        }else{
            res.status(400).json({message: "Invalid user data!"});
        }
        
    }catch(err){
        res.status(500).json({message: "Server Error", Error: err.message});
    }
};

export const loginUser = async (req, res) => {
    const { name, email, password } = req.body;

    try{
        const user = await User.findOne({email}).select("+password");

        if(user && await user.matchPassword(password)){
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id),

                businessName: user.businessName || '',
                address: user.address || '',
                phone: user.phone || '',
            });

        }else{
            res.status(401).json({message: "Invalid credentials!"});
        }

    }catch(err){
        res.status(500).json({message: "Server Error", Error: err.message});
    }
};

export const getMe = async (req, res) => {
    try{
        const user = await User.findById(req.user.id);

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,

            businessName: user.businessName || '',
            address: user.address || '',
            phone: user.phone || '',
        });

    }catch(err){
        res.status(500).json({message: "Server Error"});
    }
};

export const updateUserProfile = async (req, res) => {
    try{
        const user = await User.findById(req.user.id);

        if(user){
            user.name = req.body.name || user.name;
            user.businessName = req.body.businessName || user.businessName;
            user.address = req.body.address || user.address;
            user.phone = req.body.phone || user.phone;

            const updatedUser = await user.save();
            const { _id, name, email, businessName, address, phone } = updatedUser;
            res.json({
                _id: _id,
                name: name,
                email: email,
                businessName: businessName,
                address: address,
                phone: phone
            });
        }else{
            res.status(401).json({message: "User not found!"})
        }

    }catch(err){
        res.status(500).json({message: "Server Error", Error: err.message});
    }
};