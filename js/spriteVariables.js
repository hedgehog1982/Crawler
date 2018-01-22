let  viewport = {        }

//function to generate array of images with src
//list of assets that need caching in browser

let generateImage = (blankArray, imageURL) => {
  return new Promise((resolve, reject) => {
    let imagesLoaded = 0
    for (let i=0; i < blankArray.length;i++){
      blankArray[i] = new Image();
      blankArray[i].onload = () => {
        imagesLoaded ++
        if (imagesLoaded === blankArray.length){
          resolve(blankArray)
        }

      }
      blankArray[i].src = imageURL[i]
     }

  });
};

let graveObject = new Array(1)
      graveObject[0] = new Image();
      graveObject[0].src='sprite/objects/grave.png';

const itemImages =[
  'sprite/objects/bread_ration.png',
  'sprite/objects/battle_axe1.png',
    'sprite/objects/chain_mail1.png',

]

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

const spriteArrayImages = [
  'spriteMaps/jake.png',
  'spriteMaps/cinn2.png',
  'spriteMaps/cinnRED.png'
]

const jake = {
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
