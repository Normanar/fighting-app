const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

const gravity = 0.7
const playerPathImg = 'medievalKing'
const enemyPathImg = 'kenji'

c.fillRect(0, 0, canvas.width, canvas.height)

const background = new Sprite({
    position: {
        x: 0,
        y: 0,
    },
    imageSrc: "./img/background.png"
})

const shop = new Sprite({
    position: {
        x: 600,
        y: 162,
    },
    imageSrc: "./img/shop.png",
    scale: 2.5,
    framesMax: 6,
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
    imageSrc: "./img/martialHero/Idle.png",
    framesMax: 8,
    scale: 2.5,
    offsetImg: {
        x: 150,
        y: 110
    },
    sprites: {
        idle: {
            imageSrc: `./img/${playerPathImg}/Idle.png`,
            framesMax: 8,
        },
        run: {
            imageSrc: `./img/${playerPathImg}/Run.png`,
            framesMax: 8,
        },
        jump: {
            imageSrc: `./img/${playerPathImg}/Jump.png`,
            framesMax: 2,
        },
        fall: {
            imageSrc: `./img/${playerPathImg}/Fall.png`,
            framesMax: 2,
        },
        attack: {
            imageSrc: `./img/${playerPathImg}/Attack3.png`,
            framesMax: 4,
        },
        takeHit: {
            imageSrc: `./img/${playerPathImg}/Take Hit - white silhouette.png`,
            framesMax: 4,
        },
        death: {
            imageSrc: `./img/${playerPathImg}/Death.png`,
            framesMax: 6,
        },
    },
    attackBox: {
        offset: {
            x: 86,
            y: 50,
        },
        width: 200,
        height: 50
    },
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
    },
    imageSrc: "./img/kenji/Idle.png",
    framesMax: 4,
    scale: 2.4,
    offsetImg: {
        x: 300,
        y: 154
    },
    sprites: {
        idle: {
            imageSrc: `./img/${enemyPathImg}/Idle.png`,
            framesMax: 4,
        },
        run: {
            imageSrc: `./img/${enemyPathImg}/Run.png`,
            framesMax: 8,
        },
        jump: {
            imageSrc: `./img/${enemyPathImg}/Jump.png`,
            framesMax: 2,
        },
        fall: {
            imageSrc: `./img/${enemyPathImg}/Fall.png`,
            framesMax: 2,
        },
        attack: {
            imageSrc: `./img/${enemyPathImg}/Attack2.png`,
            framesMax: 4,
        },
        takeHit: {
            imageSrc: `./img/${enemyPathImg}/Take Hit.png`,
            framesMax: 3,
        },
        death: {
            imageSrc: `./img/${enemyPathImg}/Death.png`,
            framesMax: 7,
        },
    },
    attackBox: {
        offset: {
            x: -224,
            y: 50,
        },
        width: 140,
        height: 50
    },
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
    c.fillStyle = 'rgba(255, 255, 255, 0.1)'
    c.fillRect(0, 0, canvas.width, canvas.height)
    player.update()
    enemy.update()
    player.velocity.x = 0
    enemy.velocity.x = 0

    if (timer > 58) {
        document.querySelector('#fightingResult').style.display = "flex"
        document.querySelector('#fightingResult').innerHTML = "Fight!"
        setTimeout(() => document.querySelector('#fightingResult').style.display = "none", 1000)
    }

    //player movement

    if (keys.a.pressed && player.lastKey === 'a') {
        if (player.position.x < 0) {
            player.velocity.x = 0
            player.switchSprite('run')
        } else {
            player.velocity.x = -4
            player.switchSprite('run')
        }
    } else if (keys.d.pressed && player.lastKey === 'd') {
        if (player.position.x > 920) {
            player.velocity.x = 0
            player.switchSprite('run')
        } else {
            player.velocity.x = 4
            player.switchSprite('run')
        }
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
        if (enemy.position.x < 100) {
            enemy.velocity.x = 0
            enemy.switchSprite('run')
        } else {
            enemy.velocity.x = -4
            enemy.switchSprite('run')
        }
    } else if (keys.arrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        if (enemy.position.x > 1020) {
            enemy.velocity.x = 0
            enemy.switchSprite('run')
        } else {
            enemy.velocity.x = 4
            enemy.switchSprite('run')
        }
    } else {
        enemy.switchSprite('idle')
    }

    if (enemy.velocity.y < 0) {
        enemy.switchSprite('jump')
    }

    if (enemy.velocity.y > 0) {
        enemy.switchSprite('fall')
    }

    // detect for collision
    if (playersCollision({attacking: player, defending: enemy})
        && player.isAttacking && player.currentFrame === 2
    ) {
        enemy.takeHit()
        player.isAttacking = false
        gsap.to('#enemyHealth', {
            width : enemy.health + '%'
        })
    }

    // if player misses
    if (player.isAttacking && player.currentFrame === 2) {
        player.isAttacking = false
    }

    if (playersCollision({attacking: enemy, defending: player})
        && enemy.isAttacking && enemy.currentFrame === 2
    ) {
        player.takeHit()
        enemy.isAttacking = false
        gsap.to('#playerHealth', {
            width : player.health + '%'
        })
    }

    // if enemy misses
    if (enemy.isAttacking && enemy.currentFrame === 2) {
        enemy.isAttacking = false
    }

    if (player.health <= 0 || enemy.health <= 0) {
        determineWinner({player, enemy})
        clearTimeout(timerId)
    }

}

animate()

window.addEventListener('keydown', (e) => {

    if (!player.dead) {
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
        }
    }
    if (!enemy.dead) {
        switch (e.key) {

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