import asyncHandler from 'express-async-handler';
import generateToken from '../utils/generateToken.js';
import User from '../models/userModel.js';

//  @desc   Auth user & get a token
//  @route  POST /api/users/login
//  @access Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

//  @desc   Register new user
//  @route  POST /api/users
//  @access Public
const registerUser = asyncHandler(async (req, res) => {
  const { email, password, name } = req.body;

  const userExist = await User.findOne({ email });

  if (userExist) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

//  @desc   Get user profile data
//  @route  GET /api/users/profile
//  @access Private
const getProfileData = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

//  @desc   Uptade user profile data
//  @route  PUT /api/users/profile
//  @access Private
const updateProfileData = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    const { name, email, password } = req.body;
    user.name = name || user.name;
    user.email = email || user.email;

    if (password) {
      user.password = password;
    }

    const updatedUser = await user.save();

    res.status(201).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

//  @desc   Get all users list as admin user
//  @route  GET /api/users
//  @access Private / Admin only
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

//  @desc   Remove user by ID
//  @route  DELETE /api/users/profile
//  @access Private / Admin only
const removeUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    await user.remove();
    res.json({
      message: 'User was removed',
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

//  @desc   Find user by ID
//  @route  GET /api/users/:id
//  @access Private / Admin only
const findUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

//  @desc   Uptade user by ID
//  @route  PUT /api/users/:id
//  @access Private / Admin only
const updateUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  console.log(user);
  if (user) {
    const { name, email, isAdmin } = req.body;
    user.name = name || user.name;
    user.email = email || user.email;
    user.isAdmin = typeof isAdmin === 'undefined' ? user.isAdmin : isAdmin;

    const updatedUser = await user.save();

    res.status(201).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

export {
  authUser,
  registerUser,
  getProfileData,
  updateProfileData,
  getUsers,
  removeUserById,
  findUserById,
  updateUserById,
};
