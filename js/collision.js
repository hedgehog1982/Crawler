let lastUpdate;

let updatePos = (personArray, person, timeDiff) => {
 let position = personArray[person]
 let pixelsWalked = 0;  //if no update in times dont walk
 pixelsWalked = (position.sprite.walkRate / 1000) * (timeDiff)

 let newLocationX = position.locationX
 let newLocationY = position.locationY


//work out direction and subtract or add
 if (position.direction === 'walkLeft'){
       newLocationX -= pixelsWalked
 } else if (position.direction === 'walkRight'){
       newLocationX += pixelsWalked
 } else if (position.direction === 'walkUp'){
       newLocationY -= pixelsWalked
 } else if (position.direction === 'walkDown'){
     newLocationY += pixelsWalked
 }

 let spriteWidth = position.sprite.animation[position.direction][2]  //widest points
 let spriteHeight = position.sprite.animation[position.direction][3] //widest points

 let inDungeon = withinDungeon(newLocationX, newLocationY, spriteWidth, spriteHeight )  // check if still within dungeon
 let touching = touchingOthers(newLocationX, newLocationY, spriteWidth, spriteHeight, person, personArray) //check if touching other player

 if (personArray.length -1 !== person){  //generate new driection for enemies  // not sure it should be in here.
    position.direction = randomDirection(position.direction);
 }

 if (inDungeon === true && touching === false){ //if its still in the dungeon and not touching anyone then update the location
      position.locationX = newLocationX
      position.locationY = newLocationY
 }

};

let withinDungeon = (newX, newY, spriteWidth, spriteHeight) => {  //function to check if within dungeon still
  let inDungeon = false

  newX = Math.round(newX)   //only care about full pixels
  newY = Math.round(newY)
  inDungeon = true
  if (newX < 0 ){
    return false
  } else {
    for (let i = newX; i < newX + spriteWidth; i++ ){ // for width of sprite
      for(let j= newY; j < newY + spriteHeight; j++){ //for height of sprite
        if (canvasArray[i] !== undefined && canvasArray[i][j] !== 1){
          inDungeon = false;
          break;
        }
      }
    }

  return (inDungeon)

}
};

randomDirection = (newDirection) => {   //4 in 30 chance of changing direction ( roughly every 0.5 seconds)
  let randomNum = random(0,30)
  if (randomNum === 0 ){
    newDirection = "walkLeft"
  } else if (randomNum === 1 ) {
    newDirection = "walkRight"
  } else if (randomNum === 2) {
    newDirection = "walkUp"
  } else if (randomNum === 3 ) {
    newDirection = "walkDown"
  }
  return(newDirection)
};

touchingOthers = (newLocationX, newLocationY, spriteWidth, spriteHeight, person, otherPlayers) => {
  let collision = false;
  for (let i = 0; i < otherPlayers.length ; i++){  //check whold of arrayDiff except current person

     if ( i !== person ){  // Person is the current number in array we are checking (always going to be in the same place )
   let otherWidth = otherPlayers[i].sprite.animation[otherPlayers[i].direction][2]
   let otherHeight = otherPlayers[i].sprite.animation[otherPlayers[i].direction][3]

         if (   newLocationX + spriteWidth > otherPlayers[i].locationX &&
                newLocationX < otherPlayers[i].locationX + otherWidth &&
                newLocationY + spriteHeight > otherPlayers[i].locationY &&
                newLocationY < otherPlayers[i].locationY + otherHeight){
                console.log("other player is ", otherPlayers[person].name)

                //  (newLocationY < otherPlayers[i].locationY + otherHeight){
                  if (otherPlayers[person].name === "player" || otherPlayers[i].name === "player"){  // fighting mechanics // player needs to be involved
                    console.log("defense is ", otherPlayers[i].defense )
                    console.log("attack is ", (otherPlayers[person]).attack)
                      otherPlayers[i].health[0] -=  (otherPlayers[person]).attack - otherPlayers[i].defense
                 }

                  if (otherPlayers[i].health[0] < 0){  // if health goes below zero just set it to zero
                    otherPlayers[i].health[0] = 0
                  }
                    collision = true
                    break;
                    }
                }
        }

  return (collision)
};

let touchingItems = (player, items) => {  //if touching a power up add that to the stats

  let direction = player.direction

  let spriteWidth = player.sprite.animation[direction][2]
  let spriteHeight = player.sprite.animation[direction][3]
  let newLocationX = player.locationX
  let newLocationY = player.locationY

  for (let i = 0 ; i < items.length ; i++){  // lazy same as above> needs turning into a function
      let otherWidth = tileSize
      let otherHeight = tileSize
      if (   newLocationX + spriteWidth > items[i].locationX &&
             newLocationX < items[i].locationX + otherWidth &&
             newLocationY + spriteHeight > items[i].locationY &&
             newLocationY < items[i].locationY + otherHeight){

              // add difference to player stats (do not go over max health)
              // zero items value
              player.health[0] += items[i].health
              player.attack += items[i].attack
              player.defense += items[i].defense

              if (player.health[0] > player.health[1]) { //stop health going above max
                player.health[0] = player.health[1]
              }
              items[i].attack = 0
              items[i].defense = 0
              items[i].health = 0
              console.log(items[i])

       }

    }
    let cleanedArray =[]
    items.map((item) => {  //remove item once its been touched

        if (!(item.health === 0 && item.defense === 0 && item.attack === 0)){
          cleanedArray.push(item)
        }

        })

return (cleanedArray)
    //clean array of zero values

};
