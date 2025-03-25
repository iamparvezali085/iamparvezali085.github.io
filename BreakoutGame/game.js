// Import Phaser
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false // Ensure debug mode is off
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);
let paddle;
let ball;
let bricks;
let cursors;
let gameOverText;

function preload() {
    this.load.image('background', 'background.jpg');
    this.load.image('paddle', 'paddle.jpg');
    this.load.image('ball', 'ball.jpg');
    this.load.image('brick', 'brick.png');
}

function create() {
    this.add.image(400, 300, 'background'); // Set background image
    
    paddle = this.physics.add.sprite(400, 550, 'paddle').setImmovable();
    paddle.body.allowGravity = false;
    paddle.setCollideWorldBounds(true);
    
    ball = this.physics.add.sprite(400, 500, 'ball');
    ball.setCollideWorldBounds(true);
    ball.setBounce(1);
    ball.setVelocity(200, -200);
    
    bricks = this.physics.add.staticGroup();
    let brickSpacingX = 10; // Horizontal space between bricks
    let brickSpacingY = 10; // Vertical space between bricks
    let brickWidth = 70;
    let brickHeight = 30;
    
    for (let x = 80; x < 720; x += (brickWidth + brickSpacingX)) {
        for (let y = 50; y < 250; y += (brickHeight + brickSpacingY)) {
            bricks.create(x, y, 'brick');
        }
    }
    
    this.physics.add.collider(ball, paddle, hitPaddle, null, this);
    this.physics.add.collider(ball, bricks, hitBrick, null, this);
    
    cursors = this.input.keyboard.createCursorKeys();
    
    gameOverText = this.add.text(400, 300, '', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);
}

function update() {
    paddle.setVelocityX(0);
    
    if (cursors.left.isDown) {
        paddle.setVelocityX(-300);
    } else if (cursors.right.isDown) {
        paddle.setVelocityX(300);
    }

    // Check if the ball touches the bottom of the screen
    if (ball.y > 600) {
        gameOver('Game Over! You Lost');
    }
    
    // If all bricks are destroyed, display win message
    if (bricks.countActive() === 0) {
        this.time.delayedCall(500, () => gameOver('Congratulations! You Win!'), [], this);
    }
}

function hitPaddle(ball, paddle) {
    let diff = ball.x - paddle.x;
    ball.setVelocityX(10 * diff);
}

function hitBrick(ball, brick) {
    brick.destroy();
    if (bricks.countActive() === 0) {
        this.time.delayedCall(500, () => gameOver('Congratulations! You Win!'), [], this);
    }
}

function gameOver(message) {
    ball.setVelocity(0);
    gameOverText.setText(message);
    this.physics.pause();
}
