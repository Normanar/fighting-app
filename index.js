const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

const gravity = 0.7

c.fillRect(0, 0, canvas.width, canvas.height)

const background = new Sprite({
    position: {
        x: 0,
        y: 0,
    },
    imageSrc : "./img/background.png"
})

const player = new Fighter({
    position: {
        x: 30,
        y: 200,
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
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    background.update()
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