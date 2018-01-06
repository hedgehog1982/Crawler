let  viewport = {        }

let generateImage = (blankArray, imageURL) => {
  return new Promise((resolve, reject) => {
    console.log("PROMISE!")
    let imagesLoaded = 0
    for (let i=0; i < blankArray.length;i++){
      blankArray[i] = new Image();
      blankArray[i].onload = () => {
        imagesLoaded ++
        console.log("downloaded ", imagesLoaded , "images")

        if (imagesLoaded === blankArray.length){
          console.log("got all pictures")
          resolve(imagesLoaded)
        }

      }
      blankArray[i].src = imageURL[i]
      console.log(imageURL[i])
     }

  });
};

let healthObject = new Array(1)
      healthObject[0] = new Image();
      healthObject[0].src='sprite/objects/bread_ration.png';




const dungeonFloorImages = [
  'sprite/floor/cobble_blood1.png',
  'sprite/floor/cobble_blood2.png',
  'sprite/floor/cobble_blood3.png',
  'sprite/floor/cobble_blood4.png',
  'sprite/floor/cobble_blood5.png',
  'sprite/floor/cobble_blood8.png',
  'sprite/floor/cobble_blood9.png',
  'sprite/floor/cobble_blood10.png'
]

const dungeonWallImages = [
  'sprite/wall/brick_gray0.png',
  'sprite/wall/brick_gray1.png',
  'sprite/wall/brick_gray2.png',
  'sprite/wall/brick_gray3.png',
]

const dungeonLavaImages = [
  'sprite/lava/lava0.png',
  'sprite/lava/lava1.png',
  'sprite/lava/lava2.png',
  'sprite/lava/lava3.png'
]

let dungeonSprite = new Array(8)
    dungeonSprite[0] = new Image();
    dungeonSprite[0].src='sprite/floor/cobble_blood1.png';
    dungeonSprite[1] = new Image();
    dungeonSprite[1].src='sprite/floor/cobble_blood2.png';
    dungeonSprite[2] = new Image();
    dungeonSprite[2].src='sprite/floor/cobble_blood3.png';
    dungeonSprite[3] = new Image();
    dungeonSprite[3].src='sprite/floor/cobble_blood4.png';
    dungeonSprite[4] = new Image();
    dungeonSprite[4].src='sprite/floor/cobble_blood5.png';
    dungeonSprite[5] = new Image();
    dungeonSprite[5].src='sprite/floor/cobble_blood8.png';
    dungeonSprite[6] = new Image();
    dungeonSprite[6].src='sprite/floor/cobble_blood9.png';
    dungeonSprite[7] = new Image();
    dungeonSprite[7].src='sprite/floor/cobble_blood10.png';

let dungeonWall = new Array(4)
    dungeonWall[0] = new Image();
    dungeonWall[0].src='sprite/wall/brick_gray0.png';
    dungeonWall[1] = new Image();
    dungeonWall[1].src='sprite/wall/brick_gray1.png';
    dungeonWall[2] = new Image();
    dungeonWall[2].src='sprite/wall/brick_gray2.png';
    dungeonWall[3] = new Image();
    dungeonWall[3].src='sprite/wall/brick_gray3.png';

let dungeonLava = new Array(4)   //create dungeon lava array
      dungeonLava[0] = new Image();
      dungeonLava[0].src='sprite/lava/lava0.png';
      dungeonLava[1] = new Image();
      dungeonLava[1].src='sprite/lava/lava1.png';
      dungeonLava[2] = new Image();
      dungeonLava[2].src='sprite/lava/lava2.png';
      dungeonLava[3] = new Image();
      dungeonLava[3].src='sprite/lava/lava3.png';





const jake = {
    src : 'spriteMaps/jake.png',
    frameRate : 4,
    walkRate : 130,
    animation : {
                 walkDown:[
                  17,13,21,33,
                  42,13,21,33,
                  67,13,21,33,
                  42,13,21,33
                ],
                walkUp:[
                 14,149,21,33,
                 40,149,21,33,
                 65,149,21,33,
                 40,149,21,33
               ],
               walkRight:[
                12,56,25,33,
                40,56,22,33,
                64,56,26,33,
                40,56,22,33
              ],
              walkLeft:[
               12,102,25,33,
               38,102,22,33,
               64,102,26,33,
               38,102,22,33
             ]
             }
};

const cinn = {
  src : 'spriteMaps/cinn2.png',
  frameRate : 4,
  walkRate : 90,
  animation : {
               walkDown:[
                49,21,40,41,
                90,19,36,41,
                127,21,40,40,
                90,19,36,41
              ],
              walkUp:[
               49,170,40,41,
               90,168,36,41,
               127, 170,40,40,
               90, 168,36,41
             ],
             walkRight:[
              54,69,30,40,
              99,67,30,42,
              140,69,30,40,
              99,67,30,42
            ],
            walkLeft:[
             54,119,30,40,
             94,117,30,42,
             134,119,30,40,
             94,117,30,42
           ]
           }
}
const floorTile = {
  src : 'sprite/dungeon.jpg'
}

const lava = {
  src : 'sprite/lava.jpg'
}
