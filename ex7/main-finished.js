// setup canvas

var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');

var width = canvas.width = window.innerWidth;
var height = canvas.height = window.innerHeight;

var pCounter = document.querySelector('p');

// function to generate random number

function random(min,max) {
  var num = Math.floor(Math.random()*(max-min)) + min;
  return num;
}

// Construtor do Shape

function Shape(x, y, velX, velY, exists) {
  this.x = x;
  this.y = y;
  this.velX = velX;
  this.velY = velY;
  this.exists = exists;

}

// define Ball constructor

function Ball(x, y, velX, velY, exists, color, size) {
  Shape.call(this, x, y, velX, velY, exists); /* Herdar */
  this.color = color;
  this.size = size;
}

// Construtor do Evil Cirle

function EvilCircle(x, y, exists) {
  Shape.call(this, x, y, 20, 20, exists); /* Herdar */
  this.color = "rgb(255, 255, 255)";
  this.size = 10;
}

// Ajustar prototype de Ball e Evil Circle

Ball.prototype = Object.create(Shape.prototype);
Ball.prototype.constructor = Ball;

EvilCircle.prototype = Object.create(Shape.prototype);
EvilCircle.prototype.constructor = EvilCircle;

// define ball draw method

Ball.prototype.draw = function() {
  ctx.beginPath();
  ctx.fillStyle = this.color;
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  ctx.fill();
};

// define ball update method

Ball.prototype.update = function() {
  if((this.x + this.size) >= width) {
    this.velX = -(this.velX);
  }

  if((this.x - this.size) <= 0) {
    this.velX = -(this.velX);
  }

  if((this.y + this.size) >= height) {
    this.velY = -(this.velY);
  }

  if((this.y - this.size) <= 0) {
    this.velY = -(this.velY);
  }

  this.x += this.velX;
  this.y += this.velY;
};

// define ball collision detection

Ball.prototype.collisionDetect = function() {
  for(var j = 0; j < balls.length; j++) {
    if(balls[j].exists && !(this === balls[j])) {
      var dx = this.x - balls[j].x;
      var dy = this.y - balls[j].y;
      var distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.size + balls[j].size) {
        balls[j].color = this.color = 'rgb(' + random(0,255) + ',' + random(0,255) + ',' + random(0,255) +')';
      }
    }
  }
};

// Métodos do Evil Circle

EvilCircle.prototype.checkBounds = function() {
  if((this.x + this.size) >= width) {
    this.x = width - this.size - 3; // Diminuir o stroke também
  }

  if((this.x - this.size) <= 0) {
    this.x = this.size + 3; // Somar stroke também
  }

  if((this.y + this.size) >= height) {
    this.y = height - this.size - 3; // Diminuir o stroke também
  }

  if((this.y - this.size) <= 0) {
    this.y = this.size + 3; // Somar stroke também
  }
};

EvilCircle.prototype.setControls = function() {
  var _this = this; /* Precisamos definir o _this porque na implementação do método para o "keydown" abaixo, o escopo mudará, assim como valor do this, e precisamos do escopo do EvilCircle abaixo */
  window.onkeydown = function(e) {
    if (e.keyCode === 65) { // A -> Pra esquerda
      _this.x -= _this.velX;
    } else if (e.keyCode === 68) { // D -> Pra direita
      _this.x += _this.velX;
    } else if (e.keyCode === 87) { // W -> sobe
      _this.y -= _this.velY;
    } else if (e.keyCode === 83) { // S -> desce
      _this.y += _this.velY;
    }
  }
};

EvilCircle.prototype.collisionDetect = function() {
  for(var j = 0; j < balls.length; j++) {
    if(balls[j].exists) {
      var dx = this.x - balls[j].x;
      var dy = this.y - balls[j].y;
      var distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.size + balls[j].size) {
        balls[j].exists = false;
        counter--;
        updateCounter();
      }
    }
  }
};

EvilCircle.prototype.draw = function() {
  ctx.beginPath();
  ctx.strokeStyle = this.color;
  ctx.lineWidth = 3; // Mais grossa a linha
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  ctx.stroke();
};

// define array to store balls

var balls = [];

// Definir Evil Circle

var evilCircle = new EvilCircle(width/2, height/2, true); // Evil Circle começa no centro da tela
evilCircle.setControls();

// Definir contador de balls

var counter = 0;


// Função que atualiza o contador na tela

function updateCounter() {
  pCounter.innerHTML = "Ball count: " + counter;
}

// define loop that keeps drawing the scene constantly

function loop() {
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.fillRect(0,0,width,height);

  while(balls.length < 25) {
    var size = random(10,20);
    var ball = new Ball(
      // ball position always drawn at least one ball width
      // away from the adge of the canvas, to avoid drawing errors
      random(0 + size,width - size),
      random(0 + size,height - size),
      random(-7,7),
      random(-7,7),
	  true, /* Novo: exists começa com true */
      'rgb(' + random(0,255) + ',' + random(0,255) + ',' + random(0,255) +')',
      size
    );
    balls.push(ball);
    counter++; // Incrementar contador e atualizar
    updateCounter();
  }

  for(var i = 0; i < balls.length; i++) {
    if(!balls[i].exists) {
      continue;
    }
    balls[i].draw();
    balls[i].update();
    balls[i].collisionDetect();
  }
  
  // Atualizar Evil Circle
  evilCircle.draw();
  evilCircle.checkBounds();
  evilCircle.collisionDetect();

  requestAnimationFrame(loop);
}


// ==== EXTRA ====: se o usuário diminuir ou aumentar o tamanho da tela (navegador), as variáveis width e height precisam ser atualizadas.

window.onresize = function() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}


loop();
