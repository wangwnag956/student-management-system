const { login } = require("./auth");

describe("Mock Object Framework - User Login", () => {
  test("logs in successfully when mock service returns a user", () => {
    const mockAuthService = {
      authenticate: jest.fn().mockReturnValue({
        id: 1,
        name: "Student"
      })
    };

    const result = login(mockAuthService, "student1", "123456");

    expect(mockAuthService.authenticate).toHaveBeenCalledWith(
      "student1",
      "123456"
    );
    expect(result.success).toBe(true);
    expect(result.message).toBe("Welcome, Student!");
  });

  test("rejects login when mock service returns null", () => {
    const mockAuthService = {
      authenticate: jest.fn().mockReturnValue(null)
    };

    const result = login(mockAuthService, "student1", "wrong-password");

    expect(result.success).toBe(false);
    expect(result.message).toBe("Invalid username or password.");
  });

  test("does not call authentication service if details are empty", () => {
    const mockAuthService = {
      authenticate: jest.fn()
    };

    const result = login(mockAuthService, "", "");

    expect(mockAuthService.authenticate).not.toHaveBeenCalled();
    expect(result.success).toBe(false);
  });
});
