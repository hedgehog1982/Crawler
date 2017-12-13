genEnemyArray = (dungeonArray, enemies) => {
 // first room 0 is player starting room. Every odd number is corridors. Every Even room from 2 onwards is fine
 let enemyArray = []

for (let i=0; i< enemies; i++) {

  let inDungeon = false
  let selectedSprite = cinn
  let X, Y

  do {
     X = random(0, maximumX)
     Y = random(0, maximumY)
     console.log("generated",X,Y)
     let spriteWidth = selectedSprite.animation.walkUp[3]
     let spriteHeight = selectedSprite.animation.walkUp[2]

    inDungeon = withinDungeon (X, Y, spriteWidth, spriteHeight)

  } while (inDungeon === false)

  enemyArray.push({
    name : i,  //keep array number to track it easier
    locationX : Math.round(X),
    locationY : Math.round(Y),
    direction : "walkLeft",
    sprite : cinn,
    health : [100 , 100]
  })

}
return(enemyArray)
}
