/* global D3 */

var slices = []

// Initialize a line chart. Modeled after Mike Bostock's
// Reusable Chart framework https://bost.ocks.org/mike/chart/
function graphline() {

  // Based on Mike Bostock's margin convention
  // https://bl.ocks.org/mbostock/3019563
  let margin = {
      top: 30,
      left: 25,
      right: 25,
      bottom: 50
    },
    width = 800,
    height = 350,
    xValue = d => d.date,
    yValue = d => d.count,
    xLabelText = 'Date',
    yLabelText = 'Frequency of Words',
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

    // Y axis and label
    let yAxis = svg.append('g')
        .call(d3.axisLeft(yScale))
        .append('text')
        .attr('class', 'axisLabel')
        .attr('transform', 'translate(' + yLabelOffsetPx + ', -12)')
        .text(yLabelText);

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

  // Given selected data from another visualization
  // select the relevant elements here (linking)
  chart.updateSelection = function (selectedData) {
    if (!arguments.length) return;

    // Select an element if its datum was selected
    selectableElements.classed('selected', d =>
      selectedData.includes(d)
    );
  };

  return chart;
}
