function graphBubble() {

    // Based on Mike Bostock's margin convention
    // https://bl.ocks.org/mbostock/3019563
    let margin = {
        top: 10,
        left: 50,
        right: 30,
        bottom: 0
      },
      ourBrush = null,
      selectableElements = d3.select(null),
      dispatcher,
      svg;

    function chart(selector, dataFromCsv) {

        // set the data as children for d3.pack
        let dataset = {
            "children": dataFromCsv
        }

        // the diameter of the bubbles area for d3.pack
        let diameter = 200; 
          // https://observablehq.com/@d3/circle-packing
          // d3.pack to create bubbles algorithm
          let bubble = d3.pack(dataset)
            .size([diameter, diameter])
            .padding(1.5);

            // append the svg that we will draw on
            svg = d3.select(selector)
            .append('svg')
              .attr('preserveAspectRatio', 'xMidYMid meet')
              .attr('viewBox', [50, 0, 205, 250].join(' '))
      		
      		  // title
            svg.append("text") 
                .attr("y", 13)
                .attr("x", 150)
                .attr("text-anchor", "middle")
                .style("font-size", "7px")
                .style("text-decoration", "underline")
                .attr('margin-bottom', 200)
                .text("Most Used Keywords on UberPeople.net")
                .style("fill", "rgb(0, 0, 0)")
            
            // <g> for nodes and links
            svg = svg.append('g')
              .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

            // all the bubbles in the graph
            let nodes = d3.hierarchy(dataset)
            .sum(function(d) { 
                return d.count; });

            // individual nodes
            let node = svg.selectAll(".node")
            .data(bubble(nodes).descendants())
            .enter()
            .filter(function(d){
                return  !d.children
            })

            .append("g")
            .attr("class", "node")
            .attr("transform", function(d) {
                return `translate(${d.x}, ${d.y})`
            })
            .attr("cx", 410).attr("cy", 190)

            // add the actual circles
            node.append("circle")
            .attr("r", function(d) {
                return d.r;
            })
            .style("fill", "#1BBBDE")

            // append the keywords inside the circle
            node.append("text")
            .style("text-anchor", "middle")
            .text(function(d) {
                return d.data.keywords;
            })
            .attr("font-family", "sans-serif")
            .attr("font-size", function(d){
                
                if ((d.r/3.5) < 1.5) {
                  return 2 // the minimum font size before it's too small
                } 
                else {
                return d.r/3.5; // font size is 1/3 radius
            }})
            .style("fill", "black")

    // brush code (referenced from Cody Dunne's example)
    svg.call(brush);


    // Highlight points when brushed
    function brush(g) {
      const brush = d3.brush() // Create a 2D interactive brush
        .on('start brush', highlight) // When the brush starts/continues do...
        .on('end', brushEnd) // When the brush ends do...
        .extent([
          [0,0],
          [208,208]
        ]);
        
      ourBrush = brush;

      g.call(brush); // Adds the brush to this element

      
      // Highlight the selected circles
      function highlight(event, d) {
        if (event.selection === null) return;
        const [
          [x0, y0],
          [x1, y1]
        ] = event.selection;
        let circles = svg.selectAll('circle')
        circles.classed("selected", function(d){ 
          
        // https://stackoverflow.com/questions/21089959/detecting-collision-of-rectangle-with-circle
          let width = (x1 - x0)
          let height = (y1 - y0)

          let distX = Math.abs(d.x - x0-width/2);
    	  let distY = Math.abs(d.y - y0-height/2);
    	  
    	  let dx=distX-width/2;
    	  let dy=distY-height/2;

    		if (distX > (width/2 + d.r)) { return false; }
    		if (distY > (height/2 + d.r)) { return false; }

    		if (distX <= (width/2)) { return true; } 
    		if (distY <= (height/2)) { return true; }
		      return (dx*dx+dy*dy<=(d.r*d.r));
        })

        // Let other charts know about our selection
        let dispatchString = Object.getOwnPropertyNames(dispatcher._)[0];
        dispatcher.call(dispatchString, this, svg.selectAll('.selected').data());
        
      }
      
      function brushEnd(event, d){
        // We don't want infinite recursion
        if(event.sourceEvent !== undefined && event.sourceEvent.type!='end'){
          d3.select(this).call(brush.move, null);
        }
      }
    }        
            
            return chart;
    }

  // Gets or sets the dispatcher we use for selection events
  // this chart does not listen for any dispatch
  chart.selectionDispatcher = function (_) {
    if (!arguments.length) return dispatcher;
    dispatcher = _;
    return chart;
  };

    return chart;
}