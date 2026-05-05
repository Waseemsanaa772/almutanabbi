import { registerRoot, Composition, AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, Audio, Img, staticFile } from 'remotion';

const Scene1 = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const durationPerImage = fps * 2;
  const imageIndex = Math.min(Math.floor(frame / durationPerImage), 3);
  const imageFile = `${imageIndex + 1}.png`;

  return (
    <AbsoluteFill style={{ backgroundColor: 'black' }}>
      <Img src={staticFile(`images/${imageFile}`)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      <Audio src={staticFile('audio/scene1.mp3')} />
    </AbsoluteFill>
  );
};

const Scene2 = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const durationPerImage = fps * 2;
  const imageIndex = Math.min(Math.floor(frame / durationPerImage), 5);
  const imageFile = `${imageIndex + 5}.png`;

  return (
    <AbsoluteFill style={{ backgroundColor: 'black' }}>
      <Img src={staticFile(`images/${imageFile}`)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      <Audio src={staticFile('audio/scene2.mp3')} />
    </AbsoluteFill>
  );
};

const FullFilm = () => {
  const { fps } = useVideoConfig();
  return (
    <Sequence from={0} durationInFrames={fps * 8}>
      <Scene1 />
      <Sequence from={fps * 8} durationInFrames={fps * 12}>
        <Scene2 />
      </Sequence>
    </Sequence>
  );
};

registerRoot(() => (
  <Composition
    id="MyComp"
    component={FullFilm}
    durationInFrames={30 * 20}
    fps={30}
    width={1080}
    height={1920}
  />
));
// fixed
