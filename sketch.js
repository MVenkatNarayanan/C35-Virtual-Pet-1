const Engine = Matter.Engine;
const World= Matter.World;
const Bodies = Matter.Bodies;

 var engine,world;

//Create variables here
var dog,happyDog;
var database;
var foods,foodStock;
var food;
var lastFed,fedTime;
var Foodstock;

function preload()
{
  //load images here
  dogImg=loadImage("Dog.png");
  happyImg=loadImage("happydog.png")
  
}

function setup() {
  database=firebase.database();
  createCanvas(1100, 800);

  engine = Engine.create();
  world = engine.world;
  
  dog=createSprite(624,374,10,10);
  dog.addImage("standing",dogImg);

  dog.scale=0.15;

  feed=createButton("Feed the dog");
  feed.position(700,95);
  feed.mousePressed(addFoods);

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

    foodStock=database.ref('Food');
    foodStock.on("value",readStock);

    foodObj=new Food();
}


function draw() {  
background(46,139,87);

Engine.update(engine)

  foodObj.display();

  if(keyWentDown(UP_ARROW)){
       feedPet();
    
  }
  fill(255,255,254);
          textSize(15);
          if(lastFed>=12){
              text("Last Feed:"+lastFed%12+"PM",350,30);
    
          }else if(lastFed===0){
              text("Last Feed:12 AM",350,30);
          }else {
              text("Last Feed:"+lastFed+"AM",350,30)
          }


  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  })
  drawSprites();

  textSize(25);
  stroke("white");
  text(mouseX + "," + mouseY, 10,30);
  //add styles here
textSize(23);
fill("white");
stroke("green");
//text("Note:Press UP_ARROW Key To Feed Drago Milk",500,100);
}
 
function readStock(data){
  foods=data.val();
}

function writeStock(data){

 foodStock.set(data)
}
function feedPet(){
  if(foods>0){
    writeStock(foods-1);
    
  }
  else{
    dog.addImage(dogImg);
  }
}
function feedDog(){
  dog.addImage("happy",happyImg);

  foodObj.updateFoodstock(foodObj.getFoodstock()-1);
  database.ref('/').update({
    food:foodObj.getFoodstock(),
    FeedTime:hour()
  })
}
function addFoods(){
  foods++;
  database.ref('/').update({
    food:foods
  })
}