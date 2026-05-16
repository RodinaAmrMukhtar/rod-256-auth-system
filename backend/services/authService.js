const bcrypt = require("bcryptjs");

const {
  generateId,
  findUserByUsername,
  findUserByUsernameOrEmail,
  insertUser
} = require("../utils/storage");

const { createLedgerBlock } = require("./ledgerService");
const { signAuthToken } = require("../utils/rsaJwt");

async function registerUser(username, email, password, ipAddress) {
  const existingUser = await findUserByUsernameOrEmail(username, email);

  if (existingUser) {
    await createLedgerBlock(username, "REGISTER", "FAILED_USER_ALREADY_EXISTS", ipAddress);

    return {
      success: false,
      message: "Username or email already exists"
    };
  }

  const passwordHash = bcrypt.hashSync(password, 10);

  const newUser = {
    id: generateId("user"),
    username,
    email,
    passwordHash,
    role: "USER",
    createdAt: new Date().toISOString()
  };

  await insertUser(newUser);

  const block = await createLedgerBlock(username, "REGISTER", "SUCCESS", ipAddress);

  return {
    success: true,
    message: "User registered successfully",
    user: {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role
    },
    ledgerBlock: block
  };
}

async function loginUser(username, password, ipAddress) {
  const user = await findUserByUsername(username);

  if (!user) {
    await createLedgerBlock(username, "LOGIN", "FAILED_USER_NOT_FOUND", ipAddress);

    return {
      success: false,
      message: "Invalid username or password"
    };
  }

  const passwordIsCorrect = bcrypt.compareSync(password, user.passwordHash);

  if (!passwordIsCorrect) {
    await createLedgerBlock(username, "LOGIN", "FAILED_WRONG_PASSWORD", ipAddress);

    return {
      success: false,
      message: "Invalid username or password"
    };
  }

  const token = signAuthToken(user);

  const block = await createLedgerBlock(username, "LOGIN", "SUCCESS_RSA_TOKEN_CREATED", ipAddress);

  return {
    success: true,
    message: "Login successful. RSA-signed JWT token created.",
    tokenType: "RSA-signed JWT",
    algorithm: "RS256",
    token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    },
    ledgerBlock: block
  };
}

module.exports = {
  registerUser,
  loginUser
};
