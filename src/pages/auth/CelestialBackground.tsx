import React, { useEffect, useRef, useState } from 'react';
import './celestial.css';

interface Star3D {
  x: number;
  y: number;
  z: number;
  prevZ: number;
  size: number;
  color: string;
  twinkleSpeed: number;
  twinklePhase: number;
  hasSparkle: boolean;
}

interface Meteor3D {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  length: number;
  life: number;
  maxLife: number;
  color: string;
}

export const CelestialBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const moonRef = useRef<HTMLDivElement | null>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const [moonTilt, setMoonTilt] = useState({ rotateX: 0, rotateY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Track mouse for 3D camera parallax
    const handleMouseMove = (e: MouseEvent) => {
      const normalizedX = (e.clientX / window.innerWidth) * 2 - 1;
      const normalizedY = (e.clientY / window.innerHeight) * 2 - 1;
      mouseRef.current.targetX = normalizedX;
      mouseRef.current.targetY = normalizedY;

      // 3D Moon parallax tilt
      setMoonTilt({
        rotateY: normalizedX * 14,
        rotateX: -normalizedY * 12,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Mobile orientation / touch support
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const normalizedX = (touch.clientX / window.innerWidth) * 2 - 1;
        const normalizedY = (touch.clientY / window.innerHeight) * 2 - 1;
        mouseRef.current.targetX = normalizedX;
        mouseRef.current.targetY = normalizedY;
        setMoonTilt({
          rotateY: normalizedX * 10,
          rotateX: -normalizedY * 8,
        });
      }
    };
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    // Initialize 400 stars in 3D space
    const STAR_COUNT = 420;
    const FOCAL_LENGTH = 350;
    const MAX_DEPTH = 1800;
    const stars: Star3D[] = [];

    const starColors = [
      '#ffffff',
      '#ffffff',
      '#e0e7ff',
      '#c7d2fe',
      '#bae6fd',
      '#fef08a',
      '#ddd6fe',
      '#7dd3fc',
    ];

    for (let i = 0; i < STAR_COUNT; i++) {
      const z = Math.random() * MAX_DEPTH + 1;
      stars.push({
        x: (Math.random() - 0.5) * 2200,
        y: (Math.random() - 0.5) * 2200,
        z: z,
        prevZ: z,
        size: Math.random() * 1.8 + 0.8,
        color: starColors[Math.floor(Math.random() * starColors.length)],
        twinkleSpeed: Math.random() * 0.05 + 0.015,
        twinklePhase: Math.random() * Math.PI * 2,
        hasSparkle: Math.random() > 0.85,
      });
    }

    // Dynamic 3D Meteors list
    const meteors: Meteor3D[] = [];
    let nextMeteorSpawn = Date.now() + 1500;

    const spawnMeteor = () => {
      const startX = (Math.random() * 0.8 - 0.2) * width;
      const startY = (Math.random() * 0.4 - 0.2) * height;
      meteors.push({
        x: startX,
        y: startY,
        z: Math.random() * 600 + 200,
        vx: -(Math.random() * 9 + 11),
        vy: Math.random() * 8 + 9,
        vz: -(Math.random() * 2 + 1),
        length: Math.random() * 70 + 80,
        life: 0,
        maxLife: Math.random() * 30 + 35,
        color: Math.random() > 0.4 ? '#818cf8' : '#38bdf8',
      });
    };

    let autoTime = 0;

    // 60FPS 3D Animation Loop
    const render = () => {
      autoTime += 0.01;

      // Smooth mouse interpolation
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      const currentMouseX = mouseRef.current.x;
      const currentMouseY = mouseRef.current.y;

      const centerX = width / 2;
      const centerY = height / 2;

      // Clear with dark space gradient
      ctx.clearRect(0, 0, width, height);

      // Deep space ambient glow
      const bgGrad = ctx.createRadialGradient(
        centerX + currentMouseX * 100,
        centerY + currentMouseY * 100,
        50,
        centerX,
        centerY,
        Math.max(width, height) * 0.8
      );
      bgGrad.addColorStop(0, 'rgba(15, 23, 42, 0.4)');
      bgGrad.addColorStop(0.5, 'rgba(10, 15, 29, 0.2)');
      bgGrad.addColorStop(1, 'rgba(4, 7, 17, 0)');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Render 3D Stars with perspective projection
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];

        star.prevZ = star.z;
        star.z -= 1.4; // Continuous forward cosmic drift

        // Recycle star when it passes the camera
        if (star.z <= 1) {
          star.z = MAX_DEPTH;
          star.prevZ = MAX_DEPTH;
          star.x = (Math.random() - 0.5) * 2200;
          star.y = (Math.random() - 0.5) * 2200;
        }

        // 3D Perspective Projection
        const k = FOCAL_LENGTH / star.z;
        const px = centerX + (star.x + currentMouseX * 180) * k;
        const py = centerY + (star.y + currentMouseY * 180) * k;

        // Clip stars outside screen
        if (px < -20 || px > width + 20 || py < -20 || py > height + 20) {
          continue;
        }

        // Distance attenuation & twinkle calculation
        star.twinklePhase += star.twinkleSpeed;
        const twinkle = Math.sin(star.twinklePhase) * 0.35 + 0.65;
        const depthAlpha = Math.min(1, Math.max(0.15, (1 - star.z / MAX_DEPTH) * 1.3));
        const finalAlpha = Math.min(1, depthAlpha * twinkle);

        const radius = Math.max(0.6, star.size * k * 1.4);

        ctx.fillStyle = star.color;
        ctx.globalAlpha = finalAlpha;

        // Draw star core
        ctx.beginPath();
        ctx.arc(px, py, radius, 0, Math.PI * 2);
        ctx.fill();

        // Prominent 4-point cross sparkle for closer bright stars
        if (star.hasSparkle && radius > 1.6 && twinkle > 0.8) {
          const sparkleLen = radius * 3.5;
          ctx.strokeStyle = star.color;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(px - sparkleLen, py);
          ctx.lineTo(px + sparkleLen, py);
          ctx.moveTo(px, py - sparkleLen);
          ctx.lineTo(px, py + sparkleLen);
          ctx.stroke();
        }
      }

      // Check meteor spawn
      if (Date.now() > nextMeteorSpawn) {
        spawnMeteor();
        nextMeteorSpawn = Date.now() + Math.random() * 4500 + 3500;
      }

      // Render 3D Meteors
      for (let m = meteors.length - 1; m >= 0; m--) {
        const meteor = meteors[m];
        meteor.life++;

        if (meteor.life >= meteor.maxLife) {
          meteors.splice(m, 1);
          continue;
        }

        meteor.x += meteor.vx;
        meteor.y += meteor.vy;
        meteor.z += meteor.vz;

        const k = FOCAL_LENGTH / Math.max(10, meteor.z);
        const px = centerX + (meteor.x + currentMouseX * 160) * k;
        const py = centerY + (meteor.y + currentMouseY * 160) * k;

        const progress = meteor.life / meteor.maxLife;
        const meteorAlpha = Math.sin(progress * Math.PI);

        // Meteor trail gradient
        const trailEndX = px - meteor.vx * (meteor.length * 0.15);
        const trailEndY = py - meteor.vy * (meteor.length * 0.15);

        const meteorGrad = ctx.createLinearGradient(px, py, trailEndX, trailEndY);
        meteorGrad.addColorStop(0, '#ffffff');
        meteorGrad.addColorStop(0.2, meteor.color);
        meteorGrad.addColorStop(0.7, 'rgba(99, 102, 241, 0.3)');
        meteorGrad.addColorStop(1, 'rgba(99, 102, 241, 0)');

        ctx.globalAlpha = meteorAlpha;
        ctx.strokeStyle = meteorGrad;
        ctx.lineWidth = Math.max(1.2, 2.5 * k);
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(trailEndX, trailEndY);
        ctx.stroke();

        // Glowing incandescent head
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(px, py, Math.max(1.8, 3 * k), 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1.0;
      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  return (
    <div className="celestial-universe-3d" aria-hidden="true">
      {/* 3D Depth Starfield & Meteor Canvas */}
      <canvas ref={canvasRef} className="celestial-canvas-3d" />

      {/* Atmospheric 3D Cosmic Nebulae */}
      <div className="celestial-nebula-3d nebula-indigo" />
      <div className="celestial-nebula-3d nebula-cyan" />
      <div className="celestial-nebula-3d nebula-violet" />

      {/* Volumetric 3D Celestial Moon with Interactive Parallax */}
      <div
        ref={moonRef}
        className="celestial-moon-3d-stage"
        style={{
          transform: `perspective(1000px) rotateY(${moonTilt.rotateY}deg) rotateX(${moonTilt.rotateX}deg) translateZ(0)`,
        }}
      >
        {/* Multilayer Radiating Halos */}
        <div className="moon-3d-outer-corona" />
        <div className="moon-3d-inner-corona" />
        <div className="moon-3d-atmospheric-rim" />

        {/* 3D Spherical Moon Body */}
        <div className="moon-3d-sphere">
          <svg
            className="moon-3d-svg"
            viewBox="0 0 120 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Spherical Sunlight Gradient */}
              <radialGradient id="moonSphereLight" cx="36%" cy="34%" r="66%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="30%" stopColor="#f8fafc" />
                <stop offset="60%" stopColor="#cbd5e1" />
                <stop offset="85%" stopColor="#64748b" />
                <stop offset="100%" stopColor="#1e293b" />
              </radialGradient>

              {/* Luminous Crescent Shading */}
              <linearGradient id="moonCrescent3D" x1="10%" y1="10%" x2="90%" y2="90%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="35%" stopColor="#f1f5f9" />
                <stop offset="65%" stopColor="#c7d2fe" />
                <stop offset="88%" stopColor="#818cf8" />
                <stop offset="100%" stopColor="#4338ca" />
              </linearGradient>

              {/* Deep Crater Inset Shadow */}
              <radialGradient id="craterDark" cx="30%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#1e293b" stopOpacity="0.8" />
                <stop offset="70%" stopColor="#334155" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#64748b" stopOpacity="0.1" />
              </radialGradient>

              {/* Volumetric Limb Glow Filter */}
              <filter id="moonGlow3D" x="-25%" y="-25%" width="150%" height="150%">
                <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#818cf8" floodOpacity="0.65" />
              </filter>
            </defs>

            {/* Faint Dark Side of the Moon (Earthshine Sphere) */}
            <circle cx="60" cy="60" r="48" fill="#0b1329" opacity="0.45" stroke="rgba(129, 140, 248, 0.2)" strokeWidth="0.8" />

            {/* Luminous 3D Crescent Moon */}
            <path
              d="M 74 16 A 48 48 0 1 0 102 78 A 40 40 0 1 1 74 16 Z"
              fill="url(#moonCrescent3D)"
              filter="url(#moonGlow3D)"
            />

            {/* 3D Lunar Craters with Relief Depth */}
            <g className="moon-craters-group">
              {/* Copernicus Crater */}
              <circle cx="56" cy="38" r="4.2" fill="url(#craterDark)" />
              <circle cx="55" cy="37" r="4.2" fill="none" stroke="rgba(255, 255, 255, 0.45)" strokeWidth="0.8" />

              {/* Tycho Crater & Rays */}
              <circle cx="45" cy="60" r="5.6" fill="url(#craterDark)" />
              <circle cx="44" cy="59" r="5.6" fill="none" stroke="rgba(255, 255, 255, 0.5)" strokeWidth="1" />

              {/* Minor Craters */}
              <circle cx="58" cy="78" r="4" fill="url(#craterDark)" />
              <circle cx="75" cy="90" r="3.2" fill="url(#craterDark)" />
              <circle cx="40" cy="46" r="3" fill="url(#craterDark)" />
              <circle cx="68" cy="48" r="2.8" fill="url(#craterDark)" />
              <circle cx="50" cy="92" r="2.5" fill="url(#craterDark)" />
            </g>
          </svg>

          {/* Incandescent Diamond Star Glint on Moon Horn */}
          <div className="moon-horn-glint" />

          {/* Drifting Lunar Mist Ring */}
          <div className="moon-translucent-wisp" />
        </div>
      </div>
    </div>
  );
};
