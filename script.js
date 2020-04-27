window.onload = () => {

    class Game {
        
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
    
    class Snake {
        
        constructor(direction, ...body){
            this.body = body;
            this.direction = direction;
            this.ateApple = false;
        }

        advance(){
            const nextHeadPosition = this.body[0].slice(); // pour copier la tête et non faire une référence.
            switch(this.direction){
                case "left":
                    nextHeadPosition[0]--;
                    break;
                case "right":
                    nextHeadPosition[0]++;
                    break;
                case "down":
                    nextHeadPosition[1]++;
                    break;
                case "up":
                    nextHeadPosition[1]--;
                    break;
                default:
                    throw("Invalid Direction");
            }
            this.body.unshift(nextHeadPosition);
            if (!this.ateApple){
                this.body.pop();            
            } else {
                this.ateApple = false;
            }
        }

        setDirection(newDirection){
            let allowedDirections;
            switch(this.direction){
                case "left":
                case "right":
                    allowedDirections = ["up","down"];
                    break;
                case "down":
                case "up":
                    allowedDirections = ["left","right"];
                    break;
                default:
                    throw("Invalid Direction");
            }
            if (allowedDirections.indexOf(newDirection) > -1){
                this.direction = newDirection;
            }
        }
    
        checkCollision(minX,maxX,minY,maxY){
            const [head, ...rest] = this.body
            const [headSnakeX, headSnakeY] = head
            const isNotBetweenHorizontalWalls = headSnakeX<minX ||headSnakeX>maxX;
            const isNotBetweenVerticalWalls = headSnakeY<minY ||headSnakeY>maxY;
            let wallCollision = false;
            let snakeCollision = false;
            
            if (isNotBetweenHorizontalWalls || isNotBetweenVerticalWalls){
                wallCollision = true;
            } else {
                for (const block of rest){
                    if (headSnakeX === block[0] && headSnakeY === block[1]){
                        snakeCollision = true;
                        break;
                    }
                }
            }
            
            return wallCollision || snakeCollision;
        }

        isEatingApple(appleToEat){
            const head = this.body[0];
            
            return (head[0] === appleToEat.position[0] && head[1] === appleToEat.position[1]);
        }

    }

    class Apple {
        
        constructor(position = [10,10]){
            this.position = position;
        }

        setNewPosition(snake, widthInBlocks, heightInBlocks){
            
            let newX;
            let newY;

            do{
                newX = Math.round(Math.random() * (widthInBlocks-1));
                newY = Math.round(Math.random() * (heightInBlocks-1));
                this.position = [newX,newY];
            }
            while(this.isOnSnake(snake))
        }
        
        isOnSnake(snakeToCheck){
            let isOnSnake = false;
            
            for (const block of snakeToCheck.body){
                if (this.position[0] === block[0] && this.position[1] === block[1]){
                    isOnSnake = true;
                    break;
                }
            }
            
            return isOnSnake;
                    
        }

    }
        
    class Drawing {

        static gameOver(game) {
            game.launchToDo = true;
            game.ctx.save();
            game.ctx.font = "bold 70px sans-serif";
            game.ctx.fillStyle = "#000";
            game.ctx.textAlign = "center";
            game.ctx.textBaseline = "middle";
            game.ctx.strokeStyle = "white";
            game.ctx.lineWidth = 5;
            game.ctx.strokeText("Game Over", game.centreX, game.centreY-180);
            game.ctx.fillText("Game Over", game.centreX, game.centreY-180);
            game.ctx.font = "bold 30px sans-serif";
            game.ctx.strokeText("Appuyer sur la touche Espace pour rejouer", game.centreX, game.centreY-120);
            game.ctx.fillText("Appuyer sur la touche Espace pour rejouer", game.centreX, game.centreY-120);
            game.ctx.restore();
        }
        
        static drawScore(ctx, centreX, centreY, score){
            ctx.save();
            ctx.font = "bold 200px sans-serif";
            ctx.fillStyle = "gray";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(score.toString(), centreX, centreY);
            ctx.restore();
        }

        static drawBlock(ctx, position, blockSize){
            const [x,y] = position;
            ctx.fillRect(x * blockSize, y * blockSize, blockSize, blockSize);
        }

        static drawSnake(ctx, snake, blockSize){
            ctx.save();
            ctx.fillStyle = "#ff0000";
            for(const block of snake.body){
                this.drawBlock(ctx, block, blockSize);
            }
            ctx.restore();
        }

        static drawApple(ctx, apple, blockSize){
            const radius = blockSize/2;
            const x= apple.position[0]*blockSize + radius;
            const y= apple.position[1]*blockSize + radius;
            ctx.save();
            ctx.fillStyle = "#33cc33";
            ctx.beginPath();
            ctx.arc(x,y,radius,0,Math.PI*2,true);
            ctx.fill();
            ctx.restore();
        }
        
    }

    const snakeGame = new Game();
    snakeGame.init();
    
    document.onkeydown = (e) => {
        const key = e.keyCode;
        let newDirection;
        switch(key){
            case 37:
                newDirection = "left";
                break;
            case 38:
                newDirection = "up";
                break;
            case 39:
                newDirection = "right";
                break;
            case 40:
                newDirection = "down";
                break;
            case 32:
                snakeGame.launch();
                return;
            default:
                return;
        }
        snakeGame.snakee.setDirection(newDirection);
    }
    
}
