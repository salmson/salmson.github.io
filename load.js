//画像読み込み
//道路
let road = new Image();
road.src = "car_game/road/road.png";

//自働車
car_pic = new Array();
//car_T
car_pic[0] = new Image();
car_pic[0].src = "car_game/car/towner.png";
//car_H
car_pic[1] = new Image();
car_pic[1].src = "car_game/car/HSW_type1.png";
//car_s
car_pic[2] = new Image();
car_pic[2].src ="car_game/car/sirius.png";
//car_K
car_pic[3] = new Image();
car_pic[3].src = "car_game/car/KING.png";
//car_p
car_pic[4] = new Image();
car_pic[4].src = "car_game/car/police.png";
//car_t
car_pic[5] = new Image();
car_pic[5].src = "car_game/car/challenger.png";
//car_deko1
car_pic[6] = new Image();
car_pic[6].src = "car_game/car/deko_1.png";
//car_deko2
car_pic[7] = new Image();
car_pic[7].src = "car_game/car/deko_2.png";

//アイテム
items = new Array();
items[0] = new Image();
items[0].src = "car_game/items/fuel.png";
items[1] = new Image();
items[1].src = "car_game/items/spannar.png";
items[2] = new Image();
items[2].src = "car_game/items/NOS.png";
items[3] = new Image();
items[3].src = "car_game/items/Green_light.png";

//音楽関係
sound = new Array();

sound[0] = new Audio();
sound[0].src = "car_game/sound/kka.wav";
sound[1] = new Audio();
sound[1].src ="car_game/sound/car_engine_s.wav";
sound[2] = new Audio();
sound[2].src ="car_game/sound/maoudamasii_battle19R.wav";
sound[3] = new Audio();
sound[3].src ="car_game/sound/boom.wav";
sound[4] = new Audio();
sound[4].src ="car_game/sound/get.wav";
sound[5] = new Audio();
sound[5].src ="car_game/sound/maoudamasii-nitro.wav";

function MUSIC_func(number){
  sound[number].play();
}

function SOUND_func(number){
  sound[number].play();
}
