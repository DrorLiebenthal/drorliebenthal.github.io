/* Author: Dror Liebenthal */

// Variables to keep track of all the input parameters
// First 3 also keep track of the changing counts once simulation starts
var infCount = 1, susCount = 100, recCount = 0, infRate = 0.5, BR = 0, DR = 0, RR = 10;
var paper; // The canvas
var radius = 5; // Size of each animal
var timestep = 25, timer; // in milliseconds, timer stores the setInterval return value
// array that resizes as necessary to hold all the animals in the environment
var animals; 
var curS, curI, curR; // divs to display susCount, infCount, and recCount
// Intervals for user-specified birth and death frequencies
var birthTimer, deathTimer; 
var modelType; // SI = 0, SIS = 1, SIR = 2 

// Initializing displays when the window loads
window.onload = function()
{
    curS = document.getElementById('cS');
    curI = document.getElementById('cI');
    curR = document.getElementById('cR');
    curS.innerHTML = document.params.sus.value;
    curI.innerHTML = document.params.inf.value;
    curR.innerHTML = document.params.rec.value;
    paper = new Raphael(document.getElementById('environment'));
}


/*
 * Called when the start button is clicked. Reads in all input parameters
 * and populates the environment with the appropriate number of S, I, and
 * R individuals. Starts the animation interval.
 */
function newEnv()
{
    clearEnv();
    // Return if non-numeric or no input
    if (!processInput()) {return;}
    animals = new Array();
    // Fill animals array with appropriate number of each of S, I, and R
    for (var i = 0; i < susCount; i++)
    {
        animals.push(new Animal());
    }
    for (var i = 0; i < infCount; i++)
    {
        animals.push(new Animal());
        animals[animals.length - 1].infected = 1;
        // Set recovery timer for each infected animal if SI or SIR model
        if (modelType != 0)
        {
            animals[animals.length - 1].setRecovery();
        }
    }
    for (var i = 0; i < recCount; i++)
    {
        animals.push(new Animal());
        animals[animals.length - 1].infected = 2;
    }
    timer = setInterval("takeStep()", timestep);

}

/*
 * Clears the canvas and all timers. Sets the animal array to null.
 * First thing to happen when start button is clicked. Called when
 * stop button is clicked.
 */
function clearEnv()
{
    paper.clear();
    clearInterval(timer);
    clearInterval(birthTimer);
    clearInterval(deathTimer);
    /*
     * Notes that the animals have been removed (later checked in
     * the recovery interval handler in Animal.js)
     */
    if (animals != null)
    {
        for (var i = 0; i < animals.length; i++)
        {
            animals[i].removed = true;
        }
        animals = null;
    }
    curS.innerHTML = document.params.sus.value;
    curI.innerHTML = document.params.inf.value;
    curR.innerHTML = document.params.rec.value;
}

/*
 * Progresses animation by one step. Called by an interval timer with
 * interval specified by the timestep variable.
 */
function takeStep()
{
    paper.clear();
    for (var i = 0; i < animals.length; i++)
    {
        animals[i].move();
    }
    checkCollision();
}

/*
 * Takes all user input, validates that everything has been specified and
 * that the relevant variables have been specified as numeric. Stores input
 * in the corresponding global variables.
 */
function processInput()
{
    var sus = document.params.sus.value;
    var inf = document.params.inf.value;
    var rec = document.params.rec.value;
    var infProb = document.params.infProb.value;
    var birthRate = document.params.bRate.value;
    var deathRate = document.params.dRate.value;
    var recRate = document.params.rRate.value;
    
    if (!(isNumber(sus) && isNumber(inf) && isNumber(rec) && 
        isNumber(infProb) && isNumber(birthRate) && isNumber(deathRate)))
    {
        alert("Numeric input is required");
        return false;
    }
    
    if (!document.params.rRate.disabled)
    {
        if (!isNumber(recRate))
        {
            alert("Please enter a recovery time");
            return false;
        }
    }
    
    susCount = sus;
    infCount = inf;
    recCount = rec;
    infRate = infProb;
    
    // Set birth and death timers, if appropriate
    if (birthRate != 0)
    {
        BR = 1000/birthRate; // convert second to millisecond
        birthTimer = setInterval("birth()", BR);
    }
    if (deathRate != 0)
    {
        DR = 1000/deathRate;
        deathTimer = setInterval("death()", DR);
    }
    RR = recRate * 1000;
    
    // Store model type
    var radioButtons = document.params.mod;
    if (radioButtons[0].checked) {modelType = 0;}
    else if (radioButtons[1].checked) {modelType = 1;}
    else {modelType = 2;}
    
    return true;
}

/*
 * Handle birth event by creating a new susceptible animal
 */
function birth()
{

    animals.push(new Animal());
    susCount++;
    document.getElementById('cS').innerHTML = susCount;
}

/*
 * Handle death event by removing an animal at random
 */
function death()
{
    var removed = animals.splice(Math.round(Math.random()*animals.length), 1)[0];
    if (removed.infected == 1)
    {
        infCount--;
        document.getElementById('cI').innerHTML = infCount;
    }
    else if (removed.infected == 0)
    {
        susCount--;
        document.getElementById('cS').innerHTML = susCount;
    }
    else if (removed.infected == 2)
    {
        recCount--;
        document.getElementById('cR').innerHTML = recCount;
    }
    removed.removed = true;
}

// Helper function for validating input
function isNumber(n) 
{
  return !isNaN(parseFloat(n)) && isFinite(n);
}
