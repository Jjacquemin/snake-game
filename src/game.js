import Snake from "./snake.js";
import Apple from "./apple.js";
import Drawing from "./drawing.js";

export default class Game {
        
    constructor(canvasWidth = 900, canvasHeight = 600){
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.blockSize = 30;
        this.canvas= document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.widthInBlocks = this.canvasWidth/this.blockSize;
        this.heightInBlocks = this.canvasHeight/this.blockSize;
        this.centreX = this.canvasWidth/2;
        this.centreY = this.canvasHeight/2;
        this.minX = 0;
        this.minY = 0;
        this.maxX = this.widthInBlocks-1;
        this.maxY = this.heightInBlocks-1;
        this.delay = 100;
        this.snakee = null;
        this.applee = null;
        this.score = 0;
        this.timeout = null;
        this.launchToDo = true;
    }

    init(){
        this.canvas.width = this.canvasWidth;
        this.canvas.height = this.canvasHeight;
        this.canvas.style.border = "30px solid gray";
        this.canvas.style.margin = "50px auto";
        this.canvas.style.display = "block";
        this.canvas.style.backgroundColor = "#ddd";
        document.body.appendChild(this.canvas);
        this.launch();
    }

    launch(){
        if (this.launchToDo){
            this.launchToDo = false;
            this.snakee = new Snake("right", [6,4],[5,4],[4,4],[3,4],[2,4]);
            this.applee = new Apple();
            this.score = 0;
            this.delay = 100;
            clearTimeout(this.timeout);
            this.refreshCanvas();
        }
    }

    refreshCanvas(){
        this.snakee.advance();
        if (this.snakee.checkCollision(this.minX,this.maxX,this.minY,this.maxY)){
            Drawing.gameOver(this);
        } else {
            if (this.snakee.isEatingApple(this.applee)) {
                //Le serpent a mangé la pomme
                this.score++;
                this.snakee.ateApple = true;
                this.applee.setNewPosition(this.snakee, this.widthInBlocks, this.heightInBlocks);
                if (this.score % 5 === 0) {
                    this.speedUp()
                }
            }
            this.ctx.clearRect(0,0,this.canvasWidth,this.canvasHeight);
            Drawing.drawScore(this.ctx,this.centreX,this.centreY,this.score);
            Drawing.drawSnake(this.ctx, this.snakee, this.blockSize);
            Drawing.drawApple(this.ctx, this.applee, this.blockSize);
            this.timeout = setTimeout(this.refreshCanvas.bind(this),this.delay);
        }
    }

    speedUp() {
        this.delay /= 2;
    }

}
