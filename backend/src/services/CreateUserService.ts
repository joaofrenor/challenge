import { users } from '@prisma/client';
import { hash } from 'bcryptjs';

import prisma from '../prisma';
import AppError from '../errors/AppError';

interface Request {
  name?: string;
  email: string;
  password: string;
}

export default class CreateUserService {
  public async execute({ name, email, password }: Request): Promise<users> {
    const checkUserExists = await prisma.users.findOne({ where: { email } });

    if (checkUserExists) {
      throw new AppError('Email already exists');
    }

    const hashedPassword = await hash(password, 8);

    const user = await prisma.users.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return user;
  }
}
