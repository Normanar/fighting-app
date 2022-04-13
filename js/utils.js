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
        enemy.switchSprite('death')
        player.switchSprite('death')
    } else if (player.health > enemy.health) {
        document.querySelector('#fightingResult').innerHTML = "Player 1 win!"
        enemy.switchSprite('death')
    } else {
        document.querySelector('#fightingResult').innerHTML = "Player 2 win!"
        player.switchSprite('death')
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