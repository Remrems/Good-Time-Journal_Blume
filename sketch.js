var data = [];
var ready = false;
var dateScale = d3.scaleTime();
var timeScale = d3.scaleTime();
var parseDate = d3.timeParse('%d.%m.%y'); //09.10.18
var dayScale = d3.scalePoint();
var hourScale = d3.scaleLinear(); //scaleLinear ist eine vordefinierte Funktion von d3, mapt in Zahlen
var colorScale = d3.scaleOrdinal();
var activitesScale = d3.scalePoint();
var activities = [];

var flowerPetal;
var star;

function preload() {
  flowerPetal = loadImage('blumenblatt.png');
  star = loadImage('stern.png')
  flowerPetalBorder = loadImage('blumenblatt_rand.png');
}


function setup() {

  createCanvas(6000, 6500);
  noLoop();
  pixelDensity(2);


  d3.csv("GTJ.csv", function (d, i) { //d geht jede einzelne Zeile durch. D= Array

    var startDate = new Date();//parseDate(d.Date);


    return {
      date: parseDate(d.Date), //plus sagt es ist eine Zahl //wir speichern die daten in eine Variable
      hour: +d.Hour,
      activities: d.Activities.toLowerCase(),
      environments: d.Environments,
      energylevel: +d.Energylevel,
      moodlevel: +d.Moodlevel,
      alcohol: d.Alcohol,
      objects: d.Objects,
      people: d.People.toLowerCase(),
      names: d.Namesofusers,
      engagement: +d.Engagement
    };



  }).then(function (csv) {
    data = csv;
    ready = true;
    console.log(data);

    var dateDomain = d3.extent(data, function (d) {
      return d.date;
    });

    dateScale.domain(dateDomain)
    .range([0, 300]);

    days = d3.set(data, function (d) { //diese Funktion macht eine Liste der einzelnen Wochentage, und übernimmt jedes wort 1x
      return d.date; //greift auf die vordefinierte variable weekday Z15 zu
    }).values();

    dayScale.domain(days) //keine eckigen Klammern weil weekdays schon ein Array ist
    .range([0,6000]);

    let maxEnd = d3.max(data, function (d) {
        return d.hour;
      });

    hourScale.domain([0, maxEnd]) //domain nimmt die Ausgangswerte
    .range([0, 3300]); //range gibt die Zielwerte auf die gemapt werden soll an



    activities = d3.set(data, function (d) { //diese Funktion macht eine Liste der einzelnen Wochentage, und übernimmt jedes wort 1x
      return d.activities; //greift auf die vordefinierte variable weekday Z15 zu
    }).values();


    activitesScale.domain(activities).range([100, 500]);
    console.log(activities);
    console.log("amount activities" + " " + activities.length);

    colorScale.domain(activities)
    .range(['#ff93ab',  '#94c3af', '#155a3c', '#ffb745', '#6a002b',
      '#138d90', '#001871', '#43bcff', '#85b881', '#b2769d', '#8f6aa1', '#8ee5ee',
  '#009688', '#fb6f62', '#f69454', '#8b0000', '#01796f', '#990033',
      '#cb2636', '#a7dbce', '#6abf5a', '#ff8b27', '#138d90', '#890029',
       '#79b120', '#ca326b', '#f3b0d0', '#A37AA5', '#e15a53','#bc7568',
      '#4c8cb5',  '#43bcff', '#374873', '#86b872', '#a76767', '#67709c'
      ]);


    redraw();
  });

}

function draw() {

  if (!ready) {
    background(255, 0, 0);
    return;
  } else {
    // background(255);
    clear();
  }

  for (var i = 0; i < data.length; i++) {
    var energy = data[i].energylevel;
    var mood = data[i].moodlevel;
    var engagement = data[i].engagement;
    var activity = data[i].activities;
    var people = data[i].people;
    var x = hourScale(data[i].hour);
    // var x = 200 * i + 100;
    var y = dayScale(data[i].date) + 100;

    if (people == "alone") {
    var alone = true;
    } else {
    var alone = false;
    }


    //draw a flower
    drawFlower(x, y, 80, energy, mood, engagement, activity, alone);
  }




}

function drawFlower(x, y, radius, energy, mood, engagement, activity, alone) {

  //draw flower petals
  var anglePerPetal = 360 / 5;
  var flowerMaxWidth = 0.5 * radius;
  var flowerMinWidth = flowerMaxWidth / 5;
  var flowerWidth = round(map(energy, 1, 5, flowerMinWidth, flowerMaxWidth));
  var flowerHeight = round((flowerPetal.height / flowerPetal.width) * flowerWidth);

  for (let i = 0; i < mood; i++) {
    var angle = i * anglePerPetal;
    push();
    translate(x, y);
    rotate(radians(angle));
    var col = colorScale(activity);
    // tint(col);
    // image(flowerPetal, 0, 0, flowerWidth, flowerHeight);


    if (!alone) {
    tint(col);
    image(flowerPetal, 0, 0, flowerWidth, flowerHeight);

    tint(255, 127);
    image(flowerPetal, 0, 0, flowerWidth*0.4, flowerHeight*0.4);
    // tint(col);
    // image(flowerPetal, 0, 0, flowerWidth*1.15, flowerHeight*1.15);
    // tint(255, 127);
    // image(flowerPetal, 0, 0, flowerWidth, flowerHeight);

  } else {
    tint(col);
    image(flowerPetal, 0, 0, flowerWidth, flowerHeight);

  }

    pop();
  }

  //draw engagement dots
  push();
  translate(x, y);
  var angleBetweenDots = 360 / 10;
  var dotRadius = radius / 10;
  // console.log(angleBetweenDots);
  for (var i = 0; i < engagement; i++) {
    var angle = i * angleBetweenDots;
    // console.log(angle);
    var v = p5.Vector.fromAngle(radians(angle), radius);

    noStroke();
    fill('black');

    if (i < 8){
      ellipse(v.x, v.y, dotRadius, dotRadius);
    } else {
        image(star, v.x, v.y, 17, 17);
      }
  }
  pop();


}
function keyPressed(){
  if (key == 's'){
    saveCanvas('Flowers', 'png');

  }

}
