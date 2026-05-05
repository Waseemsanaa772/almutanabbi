import { registerRoot, Composition, AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, interpolate, Img, staticFile, Audio } from 'remotion';

const Scene1 = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const durationPerImage = fps * 3; // 3 ثواني لكل صورة
  const imageIndex = Math.min(Math.floor(frame / durationPerImage), 3); // 0-3
  const imageFile = `${imageIndex + 1}.png`;
  const progressInImage = frame % durationPerImage;
  // تأثير zoom بطيء (من 1 إلى 1.1)
  const scale = interpolate(progressInImage, [0, durationPerImage], [1, 1.08]);
  // تأثير fade للصورة عند ظهورها (اختياري)
  const opacity = interpolate(progressInImage, [0, 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  
  return (
    <AbsoluteFill style={{ backgroundColor: 'black' }}>
      <Img src={staticFile(`images/${imageFile}`)} style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        transform: `scale(${scale})`,
        opacity
      }} />
      <Audio src={staticFile('audio/scene1.mp3')} />
    </AbsoluteFill>
  );
};

const Scene2 = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const durationPerImage = fps * 3; // 3 ثواني لكل صورة
  const imageIndex = Math.min(Math.floor(frame / durationPerImage), 5); // 0-5
  const imageFile = `${imageIndex + 5}.png`;
  const progressInImage = frame % durationPerImage;
  const scale = interpolate(progressInImage, [0, durationPerImage], [1, 1.08]);
  const opacity = interpolate(progressInImage, [0, 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  
  return (
    <AbsoluteFill style={{ backgroundColor: 'black' }}>
      <Img src={staticFile(`images/${imageFile}`)} style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        transform: `scale(${scale})`,
        opacity
      }} />
      <Audio src={staticFile('audio/scene2.mp3')} />
    </AbsoluteFill>
  );
};

const FullFilm = () => {
  const { fps } = useVideoConfig();
  const scene1Duration = fps * 3 * 4; // 4 صور * 3 ثواني = 12 ثانية
  const scene2Duration = fps * 3 * 6; // 6 صور * 3 ثواني = 18 ثانية
  return (
    <>
      <Sequence from={0} durationInFrames={scene1Duration}>
        <Scene1 />
      </Sequence>
      <Sequence from={scene1Duration} durationInFrames={scene2Duration}>
        <Scene2 />
      </Sequence>
    </>
  );
};

registerRoot(() => (
  <Composition
    id="MyComp"
    component={FullFilm}
    durationInFrames={(12 + 18) * 30}
    fps={30}
    width={1080}
    height={1920}
  />
));
