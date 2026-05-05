import { registerRoot, Composition, AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, Audio, staticFile, Img } from 'remotion';
import { interpolate } from 'remotion';

// المشهد الأول: الطفولة في الكوفة (صور 1.png إلى 4.png)
const Scene1: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const durationPerImage = fps * 3; // 3 ثوانٍ لكل صورة
  const imageIndex = Math.min(Math.floor(frame / durationPerImage), 3); // 0,1,2,3
  const imageFile = `${imageIndex + 1}.png`;
  
  // تأثير الزووم البطيء
  const scale = interpolate(frame % durationPerImage, [0, durationPerImage], [1, 1.05]);
  // تأثير التلاشي عند بداية كل صورة
  const opacity = interpolate(frame % durationPerImage, [0, 15], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  
  return (
    <AbsoluteFill style={{ backgroundColor: 'black' }}>
      <Img src={staticFile(`images/${imageFile}`)} style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        transform: `scale(${scale})`,
        opacity
      }} />
      <AbsoluteFill style={{
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(0deg, rgba(0,0,0,0.5), rgba(0,0,0,0.2))',
      }}>
        <h1 style={{ color: '#ffd966', fontSize: 70, fontFamily: 'Cairo, sans-serif', textAlign: 'center', textShadow: '2px 2px 5px black' }}>
          {frame < durationPerImage * 1 ? 'الكوفة...' :
           frame < durationPerImage * 2 ? 'طفل استثنائي' :
           frame < durationPerImage * 3 ? 'نظرة تخترق الجدران' : 'المتنبي'}
        </h1>
      </AbsoluteFill>
      <Audio src={staticFile('audio/scene1.mp3')} />
    </AbsoluteFill>
  );
};

// المشهد الثاني: دعوى النبوة (صور 5.png إلى 10.png)
const Scene2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const durationPerImage = fps * 4; // 4 ثوانٍ لكل صورة
  const imageIndex = Math.min(Math.floor(frame / durationPerImage), 5); // 0..5
  const imageFile = `${imageIndex + 5}.png`;
  
  const scale = interpolate(frame % durationPerImage, [0, durationPerImage], [1, 1.08]);
  const brightness = interpolate(frame % durationPerImage, [0, durationPerImage], [1, 1.15]);
  
  return (
    <AbsoluteFill>
      <Img src={staticFile(`images/${imageFile}`)} style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        transform: `scale(${scale})`,
        filter: `brightness(${brightness})`
      }} />
      <AbsoluteFill style={{
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: 100,
        background: 'linear-gradient(0deg, rgba(0,0,0,0.7), transparent)',
      }}>
        <p style={{ color: 'white', fontSize: 35, maxWidth: '80%', textAlign: 'center', fontFamily: 'Cairo', textShadow: '1px 1px 3px black' }}>
          "لم يكن كاذباً... بل كان يصدق ما يقول"
        </p>
      </AbsoluteFill>
      <Audio src={staticFile('audio/scene2.mp3')} />
    </AbsoluteFill>
  );
};

// الفيلم الكامل
const AlMutanabbiFilm: React.FC = () => {
  const { fps } = useVideoConfig();
  const scene1Duration = fps * 3 * 4;  // 12 ثانية
  const scene2Duration = fps * 4 * 6;  // 24 ثانية
  
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
    component={AlMutanabbiFilm}
    durationInFrames={ (3*4 + 4*6) * 30 }  // 36 ثانية تقريباً
    fps={30}
    width={1080}
    height={1920}
  />
));
