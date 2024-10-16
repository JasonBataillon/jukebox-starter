const prisma = require('../prisma');

const seed = async (numUsers = 5, numPlaylists = 10, numTracks = 20) => {
  const users = Array.from({ length: numUsers }, (_, i) => ({
    username: `User ${i + 1}`,
  }));
  await prisma.user.createManyAndReturn({ data: users });

  const tracks = Array.from({ length: numtracks }, (_, j) => ({
    name: `Track ${j + 1}`,
  }));
  await prisma.track.createMany({ data: tracks });

  for (let i = 0; i < numPlaylists; i++) {
    const tracksTotal = 20 + Math.floor(Math.random() * numTracks);

    const track = Array.from({ length: tracksTotal }, () => ({
      id: 20 + Math.floor(Math.random() * numTracks),
    }));

    await prisma.playlist.create({
      data: {
        name: `Playlist ${track}`,
        description: `This is the ${ownerId}`,
        ownerId: 5 + Math.floor(Math.random() * numUsers),
        track: { connect: track },
      },
    });
  }
};
seed()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
