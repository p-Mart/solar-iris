//dweaver_nought - 2016
//Simulation of the solar system

/*
Todo:

*Fix time display to have a constant size
*Button functionality
*General code optimizations / cleaning up

*/

var myFont;
var mouseoffset_x;
var mouseoffset_y;
var offset_x;
var offset_y;
var temp_offset_x;
var temp_offset_y;
var store_mousex;
var store_mousey;
var hasClicked;
var scale_factor = 1.0;
var translate_x = 0.0;
var translate_y = 0.0;


var mercury;
var venus;
var earth;
var mars;
var jupiter;
var saturn;
var uranus;
var neptune;



function Planet(asc_node_longitude,inclination,arg_perihelion,semi_major_axis,
    eccentricity,mean_anomaly,planet_color)
{
    this.asc_node_longitude = asc_node_longitude;
    this.inclination = inclination;
    this.arg_perihelion = arg_perihelion;
    this.semi_major_axis = semi_major_axis;
    this.eccentricity = eccentricity;
    this.mean_anomaly = mean_anomaly;
    
    this.longitude_perihelion = asc_node_longitude + arg_perihelion;
    this.mean_longitude = mean_anomaly + this.longitude_perihelion;
    this.perihelion_distance = semi_major_axis*(1 - eccentricity);
    this.aphelion_distance = semi_major_axis*(1 + eccentricity);
    this.orbital_period = Math.pow(semi_major_axis,1.5);
    this.semi_minor_axis = semi_major_axis * Math.sqrt(1-Math.pow(eccentricity,2));
	this.planet_color = planet_color;
}



Planet.prototype.eccentricAnomaly = function(){
  var eccentric_anomaly;
  //var new_eccentric_anomaly;
  var M = this.mean_anomaly;
  var e = this.eccentricity;
  
  //Working in radians
  eccentric_anomaly = M + e * sin(M) *(1.0 + e *cos(M));
  
  
  //Improve the approximation of the eccentric anomaly
  if(e > 0.06){
    new_eccentric_anomaly = eccentric_anomaly - (eccentric_anomaly - e*sin(eccentric_anomaly) - M) /
      (1 - e * cos(eccentric_anomaly));
      
    while(new_eccentric_anomaly - eccentric_anomaly > radians(0.001)){
	  eccentric_anomaly = new_eccentric_anomaly;
      new_eccentric_anomaly = eccentric_anomaly - (eccentric_anomaly - e*sin(eccentric_anomaly) - M) /
        (1 - e * cos(eccentric_anomaly));
    }
    eccentric_anomaly = new_eccentric_anomaly;
  }
  
  return eccentric_anomaly;
}

Planet.prototype.trueAnomaly = function(){
  var E = this.eccentricAnomaly();
  var e = this.eccentricity;
  var a = this.semi_major_axis;
  
  var true_anomaly;
  var true_anomaly_x;
  var true_anomaly_y;
  
  true_anomaly_x = a * (cos(E) - e);
  true_anomaly_y = a * (sqrt(1.0 - e*e) * sin(E));
  true_anomaly = atan2(true_anomaly_y,true_anomaly_x);
  
  return true_anomaly;
}

Planet.prototype.distance = function(){
  var E = this.eccentricAnomaly();
  var e = this.eccentricity;
  var a = this.semi_major_axis;
  
  var true_anomaly_x;
  var true_anomaly_y;
  var d;
  
  true_anomaly_x = a * (cos(E) - e)
  true_anomaly_y = a * (sqrt(1.0 - e*e) * sin(E));
  d = sqrt(Math.pow(true_anomaly_x,2) + Math.pow(true_anomaly_y,2));
  
  return d;
}

Planet.prototype.xPosition = function(){
  var r = this.distance();
  var v = this.trueAnomaly();
  var N = this.asc_node_longitude;
  var w = this.arg_perihelion;
  var i = this.inclination;
  
  return r * (cos(N) * cos(v+w) - sin(N) * sin(v+w) * cos(i));
}

Planet.prototype.yPosition = function(){
  var r = this.distance();
  var v = this.trueAnomaly();
  var N = this.asc_node_longitude;
  var w = this.arg_perihelion;
  var i = this.inclination;
  
  return r * (sin(N) * cos(v+w) + cos(N) * sin(v+w) * cos(i));
}

Pluto.prototype = new Planet();
Pluto.prototype.constuctor = Pluto;
function Pluto(asc_node_longitude,inclination,arg_perihelion,semi_major_axis,
    eccentricity,mean_anomaly,planet_color,orbit_period){
	this.asc_node_longitude = asc_node_longitude;
    this.inclination = inclination;
    this.arg_perihelion = arg_perihelion;
    this.semi_major_axis = semi_major_axis;
    this.eccentricity = eccentricity;
    this.mean_anomaly = mean_anomaly;
    
    this.longitude_perihelion = asc_node_longitude + arg_perihelion;
    this.mean_longitude = mean_anomaly + this.longitude_perihelion;
    this.perihelion_distance = semi_major_axis*(1 - eccentricity);
    this.aphelion_distance = semi_major_axis*(1 + eccentricity);
    this.orbital_period = Math.pow(semi_major_axis,1.5);
    this.semi_minor_axis = semi_major_axis * sqrt(1-Math.pow(eccentricity,2));
	this.planet_color = planet_color;
	this.orbit_period = orbit_period;
}

Pluto.prototype.distance = function(){
	var P = this.orbit_period;
	var r;
	r     =  40.72
           + 6.68 * sin(P)       + 6.90 * cos(P)
           - 1.18 * sin(2*P)     - 0.03 * cos(2*P)
           + 0.15 * sin(3*P)     - 0.14 * cos(3*P);
	print(r);	   
	return r * 100; // convert to dAU
}
//Returns the day number using moment.js
function calcDayNumber(){
  var current_date = moment([year(),month() - 1, day()]);
  var epoch_j2k = moment([2000,0,1]);
  var difference = current_date.diff(epoch_j2k, 'days');
  print(difference);
  return(difference);
}

//Planets' orbital elements
//Currently starting at J.2000 epoch (day 0)
//[a]= [dAU]
var mercury_a;
var mercury_e;
var mercury_N;
var mercury_i;
var mercury_w;
var mercury_M;

var venus_a;
var venus_e;
var venus_N;
var venus_i;
var venus_w;
var venus_M;

var earth_a;
var earth_e;
var earth_N;
var earth_i;
var earth_w;
var earth_M;

var mars_a;
var mars_e;
var mars_N;
var mars_i;
var mars_w;
var mars_M;

var jupiter_a;
var jupiter_e;
var jupiter_N;
var jupiter_i;
var jupiter_w;
var jupiter_M;

var saturn_a;
var saturn_e;
var saturn_N;
var saturn_i;
var saturn_w;
var saturn_M;


var uranus_a;
var uranus_e;
var uranus_N;
var uranus_i;
var uranus_w;
var uranus_M;

var neptune_a;
var neptune_e;
var neptune_N;
var neptune_i;
var neptune_w;
var neptune_M;

var pluto_a;
var pluto_e;
var pluto_N;
var pluto_i;
var pluto_w;
var pluto_M;


function preload(){
    myFont = loadFont('radiospace.ttf');
}

function setup() {
  var d = calcDayNumber();
  print (calcDayNumber());
  createCanvas(windowWidth,windowHeight);
  offset_x = 0;
  offset_y = 0;
  mouseoffset_x = 0;
  mouseoffset_y = 0;
  temp_offset_x = 0;
  temp_offset_y = 0;
  hasClicked = false;
  
  //Initializing planets' orbital elements
	var mercury_a = 38.71;
	var mercury_e = 0.2056;
	var mercury_N = radians(48.33);
	var mercury_i = radians(7.005);
	var mercury_w = radians(29.12);
	var mercury_M = radians(168.6 + 4.092 * d) ;
	
	var venus_a = 72.3;
	var venus_e = 0.0068;
	var venus_N = radians(76.68);
	var venus_i = radians(3.395);
	var venus_w = radians(54.89);
	var venus_M = radians(48.01 + 1.602 * d);
	
	var earth_a = 100.0;
	var earth_e = 0.0167;
	var earth_N = radians(348.7);
	var earth_i = radians(7.155);
	var earth_w = radians(114.2);
	var earth_M = radians(358.6 + 0.9856 * d);
	
	var mars_a = 152.4;
	var mars_e = 0.0934;
	var mars_N = radians(49.56);
	var mars_i = radians(1.850);
	var mars_w = radians(286.5);
	var mars_M = radians(18.60 + 0.5240207766 * d);
	
	var jupiter_a = 520.3;
	var jupiter_e = 0.0484;
	var jupiter_N = radians(100.5);
	var jupiter_i = radians(1.303);
	var jupiter_w = radians(273.9);
	var jupiter_M = radians(19.90 + 0.08308 * d);
	
	var saturn_a = 953.7;
	var saturn_e = 0.0542;
	var saturn_N = radians(113.7);
	var saturn_i = radians(2.489);
	var saturn_w = radians(339.4);
	var saturn_M = radians(317.0 + 0.03344 * d);
	
	
	var uranus_a = 1919.1;
	var uranus_e = 0.0472;
	var uranus_N = radians(74.00);
	var uranus_i = radians(0.7733);
	var uranus_w = radians(96.66);
	var uranus_M = radians(142.6 + 0.01172 * d);
	
	var neptune_a = 3006.9;
	var neptune_e = 0.0086;
	var neptune_N = radians(131.8);
	var neptune_i = radians(1.770);
	var neptune_w = radians(272.8);
	var neptune_M = radians(260.2 + 0.005995 * d);
	
	var pluto_a = 3954;
	var pluto_e = 0.24905;
	var pluto_N = radians(110.299);
	var pluto_i = radians(11.40);
	var pluto_w = radians(113.834);
	var pluto_M = radians(14.53 + 0.003977 * d);
	var pluto_P = radians(238.95  +  0.003968789 * d);
  
  
  //Initializing planets
  mercury = new Planet(mercury_N,mercury_i,mercury_w,mercury_a,mercury_e,mercury_M,'#7F7F7F');
  venus = new Planet(venus_N,venus_i,venus_w,venus_a,venus_e,venus_M,'#FFD166');
  earth = new Planet(earth_N,earth_i,earth_w,earth_a,earth_e,earth_M,'#669BFF');
  mars = new Planet(mars_N,mars_i,mars_w,mars_a,mars_e,mars_M,'#FF3C3C');
  jupiter = new Planet(jupiter_N,jupiter_i,jupiter_w,jupiter_a,jupiter_e,jupiter_M,'#FF9866');
  saturn = new Planet(saturn_N,saturn_i,saturn_w,saturn_a,saturn_e,saturn_M,'#FFEC9F');
  uranus = new Planet(uranus_N,uranus_i,uranus_w,uranus_a,uranus_e,uranus_M,'#84F9FF');
  neptune = new Planet(neptune_N,neptune_i,neptune_w,neptune_a,neptune_e,neptune_M,'#0269FF');
  pluto = new Pluto(pluto_N,pluto_i,pluto_w,pluto_a,pluto_e,pluto_M,'#FFCCFF',pluto_P);
  
}

function draw() {
  background(25,5,54);

  smooth();

  
  if(mouseIsPressed){
    if(hasClicked === false){
      hasClicked = true;
      temp_offset_x = offset_x;
      temp_offset_y = offset_y;
    }
    mouseoffset_x = (mouseX - store_mousex)/scale_factor;
    mouseoffset_y = (mouseY - store_mousey)/scale_factor;
  }else{
    hasClicked = false;
    mouseoffset_x = 0;
    mouseoffset_y = 0;
    temp_offset_x = offset_x;
    temp_offset_y = offset_y;
    store_mousex = mouseX;
    store_mousey = mouseY;
  }
	
  offset_x = temp_offset_x + mouseoffset_x;
  offset_y = temp_offset_y + mouseoffset_y;
  
  
  //Non-text layer
  push();
	//Move everything on the screen according to how zoomed in we are
	translate(translate_x,translate_y);
	scale(scale_factor);
  
	//Draw the planets
	push();
		//The sun
		fill(255,255,0);
		noStroke();
		ellipse(windowWidth/2 + offset_x,windowHeight/2+offset_y,20,20); 
		
		fill(mercury.planet_color);
		ellipse(windowWidth/2 + offset_x + mercury.xPosition(), windowHeight/2 + offset_y + mercury.yPosition(),10,10);
		fill(venus.planet_color);
		ellipse(windowWidth/2 + offset_x + venus.xPosition(), windowHeight/2 + offset_y + venus.yPosition(),10,10);
		fill(earth.planet_color);
		ellipse(windowWidth/2 + offset_x + earth.xPosition(), windowHeight/2 + offset_y + earth.yPosition(),10,10);
		fill(mars.planet_color);
		ellipse(windowWidth/2 + offset_x + mars.xPosition(), windowHeight/2 + offset_y + mars.yPosition(),10,10);
		fill(jupiter.planet_color);
		ellipse(windowWidth/2 + offset_x + jupiter.xPosition(), windowHeight/2 + offset_y + jupiter.yPosition(),10,10);
		fill(saturn.planet_color);
		ellipse(windowWidth/2 + offset_x + saturn.xPosition(), windowHeight/2 + offset_y + saturn.yPosition(),10,10);
		fill(uranus.planet_color);
		ellipse(windowWidth/2 + offset_x + uranus.xPosition(), windowHeight/2 + offset_y + uranus.yPosition(),10,10);
		fill(neptune.planet_color);
		ellipse(windowWidth/2 + offset_x + neptune.xPosition(), windowHeight/2 + offset_y + neptune.yPosition(),10,10);
		fill(pluto.planet_color);
		ellipse(windowWidth/2 + offset_x + pluto.xPosition(), windowHeight/2 + offset_y + pluto.yPosition(),10,10);
		
	pop();

	//Draw the planets' orbits
	push();
  
		drawPlanetOrbit(mercury);
		drawPlanetOrbit(venus);
		drawPlanetOrbit(earth);
		drawPlanetOrbit(mars);
		drawPlanetOrbit(jupiter);
		drawPlanetOrbit(saturn);
		drawPlanetOrbit(uranus);
		drawPlanetOrbit(neptune);
		drawPlanetOrbit(pluto);
		
	pop();
  
    //Draw the planets' names
	push();
  
		drawPlanetName(mercury,"Mercury");
		drawPlanetName(venus, "Venus");
		drawPlanetName(earth, "Earth");
		drawPlanetName(mars, "Mars");
		drawPlanetName(jupiter, "Jupiter");
		drawPlanetName(saturn, "Saturn");
		drawPlanetName(uranus, "Uranus");
		drawPlanetName(neptune, "Neptune");
		drawPlanetName(pluto, "Pluto");
		
	pop();
  
  //End non-text layer
  pop();


  //Text for the top of the screen
  push();

	noStroke();
	fill(180,180,180);
	textFont(myFont);
	textSize(64);
	textAlign(CENTER);
	text('SOLAR IRIS',windowWidth/2,48);
	textSize(26);
	text(formattedDate() + "\t" + formattedTime(),windowWidth/2,72); //Time printer
  
  pop();
  
  //Buttons for the bottom of the screen
  push();
  
	noStroke();
	textFont(myFont);
	textSize(32);
	textAlign(CENTER);
	var center_view_text = "Center View";
	
	//Check if the mouse is currently in the bounding box of the button
	if(mouseX >= windowWidth/2 - textWidth(center_view_text)/2 && mouseX <= windowWidth/2 + textWidth(center_view_text)/2 &&
		mouseY <= windowHeight - windowHeight/32 + 16 && mouseY >= windowHeight - windowHeight/32 - 16)
		{
			fill(255,255,255);
			if(mouseIsPressed){
				translate_x = 0;
				translate_y = 0;
				scale_factor = 1;
				offset_x = 0;
				offset_y = 0;
			}
		}
	else
		{
			fill(180,180,180);
		}
	
	text(center_view_text,windowWidth/2,windowHeight - windowHeight/32);
	
  pop();
}

function windowResized(){
  resizeCanvas(windowWidth,windowHeight);
}

//Formats the time into hh:mm:ss
//Update so that the string never changes size depending on the time
function formattedTime(){
  var time;
  var time_hour;
  var time_minute;
  var time_second;
  
 if (hour() < 10){
   time_hour = "0" + hour();
 } else{
   time_hour = hour();
 }
 
 if (minute() < 10){
   time_minute = "0" + minute();
 }else{
   time_minute = minute();
 }
 
 if (second() < 10){
   time_second = "0" + second();
 }else{
   time_second = second();
 }
  
  time = time_hour + ":" + time_minute + ":" + time_second;
  
  return time;
}

function formattedDate(){
	var month_name;
	//oh boy here we go
	if (month() == 1) {month_name = "January"}
	else if (month() == 2) {month_name = "February"}
	else if (month() == 3) {month_name = "March"}
	else if (month() == 4) {month_name = "April"}
	else if (month() == 5) {month_name = "May"}
	else if (month() == 6) {month_name = "June"}
	else if (month() == 7) {month_name = "July"}
	else if (month() == 8) {month_name = "August"}
	else if (month() == 9) {month_name = "September"}
	else if (month() == 10) {month_name = "October"}
	else if (month() == 11) {month_name = "November"}
	else if (month() == 12) {month_name = "December"}
	
	return month_name + " " + day() + ", " + year();
}

//Controls the zooming in the program
function mouseWheel(event){
  translate_x -= mouseX;
  translate_y -= mouseY;
  
  var meme = event.delta < 0 ? 1.05 : event.delta > 0 ? 1.0/1.05 : 1.0;
  translate_x *= meme;
  translate_y *= meme;
  scale_factor *= meme;
  translate_x += mouseX;
  translate_y += mouseY;
}

//Draws the name of a planet directly above it
function drawPlanetName(planet_ref,planet_name){
  fill(220,220,220);
  textFont(myFont);
  textSize(14);
  textAlign(CENTER);
  push();
  translate(windowWidth/2 + offset_x + planet_ref.xPosition(),windowHeight/2 + offset_y + planet_ref.yPosition()-14);
  scale(1/scale_factor);
  text(planet_name,0,0);
  pop();
}

//Draws the orbit of a planet
function drawPlanetOrbit(planet_ref){
	var a = planet_ref.semi_major_axis;
	var b = planet_ref.semi_minor_axis;
	var N = planet_ref.asc_node_longitude;
	var w = planet_ref.arg_perihelion;
	var e = planet_ref.eccentricity;
	var i = planet_ref.inclination;
	stroke(planet_ref.planet_color);
	noFill();
	push();
	translate(windowWidth/2 + offset_x,windowHeight/2+offset_y);
	rotate((N+w));
	ellipse(-a*e,0,2*a*cos(i),2*b)
	pop();
	
}


