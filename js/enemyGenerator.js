genEnemyArray = (dungeonArray) => {
 // first room 0 is player starting room. Every odd number is corridors. Every Even room from 2 onwards is fine
 let enemyArray = []
 let enemyCount = 0
for (let i=2; i< dungeonArray.length; i=i+2) {

  enemyArray.push({
    name : enemyCount,  //keep array number to track it easier
    locationX : Math.round(dungeonArray[i].x + dungeonArray[i].width /2),
    locationY : Math.round(dungeonArray[i].y + dungeonArray[i].height /2),
    direction : "walkLeft",
    sprite : cinn,
    health : [100 , 100]
  })
  enemyCount ++

}
return(enemyArray)
}
