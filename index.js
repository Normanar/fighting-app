const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

const gravity = 0.7

c.fillRect(0, 0, canvas.width, canvas.height)

class Sprite {
    constructor({position, velocity, color, offset}) {
        this.position = position
        this.velocity = velocity
        this.height = 150
        this.width = 50
        this.color = color
        this.lastKey
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y,
            },
            offset,
            width: 100,
            height: 50,
        }
        this.isAttacking
        this.health = 100
    }

    draw() {
        c.fillStyle = this.color
        c.fillRect(this.position.x, this.position.y, this.width, this.height)

        // attack box
        if (this.isAttacking) {
            c.fillRect(this.attackBox.position.x,
                this.attackBox.position.y,
                this.attackBox.width,
                this.attackBox.height)
        }
    }

    update() {
        this.draw()

        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x
        this.attackBox.position.y = this.position.y

        if (this.position.y + this.height + this.velocity.y >= canvas.height) {
            this.velocity.y = 0
        } else {
            this.velocity.y += gravity
        }
    }

    attack() {
        this.isAttacking = true
        setTimeout(() => this.isAttacking = false, 100)
    }
}

const player = new Sprite({
    position: {
        x: 30,
        y: 0,
    },
    velocity: {
        x: 0,
        y: 0,
    },
    color: "green",
    offset: {
        x: 0,
        y: 0,
    }
})

const enemy = new Sprite({
    position: {
        x: 944,
        y: 100,
    },
    velocity: {
        x: 0,
        y: 0,
    },
    color: "red",
    offset: {
        x: -50,
        y: 0,
    }
})

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    arrowRight: {
        pressed: false
    },
    arrowLeft: {
        pressed: false
    },
}

let jumpPlayer = true
let jumpEnemy = true

function playersCollision({attacking, defending}) {
    return (
        attacking.attackBox.position.x + attacking.attackBox.width >= defending.position.x
        && attacking.attackBox.position.x <= defending.position.x + defending.width
        && attacking.attackBox.position.y + attacking.attackBox.height >= defending.position.y
        && attacking.attackBox.position.y <= defending.position.y + defending.height
    )
}

function determineWinner({player, enemy}) {
    document.querySelector('#fightingResult').style.display = "flex"
    if (player.health === enemy.health) {
        document.querySelector('#fightingResult').innerHTML = "Tie!"
    } else if (player.health > enemy.health) {
        document.querySelector('#fightingResult').innerHTML = "Player 1 win!"
    } else {
        document.querySelector('#fightingResult').innerHTML = "Player 2 win!"
    }
}

let timer = 60;
let timerId;

function decreaseTimer() {
    if (timer > 0) {
        timerId = setTimeout(decreaseTimer, 1000)
        timer -= 1
        document.querySelector('#timer').innerHTML = timer + ''
    }

    if (timer === 0) {
        determineWinner({player, enemy})
    }
}

decreaseTimer()

function animate() {
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    player.update()
    enemy.update()
    window.requestAnimationFrame(animate)

    player.velocity.x = 0
    enemy.velocity.x = 0

    //player movement
    if (keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -4
    } else if (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 4
    }

    //enemy movement
    if (keys.arrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -4
    } else if (keys.arrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = 4
    }

    // detect for collision
    if (playersCollision({attacking: player, defending: enemy})
        && player.isAttacking
    ) {
        player.isAttacking = false
        enemy.health -= 20
        document.querySelector('#enemyHealth').style.width = enemy.health + '%'
    }

    if (playersCollision({attacking: enemy, defending: player})
        && enemy.isAttacking
    ) {
        enemy.isAttacking = false
        player.health -= 20
        document.querySelector('#playerHealth').style.width = player.health + '%'
    }

    if(player.health <= 0 || enemy.health <= 0) {
        determineWinner({player, enemy})
        clearTimeout(timerId)
    }
}

animate()

window.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'd' :
            keys.d.pressed = true
            player.lastKey = 'd'
            break
        case 'a' :
            keys.a.pressed = true
            player.lastKey = 'a'
            break
        case 'w' :
            if (jumpPlayer) {
                player.velocity.y = -20
                jumpPlayer = false
                setTimeout(() => jumpPlayer = true, 800)
            }
            break
        case 's' :
            player.attack()
            break


        case 'ArrowRight' :
            keys.arrowRight.pressed = true
            enemy.lastKey = 'ArrowRight'
            break
        case 'ArrowLeft' :
            keys.arrowLeft.pressed = true
            enemy.lastKey = 'ArrowLeft'
            break
        case 'ArrowUp' :
            if (jumpEnemy) {
                enemy.velocity.y = -20
                jumpEnemy = false
                setTimeout(() => jumpEnemy = true, 1000)
            }
            break
        case 'ArrowDown' :
            enemy.attack()
            break
    }
})

window.addEventListener('keyup', (e) => {
    switch (e.key) {
        case 'd' :
            keys.d.pressed = false
            break
        case 'a' :
            keys.a.pressed = false
            break


        case 'ArrowRight' :
            keys.arrowRight.pressed = false
            break
        case 'ArrowLeft' :
            keys.arrowLeft.pressed = false
            break
    }
})