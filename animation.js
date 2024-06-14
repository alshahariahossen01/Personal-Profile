const canvas = document.getElementById('backgroundCanvas');
const ctx = canvas.getContext('2d');

// Resize the canvas to fill the browser window dynamically
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Settings for the animation
const config = {
    particleCount: 100,
    maxLineLength: 150,
    particleSize: 3,
    particleSpeed: 2,
    particleColor: 'rgba(255, 255, 255, 0.8)' // Initial particle color
};

// Store mouse position
let mousePosition = { x: canvas.width / 2, y: canvas.height / 2 };

canvas.addEventListener('mousemove', (e) => {
    mousePosition.x = e.clientX;
    mousePosition.y = e.clientY;
});

// Array to hold particles
let particles = [];

class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = Math.random() * config.particleSpeed - config.particleSpeed / 2;
        this.vy = Math.random() * config.particleSpeed - config.particleSpeed / 2;
        this.color = this.getRandomRGBColor(); // Assign a random RGB color
    }

    getRandomRGBColor() {
        const r = Math.floor(Math.random() * 255);
        const g = Math.floor(Math.random() * 255);
        const b = Math.floor(Math.random() * 255);
        return `rgba(${r}, ${g}, ${b}, 0.8)`;
    }

    move() {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce off the edges
        if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
        if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;

        // Attract to mouse
        const dx = this.x - mousePosition.x;
        const dy = this.y - mousePosition.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 100) {
            this.vx += (mousePosition.x - this.x) * 0.01;
            this.vy += (mousePosition.y - this.y) * 0.01;
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, config.particleSize, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

// Initialize particles
function initParticles() {
    particles = [];
    for (let i = 0; i < config.particleCount; i++) {
        particles.push(new Particle(Math.random() * canvas.width, Math.random() * canvas.height));
    }
}
initParticles();

// Draw connections
function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            let dx = particles[i].x - particles[j].x;
            let dy = particles[i].y - particles[j].y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < config.maxLineLength) {
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);

                // Create a gradient connection based on the distance
                const gradient = ctx.createLinearGradient(
                    particles[i].x,
                    particles[i].y,
                    particles[j].x,
                    particles[j].y
                );
                gradient.addColorStop(0, particles[i].color);
                gradient.addColorStop(1, particles[j].color);

                ctx.strokeStyle = gradient;
                ctx.lineWidth = 1;
                ctx.stroke();
            }
        }
    }
}

// Animation loop
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(particle => {
        particle.move();
        particle.draw();
    });
    drawConnections();
    requestAnimationFrame(animate);
}
animate();