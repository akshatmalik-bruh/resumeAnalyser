import React, { useEffect, useRef } from 'react';

const Background = () => {
    const canvasRef = useRef(null);
    const blobsRef = useRef([]);
    const mouseRef = useRef({ x: 0, y: 0 });
    const frameRef = useRef(null);

    // Color palette: deep reds, purples, blues, cyans
    const colors = [
        [255, 60, 60],
        [200, 40, 120],
        [129, 60, 255],
        [60, 129, 255],
        [0, 210, 255],
        [80, 0, 180],
        [255, 100, 80],
        [0, 160, 200],
    ];

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        // Spawn blobs on mouse move
        let spawnCounter = 0;
        const handleMouseMove = (e) => {
            mouseRef.current = { x: e.clientX, y: e.clientY };
            spawnCounter++;
            // Spawn a new blob every 3rd mouse event for density
            if (spawnCounter % 3 === 0) {
                const color = colors[Math.floor(Math.random() * colors.length)];
                blobsRef.current.push({
                    x: e.clientX + (Math.random() - 0.5) * 120,
                    y: e.clientY + (Math.random() - 0.5) * 120,
                    radius: 80 + Math.random() * 180,
                    color,
                    alpha: 0.25 + Math.random() * 0.15,
                    vx: (Math.random() - 0.5) * 0.6,
                    vy: (Math.random() - 0.5) * 0.6,
                    life: 1.0,
                    decay: 0.002 + Math.random() * 0.003,
                });
            }
        };
        window.addEventListener('mousemove', handleMouseMove);

        // Animation loop
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw & update blobs
            const blobs = blobsRef.current;
            for (let i = blobs.length - 1; i >= 0; i--) {
                const b = blobs[i];
                b.x += b.vx;
                b.y += b.vy;
                b.life -= b.decay;

                if (b.life <= 0) {
                    blobs.splice(i, 1);
                    continue;
                }

                const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.radius);
                const a = b.alpha * b.life;
                grad.addColorStop(0, `rgba(${b.color[0]}, ${b.color[1]}, ${b.color[2]}, ${a})`);
                grad.addColorStop(0.5, `rgba(${b.color[0]}, ${b.color[1]}, ${b.color[2]}, ${a * 0.4})`);
                grad.addColorStop(1, `rgba(${b.color[0]}, ${b.color[1]}, ${b.color[2]}, 0)`);

                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
                ctx.fill();
            }

            // Cap max blobs for performance
            if (blobs.length > 120) {
                blobs.splice(0, blobs.length - 120);
            }

            frameRef.current = requestAnimationFrame(animate);
        };
        animate();

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(frameRef.current);
        };
    }, []);

    return (
        <div className="bg-canvas">
            {/* Static ambient glows for base color */}
            <div className="ambient-glow top-right"></div>
            <div className="ambient-glow bottom-left"></div>

            {/* Dynamic fluid gradient canvas */}
            <canvas ref={canvasRef} className="fluid-canvas" />

            {/* Pixel grid overlay for pixelated look */}
            <div className="pixel-grid"></div>
        </div>
    );
};

export default Background;
