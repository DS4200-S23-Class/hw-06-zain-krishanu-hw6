// JS File for hw06               
// Krishanu Datta and Zain Alam


// create frame constants
const FRAME_HEIGHT = 500;
const FRAME_WIDTH = 500; 
const MARGINS = {left: 50, right: 50, top: 50, bottom: 50};
const VIS_HEIGHT = FRAME_HEIGHT - MARGINS.top - MARGINS.bottom;
const VIS_WIDTH = FRAME_WIDTH - MARGINS.left - MARGINS.right; 


// create frame for scatter plot
const FRAME1 = d3.select("#plot1") 
                  .append("svg") 
                    .attr("height", FRAME_HEIGHT)   
                    .attr("width", FRAME_WIDTH)
                    .attr("class", "frame"); 


// read data for scatter plot
d3.csv("data/scatter-data.csv").then((data) => { 

    
    // find max of x and y values
    const MAX_X = d3.max(data, (d) => { return parseInt(d.x); });
    const MAX_Y = d3.max(data, (d) => { return parseInt(d.y); });

    // create scales to map x and y values to pixels 
    const X_SCALE = d3.scaleLinear() 
                      .domain([0, (MAX_X + 1)]) 
                      .range([0, VIS_WIDTH]); 
    const Y_SCALE = d3.scaleLinear() 
                      .domain([0, (MAX_Y + 1)]) 
                      .range([VIS_HEIGHT, 0]); 


    // append svg circle points based on data
  FRAME1.selectAll("point")  
      .data(data) 
      .enter()       
      .append("circle")  
        .attr("cx", (d) => { return (X_SCALE(d.x) + MARGINS.left); }) 
        .attr("cy", (d) => { return (Y_SCALE(d.y) + MARGINS.bottom); })
        .attr("r", 8)
        .attr("class", "point");


    // function to change color when mouse is hovering
    function changeColor(){
        d3.select(this)
              .style("fill", "blue");
    };


    // function to return to normal color after mouse is not hovering
    function normalColor(){
        d3.select(this)
              .style("fill", "darkred");
    };
        


    const POINT_CLICK = d3.select("#information")
                            .append("div");

    function clickPoint(d){
      const circle = d3.select(this);
      circle.classed("bordered", !circle.classed("bordered"));
      const xPt = X_SCALE.invert(circle.attr("cx"));
      const yPt = Y_SCALE.invert(circle.attr("cy"));
      POINT_CLICK.html("<br> Coordinates: (" + (Math.round(xPt) - 1) + "," + (Math.round(yPt) + 1) + ")");
    };


    // Add event listeners
    FRAME1.selectAll(".point")
          .on("mouseover", changeColor) 
          .on("click", clickPoint)
          .on("mouseleave", normalColor);    


    // append x axis to frame
    FRAME1.append("g") 
          .attr("transform", "translate(" + MARGINS.left + 
                "," + (VIS_HEIGHT + MARGINS.top) + ")") 
          .call(d3.axisBottom(X_SCALE).ticks(10)) 
           

    // append y axis to frame
    FRAME1.append("g") 
          .attr("transform", "translate(" + (MARGINS.left) + 
                "," + (MARGINS.top) + ")") 
          .call(d3.axisLeft(Y_SCALE).ticks(10)) 
           


    function addPoint(){
        const xcoord = d3.select("#x-coord").property("value");
        const ycoord = d3.select("#y-coord").property("value");

        FRAME1.append("circle")
                .attr("cx", (X_SCALE(xcoord) + MARGINS.left)) 
                .attr("cy", (Y_SCALE(ycoord) + MARGINS.bottom))
                .attr("r", 8)
                .attr("class", "point")
                .on("mouseover", changeColor) 
                .on("click", clickPoint)
                .on("mouseleave", normalColor);  
    };

    // create button
    d3.select("#create-pt")
    .on("click", addPoint); 

});




// bar plot frame
const FRAME2= d3.select("#plot2") 
                  .append("svg") 
                    .attr("height", FRAME_HEIGHT)   
                    .attr("width", FRAME_WIDTH)
                    .attr("class", "frame"); 



// read in bar data
  d3.csv("data/bar-data.csv").then((data) => { 

    
    // create y axis scale           
    const Y_SCALE = d3.scaleLinear() 
                          .domain([100, 0]) 
                          .range([0, VIS_HEIGHT]); 

    // create x axis scale 
    const X_SCALE = d3.scaleBand() 
                               .domain(data.map((d) => { return d.category; })) 
                               .range([0, VIS_WIDTH])
                               .padding(.2); 


    // plot bar based on data with rectangle svgs 
    FRAME2.selectAll("bar")  
          .data(data) 
          .enter()       
          .append("rect")  
            .attr("y", (d) => { return Y_SCALE(d.amount) + MARGINS.bottom; }) 
            .attr("x", (d) => { return X_SCALE(d.category) + MARGINS.left;}) 
            .attr("height", (d) => { return VIS_HEIGHT - Y_SCALE(d.amount); })
            .attr("width", 40)
            .attr("class", "bar");



       // append x axis to frame
       FRAME2.append("g") 
          .attr("transform", "translate(" + MARGINS.left + 
                "," + (VIS_HEIGHT + MARGINS.top) + ")") 
          .call(d3.axisBottom(X_SCALE))
          


    // append y axis to frame
      FRAME2.append("g") 
            .attr("transform", "translate(" + (MARGINS.left) + 
                  "," + (MARGINS.top) + ")") 
            .call(d3.axisLeft(Y_SCALE).ticks(10)) 
            


    // adding a tooltip
    const TOOLTIP = d3.select("#plot2")
                          .append("div")
                          .attr("class", "tooltip")
                          .style("opacity", 0); 


    
    function handleMouseover(event, d) {
      // change color of bar when mouse is over it
      d3.select(this)
                .style("fill", "orange");
     
      TOOLTIP.style("opacity", 1);


    };

    function handleMousemove(event, d) {

      // position the tooltip and fill in information 
      TOOLTIP.html("Category: " + d.category + "<br>Amount: " + d.amount)
              .style("left", (event.pageX + 10) + "px") 
              .style("top", (event.pageY - 50) + "px"); 
       
    };

    function handleMouseleave(event, d) {

      

      //return bar color
      d3.select(this)
              .style("fill", "darkred");

      TOOLTIP.style("opacity", 0); 
    };

    // Add event listeners
    FRAME2.selectAll(".bar")
          .on("mouseover", handleMouseover) 
          .on("mousemove", handleMousemove)
          .on("mouseleave", handleMouseleave);    


  });