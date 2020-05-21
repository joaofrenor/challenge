import { Router } from 'express';
import prisma from '../prisma';
import AppError from '../errors/AppError';

const voteRoutes = Router();

voteRoutes.get('/', async (req, res) => {
  try {
    const places = await prisma.places.findMany();

    return res.json(places);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

voteRoutes.post('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const place = await prisma.places.findOne({
      where: { id: Number(id) },
    });

    if (!place) {
      throw new AppError('Place does not exist');
    }

    const updatedPlace = await prisma.places.update({
      where: { id: Number(id) },
      data: {
        votes: place.votes + 1,
      },
    });

    return res.json(updatedPlace);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});
export default voteRoutes;
