// displaying the welcome screen after 10 sec

document.getElementById('popup').style.display="none";
window.addEventListener('load',()=>{
    document.getElementById('main').style.display="block";
    //front screen music
    let frontsoundplay = setInterval(()=>{
        frontscreen = new Audio('frontscreen.mp3')
        frontscreen.play();
        clearInterval(frontsoundplay)
    },1000)
    // game over music
    gameover = new Audio('gameover.wav')
    // hit audio
    hit = new Audio('hit.wav')
    // shoot audio
    shoot = new Audio('shoot.wav')
    // background music 
    bgmusic = new Audio('bgmusic.mp3');
    bgmusic.loop = true;
    let game=document.getElementById('start-game')
    game.addEventListener('click',()=>{
        document.getElementById('main').style.display="none";
        animate();
        frontscreen.pause();
        bgmusic.play();
    })
})

const canvas = document.getElementById('game-screen');
const c = canvas.getContext('2d');

// set the width an height of canvas
canvas.width = window.innerWidth;  
canvas.height = window.innerHeight;

// c.fillStyle = "#171717";
// c.fillRect(0, 0, canvas.width, canvas.height);

const a=new Image();
a.src='resource/jet-3.png';
const b=new Image();
b.src='resource/jet-6.png'
const m=new Image();
m.src='resource/missile.png'

// this will be used in future reference

let pax=20 ;            // X position of jet a  0,0 
let pay=100 ;            // Y position of jet a  0,0 
let pbx=200 ;            // X position of jet b  0,0  
let pby=500 ;            // Y position of jet b  0,0 
// speed of jet A 
let speeda=0;  //  initially 0
// speed of jet B
let speedb=0; //   initially 0

// postion of missile of player A
let max=pax;
let may=pay;
// postion of missile of player B
let mbx=pbx;
let mby=pby;

// angle of player A
let anglea=0;
// angle of player B
let angleb=90;


let misa=[]
let misb=[]

// available lifes of player A
let lifea=3;
// available lifes of player B
let lifeb=3;

// this will decide the frequency of missiles
let frame=0;

// created a Missile Object
class Missile{
    constructor(img,x,y,angle){
        this.x=x;
        this.y=y;
        this.img=img;
        this.angle=angle;
    }
    draw(x,y){
        c.save(); 
        c.translate((this.img.width/2)+x,(this.img.height/2)+ y);
        c.rotate(this.angle*Math.PI/180);
        c.drawImage(this.img, -(this.img.width/2), -(this.img.height/2),24,24);
        c.restore();
    }
    move(){
        this.x+=7*Math.sin(this.angle*Math.PI/180);
        this.y-=7*Math.cos(this.angle*Math.PI/180);
        this.draw(this.x,this.y)
    }
}


window.addEventListener('keydown',(event)=>{
    console.log(event);
    if(event.code=="KeyW"){
        speeda=5;
    }if(event.code=="KeyS"){
        // nothing is assigned yet
    }if(event.code=="KeyA"){
        anglea-=7;
    }if(event.code=="KeyD"){
        anglea+=7;
    }
});

window.addEventListener('keydown',(event)=>{
    if(event.code=="ArrowUp"){
        speedb=5;
    }if(event.code=="ArrowDown"){
        // nothing is assigned yet
    }if(event.code=="ArrowLeft"){
        angleb-=7;
    }if(event.code=="ArrowRight"){
        angleb+=7;
    }
});


function drawRotatedImage(image, x, y, angle)
{ 
    c.save(); 
    c.translate((image.width/2)+x,(image.height/2)+ y);
    c.rotate(angle*Math.PI/180);
    c.drawImage(image, -(image.width/2), -(image.height/2),50,50);
    c.restore(); 
}

function collison(x1,y1,x2,y2){
    if(Math.sqrt(Math.pow((x2-x1),2)-Math.pow((y2-y1),2))<10){
        return true
    }
    return false
}


function animate(){
    document.getElementById('scorea').innerHTML=lifea;
    document.getElementById('scoreb').innerHTML=lifeb;


    c.clearRect(0, 0, canvas.width, canvas.height);  
    // c.fillRect(0, 0, canvas.width, canvas.height);

    drawRotatedImage(a,pax,pay,anglea)
    drawRotatedImage(b,pbx,pby,angleb)

    pax+= speeda*Math.sin(anglea*Math.PI/180);
    pay-= speeda*Math.cos(anglea*Math.PI/180);
    pbx+= speedb*Math.sin(angleb*Math.PI/180);
    pby-= speedb*Math.cos(angleb*Math.PI/180);
    
    if(frame%110==0){
        misa=[]
        misb=[]
        let ma=new Missile(m,pax,pay,anglea)
        misa.push(ma)
        let mb=new Missile(m,pbx,pby,angleb)
        misb.push(mb)
        shoot.play();
    }
    if(misa.length!=0){
        misa[0].move()
        if(collison(misa[0].x,misa[0].y,pbx,pby)){
            lifeb-=1;
            hit.play();
            misa=[]
        }
    }
    if(misb.length!=0){
        misb[0].move()
        if(collison(misb[0].x,misb[0].y,pax,pay)){
            lifea-=1;
            hit.play();
            misb=[]
        }
    }
    
    if(lifea==0){
        gameover.play();
        document.getElementById('scorea').innerHTML=lifea;
        document.getElementById('show').innerHTML="Player B Wins"
        document.getElementById('popup').style.display="flex";
        cancelAnimationFrame(animationID)
    }
    if(lifeb==0){
        gameover.play()
        document.getElementById('scoreb').innerHTML=lifeb;
        document.getElementById('show').innerHTML="Player A Wins"
        document.getElementById('popup').style.display="flex";
        cancelAnimationFrame(animationID)
    }


    // making boundaries
    if(pax<5){pax=5;anglea+=7;}if(pay<5){pay=5;anglea+=7;}if(pax>canvas.width-70){pax=canvas.width-70;anglea+=7;}if(pay>canvas.height-70) {pay=canvas.height-70;anglea+=7;}
    if(pbx<5){pbx=5;angleb-=7}if(pby<5){pby=5;angleb-=7}if(pbx>canvas.width-70){pbx=canvas.width-70;angleb-=7}if(pby>canvas.height-70){pby=canvas.height-70;angleb-=7}

    frame+=1;
    let animationID = requestAnimationFrame(animate);
}

let reset=document.getElementById('reset');
reset.addEventListener('click',()=>{
    gameover.pause()
    lifea=3;
    lifeb=3;
    document.getElementById('popup').style.display="none";
    animationID = requestAnimationFrame(animate);
})