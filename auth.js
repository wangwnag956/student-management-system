function login(authService, username, password) {
  if (!username || !password) {
    return { success: false, message: "Username and password are required." };
  }

  const user = authService.authenticate(username, password);

  if (user) {
    return {
      success: true,
      message: `Welcome, ${user.name}!`,
      user
    };
  }

  return { success: false, message: "Invalid username or password." };
}

module.exports = { login };
