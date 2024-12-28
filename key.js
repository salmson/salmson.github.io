//キー
var key = new Object();
key.up = false;
key.down = false;
key.left = false;
key.right = false;
key.space = false;
key.w = false;
key.s = false;
key.a = false;
key.d = false;
key.esc = false;
key.enter = false;
key.z = false;
key.one = false;
key.two = false;
key.three = false;
key.four = false;
key.zero = false;

let key_counter =0;

//制御系
//押されたときの関数
function keydownfunc(e){
  if(e.key == "Left" || e.key == "ArrowLeft") {key.left = true;}
	if(e.key == "Up" || e.key =="ArrowUp") {key.up = true;}
	if(e.key == "Right" || e.key =="ArrowRight"){key.right = true;}
	if(e.key == "Down" || e.key == "ArrowDown") {key.down = true;}
  if(e.key == "w") {key.w = true;}
  if(e.key == "s") {key.s = true;}
  if(e.key == "a") {key.a = true;}
  if(e.key == "d") {key.d = true;}
  if(e.key === "Escape"){key.esc =true;}
  if(e.key == "Enter"){key.enter =true;}
  if(e.key == " ") {key.space =true;}
  if(e.key == "z") {key.z = true;}
  if(e.key == "0"){key.zero = true;}
  if(e.key == "1"){key.one = true;}
  if(e.key == "2"){key.two = true;}
  if(e.key == "3"){key.three = true;}
  if(e.key == "4"){key.four = true;}
  key_counter++;
}

//離されたときの関数
function keyupfunc(e){
  if(e.key == "Left" || e.key == "ArrowLeft") {key.left = false;}
	if(e.key == "Up" || e.key =="ArrowUp") {key.up = false;}
	if(e.key == "Right" || e.key =="ArrowRight"){key.right = false;}
	if(e.key == "Down" || e.key == "ArrowDown") {key.down = false;}
  if(e.key == "w") {key.w = false;}
  if(e.key == "s") {key.s = false;}
  if(e.key == "a") {key.a = false;}
  if(e.key == "d") {key.d = false;}
  if(e.key === "Escape"){key.esc =false;}
  if(e.key == "Enter"){key.enter =false;}
  if(e.key == " ") {key.space =false;}
  if(e.key == "z") {key.z = false;}
  if(e.key == "0"){key.zero = false;}
  if(e.key == "1"){key.one = false;}
  if(e.key == "2"){key.two = false;}
  if(e.key == "3"){key.three = false;}
  if(e.key == "4"){key.four = false;}
  key_counter=0;
}
