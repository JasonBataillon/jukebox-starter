const prisma = require('../prisma');
const numUser = 5 + Math.floor(Math.random() * 5);
const numPlaylist = 10 + Math.floor(Math.random() * 10);
const numTrack = 20 + Math.floor(Math.random() * 20);

const seed = async (
  numUsers = numUser,
  numPlaylists = numPlaylist,
  numTracks = numTrack
) => {
  const users = Array.from({ length: numUsers }, (_, i) => ({
    username: `User ${Math.floor(Math.random() * 100)}`,
  }));
  await prisma.user.createManyAndReturn({ data: users });

  const tracks = Array.from({ length: numTracks }, (_, j) => ({
    name: `Track ${j + 1}`,
  }));
  await prisma.track.createMany({ data: tracks });

  const playlists = Array.from({ length: numPlaylists }, (_, l) => {
    const ownerId = 1 + Math.floor(Math.random() * numUsers);
    return {
      name: `Playlist ${l + 1}`,
      description: `Anything for ${l + 1}.`,
      ownerId,
    };
  });
  await prisma.playlist.createMany({ data: playlists });

  for (let i = 0; i < numPlaylists; i++) {
    const tracksTotal = 20 + Math.floor(Math.random() * numTracks);

    const trackIds = Array.from({ length: tracksTotal }, () => ({
      id: 1 + Math.floor(Math.random() * numTracks),
    }));

    await prisma.playlist.update({
      where: { id: i + 1 },
      data: {
        tracks: { connect: trackIds.map((track) => ({ id: track.id })) },
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
