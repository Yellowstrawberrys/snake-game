/**
 * en_us (American English) || en_gb (British English)
 * 
 *                   Snake Game 4 MICRO:BIT
 * ___________________________________________________________
 * Developed by Eunsoo.Jung && Developed with Typescript
 *
 * Follow me on Github, Instagram
 *
 * Github: @yellowstrawberrys (main), @yellowstrawberry (sub)
 * Instagram: @yellowstrawberry3009
 * ___________________________________________________________
 *  
 * 'HOW TO PLAY'
 * 
 * > It's simple. 
 * 
 * Press A & B to start the game.
 * Press A to turn 90° to the left.
 * Press B to turn 90° to the right.
 */

/**
 * ko_kr (한국어) || ko_kp (조선어 ㅋㅋ (장난인거 알지?))
 * 
 *               MICRO:BIT를 위한 스네이크 게임
 * ___________________________________________________________
 * 개발: 정은수, 개발언어: Typescript
 * 
 * "정보시간에 할거 없어서 조금씩 만들었다는게 학계의 전설"
 * 
 * 깃허브: @yellowstrawberrys (본계), @yellowstrawberry (부계)
 * 인스타: @yellowstrawberry3009
 * ___________________________________________________________
 * 
 * :: 플레이 방법 ::
 * 
 * A 와 B 버튼을 눌러 게임을 시작
 * A 버튼을 눌러 왼쪽으로 90도 회전
 * B 버튼을 눌러 오른쪽으로 90도 회전
 */
// Boolean
let isGameRunning:boolean = false;

// Coordinate
let x:number[] = [1], y:number[] = [4];
let appleX:number = 1, appleY:number = 2;

//Length
let snakeLength:number = 0;

//Facing
/**
 * 0 = North;
 * 1 = Easth;
 * 2 = South;
 * 3 = West;
 */
let direction:number[] = [0];
let headDirection:number = 0;

//Events
function onInit() {
    reset();
}

function onAPressed() {
    headDirection = headDirection > 2 ? 0 : headDirection + 1;
}

function onBPressed() {
    headDirection = headDirection < 1 ? 3 : headDirection - 1;
}

function onABPressed() {
    if (!isGameRunning) {
        snakeLength = 1;
        led.stopAnimation();
        for (let i = 3; i > 0; i--) {
            basic.showNumber(i);
            basic.pause(100);
        }
        basic.clearScreen();
        isGameRunning = true;
    }
}

function loop() {
    if(isGameRunning) {
        if (x[0] > 4 || x[0] < 0 || y[0] > 4 || y[0] < 0) {
            basic.clearScreen();
            basic.showString("LOSE");
            basic.showLeds(`
            . . . . .
            . # . # .
            . . . . .
            . # # # .
            # . . . #
            `);
            basic.pause(2000);
            basic.clearScreen();
            basic.showString("SCORE: ");
            basic.showNumber(snakeLength);
            basic.pause(5000);
            basic.clearScreen();
            reset();
            isGameRunning = false;
            return;
        }
        drawSnake();
        drawApple();
        basic.pause(500);
    }else if(snakeLength == 0){
        basic.showString("PRESS AB TO START");
    }
}

//Drawing
function drawSnake() {
    manageDir();
    
    //Child
    for (let i = 0; i < snakeLength; i++) {
        move(i);
        led.plot(x[i], y[i]);
    }

    led.unplot(
        x[snakeLength - 1] - calculateX(snakeLength - 1),
        y[snakeLength - 1] - calculateY(snakeLength - 1)
    );
} 

function drawApple(): void {
    if (appleX == x[0] && appleY == y[0]) {
        addSnake();
        calculateNewLocationOfApple();
    }
    led.plot(appleX, appleY);
}

//Moving
function manageDir() {
    while (direction.length > snakeLength)
        direction.pop();
    direction.insertAt(0, headDirection);
}

function move(num:number) {
    x[num] += calculateX(num);
    y[num] += calculateY(num);
}

// Add || Remove || Reset
function addSnake() {
    let dir = direction[direction.length - 1];
    x.push(x[snakeLength - 1] - calculateX(snakeLength - 1));
    y.push(y[snakeLength - 1] - calculateY(snakeLength - 1));
    snakeLength++;
}

function reset() {
    snakeLength = 0;
    x = [1];
    y = [4];
    direction = [0];
    headDirection = 0;
    appleX = 1;
    appleY = 2;
}

//Calculation
function calculateX(num:number) {
    if(direction[num] == 1){
        return -1;
    } else if(direction[num] == 3){
        return 1;
    } else {
        return 0;
    }
}

function calculateY(num: number) {
    if (direction[num] == 0) {
        return -1;
    } else if (direction[num] == 2) {
        return 1;
    } else {
        return 0;
    }
}

function calculateNewLocationOfApple() {
    let usedSpace:number[] = [];
    let debug = 0;

    for (let i = 0; i < snakeLength; i++) {
        usedSpace.push((x[i] + 1) * (y[i] + 1));
    }

    console.log(usedSpace);

    let ranSpace = calculateRandomExceptFor(usedSpace, 1, 25);

    appleY = Math.ceil(ranSpace/5)-1;
    appleX = ranSpace - (5 * appleY)-1;
}

function calculateRandomExceptFor(nums:number[], fronn:number, to:number): number {
    let ran = randint(fronn, to);

    if(nums.indexOf(ran) > -1) 
        return calculateRandomExceptFor(nums, fronn, to);
    else 
        return ran;
}

// Signing Events
onInit();
basic.forever(loop);
input.onButtonPressed(Button.A, onAPressed);
input.onButtonPressed(Button.B, onBPressed);
input.onButtonPressed(Button.AB, onABPressed);