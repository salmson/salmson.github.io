var test = "testです";

let title_number =0;
let title_name = [
  ["フリー　走行","長距離走れるようにチャレンジしましょう。"],
  ["日本横断旅　","日本の高速道路を走ります."],
  ["日本高速物語","トラックで各高速を縦横無尽に走ります。"],
  ["　セーブ　　","ゲーム進行状況を記録します"],
  ["　設　　定　","音量，セーブデータ等の設定です。"]
]

let setting_number =0;
let bgm_vol = 0.2;
let sound_vol = 0.2;
let setting_name =["BGM音量","システム音量","戻る"]

let time60 =0;
function timer60(){
  time60 ++;
  if(time60 > 59){
    time60 =0;
  }
  return time60;
}

let time100 =0;
function timer100(){
  time100++;
  if(time100 >= 100){
    time100 =0;
  }
  return time100;
}

function pulse(){

}
