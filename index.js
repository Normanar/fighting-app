const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

const gravity = 0.7
const playerPathImg = 'medievalKing'

c.fillRect(0, 0, canvas.width, canvas.height)

const background = new Sprite({
    position: {
        x: 0,
        y: 0,
    },
    imageSrc : "./img/background.png"
})

const shop = new Sprite({
    position: {
        x: 600,
        y: 162,
    },
    imageSrc : "./img/shop.png",
    scale : 2.5,
    framesMax : 6,
})

const player = new Fighter({
    position: {
        x: 40,
        y: 200,
    },
    velocity: {
        x: 0,
        y: 0,
    },
    offset: {
        x: 0,
        y: 0,
    },
    imageSrc : "./img/martialHero/Idle.png",
    framesMax : 8,
    scale : 2.5,
    offsetImg : {
        x : 150,
        y : 110
    },
    sprites : {
        idle : {
            imageSrc : `./img/${playerPathImg}/Idle.png`,
            framesMax : 8,
        },
        run : {
            imageSrc : `./img/${playerPathImg}/Run.png`,
            framesMax : 8,
        },
        jump : {
            imageSrc : `./img/${playerPathImg}/Jump.png`,
            framesMax : 2,
        },
        fall : {
            imageSrc : `./img/${playerPathImg}/Fall.png`,
            framesMax : 2,
        },
        attack : {
            imageSrc : `./img/${playerPathImg}/Attack3.png`,
            framesMax : 4,
        },
    }
})

const enemy = new Fighter({
    position: {
        x: 944,
        y: 200,
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



decreaseTimer()

function animate() {
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    background.update()
    shop.update()
    player.update()
    //enemy.update()
    player.velocity.x = 0
    enemy.velocity.x = 0

    //player movement

    if (keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -4
        player.switchSprite('run')
    } else if (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 4
        player.switchSprite('run')
    } else {
        player.switchSprite('idle')
    }

    if (player.velocity.y < 0) {
        player.switchSprite('jump')
    }

    if (player.velocity.y > 0) {
        player.switchSprite('fall')
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

    if (player.health <= 0 || enemy.health <= 0) {
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
                setTimeout(() => jumpPlayer = true, 1000)
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