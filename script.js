window.onload = function(){
    var canvasWidth = 900;
    var canvasHeight = 600;
    var blockSize = 30;
    var canvas;
    var ctx;
    var delay = 100;
    var snakee;
    var applee;
    var widthInBlocks = canvasWidth/blockSize;
    var heightInBlocks = canvasHeight/blockSize;

    function init(){
        canvas = document.createElement('canvas');
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        canvas.style.border = "1px solid";
        document.body.appendChild(canvas);
        ctx = canvas.getContext('2d');
        snakee = new Snake([[6,4],[5,4],[4,4],[3,4],[2,4]], "right");
        applee = new Apple([10,10]);
        refreshCanvas();
    }
    
    function refreshCanvas(){
        snakee.advance();
        if (snakee.checkCollision()){
            //Game Over
        } else {
            if (snakee.isEatingApple(applee)) {
                //Le serpent a mangé la pomme
                snakee.ateApple = true;
                applee.setNewPosition();
            }
            ctx.clearRect(0,0,canvasWidth,canvasHeight);
            snakee.draw();
            applee.draw();
            setTimeout(refreshCanvas,delay);
        }
    }
    
    function drawBlock(ctx, position){
        var x = position[0] * blockSize;
        var y = position[1] * blockSize;
        ctx.fillRect(x, y, blockSize, blockSize);
    }

    function Snake(body, direction){
        this.body = body;
        this.direction = direction;
        this.ateApple = false;
        
        this.draw = function(){
            ctx.save();
            ctx.fillStyle = "#ff0000";
            for(var i=0; i < this.body.length; i++){
                drawBlock(ctx, this.body[i]);
            }
            ctx.restore();
        };
        
        this.advance = function(){
            var nextHeadPosition = this.body[0].slice(); // pour copier la tête et non faire une référence.
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
            var allowedDirections;
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
            var wallCollision = false;
            var snakeCollision = false;
            
            var head = this.body[0];
            var rest = this.body.slice(1);
            var headSnakeX = head[0];
            var headSnakeY = head[1];
            var minX = 0;
            var minY = 0;
            var maxX = widthInBlocks-1;
            var maxY = heightInBlocks-1;

            var isNotBetweenHorizontalWalls = headSnakeX<minX ||headSnakeX>maxX;
            var isNotBetweenVerticalWalls = headSnakeY<minY ||headSnakeY>maxY;
            
            if (isNotBetweenHorizontalWalls || isNotBetweenVerticalWalls){
                wallCollision = true;
            } else {
                for (var i=0; i<rest.length; i++){
                    if (headSnakeX === rest[i][0] && headSnakeY === rest[i][1]){
                        snakeCollision = true;
                        break;
                    }
                }
            }
            
            return wallCollision || snakeCollision;
        };

        this.isEatingApple = function(appleToEat){
            var head = this.body[0];
            
            return (head[0] === appleToEat.position[0] && head[1] === appleToEat.position[1]);
        };

    }

    function Apple(position){
        this.position = position;
        
        this.draw = function(){
            ctx.save();
            ctx.fillStyle = "#33cc33";
            ctx.beginPath();
            var radius = blockSize/2;
            var x= this.position[0]*blockSize + radius;
            var y= this.position[1]*blockSize + radius;
            ctx.arc(x,y,radius,0,Math.PI*2,true);
            ctx.fill();
            ctx.restore();
        };

        this.setNewPosition = function(){
            
            var newX;
            var newY;

            do{
                newX = Math.round(Math.random() * (widthInBlocks-1));
                newY = Math.round(Math.random() * (heightInBlocks-1));
                this.position = [newX,newY];
            }
            while(this.isOnSnake(snakee))
        };
        
        this.isOnSnake = function(snakeToCheck){
            var isOnSnake = false;
            
            for (var i=0;i<snakeToCheck.body.length;i++){
                if (this.position[0] === snakeToCheck.body[i][0] && this.position[1] === snakeToCheck.body[i][1]){
                    isOnSnake = true;
                    break;
                }
            }
            
            return isOnSnake;
                    
        };
    }

    document.onkeydown = function handleKeyDown(e){
        var key = e.keyCode;
        var newDirection;
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
            default:
                return;
        }
        snakee.setDirection(newDirection);
    }
    
    
    init();
    
}
