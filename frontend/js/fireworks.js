fireworks = {};
fireworks.Salute = function(id) {
    this.elementID = id;
    this.canvasWidth = document.getElementById(id).offsetWidth;
    this.canvasHeight = document.getElementById(id).offsetHeight;
    this.canvas = document.createElement('canvas');
    this.canvas.id = id += '-fireworks';
    this.context = this.canvas.getContext('2d');
    this.particles = [];
    this.rockets = [];
    this.maxParticles = 400;
    this.colorCode = 0;
};

fireworks.Salute.prototype = {
    init: function() {
        document.getElementById(this.elementID).appendChild(this.canvas);
        this.canvas.style.background = 'none'; //#B9B974
        //this.canvas.style.opacity = '0.5';
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = 0;
        this.canvas.style.left = 0;
        this.canvas.width = this.canvasWidth;
        this.canvas.height = this.canvasHeight;
    },

    launch: function(quantity) {
        if(!quantity) quantity = 1;
        var rand1 = Math.random();
        var positionX = Math.floor(this.canvasWidth / 3 + rand1 * this.canvasWidth / 3);

        while(quantity > 0 && this.rockets.length < 10) {
            var rocket = new fireworks.Rocket(positionX, this.canvasHeight, this);
            rocket.explosionColor = Math.floor(rand1 * 360 / 10) * 10;
            rocket.vel.y = Math.random() * -3 - 6;
            rocket.vel.x = Math.random() * 3 - 1.5;
            rocket.size = 2;
            rocket.shrink = 0.999;
            rocket.gravity = 0.01;
            this.rockets.push(rocket);
            quantity--;
        }
    },

    loop: function() {
        var SCREEN_WIDTH = this.canvasWidth;
        var SCREEN_HEIGHT = this.canvasHeight;

        this.context.fillStyle = "rgba(255, 255, 255, 0.15)";
        this.context.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

        var existingRockets = [];
        var rockets = this.rockets;

        var l = rockets.length;
        while(l--) {
            rockets[l].update();
            rockets[l].render(this.context);

            var randomChance = rockets[l].pos.y < (SCREEN_HEIGHT * 1 / 3) ? (Math.random() * 100 <= 1) : false;

            if (rockets[l].pos.y < SCREEN_HEIGHT / 5 || rockets[l].vel.y >= 0 || randomChance) {
                rockets[l].explode();
            } else {
                existingRockets.push(rockets[l]);
            }
        }

        this.rockets = existingRockets;

        var existingParticles = [];
        var particles = this.particles;

        l = particles.length;
        while(l--) {
            particles[l].update();

            // render and save particles that can be rendered
            if (particles[l].exists()) {
                particles[l].render(this.context);
                existingParticles.push(particles[l]);
            }
        }

        // update array with existing particles - old particles should be garbage collected
        particles = existingParticles;

        while (particles.length > this.maxParticles) {
            particles.shift();
        }

    },

    clearCanvas: function() {
        this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    }

};

fireworks.Particle = function(pos) {
    this.pos = {
        x: pos ? pos.x : 0,
        y: pos ? pos.y : 0
    };
    this.vel = {
        x: 0,
        y: 0
    };
    this.shrink = .97;
    this.size = 2;

    this.resistance = 1;
    this.gravity = 0;

    this.flick = false;

    this.alpha = 1;
    this.fade = 0;
    this.color = 0;
};

fireworks.Particle.prototype.update = function() {
    // apply resistance
    this.vel.x *= this.resistance;
    this.vel.y *= this.resistance;

    // gravity down
    this.vel.y += this.gravity;

    // update position based on speed
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;

    // shrink
    this.size *= this.shrink;

    // fade out
    this.alpha -= this.fade;
};

fireworks.Particle.prototype.render = function(c) {
    if (!this.exists()) return;

    c.save();

    c.globalCompositeOperation = 'hard-light';

    var x = this.pos.x,
        y = this.pos.y,
        r = this.size / 3;

    var gradient = c.createRadialGradient(x, y, 0.1, x, y, r);
    //gradient.addColorStop(0.1, "rgba(55,55,55," + this.alpha + ")");
    gradient.addColorStop(0.8, "hsla(" + this.color + ", 70%, 45%, " + this.alpha + ")");
    gradient.addColorStop(1, "hsla(" + this.color + ", 70%, 45%, 0.1)");

    c.fillStyle = gradient;

    c.beginPath();
    c.arc(this.pos.x, this.pos.y, this.flick ? Math.random() * this.size : this.size, 0, Math.PI * 2, true);
    c.closePath();
    c.fill();

    c.restore();
};

fireworks.Particle.prototype.exists = function() {
    return this.alpha >= 0.1 && this.size >= 1;
};

fireworks.Rocket = function(x, y, fireworksThat) {
    fireworks.Particle.apply(this, [{
        x: x,
        y: y}]);
    this.fireworksThat = fireworksThat;
    this.explosionColor = 0;
};

fireworks.Rocket.prototype = new fireworks.Particle();
fireworks.Rocket.prototype.constructor = fireworks.Rocket;

fireworks.Rocket.prototype.explode = function() {
    var count = 85;
    while(count--) {
        var particle = new fireworks.Particle(this.pos);
        var rand = Math.random();
        //var angle = Math.random() * Math.PI * 2;
        var angle = rand * 6.283;

        // emulate 3D effect by using cosine and put more particles in the middle
        //var speed = Math.cos(Math.random() * Math.PI / 2) * 15;
        var speed = Math.cos(Math.random() * 1.57) * 15;

        particle.vel.x = Math.cos(angle) * speed;
        particle.vel.y = Math.sin(angle) * speed;

        particle.size = 10;

        particle.gravity = 0.2;
        particle.resistance = 0.92;
        particle.shrink = rand * 0.05 + 0.93;

        particle.flick = true;
        particle.color = this.explosionColor;

        this.fireworksThat.particles.push(particle);
    }
};

fireworks.Rocket.prototype.render = function(c) {
    if (!this.exists()) return;

    c.save();

    c.globalCompositeOperation = 'darken';

    var x = this.pos.x,
        y = this.pos.y,
        r = this.size / 2;

    c.fillStyle = "rgba(220, 220, 220, " + this.alpha + ")";

    c.beginPath();
    c.arc(this.pos.x, this.pos.y, this.flick ? Math.random() * this.size / 2 + this.size / 2 : this.size, 0, Math.PI * 2, true);
    c.closePath();
    c.fill();

    c.restore();
};

/*$(function() {
    var f1 = new fireworks.Salute('field');
    f1.init();
    f1.launch(3);
    setInterval(function() {f1.launch()}, 800);
    setInterval(function() {f1.loop()}, 20);
});*/
