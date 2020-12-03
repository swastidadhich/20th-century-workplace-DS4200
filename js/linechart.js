/* global D3 */

var slices = []

// Initialize a line chart. Modeled after Mike Bostock's
// Reusable Chart framework https://bost.ocks.org/mike/chart/
function graphline() {

  // Based on Mike Bostock's margin convention
  // https://bl.ocks.org/mbostock/3019563
  let margin = {
      top: 30,
      left: 55,
      right: 25,
      bottom: 75
    },
    width = 850,
    height = 350,
    xValue = d => d.date,
    yValue = d => d.count,
    xLabelText = 'Date',
    yLabelText = '',
    yLabelOffsetPx = 0,
    xScale = d3.scaleTime(),
    yScale = d3.scaleLinear(),
    ourBrush = null,
    selectableElements = d3.select(null),
    dispatcher;
    selector = '#linechart';



  // Create the chart by adding an svg to the div with the id
  // specified by the selector using the given data
  function chart(selector, data) {

      // Define the div for the tooltip
    let div = d3.select(selector).append("div") 
        .attr("class", "tooltip2")       
        .style("opacity", 0);

    data.forEach((word) => {

        let wordObject = slices.find(el => el.id === word.word );

        if (!wordObject) {
          wordObject = {
            id: word.word,
            values: [{
              date: word.date,
              count: word.count
            }]
          }
          slices.push(wordObject)

        } else {
          slices[slices.findIndex(el => el.id === word.word)].values.push({
            date: word.date,
            count: +word.count
          })
        }
      });

  console.log(slices);
    let svg = d3.select(selector)
      .append('svg')
        .attr('preserveAspectRatio', 'xMidYMid meet')
        .attr('viewBox', [0, 0, width + margin.left + margin.right, height + margin.top + margin.bottom].join(' '))
        .classed('svg-content', true);

    svg = svg.append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');


    //Define scales
    xScale
      .domain([
        d3.min(data, d => xValue(d)),
        d3.max(data, d => xValue(d))
      ])
      .rangeRound([0, width]);

    yScale
      .domain([
        d3.min(data, d => yValue(d)),
        d3.max(data, d => yValue(d))
      ])
      .rangeRound([height, 0]);

    // X axis
    let xAxis = svg.append('g')
        .attr('transform', 'translate(0,' + (height) + ')')
        .call(d3.axisBottom(xScale));

    // Put X axis tick labels at an angle
    xAxis.selectAll('text')
        .style('text-anchor', 'end')
        .attr('dx', '-.8em')
        .attr('dy', '.15em')
        .attr('transform', 'rotate(-65)');

    // X axis label
    xAxis.append('text')
        .attr('class', 'axisLabel')
        .attr('transform', 'translate(' + (width - 50) + ',-10)')
        .text(xLabelText);

    // text label for the x axis
      svg.append("text")
          .attr("transform", "translate(" + (width/2) + " ," + (height + margin.top + 30) + ")")
          .style("text-anchor", "middle")
          .text("Date");

    // Y axis and label
    let yAxis = svg.append('g')
        .call(d3.axisLeft(yScale))
        .append('text')
        .attr('class', 'axisLabel')
        .attr('transform', 'translate(' + yLabelOffsetPx + ', -12)')
        .text(yLabelText);

    // text label for the y axis from https://bl.ocks.org/d3noob/23e42c8f67210ac6c678db2cd07a747e
    svg.append("text")
     .attr("transform", "rotate(-90)")
     .attr("y", 0 - margin.left)
     .attr("x",0 - (height / 2))
     .attr("dy", "1em")
     .style("text-anchor", "middle")
     .text("Frequency of Words");

    // adds the title of the graph
    // template from D3 Title Reference
    svg.append("text")
      .attr("x", (width / 2))             
      .attr("y", 0)
      .attr("text-anchor", "middle")  
      .style("font-size", "16px") 
      .style("text-decoration", "underline")  
      .text("Keyword Trends over Time");

    let line = d3.line()

    .x(function(d) {
      return xScale(d.date);
    })

    .y(function(d) {
      return yScale(d.count);
    })

    let lines = svg.selectAll("lines")
      .data(slices)
      .enter()
      // creates <g> block for each line
      .append("g")

    var color = d3.scaleOrdinal(d3.schemeCategory10);


    // Add the line
    lines.append('path')
    .attr("id", function(d) { return d.id }) // the id is the keyword
    .attr('class', 'line')
    .attr("d", function(d) { return line(d.values); })
    .style('stroke', function(d) {return color(d.id); })

    .on("mouseover", function(event, d) {   
                div.transition()    
                    .duration(200)    
                    .style("opacity", .9);    
                div .html("keyword: " + d.id)  
                    .style("left", (event.pageX) + "px")    
                    .style("top", (event.pageY - 28) + "px"); 
              })          
            .on("mouseout", function(d) {   
                div.transition()    
                    .duration(500)    
                    .style("opacity", 0); 
            });

    return chart;
  }

  // The x-accessor from the datums
  function X(d) {
    return xScale(xValue(d));
  }

  // The y-accessor from the datum
  function Y(d) {
    return yScale(yValue(d));
  }

  chart.margin = function (_) {
    if (!arguments.length) return margin;
    margin = _;
    return chart;
  };

  chart.width = function (_) {
    if (!arguments.length) return width;
    width = _;
    return chart;
  };

  chart.height = function (_) {
    if (!arguments.length) return height;
    height = _;
    return chart;
  };

  chart.x = function (_) {
    if (!arguments.length) return xValue;
    xValue = _;
    return chart;
  };

  chart.y = function (_) {
    if (!arguments.length) return yValue;
    yValue = _;
    return chart;
  };

  chart.xLabel = function (_) {
    if (!arguments.length) return xLabelText;
    xLabelText = _;
    return chart;
  };

  chart.yLabel = function (_) {
    if (!arguments.length) return yLabelText;
    yLabelText = _;
    return chart;
  };

  chart.yLabelOffset = function (_) {
    if (!arguments.length) return yLabelOffsetPx;
    yLabelOffsetPx = _;
    return chart;
  };

  // Gets or sets the dispatcher we use for selection events
  chart.selectionDispatcher = function (_) {
    if (!arguments.length) return dispatcher;
    dispatcher = _;
    return chart;
  };

  chart.updateSelection = function (selectedData) {
    console.log("heard")
    let selectedWords = [] // keep track of words in a string array
    for (let i =0; i < selectedData.length; i++) {
      selectedWords.push(selectedData[i].data.keywords)
    }
    console.log(selectedWords)
    
    if (!arguments.length) return;
    let lines = document.getElementsByClassName('line')
    for (let i = 0; i<lines.length; i++) {
      if (selectedWords.includes(lines[i].id)) {
        lines[i].style.display = 'block';
      } else {
        lines[i].style.display = 'none';
      }
    }

  };

  return chart;
}
