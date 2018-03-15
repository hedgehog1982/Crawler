import {touchingItems, touchingOthers, randomDirection, withinDungeon, updatePos} from "./collision.js" //for collision detection of players, enemies and items

const genEnemyArray = ({dungeonArray, enemies, spriteArray, playerLocation, canvasDimension}) => {        //generate the enemies // sprite array 0 is player ignore that
 let enemyArray = []
 console.log("player location is ", playerLocation)

for (let i=0; i< enemies; i++) { //generate all enemies

  let inDungeon = false//temp, will add more
  let X, Y
  let selectedSprite = JSON.parse(JSON.stringify(cinn))  //so when we swap source its not duplicated (otherwise passed by ref)

  let spriteType = (i % 2 === 0 ? 1 : 2) //spriteType 1 easy , 2 hard

  selectedSprite.src = spriteArray[(i % 2 === 0 ? 1 : 2)].src
  selectedSprite.img = spriteType

  do {        //pick a random co-ordinate  // need to make sure not near hero in future.
     X = random(0, 1920)
     Y = random(0, 1920)

     let spriteWidth = selectedSprite.animation.walkUp[3]
     let spriteHeight = selectedSprite.animation.walkUp[2]

    inDungeon = withinDungeon (X, Y, spriteWidth, spriteHeight)

  } while (inDungeon === false ||
      !( X < playerLocation.X -200 || X > playerLocation.X + 200)
      || !(Y < playerLocation.Y -200 || Y > playerLocation.Y + 200 ))     //check wether in dungeon or near player

  enemyArray.push({
    name : i,  //keep array number to track it easier later on
    locationX : Math.round(X),   //round numbers to stop sub pixel movement
    locationY : Math.round(Y),
    direction : "walkLeft",
    sprite : selectedSprite,
    health : spriteType === 1 ? [100 , 100] : [150 , 150],   //maximum health , current health
    attack : spriteType === 1 ? 15: 25,
    defense : spriteType === 1 ? 13: 20
  })

}
//console.log(enemyArray)
return(enemyArray)
};



const drawSprite = ({ ctx, cleanedArray, newPlayer, cachedHealthBar, spriteArray, animation, keyFrame, canvasDimension}) => {   //not useful?

      let Yoffset = 20

    // draw enemies
          cleanedArray.forEach(enemy => {
            let animation = enemy.sprite.animation
            let sx = animation[enemy.direction][keyFrame + 0] ,
                sy = animation[enemy.direction][keyFrame + 1],
                sWidth = animation[enemy.direction][keyFrame + 2],
                sHeight = animation[enemy.direction][keyFrame + 3],
                locationX = Math.round(enemy.locationX),
                locationY = Math.round(enemy.locationY),
                xWithOffset = Math.round(locationX - ((40 - sWidth) /2))

            //draw health bar
            ctx.drawImage(cachedHealthBar, xWithOffset , locationY - Yoffset)
            let rectangleFill = Math.floor(36 * (enemy.health[0] / enemy.health[1]))
            ctx.fillStyle="green"
            ctx.fillRect(xWithOffset + 2 , locationY - Yoffset + 2 , rectangleFill, 6)

            //draw sprite
            ctx.drawImage(spriteArray[enemy.sprite.img],
                    sx, sy, sWidth, sHeight, locationX, locationY, sWidth, sHeight  );  // keep aspect ration

          })
        //draw hero // should be on top

    let sx = animation[newPlayer.direction][keyFrame + 0],
      sy = animation[newPlayer.direction][keyFrame + 1],
      sWidth = animation[newPlayer.direction][keyFrame + 2],
      sHeight = animation[newPlayer.direction][keyFrame + 3],
      locationX = Math.round(newPlayer.locationX),
      locationY = Math.round(newPlayer.locationY),
      playerHealthBar =

      ctx.drawImage(cachedHealthBar, locationX, locationY - Yoffset)
      ctx.drawImage(spriteArray[newPlayer.sprite.img],
        sx, sy, sWidth, sHeight, locationX, locationY, sWidth, sHeight  );  // keep aspect ration

        //  return canvas
}

const healthBar = ({width, height}) =>{
  let healthBar = document.createElement('canvas');
      healthBar.width = width
      healthBar.height = height
      let ctx = healthBar.getContext("2d")
      ctx.fillStyle="black"
      ctx.fillRect(0,0,width,height)
      ctx.fillStyle="white"
      ctx.fillRect(2,2,width - 4,height - 4)
      return healthBar
};




module.exports = {
  drawSprite : drawSprite,
  healthBar : healthBar,
  genEnemyArray
}
