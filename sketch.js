var img2 = [ './imageFiles/1f600.svg' , './imageFiles/1f60b.svg' , './imageFiles/1f60d.svg','./imageFiles/1f610.svg','./imageFiles/1f621.svg','./imageFiles/1f62d.svg','./imageFiles/1f630.svg','./imageFiles/1f634.svg','./imageFiles/1f642.svg']//images for mobile devices where emoji dont like to show up for some reason. 
var EmojiList=['\u{1F4A9}',"😬","😰","😵","😷","💩","😍","😉"];//list of emoji. The first is using unicode.
var EmojiValue=[1,2,2,3,4,4,5,6]; //values for each emoji on an emotional scale You have to match them up with the same index as the emoji in the emoji list
var EmojiMessage=[ //the message for each emoji 
	["message1","message2","message3","message4","message5","message6","message7"],
	["message1","message2","message3","message4","message5","message6","message7"],
	["message1","message2","message3","message4","message5","message6","message7"],
	["message1","message2","message3","message4","message5","message6","message7"],
	["message1","message2","message3","message4","message5","message6","message7"],
	["message1","message2","message3","message4","message5","message6","message7"],
	["message1","message2","message3","message4","message5","message6","message7"],
	["message1","message2","message3","message4","message5","message6","message7"],
];
var emojiArray=[];
var emojiCount=10;//how many emoji we have. For some reason EmojiList.length doesnt work so I had to enter a number in manually.
var img1=[];
var emojiSize;
var newFrameCount=0;
function setup(){
	
	//download images
	for(var i=0;i<img2.length;i++){
		img1[i]=loadImage(img2[i]);
	}
	
	//setup stuff
	createCanvas(300, 300);
	frameRate(60);//how fast/fluid you want this to go. If we set this too high the device may lag.
	textSize(120);
	textAlign(CENTER,CENTER);
	imageMode(CENTER);
	
	
	
	emojiSize=width/13;
	//create emoji objects in array
	for(var i=0;i<emojiCount;i++){
		emojiArray[i]=new createEmoji(i,i%img2.length,emojiSize);
	}

}
function mouseClicked(){
	
	//countdown from the oposite way so you click the topmost emoji
	for(var i=(emojiCount-1);i>-1;i--){
		var v=Math.min((newFrameCount/500) *emojiArray[i].radius,emojiArray[i].radius);
		if(dist(mouseX,mouseY,emojiArray[i].position.x,emojiArray[i].position.y)<v){
			for(var j=0;j<emojiCount;j++){
				if(i!==j){emojiArray[j].position.add(2*width,2*height);}
			}
			emojiArray[i].radius=width/6;//Needs to be changed
			emojiArray[i].position.x=width/2;
			emojiArray[i].position.y=width/6;
			emojiArray[i].acceleration.x=0;
			emojiArray[i].velocity.x=0;
			emojiArray[i].acceleration.y=0.1;
			emojiArray[i].velocity.y=0;
			newFrameCount=1000;
			alert("You clicked: "+EmojiList[i%EmojiList.length]+" and your message for this emoji is: "+EmojiMessage[i%EmojiMessage.length][(Math.floor(Math.random()*7))%EmojiMessage[i%EmojiMessage.length].length]+" The value for this emoji on an emotional scale is: " + emojiArray[i%emojiArray.length].value);
			i=-1;
		}
	}
}
function draw(){
	//clears the past drawings
	background(255);
	fill(255,0,0,0);
	ellipse(width/2,height/2,width,height);
	fill(0,255,0);

	//loops through emoji objects
	for(var i=0;i<emojiCount;i++){
	var v=Math.min((newFrameCount/500) *emojiArray[i].radius,emojiArray[i].radius);
	//console.log(v);
	//rotate and drawing
	push();
	translate(emojiArray[i].position.x,emojiArray[i].position.y);
	rotate(radians(frameCount*2+i*40));
	ellipse(0,0,v*2,v*2);
	image(img1[emojiArray[i].emojiImg], 0, 0,v*2,v*2);//Make sure the last two arguments are relative to the same as line 34 //Mobile needs the image, because text wont load for some reason.
	//text(emojiArray[i].pic,0,0); //firefox needs this. It also works with chrome.
	pop();
	
//	incase I want to remove rotate for proformance/style	
//	image(img1[emojiArray[i].emojiImg], emojiArray[i].position.x,emojiArray[i].position.y);
//	ellipse(emojiArray[i].position.x,emojiArray[i].position.y,emojiArray[i].radius*2,emojiArray[i].radius*2);
//	text(emojiArray[i].pic,emojiArray[i].position.x,emojiArray[i].position.y);
	
	//collision detection
	for(var j=0;j<emojiCount;j++){ 
	//for(var j=0;j<1;j++){ 
	var d2=dist(emojiArray[i].position.x,emojiArray[i].position.y,emojiArray[j].position.x,emojiArray[j].position.y);
	if(i==j){d2=width+height;}
	if((emojiArray[i].lastFlip2>90&& d2<(emojiArray[i].radius+emojiArray[j].radius))||(emojiArray[i].lastFlip>10&& dist(width/2,height/2,emojiArray[i].position.x,emojiArray[i].position.y)>(width/2-emojiArray[i].radius))){
		var temp=emojiArray[i].velocity.x;
		emojiArray[i].velocity.x=(emojiArray[i].velocity.y);//this is a bit cheaty, but nobody will notice. Its also most likley the reason for strange behavior
		emojiArray[i].velocity.y=(-temp);
		emojiArray[i].lastFlip=0;
		emojiArray[i].lastFlip2=0;
	}}
	//gets a new position for the next frame. 
	emojiArray[i].update();
	}
	newFrameCount++;
}

//template of each emoji object
var createEmoji = function(emoji,img1,emojiSize){
	this.lastFlip=0;
	this.lastFlip2=0;
	this.radius=emojiSize;//If we need to adjust the collision size
	this.pic=EmojiList[emoji%EmojiList.length];
	this.emojiImg=img1;
	this.value=EmojiValue[emoji];
	
	//basic physics simulation
	this.position=createVector(width/2+random(-width/4,width/4),height/2+random(-height/4,height/4));
	this.velocity=createVector(random(-2,2),random(-2,2));
	this.acceleration=createVector(random(-0.01,0.01),random(-0.01,0.01)); 

	this.update = function(){
		this.lastFlip++;
		this.lastFlip2++;
		this.position.add(this.velocity);
		this.velocity.add(this.acceleration);
	}
}



/*
		//Stuff If we wanted to know the angle the emoji bounced and the slope of the tangent line
		var slope=Math.abs((emojiArray[i].position.x)/sqrt(Math.abs((width/2)^2-(emojiArray[i].position.x)^2)));
		if(emojiArray[i].position.y<=height/2&&emojiArray[i].position.x<=width/2){slope=(-1*Math.abs(slope));}
		else if(emojiArray[i].position.y>=height/2&&emojiArray[i].position.x>=width/2){slope=(-1*Math.abs(slope));}

		var angle=Math.atan((slope-(emojiArray[i].velocity.y/emojiArray[i].velocity.x))/(1+(slope*(emojiArray[i].velocity.y/emojiArray[i].velocity.x))));
*/
