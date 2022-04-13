class Sprite {
    constructor({
                    position,
                    imageSrc,
                    scale = 1,
                    framesMax = 1,
                    offsetImg = {x: 0, y: 0},
                }) {
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
        this.offsetImg = offsetImg
    }

    draw() {
        c.drawImage(this.image,
            this.currentFrame * (this.image.width / this.framesMax),
            0,
            this.image.width / this.framesMax,
            this.image.height,
            this.position.x - this.offsetImg.x,
            this.position.y - this.offsetImg.y,
            (this.image.width / this.framesMax) * this.scale,
            this.image.height * this.scale,
        )
    }

    animateFrame() {
        this.framesElapsed++
        if (this.framesElapsed % this.framesHold === 0) {
            if (this.currentFrame < this.framesMax - 1) {
                this.currentFrame++
            } else {
                this.currentFrame = 0
            }
        }
    }

    update() {
        this.draw()
        this.animateFrame()
    }
}

class Fighter extends Sprite {
    constructor({
                    position,
                    velocity,
                    color,
                    offset,
                    imageSrc,
                    scale = 1,
                    framesMax = 1,
                    offsetImg = {x: 0, y: 0},
                    sprites,
                    attackBox = {offset: {}, width: undefined, height: undefined}
                }) {
        super({
            position,
            imageSrc,
            scale,
            framesMax,
            offsetImg
        })
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
            offset: attackBox.offset,
            width: attackBox.width,
            height: attackBox.height,
        }
        this.isAttacking
        this.health = 100
        this.currentFrame = 0
        this.framesElapsed = 0
        this.framesHold = 5
        this.sprites = sprites
        this.dead = false

        for (const sprite in this.sprites) {
            sprites[sprite].image = new Image()
            sprites[sprite].image.src = sprites[sprite].imageSrc
        }
    }

    update() {
        this.draw()
        if (!this.dead) this.animateFrame()

        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x
        this.attackBox.position.y = this.position.y + this.attackBox.offset.y

        //c.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height)

        if (this.position.y + this.height + this.velocity.y >= canvas.height - 96) {
            this.velocity.y = 0
            this.position.y = 330
        } else {
            this.velocity.y += gravity
        }

    }

    attack() {
        this.switchSprite('attack')
        this.isAttacking = true
    }

    takeHit() {
        this.health -= 20
        if (this.health <= 0) {
            this.switchSprite('death')
        } else this.switchSprite('takeHit')
    }

    switchSprite(sprite) {
        if (this.image === this.sprites.death.image) {
            if (this.currentFrame === this.sprites.death.framesMax - 1) this.dead = true
            return;
        }

        // overriding all other animations with attack animation
        if (this.image === this.sprites.attack.image && this.currentFrame < this.sprites.attack.framesMax - 1) return

        //override when fighter gets hit
        if (this.image === this.sprites.takeHit.image && this.currentFrame < this.sprites.takeHit.framesMax - 1) return

        switch (sprite) {
            case ('idle') :
                if (this.image !== this.sprites.idle.image) {
                    this.image = this.sprites.idle.image
                    this.framesMax = this.sprites.idle.framesMax
                    this.currentFrame = 0
                }
                break

            case ('run') :
                if (this.image !== this.sprites.run.image) {
                    this.image = this.sprites.run.image
                    this.framesMax = this.sprites.run.framesMax
                    this.currentFrame = 0
                }
                break

            case ('jump') :
                if (this.image !== this.sprites.jump.image) {
                    this.image = this.sprites.jump.image
                    this.framesMax = this.sprites.jump.framesMax
                    this.currentFrame = 0
                }
                break
            case ('fall') :
                if (this.image !== this.sprites.fall.image) {
                    this.image = this.sprites.fall.image
                    this.framesMax = this.sprites.fall.framesMax
                    this.currentFrame = 0
                }
                break
            case ('attack') :
                if (this.image !== this.sprites.attack.image) {
                    this.image = this.sprites.attack.image
                    this.framesMax = this.sprites.attack.framesMax
                    this.currentFrame = 0
                }
                break
            case ('takeHit') :
                if (this.image !== this.sprites.takeHit.image) {
                    this.image = this.sprites.takeHit.image
                    this.framesMax = this.sprites.takeHit.framesMax
                    this.currentFrame = 0
                }
                break
            case ('death') :
                if (this.image !== this.sprites.death.image) {
                    this.image = this.sprites.death.image
                    this.framesMax = this.sprites.death.framesMax
                    this.currentFrame = 0
                }
                break
        }
    }
}