var img2 = [ 
'./imageFiles/svg/excited.svg',
'./imageFiles/svg/silly.svg',
'./imageFiles/svg/loved.svg',
'./imageFiles/svg/happy.svg',
'./imageFiles/svg/neutral.svg',
'./imageFiles/svg/nervous.svg',
'./imageFiles/svg/tired.svg',
'./imageFiles/svg/sad.svg',
'./imageFiles/svg/angry.svg'
];//images for mobile devices where emoji dont like to show up for some reason. 
var EmojiList=['\u{1F4A9}',"😬","😰","😵","😷","💩","😍","😉"];//list of emoji. The first is using unicode.
var EmojiValue=[1,1,1,2,3,4,4,5,5]; //values for each emoji on an emotional scale You have to match them up with the same index as the emoji in the emoji list
var EmojiMessage=[ //the message for each emoji 
	["Wahoo!","Glad to see you're filled with energy!","Share your enthusiasm with others!"],
	["Try to make someone laugh today!","Tell someone a joke!","Laughter is the best medicine - cure someone!"],
	["Get out of your comfort zone.","Spread your love.","Try something new today."],
	["Make someone smile today!","Spread happiness with others!","Encourage others to try new things!"],
	["Make this average day extraordinary!","Make today enjoyable!","Hold the door open for someone!","Give someone a hand!"],
	["Don't worry, you can do it!","Be confident in yourself!","Do your best, that is all anyone can ask for!"],
	["Wake up and start your day!","Go to sleep an hour earlier tonight!","Wake up and make the most of today!"],
	["Talk to someone about how you're feeling.","You will be Okay! It'll all work out.","Turn your frown upside down"],
	["Take a break and calm down.","Talk to someone about how you're feeling.","Hate cannot drive out hate, only love can do that - MLK Jr."]
];
var emojiArray=[];
var emojiCount=img2.length;//how many emoji we have. For some reason EmojiList.length doesnt work so I had to enter a number in manually.
var img1=[];
var emojiSize;
var newFrameCount=0;
var waitTimer=8;//how long to wait until it goes to next page.(in seconds)
function setup(){
	
	//download images
	for(var i=0;i<img2.length;i++){
		img1[i]=loadImage(img2[i]);
	}
	
	//setup stuff
	//createCanvas(400, 400);


	var szofCanvas=Math.min(document.getElementById('canvas-container').offsetWidth,document.getElementById('canvas-container').offsetHeight);
	szofCanvas-=20;
	var canvas = createCanvas(szofCanvas, szofCanvas);
	canvas.parent('canvas-container');

	frameRate(30);//how fast/fluid you want this to go. If we set this too high the device may lag.
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
			var message=EmojiMessage[i%EmojiMessage.length][(Math.floor(Math.random()*7))%EmojiMessage[i%EmojiMessage.length].length];
//			var message="The message assigned to this emoji is: "+EmojiMessage[i%EmojiMessage.length][(Math.floor(Math.random()*7))%EmojiMessage[i%EmojiMessage.length].length]+"<br> Its value scale is: " + emojiArray[i%emojiArray.length].value;
			//var message="You clicked: "+EmojiList[i%EmojiList.length]+" and your message for this emoji is: "+EmojiMessage[i%EmojiMessage.length][(Math.floor(Math.random()*7))%EmojiMessage[i%EmojiMessage.length].length]+" The value for this emoji on an emotional scale is: " + emojiArray[i%emojiArray.length].value;
			document.getElementById('clickedMessage').innerHTML=message;
			document.getElementById('id01').style.display='block'
			//alert();
			var now = new Date();
			//sending the data
			var time= now.getFullYear() +"-"+now.getMonth()+1+"-"+ now.getDate()+"-"+ now.getHours()+"-"+ now.getMinutes();
			time=now;
			var xhr = new XMLHttpRequest();
			xhr.open("POST", '/emoji', true);
			xhr.setRequestHeader('Content-Type', 'application/json');
			xhr.send(JSON.stringify({
    			'emoji': [time,EmojiValue[i],i]
			}));

			//goes to next page
			setTimeout(function(){ window.location.href = '/report'; }, 1000*waitTimer);

			i=-1;
		}
	}
}
function draw(){
	//clears the past drawings
	background(51,127,239);
//	rgb(101,177,239)
	//fill(255,0,0,0);
	//ellipse(width/2,height/2,width,height);
	//fill(101,177,239);


	//loops through emoji objects
	for(var i=0;i<emojiCount;i++){
	var v=Math.min((newFrameCount/500*10000) *emojiArray[i].radius,emojiArray[i].radius);
	//console.log(v);
	//rotate and drawing
	push();
	translate(emojiArray[i].position.x,emojiArray[i].position.y);
	rotate(radians(frameCount*2+i*40));
	fill(255,0,0);
	//ellipse(0,0,v*2,v*2);
	//console.log(emojiArray[i].position.x+""+emojiArray[i].position.y)
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
	this.velocity=createVector(random(-4,4),random(-4,4));
	this.acceleration=createVector(random(-0.02,0.02),random(-0.02,0.02)); 

	this.update = function(){
		this.lastFlip+=3;
		this.lastFlip2+=3;
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
