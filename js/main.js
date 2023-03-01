// JS File for hw06               
// Krishanu Datta and Zain Alam


// create frame constants
const FRAME_WIDTH = 500;
const FRAME_HEIGHT = 500;
const MARGINS = {left:50, right:50, top:50, bottom:50};
const VIS_HEIGHT = FRAME_HEIGHT - (MARGINS.top + MARGINS.bottom);
const VIS_WIDTH = FRAME_WIDTH - (MARGINS.left + MARGINS.right);

// create svg for the 3 plots
const FRAME1 = d3.select("#plot1")
.append("svg")
.attr("height", FRAME_HEIGHT)
.attr("width", FRAME_WIDTH)
.attr("class", "frame");


const FRAME2 = d3.select("#plot2")
.append("svg")
.attr("height", FRAME_HEIGHT)
.attr("width", FRAME_WIDTH)
.attr("class", "frame");     


const FRAME3 = d3.select("#plot3")
.append("svg")
.attr("height", FRAME_HEIGHT)
.attr("width", FRAME_WIDTH)
.attr("class", "frame");  

// read data from iris.csv
d3.csv("data/iris.csv").then((DATA) => {

    // add the color based on the species and specify the hex of each color
  const SPECIES_COLOR = d3.scaleOrdinal()
    .domain(["setosa", "versicolor", "virginica"])
    .range(["red", "purple", "green"]);

   
  const MAX_X_PLOT_1 = d3.max(DATA, (d) => {
    return parseInt(d.Sepal_Length);
  });

  
    const MAX_Y_PLOT_1 = d3.max(DATA, (d) => {
    return parseInt(d.Petal_Length);
  }); 

  
  const X_SCALE_PLOT_1 = d3.scaleLinear()
                    .domain([0, (MAX_X_PLOT_1 + 1)])
                    .range([0, VIS_WIDTH]);

 
  const Y_SCALE_PLOT_1 = d3.scaleLinear()
          .domain([0, (MAX_Y_PLOT_1 + 1)])
          .range([VIS_HEIGHT, 0]);
    
    
    const MAX_X_PLOT_2 = d3.max(DATA, (d) => {
    return parseInt(d.Sepal_Width);
  });

    
    const MAX_Y_PLOT_2 = d3.max(DATA, (d) => {
    return parseInt(d.Petal_Width);
  }); 

    
  const X_SCALE_PLOT_2 = d3.scaleLinear()
                    .domain([0, (MAX_X_PLOT_2 + 1)])
                    .range([0, VIS_WIDTH]);

    
  const Y_SCALE_PLOT_2 = d3.scaleLinear()
          .domain([0, (MAX_Y_PLOT_2 + 1)])
          .range([VIS_HEIGHT, 0]);
    
    // 50 species
  const MAX_Y_BAR = 50;

    
    const X_SCALE_BAR = d3.scaleBand()
    .domain(DATA.map((d) => { return d.Species; }))
    .range([0, VIS_WIDTH])
    .padding(0.2);
    
    
    const Y_SCALE_BAR = d3.scaleLinear()
    .domain([0, (MAX_Y_BAR)])
    .range([VIS_HEIGHT, 0]);

    // append the x and y axis to plot1
  FRAME1.append("g")
    .attr("transform", "translate(" + MARGINS.left + "," + (VIS_HEIGHT + MARGINS.top) + ")")
    .call(d3.axisBottom(X_SCALE_PLOT_1).ticks(10))
        .attr("font-size", "15px");
  FRAME1.append("g")
    .attr("transform", "translate(" + MARGINS.left + "," + (MARGINS.bottom) + ")")
    .call(d3.axisLeft(Y_SCALE_PLOT_1).ticks(10))
        .attr("font-size", "15px");

  // append x and y axis to plot2
  FRAME2.append("g")
    .attr("transform", "translate(" + MARGINS.left + "," + (VIS_HEIGHT + MARGINS.top) + ")")
    .call(d3.axisBottom(X_SCALE_PLOT_2).ticks(10))
        .attr("font-size", "15px");
  FRAME2.append("g")
    .attr("transform", "translate(" + MARGINS.left + "," + (MARGINS.bottom) + ")")
    .call(d3.axisLeft(Y_SCALE_PLOT_2).ticks(10))
        .attr("font-size", "15px"); 

  // append x and y axis to plot3
  FRAME3.append("g")
    .attr("transform", "translate(" + MARGINS.left + "," + (VIS_HEIGHT + MARGINS.top) + ")")
    .call(d3.axisBottom(X_SCALE_BAR).ticks(10))
    .attr("font-size", "15px");
    FRAME3.append("g")
    .attr("transform", "translate(" + MARGINS.left + "," + (MARGINS.bottom) + ")")
    .call(d3.axisLeft(Y_SCALE_BAR).ticks(10))
    .attr("font-size", "15px");

  // add points to plot1
  let GRAPH1 = FRAME1.selectAll("dot")
        .data(DATA)
        .enter()
        .append("circle")
        .attr("cx", (d) => { return X_SCALE_PLOT_1(d.Sepal_Length) + MARGINS.left; })
    .attr("cy", (d) => { return Y_SCALE_PLOT_1(d.Petal_Length) + MARGINS.top; })
        .attr("fill", (d) => { return SPECIES_COLOR(d.Species); })
        .style("opacity", 0.5)
        .attr("r", 5)
        .attr("class", "point");

  // add points to plot2
  let GRAPH2 = FRAME2.selectAll("dot")
    .data(DATA)
    .enter()
    .append("circle")
    .attr("cx", (d) => { return X_SCALE_PLOT_2(d.Sepal_Width) + MARGINS.left; })
    .attr("cy", (d) => { return Y_SCALE_PLOT_2(d.Petal_Width) + MARGINS.top; })
    .attr("fill", (d) => { return SPECIES_COLOR(d.Species); })
    .style("opacity", 0.5)
    .attr("r", 5)
    .attr("class", "point");

    // add brushing to plot2
    FRAME2.call(d3.brush()                 
    .extent([[0,0], [FRAME_WIDTH, FRAME_HEIGHT]]) 
    .on("start brush", displayBrush)); 



    // add data to plot3 (bar chart)
    let GRAPH3 = FRAME3.selectAll("bars")
    .data(DATA)
    .enter()
    .append("rect")
        .attr("x", (d) => { return X_SCALE_BAR(d.Species) + MARGINS.left; })
        .attr("y", (d) => { return Y_SCALE_BAR(MAX_Y_BAR) + MARGINS.top; })
        .attr("width", X_SCALE_BAR.bandwidth())
        .attr("height", (d) => { return VIS_HEIGHT - Y_SCALE_BAR(MAX_Y_BAR); })
        .attr("fill", (d) => { return SPECIES_COLOR(d.Species); })
        .style("opacity", 0.5)
        .attr("class", "bar");

    // shows the brushing
    function displayBrush(event) {
        selection = event.selection;
        GRAPH1.classed("selected", function(d){ return isSelected(selection, X_SCALE_PLOT_2(d.Sepal_Width) + MARGINS.left, Y_SCALE_PLOT_2(d.Petal_Width) + MARGINS.top); })
        GRAPH2.classed("selected", function(d){ return isSelected(selection, X_SCALE_PLOT_2(d.Sepal_Width) + MARGINS.left, Y_SCALE_PLOT_2(d.Petal_Width) + MARGINS.top); })
        GRAPH3.classed("selected", function(d){ return isSelected(selection, X_SCALE_PLOT_2(d.Sepal_Width) + MARGINS.left, Y_SCALE_PLOT_2(d.Petal_Width) + MARGINS.top); })
      };
    
      // when selecting a point to be brushed
      function isSelected(coords, cx, cy) {
        let x0 = coords[0][0],
            x1 = coords[1][0],
            y0 = coords[0][1],
            y1 = coords[1][1];
        return x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1;
      };

});