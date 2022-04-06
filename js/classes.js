class Sprite {
    constructor({position, imageSrc, scale = 1, framesMax = 1}) {
        this.position = position
        this.height = 150
        this.width = 50
        this.image = new Image()
        this.image.src = imageSrc
        this.scale = scale
        this.framesMax = framesMax
        this.currentFrame = 0
        this.framesElapsed = 0
        this.framesHold = 5
    }

    draw() {
        c.drawImage(this.image,
            (this.image.width / this.framesMax) * this.currentFrame,
            0,
            this.image.width / this.framesMax,
            this.image.height,
            this.position.x,
            this.position.y,
            (this.image.width / this.framesMax) * this.scale,
            this.image.height * this.scale,
        )
    }

    update() {
        this.draw()
        this.framesElapsed++
        if (this.framesElapsed % this.framesHold === 0) {
            if (this.currentFrame < this.framesMax - 1) {
                this.currentFrame++
            } else {
                this.currentFrame = 0
            }
        }
    }
}

class Fighter {
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

        if (this.position.y + this.height + this.velocity.y >= canvas.height - 96) {
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