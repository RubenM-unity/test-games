// Define the Component and Game namespaces to avoid scope issues
var Component = {};
var Game = {};

// Game Component Stage
Component.Stage = function(canvas, conf) {
    // Same logic as before
    this.keyEvent  = new Keyboard.ControllerEvents();
    this.width     = canvas.width;
    this.height    = canvas.height;
    this.length    = [];
    this.food      = {};
    this.score     = 0;
    this.direction = 'right';
    this.conf      = {
      cw   : 10,
      size : 5,
      fps  : 1000
    };
    
    if (typeof conf === 'object') {
      for (var key in conf) {
        if (conf.hasOwnProperty(key)) {
          this.conf[key] = conf[key];
        }
      }
    }
};

// Game Component Snake
Component.Snake = function(canvas, conf) {
    this.stage = new Component.Stage(canvas, conf);
    
    this.initSnake = function() {
        for (var i = 0; i < this.stage.conf.size; i++) {
            this.stage.length.push({x: i, y: 0});
        }
    };
    
    this.initFood = function() {
        this.stage.food = {
            x: Math.round(Math.random() * (this.stage.width - this.stage.conf.cw) / this.stage.conf.cw), 
            y: Math.round(Math.random() * (this.stage.height - this.stage.conf.cw) / this.stage.conf.cw), 
        };
    };
    
    this.restart = function() {
        this.stage.length = [];
        this.stage.food = {};
        this.stage.score = 0;
        this.stage.direction = 'right';
        this.stage.keyEvent.pressKey = null;
        this.initSnake();
        this.initFood();
    };
};

// Game Draw
Game.Draw = function(context, snake) {
    this.drawStage = function() {
        var keyPress = snake.stage.keyEvent.getKey();
        if (typeof(keyPress) !== 'undefined') {
            snake.stage.direction = keyPress;
        }
        
        context.fillStyle = "white";
        context.fillRect(0, 0, snake.stage.width, snake.stage.height);
        
        var nx = snake.stage.length[0].x;
        var ny = snake.stage.length[0].y;

        switch (snake.stage.direction) {
            case 'right':
                nx++;
                break;
            case 'left':
                nx--;
                break;
            case 'up':
                ny--;
                break;
            case 'down':
                ny++;
                break;
        }

        if (this.collision(nx, ny)) {
            snake.restart();
            return;
        }

        if (nx == snake.stage.food.x && ny == snake.stage.food.y) {
            var tail = {x: nx, y: ny};
            snake.stage.score++;
            snake.initFood();
        } else {
            var tail = snake.stage.length.pop();
            tail.x = nx;
            tail.y = ny;
        }
        snake.stage.length.unshift(tail);

        // Draw Snake
        for (var i = 0; i < snake.stage.length.length; i++) {
            var cell = snake.stage.length[i];
            this.drawCell(cell.x, cell.y);
        }
        
        // Draw Food
        this.drawCell(snake.stage.food.x, snake.stage.food.y);
        
        // Draw Score
        context.fillText('Score: ' + snake.stage.score, 5, (snake.stage.height - 5));
    };

    this.drawCell = function(x, y) {
        context.fillStyle = 'rgb(170, 170, 170)';
        context.beginPath();
        context.arc((x * snake.stage.conf.cw + 6), (y * snake.stage.conf.cw + 6), 4, 0, 2 * Math.PI, false);    
        context.fill();
    };

    this.collision = function(nx, ny) {
        if (nx == -1 || nx == (snake.stage.width / snake.stage.conf.cw) || ny == -1 || ny == (snake.stage.height / snake.stage.conf.cw)) {
            return true;
        }
        return false;    
    };
};

// Game Snake
Game.Snake = function(elementId, conf) {
    var canvas = document.getElementById(elementId);
    var context = canvas.getContext("2d");
    var snake = new Component.Snake(canvas, conf);
    var gameDraw = new Game.Draw(context, snake);

    setInterval(function() { gameDraw.drawStage(); }, snake.stage.conf.fps);
};

window.onload = function() {
    var snake = new Game.Snake('stage', {fps: 100, size: 4});
};
