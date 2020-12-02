// Immediately Invoked Function Expression to limit access to our
// variables and prevent
((() => {

  // General event type for selections, used by d3-dispatch
  // https://github.com/d3/d3-dispatch
  const dispatchString = 'selectionUpdated';
  let bubbleChart;
  let lineChart;
  let networkGraph;

  let parseDate = d3.timeParse('%m/%d/%y');
  // get the csv data
  d3.csv(
    'data/data.csv',
    function(d) {
      let ret = {
        date: parseDate(d.date),
        word : d.word,
        count: +d.count
      };
      return ret
   }
  ).then((data) => {

    lineChart = graphline()
    .selectionDispatcher(d3.dispatch(dispatchString))
    ('#linechart', data);

    d3.csv('data/keywords.csv').then((data) => {
     bubbleChart = graphBubble()
      .selectionDispatcher(d3.dispatch(dispatchString))
      ('#bubblechart', data);


    d3.json('data/graph.json').then((data) => {
      networkGraph = graphNetwork()
      ('#network', data);

      bubbleChart.selectionDispatcher()
      .on(`${dispatchString}.bc_to_nw`, networkGraph.updateSelection)

    });

  });
});

})());
