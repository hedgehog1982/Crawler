import {withinDungeon} from "./collision.js" //for collision detection of players, enemies and items

const genObjectArray = ({dungeonArray, objects, objectPicArray, canvasDimension}) => {  //generate objects. only health at moment

  let objectArray = []
  for (let i=0; i< objects; i++) {

  let inDungeon = false

  let X , Y, item


  do {        //pick a random co-ordinate
    X = random(0, canvasDimension.width)
    Y = random(0, canvasDimension.height)

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
    imgItem : item,
    health : item === 0 ?  random(20, 50) : 0,
    attack : item === 1 ? random(5, 10) : 0,
    defense : item === 2 ? random(2, 4) : 0
  })

}
 console.log(objectArray)
  return (objectArray)

}

const itemsCanvas = ({ctx, itemImages, itemList, canvasDimension}) =>{  //DRAW DUNGEON

      itemList.forEach(item => {
        ctx.drawImage(itemImages[item.imgItem], item.locationX, item.locationY);
      })
}

module.exports = {
    itemsCanvas : itemsCanvas,
    genObjectArray : genObjectArray

}
