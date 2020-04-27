import Game from "./game.js";

window.onload = () => {

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
