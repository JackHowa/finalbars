
// 1.
//WHAT'S GOING ON HERE? WHERE DOES IT GET USED AND WHAT DOES IT AFFECT?
//The margin convention sets the width, height and margin values for our chart space
//Our actual chart group (classed below as ".main-g") will live in the center of the svg element and be offset by the margins.
//Reference: http://bl.ocks.org/mbostock/3019563
var margin = {top: 20, right: 20, bottom: 20, left: 20},
    width = $(".chart").width() - margin.left - margin.right,
    height = $(".chart").height() - margin.top - margin.bottom;

// 2.
//WHAT ARE x AND y ?
//These are scales we use to turn our data values into pixel positions
//Scales have three important properties:
  //1. Type (ordinal and linear here)
  //2. range (the available space in which to plot the data)
  //3. domain (the total number of data points in the data)
//Reference: https://github.com/mbostock/d3/wiki/Scales
var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var y = d3.scale.linear()
    .range([height, 0]);

// 3.
//HOW DO THEY x AND y AXIS GET DRAWN?
//Axis are called within group ("g") elements
//Reference: https://github.com/mbostock/d3/wiki/SVG-Axes
var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

//WHAT'S THIS?
var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(10)
    .tickFormat(function(d) {
      return d;
    });



//4.
//WHERE DOES THIS APPEAR? WHAT DOES IT LOOK LIKE IN YOUR BROWSER INSPECTOR?
//This is where we'll put our chart.
//It gets appended to the .chart div, and is assigned a width and height.
//Remember that above, we define 'width' and 'height' as the width and height of .chart MINUS the margins.
//So to make our svg the full width and height of the .chart div, we ADD the margins to the 'width' and 'height'
//In the same statement, we also add a group where our chart will live (".main-g")
//Its position is defined in the transform attribute as margin.left (x pos) and margin.top (y pos)
var svg = d3.select(".chart")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("class", "main-g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");



//Our Ajax call loads the data...
//In the working example, we use d3.tsv
//But our data is JSON. SO we use d3.json
d3.json("js/baseballcard.json", function(error, data) {

  //5.
  //WHAT'S HAPPENING HERE?
  //We define the domain as all of the possible values for our ORDINAL x scale.
  x.domain(data.stats.map(function(d) {
    return d.year;
  }));

  //And here we define the minimum and maximum values for our LINEAR y scale.
  y.domain([0, d3.max(data.stats, function(d) {
    return d.H;
  })]);


  //6.
  //WHAT'S GOING ON IN THE NEXT TWO BLOCKS?
  //We append two groups to the page, one for each of our axis.
  //Each is positioned with a transform property because they're groups.
  //Then we 'call' the axis, which draws it on the page.
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 15)
      .style("text-anchor", "end")
      .text("Hits");
  
  //7.
  //AND WHAT'S THIS? ARE WE ITERATING THROUGH OUR DATA HERE?
  //HOW IS THIS DIFFERENT THAN THE $.each() METHOD WE USED TO CREATE THE LAST CHART?
  //This is where we draw our bars on the page.
  //We select the phantom ".bar"s, which do not yet exist.
  //Then we feed them data
  //For each item in our data, a "rect" tag is added to the page
  //Each rectangle takes on a width, height and x,y position which is determined by the data value
  //Properties are determined by "feeding" the data to the variables at the top of the script:
    // x(d.someValue),y(d.someValue),rangeband(d.someValue)
  svg.selectAll(".bar")
      .data(data.stats)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) {
          return x(d.year);
      })
      .attr("width", x.rangeBand())
      .attr("y", function(d) {
        console.log(y(d.H));
        return y(d.H);
      })
      .attr("height", function(d) { return height - y(d.H); });

});


//Miller Time!






