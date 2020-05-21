import { compare } from 'bcryptjs';
import { users } from '@prisma/client';
import { sign } from 'jsonwebtoken';

import AppError from '../errors/AppError';
import prisma from '../prisma';
import authConfig from '../config/auth';

interface Request {
  email: string;
  password: string;
}
interface Response {
  user: users;
  token: string;
}

export default class AuthenticateUserService {
  public async execute({ email, password }: Request): Promise<Response> {
    const user = await prisma.users.findOne({ where: { email } });

    if (!user) {
      throw new AppError('Incorrect email/password combination');
    }

    const passwordMatched = await compare(password, user.password);

    if (!passwordMatched) {
      throw new AppError('Incorrect email/password combination');
    }

    const token = sign({}, authConfig.jwt.secret, {
      subject: String(user.id),
      expiresIn: authConfig.jwt.expiresIn,
    });

    return { user, token };
  }
}
