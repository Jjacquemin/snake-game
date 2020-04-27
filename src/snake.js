export default class Snake {
        
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
        if (allowedDirections.includes(newDirection)){
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
