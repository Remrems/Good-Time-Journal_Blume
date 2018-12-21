//Kommentar von Christian
var data = [];
var ready = false;
var dateScale = d3.scaleTime();
var timeScale = d3.scaleTime();
var parseDate = d3.timeParse('%d.%m.%y'); //09.10.18
var colorScale = d3.scaleOrdinal();
var activitesScale = d3.scalePoint();
var activities = [];



function setup() {
  createCanvas(600, 600);


  noLoop();

  d3.csv("GTJ.csv", function (d, i) { //d geht jede einzelne Zeile durch. D= Array

    var startDate = new Date();//parseDate(d.Date);

    var endDate = new Date();//parseDate(d.Date);

    return {
      date: parseDate(d.Date), //plus sagt es ist eine Zahl //wir speichern die daten in eine Variable
      activities: d.Activities.toLowerCase(),
      environments: d.Environments,
      energylevel: +d.Energylevel,
      moodlevel: +d.Moodlevel,
      alcohol: d.Alcohol,
      objects: d.Objects,
      people: d.People,
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


    activities = d3.set(data, function (d) { //diese Funktion macht eine Liste der einzelnen Wochentage, und übernimmt jedes wort 1x
      return d.activities; //greift auf die vordefinierte variable weekday Z15 zu
    }).values();


    activitesScale.domain(activities).range([100, 900]);

    console.log("amount activities" + " " + activities.length);

    colorScale.domain(activities)
      .range(['#ff93ab', '#bc7568', '#94c3af', '#155a3c', '#ffb745', '#6a002b',
        '#138d90', '#001871', '#43bcff', '#ffb743', '#e95b4f', '#660033',
        '#a4e46b', '#fb6f62', '#f69454', '#24978d', '#01796f', '#990033',
        '#cb2636', '#a7dbce', '#6abf5a', '#ff8b27', '#d2ac7d', '#890029',
        '#79b120', '#ca326b', '#f3b0d0', '#830015', '#e15a53',
        '#4c8cb5', '#de937c', '#374873', '#86b872', '#a76767', '#67709c',
        '#85b881', '#b2769d', '#8f6aa1', '#8ee5ee', '#009688', '#ff7878']);


    redraw();
  });

}

function draw() {

  if (!ready) {
    background(255, 0, 0);
    return;
  } else {
    background(200);
  }
  for (var i = 0; i < data.length; i++) {

  }

  drawFlower(width/2,height/2,100,4,2,5,'asdf');

}


function drawFlower(x,y,radius,energy, mood, engagement, activity){

  // var scaleDotAngle = d3.scaleLinear()
  //   .domain([0,10])
  //   .range([0,360]);

  

  //draw engagement dots
  push();
  translate(x,y);
  var angleBetweenDots = 360/10;
  var dotRadius = radius/20;
  console.log(angleBetweenDots);
  for (var i = 0; i < engagement; i++) {
    var angle = i*angleBetweenDots;
    console.log(angle);
    var v = p5.Vector.fromAngle(radians(angle), radius);

    noStroke();
    fill('black');
    ellipse(v.x,v.y,dotRadius,dotRadius);
  }
  pop();
  

}
