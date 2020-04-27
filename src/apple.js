  export default class Apple {
        
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
