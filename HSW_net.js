var canvas = document.getElementById("myCanvas");
var tap_area = document.getElementById("touch-area1");
var ctx = canvas.getContext("2d");

//スクリーン
let screen_number = 0;

//タップ
var tx = canvas.width/2;
var ty = canvas.width/2;

//道路の大きさ
let image_x = 400;
let image_y = 384;

let car_x = 66;
let car_y = 154;

//playerのx,y
var x = 0;
var y = canvas.height/2 + 100;

//クルマ関係
var deg=0;
let speed =0;
let acc =0;
let maxspeed = 35;
//道路Y座標
var roadY =[-384,-192,0,192,384,576]

//アイテム関係
let item_x = 0;
let item_y = 0;
let spon_x = 1;
let item_num =0;
let get_item = false;
let get_NOS = 0;
let gl_timer =0;
let green_light = false;
let nitro = false;
let nitro_timer = 0;
let item_total =0;

//パラメータボックス倍率
let sp =[1,5,50,5];

let spd=20;
let hnd=0;
let shl=0;

let para = [100,0,0,0];

//クルマ状態
let car_number =0;
let dmg =0;
let fuel = 100;
let time =0;
let count60 =0;
let distans =0;

//説明
let fin_ex ="";

let pit =1;

//無敵時間
let hit_timer = 0;

//ライバル出現時間
let rival_time = 0;
let win =0;

//メインループ
function main(){
  
  //キー
  document.addEventListener( "keydown", keydownfunc );
	document.addEventListener( "keyup", keyupfunc );
  //タップ
  canvas.addEventListener("touchmove",logPosition1);
  //ゲーム
  screen();

  requestAnimationFrame(main);
}
requestAnimationFrame(main);

//ゲームスイッチ
function screen(){

  switch(screen_number){
    case 0:
      title();
      break;
    case 1://セレクト
      select();
      break;
    case 2://ゲーム
      if(GAME()){
        screen_number=3;
        sound[2].pause();
      }
      break;
    case 3://リザルト
      result();
      break;
    case 4:
      car_number =0;
      screen_number =1;
      key_counter =22;
      break;
    case 5:
      setting();
      break;
    case 6:
      break;
    case 7:
      break;
    default:
  }
}

//game
function GAME(){
  draw();
  drive2(key.a,key.d,key.w,key.s,key.space,car_number);
  debug();
  timer();
  item();
  command();
  mini_map();
  //ctx.drawImage(items[item_num],item_x,item_y,24,24);

  return game_fin();
}

//タイトル
function title(){
  var ny = 400;

  ctx.fillStyle="rgb(100,90,90)";
  ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle="rgb(50,50,50)";
  ctx.fillRect(30,90,canvas.width -60,canvas.height -120);
  ctx.fillStyle="rgb(50,100,50)";
  ctx.fillRect(canvas.width/2-112,24,224,48);

  ctx.fillStyle="rgb(255,255,255)";
  ctx.font ="32px serif";
  ctx.fillText("HSW net",canvas.width/2-64,60);

  ctx.fillStyle="rgb(255,150,0)";
  for(i=0;i<title_name.length;i++){
    ctx.fillText(title_name[i][0],40,160+(i*40));
  }
  ctx.font ="16px serif";
  ctx.strokeStyle = "rgb(255,255,255)";
  ctx.beginPath();
  ctx.moveTo(60,ny);
  ctx.lineTo(canvas.width-60,ny);
  ctx.closePath();
  ctx.lineWidth = 0.5;
  ctx.stroke();

  ctx.fillText(title_name[title_number][1],60,ny + 32);

  ctx.fillStyle="rgba(255,255,255,"+((Math.sin(timer100()/10*Math.PI+Math.PI/4)/2+0.25).toFixed(2))+")";
  ctx.fillRect(40,164+(title_number*40),192,-32);
  

  


  //キー
  if(key_counter % 5 ==1 || key_counter == 1){
    if(key.enter){
      if(title_number ==0){//game
        screen_number=1;
      }
      else if(title_number==4){//設定
        screen_number=5;
        sound[2].volume = bgm_vol;//ボリューム
        sound[2].loop = true;//BGMループ
        sound[2].play();
      }
      sound[0].play();
      key_counter = 32;
    }
    if(key.down){
      title_number = (title_number + title_name.length+1) % title_name.length;
      key_counter++;
      //sound[0].play();
    }
    if(key.up){
      title_number = (title_number + title_name.length-1) % title_name.length;
      key_counter++;
    }
  }
}

//スクリーン1　セレクト
function select(){
  ctx.font = "16px Arial";
  ctx.fillStyle="rgb(200,200,200)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle="rgb(255,0,0)";
  for(let i=0;i < 4;i++){
    ctx.fillRect(140, 384 + (i*20), para[i],16);
  }

  ctx.fillStyle="rgb(0,0,0)";
  ctx.fillText("セレクト画面",10,20);
  ctx.fillText("矢印キー(←，→)で選択",10,60);
  ctx.fillText("ENTERで開始",10,80);

  ctx.fillText(car_data[car_number][6],140,360);
  ctx.fillText("　最高速度　："+car_data[car_number][2]+"km/h",30,400);
  ctx.fillText("　　加速　　："+(20-car_data[car_number][3]),30,420);
  ctx.fillText("ハンドリング："+car_data[car_number][4],30,440);
  ctx.fillText("　車両耐久　："+car_data[car_number][5],30,460);

  //パラメータボックス
  for(let i=0;i < 4;i++){
    
    if(i==1){
      if(para[i] <= (20-car_data[car_number][2+i])*sp[i]){
        para[i]++;
      }
      else if(para[i] > (20-car_data[car_number][2+i])*sp[i]){
        para[i]--;
      }
    }
    else{
      if(para[i] <= car_data[car_number][2+i]*sp[i]){
        para[i]++;
      }
      else if(para[i] > car_data[car_number][2+i]*sp[i]){
        para[i]--;
      }
    }
  }

  car_draw(car_number);

  //キー
  if(key_counter % 5 ==1 || key_counter == 1){
    if(key.right){
      car_number = (car_number + car_pic.length+1) % car_pic.length;
      key_counter++;
      //sound[0].play();
    }
    if(key.left){
      car_number = (car_number +car_pic.length-1) % car_pic.length;
      key_counter++;
    }
    if(key.enter){
      zero();
      screen_number = 2;
      sound[0].play();
    }
    if(key.esc){
      screen_number =0;
    }
  }

}

//初期化
function zero(){
  x = canvas.width/2 - car_data[car_number][0]/4;
  y = canvas.height/2 + 100;
  speed = 110;
  distans =0;
  acc = 0;
  time =0;
  fuel = 100;
  
  car_position[0][2] = 100;
  car_position[1][2] = 110;
  car_position[2][2] = 120;
  
  for(var i = 0;i < 6;i++){
    car_position[i][0] = 0;
    car_position[i][1] = -200;
    car_position[i][3] = false;
    car_position[i][4] = 2;
    car_position[i][5] = 0;
    car_position[i][6] = false;

  }
  
  //音楽関係
  sound[2].currentTime =0;//曲スタート位置
  sound[2].play();//BGMスタート
  sound[2].volume = bgm_vol;//ボリューム
  sound[2].loop = true;//BGMループ

  hit_timer =0;

  //アイテム関連
  item_x = 0;
  item_y = 0;
  get_item = false;
  spon_x =1;
  item_num =0;
  green_light = false;
  gl_timer =0;
  nitro = false;
  nitro_timer = 0;
  get_NOS =2;
  item_total =0;
  rival_time = 0;
  win =0;
  fin_ex ="";

  jc =0;
  longs =0;

  car_position[5][4] = car_number;
  car_position[5][3] = true;
}

//リザルト
function result(){
  ctx.fillStyle="rgb(100,100,100)";
  ctx.fillRect(0,0,canvas.width,canvas.height);

  ctx.fillStyle="rgb(0,100,0)";
  ctx.fillRect(10,10,canvas.width-20,canvas.height-20);
  ctx.fillStyle="rgb(255,255,255)";
  ctx.font = "16px Arial";
  ctx.fillText("リザルト",canvas.width/2 - 32,30);
  ctx.fillText(fin_ex,30,50);
  ctx.fillText("走行時間："+Math.floor(time/3600)+"時間"+((time/60)%60).toFixed(0)+"分"+(time%60).toFixed(0)+"秒",30,100);
  ctx.fillText("走行距離："+Math.floor(distans/1000)+"km"+(distans%1000).toFixed(0)+"m",30,120);
  ctx.fillText("平均速度："+((distans/1000)/(time/3600)).toFixed(0)+"km/h",30,140);
  ctx.fillText("アイテム獲得数："+item_total+"コ",30,160);
  ctx.fillText("ライバルに勝った回数："+win,30,180);

  
  ctx.fillText("ESCキーで戻る",30,canvas.height-20);

  if(key_counter == 1){
    if(key.esc){
      screen_number =4;
    }
  }

}

function setting(){//設定画面
  ctx.fillStyle = "rgb(20,100,20)";
  ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle = "rgb(200,200,200)";
  ctx.fillRect(10,50,canvas.width-20,canvas.height-100);

  ctx.fillStyle = "rgb(255,255,255)";
  ctx.font = "32px serif";
  ctx.fillText("設定",canvas.width/2-32,40);

  ctx.fillStyle="rgb(0,0,0)";
  for(i=0;i<setting_name.length;i++){
    ctx.fillText(setting_name[i],40,160+(i*40));
  }
  if(setting_number==0){ctx.fillText("< "+(bgm_vol*100).toFixed(0)+"% >",canvas.width/2+30,160+(setting_number*40));}
  else if(setting_number==1){ctx.fillText("< "+(sound_vol*100).toFixed(0)+"% >",canvas.width/2+30,160+(setting_number*40));}
  ctx.fillStyle="rgba(100,100,100,"+((Math.sin(timer100()/10*Math.PI+Math.PI/4)/2+0.25).toFixed(2))+")";
  ctx.fillRect(40,164+(setting_number*40),192,-32);

  if(key_counter % 5 ==1 || key_counter == 1 ){
    if(key.down){
      setting_number = (setting_number + setting_name.length+1) % setting_name.length;
      key_counter++;
      //sound[0].play();
    }
    if(key.up){
      setting_number = (setting_number + setting_name.length-1) % setting_name.length;
      key_counter++;
    }
    if(key.right){
      if(setting_number==0){
        bgm_vol +=0.05;
        if(bgm_vol >1){
          bgm_vol =1;
        }
      }
      else if(setting_number==1){
        sound_vol +=0.05;
        if(sound_vol >1){
          sound_vol =1;
        }
      }
      key_counter++;
      sound[2].volume = bgm_vol;
      sound[0].volume = sound_vol;
      sound[0].play();
    }
    if(key.left){
      if(setting_number==0){
        bgm_vol -=0.05;
        if(bgm_vol <0){
          bgm_vol =0;
        }
      }
      else if(setting_number==1){
        sound_vol -=0.05;
        if(sound_vol <0){
          sound_vol =0;
        }
      }
      key_counter++;
      sound[2].volume = bgm_vol;
      sound[0].volume = sound_vol;
      sound[0].play();
    }
    if(key.esc || key.enter && setting_number==2){
      screen_number =0;
      key_counter =22;
      sound[2].pause();//BGMスタート
      sound[2].currentTime =0;//曲スタート位置
    }
  }
}


//ゲームの描画
function draw(){
  ctx.fillStyle="rgb(0,200,0)";
  ctx.fillRect(0,0,canvas.width,canvas.height);

  for(var i=0;i<6;i++){
    ctx.drawImage(road,(canvas.width/2)-(image_x/4),roadY[i],image_x/2,image_y/2);
    roadY[i] += speed/4;

  }
  if(roadY[1]>0){
      for(var j=0;j<6;j++){
        roadY[j] = (j*192)-384;
      }
  }
  //npcの描画
  for(var i =0;i <3;i++){
    npc(i);
  }
  rival();
  //playerの描画
  if(hit_timer%5 ==0){car_draw(car_number);}
  ctx.fillstyle="rgba(20,20,20,0.6)";
  //ctx.fillRect(0,0,canvas.width/3,canvas.height/2);
  if(car_position[5][6]){
    if(hit_timer <= 240){
      hit_timer ++;
    }
    else{
      hit_timer =0;
      car_position[5][6] = false;
    }
  }
  //夜
  // ctx.fillStyle = "rgba(50,50,50,0.6)";
  // ctx.beginPath();
  // ctx.moveTo(x,y+5);
  // ctx.lineTo(x-100,0);
  // ctx.lineTo(0,0);
  // ctx.lineTo(0,y+5);
  // ctx.closePath();
  // ctx.fill();

  // ctx.beginPath();
  // ctx.moveTo(x+car_data[car_number][0]/2,y+5);
  // ctx.lineTo(x+car_data[car_number][0]/2+100,0);
  // ctx.lineTo(canvas.width,0);
  // ctx.lineTo(canvas.width,y+5);
  // ctx.closePath();
  // ctx.fill();

  // ctx.fillRect(0,y+5,canvas.width,canvas.height);

  if(time <= 120){ triangel(x+car_data[car_number][0]/4,y+car_data[car_number][1]/4,15,0,0,255); }
  if(car_position[3][3]){ triangel(car_position[3][0]+car_data[car_position[3][4]][0]/4,car_position[3][1]+car_data[car_position[3][4]][1]/4,15,255,0,0); }
  had();

}

//クルマ関数
//NPCコントロール
function drive2(left_push,right_push,accel,brake,side,number){
let nitro_speed =50;

  //増速，減速
  if(accel){
    if(!nitro){
      if(speed <= car_data[number][2]){//最高速度より小さいとき
      
        acc +=1; 
        //速度アップ
        if(acc % car_data[number][3] == 0){
          speed +=1;
        }
      }
    }
    else if(nitro){
      if(speed <= car_data[number][2] + nitro_speed){//最高速度より小さいとき
      
        speed ++;

      }
      else if(speed > car_data[number][2] + nitro_speed){
        speed = car_data[nmber][2] + nitro_speed;
      }
    }
  }
  else if(brake){
    if(speed > 0){//速度0より大きいとき
      speed -=1;
    }
  }
  else {
    acc =0;
    
    if(speed >0){
      speed -= 0.05;
    }
  }

  if(!nitro){
    if(speed > car_data[number][2]){
        speed = car_data[number][2];
        acc =0;
    }
  }
  else if(nitro){
    if(speed > car_data[number][2]+nitro_speed){
      speed = car_data[number][2] + nitro_speed;
      acc =0;
  }
  }
  if(speed < 0){
    speed = 0;
  }

  //ハンドリング
  if(speed != 0){
    if(right_push){
      if(x + car_data[number][0]/2 <= canvas.width/2 + image_x/4){
        x +=car_data[number][4];
        
      }
      deg = 8;
      //if(speed > 1) speed = speed - (5 - car_data[number][4])*0.04;
    }
    else if(left_push){
      if(x >= canvas.width/2-image_x/4){
        x -=car_data[number][4];
        
      }
      deg = -8;
      //if(speed > 1)speed = speed - (5 - car_data[number][4])*0.04;
    }
    else {
      deg=0;
    }
  }

  if(x + car_data[number][0]/2 >= canvas.width/2+image_x/4){
    x = canvas.width/2+image_x/4 - car_data[number][0]/2;
  }
  else if(x <= canvas.width/2-image_x/4){
    x = canvas.width/2-image_x/4;
  }

  if(speed > 0){
    if(!accel){
      if(side){
        if(speed > 1)speed -=2;
        else if (speed <=1) speed =0;
      }
    }
    else if(accel && speed <=1){
      if(side) {speed = 0.05;}
    }
  }
}



//ハッド
function had(){
  //耐久値表示
  ctx.fillStyle = 'rgb(50,50,50)';
  if(car_data[car_number][5] >=10){
    ctx.fillRect(10,canvas.height-20,10*10,16);
  }
  else {
    ctx.fillRect(10,canvas.height-20,car_data[car_number][5]*10,16);
  }

  for(i=0;i<car_data[car_number][5]-car_position[5][5];i++){
    
    if(i < 10){
      ctx.beginPath();
      ctx.rect(10+(i*10),canvas.height-20,10,16);
      ctx.fillStyle="rgb(0,0,255)";
      ctx.fill();
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgb(20,20,30)';
      ctx.stroke();
    }
    else if(i >= 10 && i < 20){
      draw_life(0,200,255,i,10);
    }
    else if(i >= 20 && i < 30){
      draw_life(0,255,255,i,20);
    }
    else if(i >= 30 && i <40){
      draw_life(55,255,255,i,30);
    }
  }
 
  //燃料表示
  ctx.beginPath();
  ctx.fillStyle = 'rgb(50,50,50)';
  ctx.rect(10,canvas.height-40,100,16);
  ctx.fill();
  ctx.lineWidth = 1;
  ctx.strokeStyle = 'rgb(20,20,30)';
  ctx.stroke();

  ctx.fillStyle = 'rgb(200,200,50)';
  ctx.fillRect(10,canvas.height-40,fuel,16)
  if(speed <= 120 && speed >=80){
    if(time % 300 == 0){
      fuel -=1;
    }
  }
  else{
    if(time % 300 == 0){
      fuel -=2;
    }
  }
  //ニトロ表示
  if(get_NOS >=1){
    for(i=0;i < get_NOS;i++){
      ctx.drawImage(items[2],10+(i*20),canvas.height -80);
    }
  }
  if(nitro){
    ctx.fillStyle = 'rgb(100,200,200)';
    ctx.fillRect(10,canvas.height-60,100 - nitro_timer/2,16);
  }
}
//耐久値用
function draw_life(r,g,b,i,n){
  ctx.beginPath();
  ctx.fillStyle="rgb("+r+","+g+","+b+")";
  ctx.rect(10+((i-n)*10),canvas.height-20,10,16); 
  ctx.fill();
  ctx.lineWidth = 1;
  ctx.strokeStyle = 'rgb(20,20,30)';
  ctx.stroke();
}

//スマホ操作
function tap(){

  if((canvas.width/2) - 50 > tx){
    x -=3;
  }
  else if(canvas.width/2 +50 <tx){
    x +=3;
  }

  if(canvas.height/2 +100 > ty){
    speed +=0.05;
  }
  else if(canvas.height/2 -100 <ty){
    speed -=0.05;
  }
}

//タップ
function logPosition1(e){
  e.preventDefault()
  tx = e.changedTouches[0].pageX;
  ty = e.changedTouches[0].pageY;
}

//デバック表示
function debug(){
  ctx.font = "16px Arial";
  ctx.fillStyle = "#000000";
  ctx.fillText("x :"+x+"cx:"+(x+car_data[car_number][0]/4),10,16);
  ctx.fillText("y :"+y,10,32);

  ctx.fillText("ex:"+car_position[0][0],10,232);
  ctx.fillText("ey:"+(car_position[0][1]).toFixed(0),10,264);

  ctx.fillText(((speed).toFixed(1)+"km/h"),350,450);
  ctx.fillText("tx:"+tx+"ty:"+ty,10,64);
  ctx.fillText(""+(distans/1000).toFixed(0)+"km"+(distans%1000).toFixed(0)+"m",350,40);
  ctx.fillText(Math.floor(time/3600)+"時間"+((time/60)%60).toFixed(0)+"分",350,20);
  ctx.fillText("acc:"+acc,10,200);
  ctx.fillText("distance:\n",350,100);
  ctx.fillText((distans).toFixed(0),350,120);
  if(car_position[3][3]) {
    ctx.fillText("ライバル出現!!",350,216);
    ctx.fillText("残り："+((1800 - rival_time)/60).toFixed(0),350,232);
    ctx.fillText("前に出ろ!!",350,248);
  }
  ctx.fillText("長："+jc,350,300);
  ctx.fillText("座標："+(car_position[3][1]).toFixed(0),350,264);
  // ctx.fillText("計算："+((car_position[0][1]).toFixed(0)-y),350,280);
  draw_info();
}

//看板
function draw_info(){
   var ix = 5;
   var iy = 5;
   var size = 16;
   let jc_info = load_jc(8,distans,true);

  ctx.fillStyle ="rgb(100,90,90)";
  ctx.fillRect(ix,iy,120,120);
  ctx.fillStyle ="rgb(50,50,50)";
  ctx.fillRect(ix+5,iy*3+size,110,110-size-iy);
  ctx.fillStyle ="rgb(255,100,0)";
  ctx.font = "16px Arial";
  ctx.fillText(highway[8][0],ix*3,iy*2+size);
  ctx.fillText(ksE[jc][0],ix*4,iy+size*5);

  ctx.fillStyle ="rgb(150,70,0)";
  if(jc < ksE.length-1){
    ctx.fillText(ksE[jc+1][0],ix*3,iy+size*3);
  }
  if(jc > 0){
    ctx.fillText(ksE[jc-1][0],ix*3,iy+size*7);
  }
  if(ksE.length > jc+1){
    if((distans/1000) >= ksE[jc+1][1]){
      if(ksE.length-1 >= jc){jc++;}
      if(ksE.length-1 <= jc){
        jc = ksE.length - 1;
      }
    }
  }
  
}







//player & enemy 描画
function car_draw(number){

  if(screen_number == 2){
    ctx.save();
    ctx.translate(x,y);
    ctx.rotate(deg*Math.PI/180);
    ctx.drawImage(car_pic[number],0,0,car_data[number][0]/2,car_data[number][1]/2);
    ctx.restore();
  }
  else if(screen_number == 1){
    ctx.drawImage(car_pic[number],canvas.width/2-car_data[number][0]/4,canvas.height/2-car_data[number][1]/2,car_data[number][0]/2,car_data[number][1]/2);
  }
}
//rival & npc 描画
function npc_draw(number){
  ctx.drawImage(car_pic[car_position[number][4]],car_position[number][0],car_position[number][1],car_data[car_position[number][4]][0]/2,car_data[car_position[number][4]][1]/2);
  car_position[number][1] += (speed - car_position[number][2])/6;
}


//npcの表示
//NPCがTRUEの時実行
function npc(npc_num){
var rand_number = 2;
var des =600;

  if(car_position[npc_num][3]){

    //画面外(かなり先とかなり後の場合)の時，NPCを削除
    if(car_position[npc_num][1] < -des || car_position[npc_num][1] > canvas.height + des){
      car_position[npc_num][3] = false;
      
    }
    if(green_light){
      car_position[npc_num][3] = false;
    }
    //NPC表示
    npc_draw(npc_num);
    //car_position[npc_num][1] += (speed - car_position[npc_num][2])/4;
    //衝突処理
    hit_box(npc_num);
    //debug2(npc_num);
  }
  else if(!car_position[npc_num][3] && !green_light){
    //車番決定
    rand_number = Math.floor(Math.random() * 10);

    if(0 <=rand_number && rand_number <=5){
      car_position[npc_num][4] = 2;
    }
    else if(6 <= rand_number && rand_number <=8){
      car_position[npc_num][4] = 5;
    }
    else if(rand_number ==9){
      car_position[npc_num][4] = 3;
    }
    else {
      car_position[npc_num][4] = 2;
    }

    //y
    if(speed <= 100){
      car_position[npc_num][1] = canvas.height + des -100;
    }
    else if(speed > 100){
      car_position[npc_num][1] = -des + 100;
    }
    //x
    if(npc_num == 0){
      car_position[0][0] = 166 - car_data[car_position[npc_num][4]][0]/4;
    }
    else if(npc_num ==1){
      car_position[1][0] = canvas.width/2 - car_data[car_position[npc_num][4]][0]/4;
    }
    else if(npc_num == 2){
      car_position[2][0] = 294 - car_data[car_position[npc_num][4]][0]/4;
    }
    //スポーン  
    if(npc_num == 2 && car_position[3][3]){//ライバル出現時，右npc非表示
      if(car_position[3][1]+car_data[car_position[3][4]][1]/2 < -des || car_position[3][1] > canvas.height + des){
        car_position[npc_num][3] = true;
      }
      else {
        car_position[npc_num][3] = false;
      }
    }
    else {
      car_position[npc_num][3] = true;
    }
  }
}

//ライバル
function rival(){
  rival_num = 3;

  if(car_position[rival_num][3]){
    
    //triangel(x+car_data[car_number][0]/4,y+car_data[car_number][1]/4,255,0,0);

    rival_time ++;
    hit_box(rival_num);
    npc_draw(rival_num);
    if(rival_time >= 1800 || car_position[3][1] > 3000){
      car_position[rival_num][2] --;
      if(rival_time == 1800 || car_position[3][1] >= 3000){
        if(car_position[3][1] >= y)
          fuel = 100;
          car_position[5][5] = 0;
          if(y <= car_position[3][1]) {
            sound[4].play();
            win ++;
          }
      }
      if(car_position[rival_num][1] >= canvas.height || car_position[rival_num][1]+car_data[car_position[rival_num][4]][1]/2 < 0){
        car_position[rival_num][3] = false;
      }
    }
    
  }
  else if(!car_position[rival_num][3]){
    //決定
    if(key.zero || time % 7200 ==0 && time !== 0){
      rival_time =0;
      car_position[rival_num][0] = 294 - car_data[car_position[rival_num][4]][0]/4;
      car_position[rival_num][1] = -3000;
      car_position[rival_num][2] = 140;
      car_position[rival_num][4] = 1;
      
      car_position[rival_num][3] = true;
    }
  }
}

//タイマー
function timer(){
  time ++;
  
  if(time %60 ==0){
    distans +=speed*1000/60;
  }
}

//当たり判定
function hit_box(num){
  if(hit_checker(num)){
    if(car_position[5][6] === false){
      car_position[5][6] = true;
      car_position[5][5] ++;
      sound[3].play();
      speed -=40 - car_data[car_number][5];
    }
  }
}

function hit_checker(num){
  let hit_hit = false;

  if(x > car_position[num][0] && x < car_position[num][0] + car_data[car_position[num][4]][0]/2){
    if(y + car_data[car_number][1]/2 > car_position[num][1] && y + car_data[car_number][1]/2 < car_position[num][1] + car_data[car_position[num][4]][1]/2){
      hit_hit = true;
    }
    else if(y < car_position[num][1]+car_data[car_position[num][4]][1]/2 && y > car_position[num][1]){
      hit_hit = true;
    }
  }
  else if(x + car_data[car_number][0]/4 > car_position[num][0] && x + car_data[car_number][0]/4 < car_position[num][0] + car_data[car_position[num][4]][0]/2){
    if(y + car_data[car_number][1]/2 > car_position[num][1] && y + car_data[car_number][1]/2 < car_position[num][1] + car_data[car_position[num][4]][1]/2){
      hit_hit = true;
    }
    else if(y < car_position[num][1]+car_data[car_position[num][4]][1]/2 && y > car_position[num][1]){
      hit_hit = true;
    }
  }
  else if(x + car_data[car_number][0]/2 > car_position[num][0] && x + car_data[car_number][0]/2 < car_position[num][0] + car_data[car_position[num][4]][0]/2){
    if(y + car_data[car_number][1]/2 > car_position[num][1] && y + car_data[car_number][1]/2 < car_position[num][1] + car_data[car_position[num][4]][1]/2){
      hit_hit = true;
    }
    else if(y < car_position[num][1]+car_data[car_position[num][4]][1]/2 && y > car_position[num][1]){
      hit_hit = true;
    }
  }
  else {
    hit_hit = false;
  }

  return hit_hit;
}

//アイテム
function item(){
let item_size =24;
let rand;

  if(get_item){

    ctx.fillStyle = "rgba(255,210,210,0.3)";
    ctx.beginPath();
    ctx.arc(item_x + item_size/2,item_y + item_size/2,item_size,0*Math.PI/180,360*Math.PI/180,true);  
    ctx.fill();
    ctx.drawImage(items[item_num],item_x,item_y,item_size,item_size);
    item_y += 2//(speed - 120)/4;
    
    if(x < item_x + item_size/2 && 
      item_x + item_size/2 < x + car_data[car_number][0]/2 && 
      y < item_y + item_size/2 && 
      item_y + item_size/2 < y + car_data[car_number][1]/2){
      
      if(item_num == 0){//燃料
        fuel += 20;
        if(fuel >= 100){
          fuel = 100;
        }
      } 
      else if(item_num == 1){//修理
        car_position[5][5] -= 2;
        if(car_position[5][5] < 0){
          car_position[5][5] = 0;
        }
      } 
      else if(item_num == 2){//ニトロ
        get_NOS ++;
        if(get_NOS >5){
          get_NOS =5;
        }
      }
      else if(item_num == 3){//青信号
        green_light = true;
        gl_timer =0;
      }
      else if(item_num == 4){

      }
      else {

      }
      item_total ++;
      get_item = false;
      sound[4].play();
    }
    if(item_y >= canvas.height + 200){
      get_item = false;
    }

  }
  else if(get_item == false){//アイテムスポーン
    if(time % 1200 ==0){
      item_y =-100;
      item_num = Math.floor(Math.random() * 4);//items.length
      rand = Math.floor(Math.random() * 3);
      if(rand == 0){
        item_x = 166 - item_size/2;
      }
      else if(rand == 1){
        item_x = canvas.width/2 - item_size/2;
      }
      else if(rand == 2){
        item_x = 294 - item_size/2;
      }
      else {
        item_x = 294 - item_size/2;
      }
      get_item = true;
    }
  }
  //ニトロ
  if(get_NOS > 0 && !nitro && key.z){
    get_NOS --;
    nitro = true;
    sound[5].play();
  }
  if(nitro){
    nitro_timer ++;

    if(nitro_timer >=200){
      nitro = false;
      nitro_timer =0;

    }
  }

  //青
  if(green_light){
    if(gl_timer < 400){
      ctx.drawImage(items[3],canvas.width/2 - item_size*1.5/2,canvas.height/2 - item_size*1.5/2,item_size*1.5,item_size*1.5);
    }
    else {
      if(gl_timer % 3 ==0){
        ctx.drawImage(items[3],canvas.width/2 - item_size*1.5/2,canvas.height/2 - item_size*1.5/2,item_size*1.5,item_size*1.5);
      }
    }
    gl_timer ++;
    if(gl_timer >= 600){
      green_light = false;
      gl_timer =0;
    }
  }
  ctx.fillText(gl_timer,5,240);
}

//gameの終了
function game_fin(){
  let flag = false;

  //ESCキー
  if(key.esc){
    flag = true;
    fin_ex = "サービスエリアへようこそ!!";
  }
  //耐力0
  if(car_position[5][5] >= car_data[car_number][5]){
    flag = true;
    fin_ex = "交通事故発生!!";
  }
  //燃料切れ
  if(fuel <= 0){
    flag = true;
    fin_ex = "燃料切れだ!!　ドライブは計画的に";
  }
  key_counter =5;

  return flag;
}

//デバック表示2
function debug2(npc_num){

  ctx.fillStyle = "#ff0000";
  ctx.beginPath();
  ctx.arc(car_position[npc_num][0],car_position[npc_num][1],2,0*Math.PI/180,360*Math.PI/180,true);  
  ctx.fill();

  ctx.fillStyle = "#ff0000";
  ctx.beginPath();
  ctx.arc(car_position[npc_num][0]+(car_data[car_position[npc_num][4]][0]/4),(car_position[npc_num][1]+(car_data[car_position[npc_num][4]][1]/4)),2,0*Math.PI/180,360*Math.PI/180,true);  
  ctx.fill();


  ctx.fillStyle = "#0000ff";
  ctx.beginPath();
  ctx.arc(x,y,2,0*Math.PI/180,360*Math.PI/180,true);
  ctx.fill();

}

function command(){
  car_position[5][0] = x ;
  car_position[5][1] = y ;
  car_position[5][2] =speed;
}

function car_triangel(number,r,g,b){
  let tx =0;
  let ty =0;
  tx = car_position[number][0] + car_data[car_position[number][0]][0]/4;
  ty = car_position[number][1] + car_data[car_position[number][1]][1]/4;

  ctx.beginPath();
  ctx.moveTo(tx,ty);
  ctx.lineTo(tx+5,ty+5);
  ctx.lineTo(tx-5,ty+5);
  ctx.closePath();
  ctx.fillStyle ="rgb("+r+","+g+","+b+")";
  ctx.fill();
  ctx.lineWidth = 0.5;
  ctx.strokeStyle = 'rgb(0,0,0)';
  ctx.stroke();

}

function triangel(rx,ry,l,r,g,b){

  ctx.beginPath();
  ctx.moveTo(rx,ry);
  ctx.lineTo(rx+l,ry-l);
  ctx.lineTo(rx-l,ry-l);
  ctx.closePath();
  ctx.fillStyle ="rgb("+r+","+g+","+b+")";
  ctx.fill();
  ctx.lineWidth = 0.5;
  ctx.strokeStyle = 'rgb(0,0,0)';
  ctx.stroke();

}

function mini_map(){
  var mmx = 350
  var mmy = 100;
  ctx.fillStyle = "rgba(100,100,100,0.6)";
  ctx.fillRect(mmx,mmy,50,400+50);
  for(var i=0;i<car_position.length;i++){
    if(car_position[i][3] == true){
      if(i <= 4){
        ctx.fillStyle = "rgb(255,0,0)";
      }
      else if(i == 5){
        ctx.fillStyle = "rgb(0,0,255)";
      }
      ctx.fillRect(mmx -33 + (car_position[i][0])/4, mmy  +(car_position[i][1]+500)/4, car_data[car_position[i][4]][0]/8,car_data[car_position[i][4]][1]/8);
      //ctx.drawImage(image[car_position[i][4]])
    }
  }
  
  // ctx.fillStyle = "rgba(0,0,255,0.5)";
  // ctx.strokeRect(canvas.width/2,canvas.height/2,30,30);
  // ctx.save();
  // ctx.setTransform(1,0,0,1,-100,0);
  // //ctx.fillRect(canvas.width/2,canvas.height/2,30,30);
  // ctx.drawImage(road,canvas.width/2,canvas.height/2,image_x/5,image_y/5);
  // ctx.restore();
  // ctx.beginPath();
  // ctx.moveTo(150,150);
  // ctx.lineTo(150,200);
  // ctx.lineTo(200,200);
  // ctx.lineTo(200,150);
  // ctx.closePath();
  


  //ctx.fillRect(mmx + (230 + car_position[5][0])/4 , mmy + (car_position[5][1] +5000)/4,car_data[car_position[5][4]][0]/4 , car_data[car_position[5][4]][1]/4);
  // ctx.fillRect(mmx + (car_position[5][0])/8, mmy  +(car_position[5][1])/2, car_data[car_position[5][4]][0]/8,car_data[car_position[5][4]][1]/8);
  //1600*200

}
