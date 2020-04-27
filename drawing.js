  export default class Drawing {

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
