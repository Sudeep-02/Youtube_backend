import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/coudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findOne(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating Refresh and Access Token"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  // Get user details from front end or postman
  // validation like valid email or not empty/
  // check if user already exists? - check email or username either should be unique
  // Check for images, check for avatar
  // upload iamges to cloudinary,
  // get the url from cloudinary and
  // create user object for db creation for user - create entry in db
  // after sending object to create user entry, i get response back containing all details which i sent to create
  // so remove encrypted  password and refresh token field from response
  // check for user creation response if null then send turns?

  const { fullname, email, username, password } = req.body;
  console.log("email", email);

  // if (fullname === "") {
  //   throw new ApiError(400, "Fullname is required");
  // }

  if (
    [fullname, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (existedUser) {
    throw new ApiError(409, " user with Username or email already exists");
  }
  const avatarLocalPath = req.files?.avatar[0]?.path; // files from multer
  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }
  const uploadAvatar = await uploadOnCloudinary(avatarLocalPath);
  const uploadCoverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!uploadAvatar) {
    throw new ApiError(400, "Avatar file is required");
  }

  const user = await User.create({
    fullname,
    avatar: uploadAvatar,
    coverImage: uploadCoverImage ? uploadCoverImage : " ",
    email,
    password,
    username: username.toLowerCase(),
  });
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Failed to register user");
  }
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered successfuuly"));
});

const loginUser = asyncHandler(async (req, res) => {
  //req body ->
  // username or email check
  //find the user or email in db
  // then password check
  // generate and access and refresh token
  //send through cookies
  const { email, username, password } = req.body;

  if (!email && !username) {
    throw new ApiError(400, "Please enter Username or Email to login");
  }

  const user = await User.findOne({
    // it fetch all data in db // here refresh token is empty
    $or: [{ username }, { email }],
  });
  if (!user) {
    throw new ApiError(
      400,
      "User does not exist , Please make sure Username or email is correct"
    );
  }

  console.log(user.isPasswordCorrect(password));

  //When checking the password, remember that the password in the database is encrypted. Therefore, when I call compare in bcrypt, it handles decryption and comparison automatically, so there's no need for manual decryption.
  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );
  // here we can do below step or update user instance on line 110
  //like user.refresh = refreshToken
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      // why this ? when above does same thing? in case user want to save cookie in his local storage
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in Successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out"));
});

export { registerUser, loginUser, logoutUser };
