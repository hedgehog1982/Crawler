genEnemyArray = (dungeonArray, enemies, spriteArray, playerLocation) => {        //generate the enemies // sprite array 0 is player ignore that
 let enemyArray = []
 console.log("player location is ", playerLocation)


for (let i=0; i< enemies; i++) { //generate all enemies

  let inDungeon = false//temp, will add more
  let X, Y
  let selectedSprite = JSON.parse(JSON.stringify(cinn))  //so when we swap source its not duplicated (otherwise passed by ref)

  let spriteType = (i % 2 === 0 ? 1 : 2) //spriteType 1 easy , 2 hard

  selectedSprite.src = spriteArray[(i % 2 === 0 ? 1 : 2)].src

  do {        //pick a random co-ordinate  // need to make sure not near hero in future.
     X = random(0, maximumX)
     Y = random(0, maximumY)

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
console.log(enemyArray)
return(enemyArray)
};

genObjectArray = (dungeonArray, objects, objectPicArray) => {  //generate objects. only health at moment
  let objectArray = []
  for (let i=0; i< objects; i++) {

  let inDungeon = false

  let X , Y, item


  do {        //pick a random co-ordinate
     X = random(0, maximumX)
     Y = random(0, maximumY)

     let spriteWidth = tileSize
     let spriteHeight = tileSize

    inDungeon = withinDungeon (X, Y, spriteWidth, spriteHeight)

  } while (inDungeon === false)
       item = i % 3  //item
       console.log(item)

  objectArray.push({
    name : "object" + i,
    locationX : Math.round(X),   //round numbers to stop sub pixel movement
    locationY : Math.round(Y),
    img : objectPicArray[item],        //if item is 0 it is health, 1 is weapon, 2 is armour
    health : item === 0 ?  random(20, 50) : 0,
    attack : item === 1 ? random(5, 10) : 0,
    defense : item === 2 ? random(2, 4) : 0
  })

}
 console.log(objectArray)
  return (objectArray)

}
