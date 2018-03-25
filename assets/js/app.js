// When the browser window is resized, respond() is called.
d3.select(window).on('resize', respond);
'#90EE90'
'#38B0DE'
// List of all chart elements
var charts = [
    ['svg1','container1','lessthan50k','normal',[5,5,10,5],'% Less than $50K Household Income','% Normal BMI'],
    ['svg2','container2','lessthan50k','obese',[4,5,15,5],'% Less than $50K Household Income','% Obese BMI'],
    ['svg3','container3','morethank150k','normal',[2,3,-15,5],'% More than $150K Household Income','% Normal BMI'],
    ['svg4','container4','morethank150k','obese',[2,2,0,5],'% More than $150K Household Income','% Obese BMI']
]

// Create all the charts on the page
function createCharts() {
    for(var i=0; i < charts.length; i++) {
        buildChart(charts[i][0], charts[i][1], charts[i][2], charts[i][3], charts[i][4], charts[i][5], charts[i][6])
    }
}

// Create charts when page loads
createCharts()

// Function to have charts respond
function respond() {
    var svgArea = d3.selectAll('svg');

    if (!svgArea.empty()) {
      svgArea.remove();
    };

    createCharts()
}

// Function to build chart
function buildChart(elementID, childElement, xAxisColumn, yAxisColumn, spacingArray, xAxsisLabel, yAxisLabel,circleFill) {
    var element = d3.select(elementID)
    console.log(element);

    // Define SVG area dimensions
    // var svgWidth = window.innerWidth;
    var svgWidth = document.getElementById(elementID).offsetWidth;
    var svgHeight = svgWidth*.7;

    // Define the chart's margins as an object
    var chartMargin = {
      top: 60,
      right: 30,
      bottom: 30,
      left: 60
    };

    // Inside the SVG area, append an SVG group, move it down and to the right
    var svg = d3
        .select('#'+elementID)
        .append('svg')
            .attr('height', svgHeight)
            .attr('width', svgWidth)
            .attr('id', childElement)
            .attr('class','svgArea')
            .append('g')
                .attr('transform', 'translate(' + chartMargin.left + ', ' + chartMargin.bottom + ')');

    // Define dimensions of the chart area
    var width = svgWidth - chartMargin.left - chartMargin.right;
    var height = svgHeight - chartMargin.top - chartMargin.bottom;

    d3.csv('assets/data/data.csv', function(error, data) {
        if (error) throw error;

        console.log(data);

        data.forEach(function(d) {
            d[xAxisColumn] = +d[xAxisColumn];
            d[yAxisColumn] = +d[yAxisColumn];
        });

        // Create scale functions
        var xLinearScale = d3.scaleLinear()
            .range([0, width]);

        var yLinearScale = d3.scaleLinear()
            .range([height, 0]);

        // Create axis functions
        var bottomAxis = d3.axisBottom(xLinearScale);
        var leftAxis = d3.axisLeft(yLinearScale);

        // Scale the domain
        xLinearScale.domain([d3.min(data, function(d) {
            return +d[xAxisColumn];
        }) - spacingArray[0], d3.max(data, function(d) {
            return +d[xAxisColumn];
        }) + spacingArray[1]]);
        yLinearScale.domain([d3.min(data, function(d) {
            return +d[xAxisColumn];
        }) - spacingArray[2], d3.max(data, function(d) {
            return +d[yAxisColumn];
        }) + spacingArray[3]]);

        // Create Tooltips
        var toolTip = d3.tip()
            .attr('class', 'tooltip')
            .offset([-5, 0])
            .html(function(d) {
                var state = d.state;
                var xValue = +d[xAxisColumn];
                var yValue = +d[yAxisColumn];
                return ('<strong>'+state+'</strong> <span style="color:red"><br>Income: ' + xValue + '%<br>Obesity: ' + yValue + '%</span>');
            });

        var chart = d3.select('#'+childElement).select('g')

        chart.call(toolTip);

        // Create circles for each data point
        chart.selectAll('circle')
            .data(data)
            .enter()
            .append('circle')
                .attr('cx', function(d, index) {
                  console.log(d[xAxisColumn]);
                  console.log(xLinearScale(d[xAxisColumn]));
                  return xLinearScale(d[xAxisColumn]);
                })
                .attr('cy', function(d, index) {
                  return yLinearScale(d[yAxisColumn]);
                })
                .attr('r', '10')
                .attr('fill', 'silver')
                .on('click', toolTip.show)
                //on mouseover
                .on('mouseover', toolTip.show)
                // onmouseout event
                .on('mouseout', toolTip.hide);
                // .append('text')
                //     .text(function(d) {
                //         console.log(d['abbr']);
                //         return d.abbr;
                //     })
                //     .attr('text-anchor','middle')
                //     .attr('dominant-baseline','middle')
                //     .attr('fill','black')
                //     .attr('class', 'stateAbbr');

        chart.selectAll('text')
            .data(data)
            .enter()
            .append('text')
                .attr('x', function(d, index) {
                  console.log(d[xAxisColumn]);
                  console.log(xLinearScale(d[xAxisColumn]));
                  return xLinearScale(d[xAxisColumn]);
                })
                .attr('y', function(d, index) {
                  return yLinearScale(d[yAxisColumn]);
              })
                .text(function(d) {
                    console.log(d['abbr']);
                    return d.abbr;
                })
                .attr('text-anchor','middle')
                .attr('dominant-baseline','middle')
                .attr('class', 'stateAbbr');

        chart.append('g')
            .attr('transform', `translate(0, ${height})`)
            .call(bottomAxis);

        chart.append('g')
            .call(leftAxis);

        chart.append('text')
            .attr('transform', 'rotate(-90)')
            .attr('y', 0 - chartMargin.left + 10) // -40
            .attr('x', 0 - (height / 2) - chartMargin.bottom - 20) //-250
            .attr('dy', '1em')
                .attr('class', 'axisText')
                .text(yAxisLabel)
                ;

          // Append x-axis labels
        chart.append('text')
            .attr('transform', 'translate(' + ((width / 2) - (chartMargin.left*2) - 20) + ' ,' + (height + chartMargin.bottom + 10) + ')')
            .attr('class', 'axisText')
            .text(xAxsisLabel);
    });
};
