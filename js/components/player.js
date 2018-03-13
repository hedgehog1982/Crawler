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
  healthBar : healthBar
}
