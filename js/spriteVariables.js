let  viewport = {        }

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
