genEnemyArray = (dungeonArray, enemies, enemySrc) => {        //generate the enemies
 let enemyArray = []

for (let i=0; i< enemies; i++) { //generate all enemies

  let inDungeon = false
  let selectedSprite = cinn  //temp, will add more
  let X, Y
  let sprite = cinn
  sprite.src = enemySrc

  do {        //pick a random co-ordinate  // need to make sure not near hero in future.
     X = random(0, maximumX)
     Y = random(0, maximumY)

     let spriteWidth = selectedSprite.animation.walkUp[3]
     let spriteHeight = selectedSprite.animation.walkUp[2]

    inDungeon = withinDungeon (X, Y, spriteWidth, spriteHeight)

  } while (inDungeon === false)

  enemyArray.push({
    name : i,  //keep array number to track it easier later on
    locationX : Math.round(X),   //round numbers to stop sub pixel movement
    locationY : Math.round(Y),
    direction : "walkLeft",
    sprite : sprite,
    health : [100 , 100],   //maximum health , current health
    attack : 15,
    defense : 13
  })

}
return(enemyArray)
};

genObjectArray = (dungeonArray, objects) => {  //generate objects. only health at moment
  let objectArray = []
  for (let i=0; i< objects; i++) {

  let inDungeon = false
  let selectedSprite = healthObject[0]
  let X , Y
  //console.log("in object function", selectedSprite)
  //console.log("width is " ,selectedSprite.width)

  do {        //pick a random co-ordinate
     X = random(0, maximumX)
     Y = random(0, maximumY)
    // console.log("generated for object",X,Y)
     let spriteWidth = tileSize
     let spriteHeight = tileSize

    inDungeon = withinDungeon (X, Y, spriteWidth, spriteHeight)

  } while (inDungeon === false)
    let randomHealth = random(20, 50)

  objectArray.push({
    name : "object" + i,
    locationX : Math.round(X),   //round numbers to stop sub pixel movement
    locationY : Math.round(Y),
    img : selectedSprite,
    health : randomHealth,
    attack : 0,
    defense : 0
  })

}
//  console.log(objectArray)
  return (objectArray)

}
