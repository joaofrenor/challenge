import multer from 'multer';
import { Router, Request } from 'express';

import prisma from '../prisma';
import CreatePlaceService from '../services/CreatePlaceServices';
import uploadConfig from '../config/upload';
import UpdatePlaceImageService from '../services/UpdatePlaceImageService';
import AppError from '../errors/AppError';

const placesRouter = Router();

const upload = multer(uploadConfig);

placesRouter.post('/', async (req, res) => {
  try {
    const { name } = req.body;

    const createPlace = new CreatePlaceService();

    const place = await createPlace.execute({ name });

    return res.json(place);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

placesRouter.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const checkPlaceExists = await prisma.places.findOne({
      where: { id: Number(id) },
    });

    if (checkPlaceExists) {
      throw new AppError('Place does not exist');
    }

    await prisma.places.delete({ where: { id: Number(id) } });

    return res.json({ ok: true });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

placesRouter.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const place = await prisma.places.update({
      where: { id: Number(id) },
      data: { name },
    });

    return res.json(place);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

placesRouter.patch('/image/:id', upload.single('image'), async (req, res) => {
  try {
    const updatePlaceImage = new UpdatePlaceImageService();

    const place = await updatePlaceImage.execute({
      id: Number(req.params.id),
      placeFilename: req.file.filename,
    });

    return res.json(place);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

export default placesRouter;
