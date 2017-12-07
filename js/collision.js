let lastUpdate;

let updatePos = (personArray, person, timeDiff) => {
 let position = personArray[person]
 let pixelsWalked = 0;  //if no update in times dont walk
 pixelsWalked = (position.sprite.walkRate / 1000) * (timeDiff)

 let newLocationX = position.locationX
 let newLocationY = position.locationY

 if (position.direction === 'walkLeft'){
       newLocationX -= pixelsWalked
 } else if (position.direction === 'walkRight'){
       newLocationX += pixelsWalked
 } else if (position.direction === 'walkUp'){
       newLocationY -= pixelsWalked
 } else if (position.direction === 'walkDown'){
     newLocationY += pixelsWalked
 }

 let spriteWidth = position.sprite.animation[position.direction][2]
 let spriteHeight = position.sprite.animation[position.direction][3]

 let inDungeon = withinDungeon(newLocationX, newLocationY, spriteWidth, spriteHeight )
 let touching = touchingOthers(newLocationX, newLocationY, spriteWidth, spriteHeight, person, personArray)

 if (personArray.length -1 !== person){  //generate new driection for enemies
    position.direction = randomDirection(position.direction);
 }

 if (inDungeon === true && touching === false){
      position.locationX = newLocationX
      position.locationY = newLocationY
 }

};

let withinDungeon = (newX, newY, spriteWidth, spriteHeight) => {
  let currentTime = JSON.stringify(new Date().getTime());
  let TL, TR, BL, BR, inDungeon = false

  newX = Math.round(newX)
  newY = Math.round(newY)
  inDungeon = true
  if (newX < 0 ){
    return false
  } else {
    for (let i = newX; i < newX + spriteWidth; i++ ){
      for(let j= newY; j < newY + spriteHeight; j++){
        if (canvasArray[i][j] !== 1){
          inDungeon = false;
          break;
        }
      }
    }

  return (inDungeon)

}
};

randomDirection = (newDirection) => {
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
     if ( i !== person ){
   let otherWidth = otherPlayers[i].sprite.animation[otherPlayers[i].direction][2]
   let otherHeight = otherPlayers[i].sprite.animation[otherPlayers[i].direction][3]

         if (   newLocationX + spriteWidth > otherPlayers[i].locationX &&
                newLocationX < otherPlayers[i].locationX + otherWidth &&
                newLocationY + spriteHeight > otherPlayers[i].locationY &&
                newLocationY < otherPlayers[i].locationY + otherHeight){
                  otherPlayers[i].health[0] -= 5
                  if (otherPlayers[i].health[0] < 0){otherPlayers[i].health[0] = 0}
                    collision = true
                    break;
                        }
                }
        }

  return (collision)
};
