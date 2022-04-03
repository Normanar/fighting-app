const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

const gravity = 0.7

c.fillRect(0, 0, canvas.width, canvas.height)

class Sprite {
    constructor({position, velocity, color}) {
        this.position = position
        this.velocity = velocity
        this.height = 150
        this.width = 50
        this.color = color
        this.lastKey
    }

    draw() {
        c.fillStyle = this.color
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }

    update() {
        this.draw()

        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
        if (this.position.y + this.height + this.velocity.y >= canvas.height) {
            this.velocity.y = 0
        } else {
            this.velocity.y += gravity
        }

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
    color : "green"
})

const enemy = new Sprite({
    position: {
        x: 500,
        y: 100,
    },
    velocity: {
        x: 0,
        y: 0,
    },
    color : "red"
})

const keys = {
    a : {
        pressed : false
    },
    d : {
        pressed : false
    },
    w : {
        pressed : false
    },
    arrowRight : {
        pressed : false
    },
    arrowLeft : {
        pressed : false
    },
}

let jumpPlayer = true
let jumpEnemy = true

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