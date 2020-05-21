import fs from 'fs';
import path from 'path';
import uploadConfig from '../config/upload';
import AppError from '../errors/AppError';
import { places } from '@prisma/client';
import prisma from '../prisma';

interface Request {
  id: number;
  placeFilename: string;
}

export default class UpdatePlaceImageService {
  public async execute({ id, placeFilename }: Request): Promise<places> {
    const place = await prisma.places.findOne({
      where: { id },
    });

    if (!place) {
      throw new AppError('Place does not exists', 401);
    }

    if (place.image_url) {
      const placeImageFilePath = path.join(
        uploadConfig.directory,
        place.image_url,
      );

      const placeImageFileExists = await fs.promises.stat(placeImageFilePath);

      if (placeImageFileExists) {
        await fs.promises.unlink(placeImageFilePath);
      }
    }

    const editedPlace = await prisma.places.update({
      where: { id },
      data: { image_url: placeFilename },
    });

    return editedPlace;
  }
}
