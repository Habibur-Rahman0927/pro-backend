import asyncHandler from 'express-async-handler';
import User from '../models/useraModel.js';
import generateToken from '../utils/genarateToken.js';

// @desc Auth user & get token
// @route POST /api/users/login
// @access Public
const userAuth = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email })
    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id)
        })
    } else {
        res.status(401);
        throw new Error("Invalid email or password")
    }
});


// @desc get user profile
// @route GET /api/users/profile
// @access Private
const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)
    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        })
    } else {
        res.status(404);
        throw new Error('User not found')
    }
});


// @desc Auth user & get token
// @route POST /api/users/login
// @access Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email })
    if (userExists) {
        res.status(400);
        throw new Error("User already exists");
    }
    const user = await User.create({
        name,
        email,
        password
    })
    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id)

        })
    }
    else {
        res.status(400)
        throw new Error('User not found');
    }
});

// @desc update user profile
// @route PUT /api/users/profile
// @access Private
const updataUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)
    if (user) {
        user.name = req.body.name || user.name
        user.email = req.body.email || user.email
        if (req.body.password) {
            user.password = req.body.password
        }
        const updataUser = await user.save()
        res.json({
            _id: updataUser._id,
            name: updataUser.name,
            email: updataUser.email,
            isAdmin: updataUser.isAdmin,
            token: generateToken(updataUser._id)
        })
    } else {
        res.status(404);
        throw new Error('User not found')
    }
});


// @desc get all user
// @route GET /api/users/profile
// @access Private/admin
const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find({})
    res.json(users)

});

// @desc delete useer
// @route DELETE /api/users/:id
// @access Private/admin
const deleteUsers = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
        await user.remove();
        res.json({ message: 'User removed' })
    } else {
        res.status(404)
        throw new Error('User not found')
    }
});

// @desc get  user by ID
// @route GET /api/users/:id
// @access Private/admin
const getUsersById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select('-password');
    if (user) {
        res.json(user)
    } else {
        res.status(404)
        throw new Error('User not found')
    }

});



// @desc update user 
// @route PUT /api/users/:id
// @access Private/admin
const updataUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id)
    if (user) {
        user.name = req.body.name || user.name
        user.email = req.body.email || user.email
        user.isAdmin = req.body.isAdmin;
        const updataUser = await user.save()
        res.json({
            _id: updataUser._id,
            name: updataUser.name,
            email: updataUser.email,
            isAdmin: updataUser.isAdmin,
        })
    } else {
        res.status(404);
        throw new Error('User not found')
    }
});


export { userAuth, getUserProfile, registerUser, updataUserProfile, getUsers, deleteUsers, updataUser, getUsersById }