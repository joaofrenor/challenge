import { places } from '@prisma/client';
import { hash } from 'bcryptjs';

import prisma from '../prisma';
import AppError from '../errors/AppError';

interface Request {
  name: string;
}

export default class CreatePlaceService {
  public async execute({ name }: Request): Promise<places> {
    const checkPlaceExists = await prisma.places.findOne({ where: { name } });

    if (checkPlaceExists) {
      throw new AppError('Place already exists');
    }

    const place = await prisma.places.create({ data: { name } });

    return place;
  }
}
