window.onload = () => {
    const canvasWidth = 900;
    const canvasHeight = 600;
    const blockSize = 30;
    const canvas= document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const widthInBlocks = canvasWidth/blockSize;
    const heightInBlocks = canvasHeight/blockSize;
    const centreX = canvasWidth/2;
    const centreY = canvasHeight/2;
    const minX = 0;
    const minY = 0;
    const maxX = widthInBlocks-1;
    const maxY = heightInBlocks-1;
    let delay;
    let snakee;
    let applee;
    let score;
    let timeout;
    let launchToDo = true;

    const init = () => {
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        canvas.style.border = "30px solid gray";
        canvas.style.margin = "50px auto";
        canvas.style.display = "block";
        canvas.style.backgroundColor = "#ddd";
        document.body.appendChild(canvas);
        launch();
    };
    
    const launch = () => {
        if (launchToDo){
            launchToDo = false;
            snakee = new Snake([[6,4],[5,4],[4,4],[3,4],[2,4]], "right");
            applee = new Apple([10,10]);
            score = 0;
            delay = 100;
            clearTimeout(timeout);
            refreshCanvas();
        }
    };
    
    const refreshCanvas = () => {
        snakee.advance();
        if (snakee.checkCollision()){
            gameOver();
        } else {
            if (snakee.isEatingApple(applee)) {
                //Le serpent a mangé la pomme
                score++;
                snakee.ateApple = true;
                applee.setNewPosition();
                if (score % 5 === 0) {
                    speedUp()
                }
            }
            ctx.clearRect(0,0,canvasWidth,canvasHeight);
            drawScore();
            snakee.draw();
            applee.draw();
            timeout = setTimeout(refreshCanvas,delay);
        }
    };
    
    const gameOver = () => {
        launchToDo = true;
        ctx.save();
        ctx.font = "bold 70px sans-serif";
        ctx.fillStyle = "#000";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.strokeStyle = "white";
        ctx.lineWidth = 5;
        ctx.strokeText("Game Over", centreX, centreY-180);
        ctx.fillText("Game Over", centreX, centreY-180);
        ctx.font = "bold 30px sans-serif";
        ctx.strokeText("Appuyer sur la touche Espace pour rejouer", centreX, centreY-120);
        ctx.fillText("Appuyer sur la touche Espace pour rejouer", centreX, centreY-120);
        ctx.restore();
    };
    
    const speedUp = () => {
        delay /= 2;
    };
    
    const drawScore = () => {
        ctx.save();
        ctx.font = "bold 200px sans-serif";
        ctx.fillStyle = "gray";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(score.toString(), centreX, centreY);
        ctx.restore();
    };
    
    const drawBlock = (ctx, position) => {
        const x = position[0] * blockSize;
        const y = position[1] * blockSize;
        ctx.fillRect(x, y, blockSize, blockSize);
    };

    function Snake(body, direction){
        this.body = body;
        this.direction = direction;
        this.ateApple = false;
        
        this.draw = function(){
            ctx.save();
            ctx.fillStyle = "#ff0000";
            for(let i=0; i < this.body.length; i++){
                drawBlock(ctx, this.body[i]);
            }
            ctx.restore();
        };
        
        this.advance = function(){
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
        };
        
        this.setDirection = function(newDirection){
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
        };
        
        this.checkCollision = function(){
            const head = this.body[0];
            const rest = this.body.slice(1);
            const headSnakeX = head[0];
            const headSnakeY = head[1];
            const isNotBetweenHorizontalWalls = headSnakeX<minX ||headSnakeX>maxX;
            const isNotBetweenVerticalWalls = headSnakeY<minY ||headSnakeY>maxY;
            let wallCollision = false;
            let snakeCollision = false;
            
            if (isNotBetweenHorizontalWalls || isNotBetweenVerticalWalls){
                wallCollision = true;
            } else {
                for (let i=0; i<rest.length; i++){
                    if (headSnakeX === rest[i][0] && headSnakeY === rest[i][1]){
                        snakeCollision = true;
                        break;
                    }
                }
            }
            
            return wallCollision || snakeCollision;
        };

        this.isEatingApple = function(appleToEat){
            const head = this.body[0];
            
            return (head[0] === appleToEat.position[0] && head[1] === appleToEat.position[1]);
        };

    }

    function Apple(position){
        this.position = position;
        
        this.draw = function(){
            const radius = blockSize/2;
            const x= this.position[0]*blockSize + radius;
            const y= this.position[1]*blockSize + radius;
            ctx.save();
            ctx.fillStyle = "#33cc33";
            ctx.beginPath();
            ctx.arc(x,y,radius,0,Math.PI*2,true);
            ctx.fill();
            ctx.restore();
        };

        this.setNewPosition = function(){
            
            let newX;
            let newY;

            do{
                newX = Math.round(Math.random() * (widthInBlocks-1));
                newY = Math.round(Math.random() * (heightInBlocks-1));
                this.position = [newX,newY];
            }
            while(this.isOnSnake(snakee))
        };
        
        this.isOnSnake = function(snakeToCheck){
            let isOnSnake = false;
            
            for (let i=0;i<snakeToCheck.body.length;i++){
                if (this.position[0] === snakeToCheck.body[i][0] && this.position[1] === snakeToCheck.body[i][1]){
                    isOnSnake = true;
                    break;
                }
            }
            
            return isOnSnake;
                    
        };
    }

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
                launch();
                return;
            default:
                return;
        }
        snakee.setDirection(newDirection);
    }
    
    init();
    
}
