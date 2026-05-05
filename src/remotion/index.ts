import { registerRoot, Composition, AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, interpolate, Img, staticFile, Audio, spring } from 'remotion';
import { loadFont } from '@remotion/google-fonts/Cairo';

loadFont();

// تأثير الكتابة التتابعية للنص
const TypewriterText: React.FC<{ text: string; delay?: number }> = ({ text, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const startFrame = delay * fps;
  const charsShown = Math.max(0, Math.min(text.length, Math.floor((frame - startFrame) / 2)));
  return <span>{text.substring(0, charsShown)}</span>;
};

// تأثير التموج الضوئي (Lens Flare)
const LensFlare: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(Math.sin(frame * 0.05), [-1, 1], [0.1, 0.4]);
  return (
    <div style={{
      position: 'absolute',
      top: '20%',
      left: '70%',
      width: '40%',
      height: '40%',
      background: 'radial-gradient(circle, rgba(255,200,100,0.4) 0%, rgba(255,200,100,0) 80%)',
      borderRadius: '50%',
      opacity,
      pointerEvents: 'none'
    }} />
  );
};

// المشهد الأول: الطفولة في الكوفة (4 صور مع انتقالات سينمائية)
const Scene1_Childhood_Kufa: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  
  // كل صورة تعرض لمدة 3 ثوانٍ (90 إطار)، مع انتقال خلط (mix) في آخر 15 إطار
  const durationPerImage = fps * 3; // 90
  const transitionDuration = 15;
  const rawIndex = frame / durationPerImage;
  const imageIndex = Math.min(Math.floor(rawIndex), 3);
  const nextImageIndex = Math.min(imageIndex + 1, 3);
  
  // نسبة التقدم داخل الصورة الحالية
  const progressInImage = (frame % durationPerImage) / durationPerImage;
  // نسبة الانتقال (تزداد في آخر transitionDuration إطار)
  const transitionProgress = Math.min(1, Math.max(0, (frame % durationPerImage - (durationPerImage - transitionDuration)) / transitionDuration));
  
  const currentImage = `${imageIndex + 1}.png`;
  const nextImage = `${nextImageIndex + 1}.png`;
  
  // تأثير الزوم السينمائي (بطيء جداً وغير خطي)
  const zoom = interpolate(progressInImage, [0, 1], [1, 1.08], { extrapolateRight: 'clamp' });
  // تأثير التمايل البسيط (camera sway)
  const swayX = Math.sin(frame * 0.02) * 3;
  const swayY = Math.cos(frame * 0.015) * 2;
  
  // تأثير التلاشي التدريجي للصورة القديمة مقابل الجديدة
  const mixOpacity = transitionProgress;
  
  // تأثير تغير الإضاءة (محاكاة مرور الوقت داخل المشهد)
  const brightness = interpolate(progressInImage, [0, 0.5, 1], [1, 1.1, 0.95]);
  
  return (
    <AbsoluteFill style={{ backgroundColor: '#0a0a0a' }}>
      {/* الصورة الحالية (تختفي تدريجياً أثناء الانتقال) */}
      <Img 
        src={staticFile(`images/${currentImage}`)} 
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: `translate(${swayX}px, ${swayY}px) scale(${zoom})`,
          filter: `brightness(${brightness})`,
          opacity: 1 - mixOpacity
        }}
      />
      {/* الصورة التالية (تظهر تدريجياً أثناء الانتقال) */}
      {nextImageIndex !== imageIndex && (
        <Img 
          src={staticFile(`images/${nextImage}`)} 
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: `translate(${swayX}px, ${swayY}px) scale(${zoom})`,
            filter: `brightness(${brightness})`,
            opacity: mixOpacity
          }}
        />
      )}
      
      {/* تراكب متدرج داكن في الأطراف (vignette) */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        boxShadow: 'inset 0 0 150px rgba(0,0,0,0.6)',
        pointerEvents: 'none'
      }} />
      
      {/* تأثير Lens Flare */}
      <LensFlare />
      
      {/* النص المتحرك (يظهر حسب تقدم الصوت) */}
      <div style={{
        position: 'absolute',
        bottom: '15%',
        left: 0,
        width: '100%',
        textAlign: 'center',
        fontFamily: 'Cairo',
        fontSize: 48,
        fontWeight: 'bold',
        color: '#f5e6ca',
        textShadow: '0 0 20px rgba(0,0,0,0.8), 0 0 5px rgba(0,0,0,0.5)',
        background: 'linear-gradient(90deg, transparent, rgba(0,0,0,0.6), transparent)',
        padding: '20px',
        letterSpacing: '1px'
      }}>
        {frame < 90 && <TypewriterText text="في الكوفة..." delay={0} />}
        {frame >= 90 && frame < 180 && <TypewriterText text="جلس طفل لم يكن كغيره..." delay={3} />}
        {frame >= 180 && frame < 270 && <TypewriterText text="نظراته تخترق الجدران..." delay={6} />}
        {frame >= 270 && <TypewriterText text="المتنبي... شاعر العرب الأول" delay={9} />}
      </div>
      
      {/* تراكب ضبابي خفيف متحرك */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: `radial-gradient(circle at ${30 + Math.sin(frame * 0.01) * 5}% ${40 + Math.cos(frame * 0.008) * 5}%, rgba(255,215,140,0.05) 0%, transparent 60%)`,
        pointerEvents: 'none'
      }} />
      
      <Audio src={staticFile('audio/scene1.mp3')} />
    </AbsoluteFill>
  );
};

const FullFilm = () => {
  const { fps } = useVideoConfig();
  const scene1Duration = fps * 3 * 4; // 12 ثانية
  
  return (
    <>
      <Sequence from={0} durationInFrames={scene1Duration}>
        <Scene1_Childhood_Kufa />
      </Sequence>
    </>
  );
};

registerRoot(() => (
  <Composition
    id="MyComp"
    component={FullFilm}
    durationInFrames={12 * 30}
    fps={30}
    width={1920}
    height={1080}
  />
));
