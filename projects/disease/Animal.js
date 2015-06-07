/* Author: Dror Liebenthal */

/* 
 * Constructer for the Animal class. Animals are initialized with random position
 * and speed. 
 */
function Animal()
{
    this.x = rand(paper.width);
    this.y = rand(paper.height);
    this.xspeed = rand(10) - 5;
    this.yspeed = rand(10) - 5;
    // Time elapsed since a collision that could have resulted in an infection
    // Necessary so that subsequent timesteps dont re-recognize earlier collisions
    this.timeElapsed = 0;
    // S = 0, I = 1, R = 2
    this.infected = 0;
    this.removed = false;
    // Bounce off West or East canvas wall
    this.bouncex = function()
    {
        this.xspeed = -1 * this.xspeed;
    };
    // Bounce off North or South canvas wall 
    this.bouncey = function()
    {
        this.yspeed = -1 * this.yspeed;
    };
    // For SIS or SIR models
    this.setRecovery = function()
    {
        var _this = this;
        // Duration is specified by RR, in which the user input has been stored
        setTimeout(function() 
        {
            if (_this.removed) {return;}
            // SIS
            if (modelType == 1)
            {
            
                _this.infected = 0;
                infCount--;
                susCount++;
            }
            // SIR
            else
            {
                _this.infected = 2;
                infCount--;
                recCount++;
            }
            curI.innerHTML = infCount;
            curS.innerHTML = susCount;
            curR.innerHTML = recCount;
        }, RR);
    };
    // Update position and render at appropriate spot
    this.move = function()
    {
        this.timeElapsed++;
        this.x = this.x + this.xspeed;
        this.y = this.y + this.yspeed;
        // East
        if ((this.x + radius) > paper.width)
        {
            this.bouncex();
            this.x = paper.width - radius;
        }
        // South
        if ((this.y + radius) > paper.height)
        {
            this.bouncey();
            this.y = paper.height - radius;
        }
        // West
        if (this.x <= 0)
        {
            this.bouncex();
            this.x = radius;
        }
        // East
        if (this.y <= 0)
        {
            this.bouncey();
            this.y = radius;
        }
        this.draw();
    };
    
    // Render using Raphael.js framework
    this.draw = function()
    {
        var circle = paper.circle(this.x, this.y, radius);
        if (this.infected == 0)
        {
            circle.attr("fill", "blue");
        }
        else if (this.infected == 1)
        {
            circle.attr("fill", "red");
        }
        else
        {
            circle.attr("fill", "green");
        }
    };
}

/*
 * A function that identifies all collisions occurring in the animals array
 * during the current timestep. It will also call functions for handling
 * possible infection. It uses an efficient sorting based algorithm for
 * improved performance when many individuals are present.
 */
function checkCollision()
{
    maxDist = 2 * radius;
    // Sort all circles by natural order at the end of each time step.
    // N log N time
    var naturalOrder = function(a,b)
    {
        if (a.x == b.x) return a.y - b.y;
        return a.x - b.x;
    }
    animals.sort(naturalOrder);
    
    var j;
    var xDist, yDist;
    /*
     * Performance here is input dependent, but should on average have
     * linear performance (worst case is N^2), in particular because
     * animal positions are randomly generated.
     */
    for (var i = 0; i < (animals.length - 1); i++)
    {
        j = i + 1;
        xDist = Math.abs(animals[i].x - animals[j].x);
        // Collision can only happen with x-overlap
        while ((xDist <= maxDist) & (j < animals.length))
        {
            yDist = Math.abs(animals[i].y - animals[j].y);
            // Euclidean Distance
            if (Math.sqrt(xDist*xDist + yDist*yDist) <= maxDist)
            {
                if ((animals[i].timeElapsed > 15) && (animals[j].timeElapsed > 15))
                {
                    didInfect(animals[i], animals[j]);
                }
            }
            j++;
            xDist = Math.abs(animals[i].x - animals[j].x);
        }
    }
}

/*
 * Checks whether a collision is between an infected and a susceptible
 * animal. If so, determines whether the collision results in an infection
 * based on user-specified probability of infection.
 */
function didInfect(a1, a2)
{
    // I and S
    if ((a1.infected == 1) && (a2.infected == 0))
    {
        a1.timeElapsed = 0;
        a2.timeElapsed = 0;
        if (Math.random() < infRate ? true: false)
        {
            a2.infected = 1;
            infCount++;
            susCount--;
            curI.innerHTML = infCount;
            curS.innerHTML = susCount;
            if (modelType != 0)
            {
                a2.setRecovery();
            }
        }
    }
    // S and I
    else if ((a2.infected == 1) && (a1.infected == 0))
    {
        a1.timeElapsed = 0;
        a2.timeElapsed = 0;
        if (Math.random() < infRate ? true: false)
        {
            a1.infected = 1;
            infCount++;
            susCount--;
            curI.innerHTML = infCount;
            curS.innerHTML = susCount;
            if (modelType != 0)
            {
                a1.setRecovery();
            }
        }
    }
}

// Helper function generating a random number between 0 and max.
function rand(max)
{
    return Math.random() * max;
}
