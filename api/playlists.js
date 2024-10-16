const express = require('express');
const router = express.Router();
module.exports = router;

const prisma = require('../prisma');

app.use('/tracks', require('./api/tracks'));

router.get('/', async (req, res, next) => {
  try {
    const playlists = await prisma.playlist.findMany();
    res.json(playlists);
  } catch (e) {
    next(e);
  }
});

router.get('/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const playlist = await prisma.playlist.findUnique({
      where: { id: +id },
      include: { tracks: true },
    });
    if (playlist) {
      res.json(playlist);
    } else {
      next({ status: 404, message: `${id} playlist doesn't exist.` });
    }
  } catch (e) {
    next(e);
  }
});

router.post('/', async (req, res, next) => {
  const { id } = req.params;
  const { name, description, trackIds, ownerId } = req.body;

  if (!name || !description) {
    return next({
      status: 400,
      message: 'Both fields must be provided.',
    });
  }

  try {
    const track = trackIds.map((id) => ({ id: +id }));
    const playlist = await prisma.playlist.create({
      data: {
        name,
        description,
        ownerId: +ownerId,
        trackId: +trackIds,
        track: { connect: track },
      },
      include: {
        owner: true,
        track: true,
      },
    });
    res.status(201).json(playlist);
  } catch (e) {
    next(e);
  }
});
