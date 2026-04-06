const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const prisma = require('../lib/prisma');

class AuthService {
  generateTokens(user) {
    const payload = { id: user.id, email: user.email, role: user.role, status: user.status };
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: process.env.JWT_ACCESS_EXPIRY });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRY });
    return { accessToken, refreshToken };
  }

  async login(email, password) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw { status: 401, message: 'Invalid email or password' };
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) throw { status: 401, message: 'Invalid email or password' };
    if (user.status === 'inactive') throw { status: 403, message: 'Account is inactive' };
    const tokens = this.generateTokens(user);
    return { ...tokens, user: { id: user.id, email: user.email, role: user.role } };
  }

  async refreshAccessToken(refreshToken) {
    try {
      const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      const user = await prisma.user.findUnique({ where: { id: payload.id } });
      if (!user) throw new Error();
      if (user.status === 'inactive') throw { status: 403, message: 'Account is inactive' };
      return this.generateTokens(user);
    } catch (err) {
      if (err.status) throw err;
      throw { status: 401, message: 'Invalid or expired refresh token' };
    }
  }

  async hashPassword(password) {
    return await bcrypt.hash(password, 10);
  }
}
module.exports = new AuthService();
