window.onload = function(){
    var canvas;
    var ctx;
    var delay = 100;
    var xCoord = 0;
    var yCoord = 0;

    function init(){
        canvas = document.createElement('canvas');
        canvas.width = 900;
        canvas.height = 600;
        canvas.style.border = "1px solid";
        document.body.appendChild(canvas);
        ctx = canvas.getContext('2d');
        refreshCanvas();
    }
    
    function refreshCanvas(){
        ctx.clearRect(0,0,canvas.width,canvas.height);
        ctx.fillStyle = "#ff0000";
        xCoord += 5;
        yCoord += 5;
        ctx.fillRect(xCoord, yCoord, 100, 50);
        setTimeout(refreshCanvas,delay);
    }
    
    init();
    
}
