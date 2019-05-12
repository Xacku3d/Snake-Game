window.onload = function() {
    //START SETTINGS
    let gameSpeed = 300;
    let speedLevel = 1;
    let gameStart = false;
    let gameEnd = false;
    let x = 20;
    let y = 20;
    let snakeDirection = 'up';
    let xTotal = [x];
    let yTotal = [y];

    //INFO DIV
    const infoPlace = document.createElement('div');
    infoPlace.className = 'infoPlace';

    //SCORE CREATING
    let score = 0;
    const scoreP = document.createElement('p');
    infoPlace.appendChild(scoreP);

    //GAMESPEED
    const gameSpeedDiv = document.createElement('div');
    gameSpeedDiv.className = 'score';
    const currentGameSpeed = document.createElement('p');
    currentGameSpeed.textContent = `Stage: ${score} | Speed Level: ${speedLevel} | Score: ${score*speedLevel}`;
    gameSpeedDiv.appendChild(currentGameSpeed);

    //RESTART BUTTON CREATING
    const restartButton = document.createElement('button');
    restartButton.id = 'restart';
    restartButton.textContent = 'Restart!';

    document.body.appendChild(infoPlace);
    infoPlace.appendChild(gameSpeedDiv);
    infoPlace.appendChild(restartButton);
    restartButton.onclick = () => {
        restart();
    }

    //TABLE CREATING
    const table = document.createElement('table');
    const fragment = document.createDocumentFragment();
    table.id = 'table';
    const w = 32;
    const h = 32;
    let r = 0;
    while(r < h) {
        r++;
        tr = table.insertRow(-1);
        let c = 0;
        while(c < w) {
            c++;
            tr.insertCell(-1).id = `cell ${r} ${c}`;
        }
    }
    document.body.appendChild(fragment.appendChild(table));
    let currentPlace = document.getElementById(`cell ${x} ${y}`);
    currentPlace.style.backgroundColor = 'rgb(82, 82, 82)';

    //RESTART
    const restart = () => {
        for (let i = 1; i <= h; i++) {
            for (let j = 1; j <= w; j++) {
                currentPlace = document.getElementById(`cell ${i} ${j}`);
                currentPlace.style.backgroundColor = 'rgb(245, 245, 245)';
            }
        }
        x = 20;
        y = 20;
        xTotal = [x];
        yTotal = [y];
        snakeDirection = 'up';
        score = 0;
        currentGameSpeed.textContent = `Stage: ${score} | Speed Level: ${speedLevel} | Score: ${score*speedLevel}`;
        gameEnd = false;
        table.style = 'border: 2px solid rgb(82, 82, 82);';
        renderSnake(x,y);
        showFood(foodX, foodY);
        update();
    }

    //RANDOM 
    const getRandomInt = (min, max) => {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    //FOOD
    let food;
    let foodX;
    let foodY;
    const showFood = (x,y) => {
        food = document.getElementById(`cell ${x} ${y}`);
        food.style.backgroundColor = 'green';
    }
    const renderFood = () => {
        foodX = getRandomInt(1, h);
        foodY = getRandomInt(1, w);
        showFood(foodX, foodY);
    }

    //BOOST
    let boost;
    let boostX;
    let boostY;
    let boostUse = false;
    let scoreCheck = 0;
    const showBoost = (x,y) => {
        boost = document.getElementById(`cell ${x} ${y}`);
        boost.style.backgroundColor = 'blue';
        boost.style.borderRadius = '15px';
    }
    const renderBoost = () => {
        boostX = getRandomInt(1, h);
        boostY = getRandomInt(1, w);
        showBoost(boostX, boostY);
    }

    const renderSnake = (x,y) => {
        currentPlace = document.getElementById(`cell ${x} ${y}`);
        currentPlace.style.borderRadius = '3px';
        currentPlace.style.backgroundColor = 'rgb(82, 82, 82)';
    }
    const deleteDot = (x,y) => {
        xTotal.pop();
        yTotal.pop();
        currentPlace = document.getElementById(`cell ${x} ${y}`);
        currentPlace.style.backgroundColor = 'rgb(245, 245, 245)';
    }

    //MOVE FUNCTIONS
    const move = (xNew, yNew) => {
        //End game
        for (let i = 1; i < xTotal.length; i++){
            if ( xNew == xTotal[i] && yNew == yTotal[i] ) {
                currentGameSpeed.textContent = `Final score: ${speedLevel*score}`
                table.style = "border: solid 6px red";
                gameEnd = true;
            }
        }

        if ( xNew == boostX && yNew == boostY ) {
            boostUse = false;
            if (gameSpeed <= 300) {
                gameSpeed = gameSpeed - 50;
                speedLevel = (350-gameSpeed)/50
            } else { speedLevel = 'Max'}
            currentGameSpeed.textContent = `Stage: ${score} | Speed Level: ${speedLevel} | Score: ${score*speedLevel}`;
            startGame(gameSpeed);
        }

        if ( xNew == foodX && yNew == foodY ) {
            score += 1;
            if (score%5 == 0 && !boostUse && score > scoreCheck) {
                scoreCheck =+ 5;
                boostUse = true;
                renderBoost();
            }
            renderFood();
            renderSnake(xNew,yNew);
            xTotal.unshift(xNew);
            yTotal.unshift(yNew);
            currentGameSpeed.textContent = `Score: ${score} | Speed Level: ${speedLevel} | Score: ${score*speedLevel}`;
        } else {
            renderSnake(xNew,yNew);
            xTotal.unshift(xNew);
            yTotal.unshift(yNew);
            deleteDot( xTotal[ xTotal.length - 1 ], yTotal[ yTotal.length - 1 ] );
        }
    }
    const moveUp = () => {
        if (snakeDirection == 'down') return;
        snakeDirection = 'up';
        x -= 1;
        checkWalls(x,y);
        move(x,y);
    }
    const moveLeft = () => {
        if (snakeDirection == 'right') return;
        snakeDirection = 'left';
        y += 1;
        checkWalls(x,y);
        move(x,y);
    }
    const moveDown = () => {
        if (snakeDirection == 'up') return;
        snakeDirection = 'down';
        x += 1;
        checkWalls(x,y);
        move(x,y);
    }
    const moveRight = () => {
        if (snakeDirection == 'left') return;
        snakeDirection = 'right';
        y -= 1;
        checkWalls(x,y);
        move(x,y);
    }
    //Go through walls
    const checkWalls = (xNew,yNew) => {
        if ( xNew < 1 ) x = h;
        if ( yNew > w ) y = 1;
        if ( xNew > h ) x = 1;
        if ( yNew < 1 ) y = w;
    }
    document.onkeydown = (event) => {
        if (gameEnd) {
            return alert('Вы проиграли!');
        }
        else if (!gameStart) {
            gameStart = true
            startGame(gameSpeed);
            renderFood();
        }
        if (event.keyCode == 38) {
            if(snakeDirection == 'up'){return}
            //Move UP
            moveUp();
        } else if (event.keyCode == 39) {
            if(snakeDirection == 'left'){return}
            //Move LEFT
            moveLeft();
        } else if (event.keyCode == 40) {
            if(snakeDirection == 'down'){return}
            //Move DOWN
            moveDown();
        } else if(event.keyCode == 37) {
            if(snakeDirection == 'right'){return}
            //Move RIGHT
            moveRight();
        }
    }
    const update = () => {
        if (gameEnd) {
        } else {
            if (snakeDirection == 'up') {
                moveUp();
            } else if (snakeDirection == 'left') {
                moveLeft();
            } else if (snakeDirection == 'down') {
                moveDown();
            } else {
                moveRight();
            }
        }
    }

    //GAME START
    const startGame = (speed) => {
        setTimeout(function () {
            update();
            startGame(speed);
        }, speed);
    }

}