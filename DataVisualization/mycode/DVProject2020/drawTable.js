function getGlobalMinMaxGGE(ggeData)
{
    var liY = []
    for (var i = 0; i < ggeData.length; i++)
    {
        var data = ggeData[i]
        liY.push(data.GGE)
    }
    return {'globalMax': d3.max(liY), 'globalMin': d3.min(liY)};
}

function getGlobalMinMaxGGEPC(ggeData)
{
    var liY = []
    for (var i = 0; i < ggeData.length; i++)
    {
        var data = ggeData[i]
        liY.push(data.GGEPC)
    }
    return {'globalMax': d3.max(liY), 'globalMin': d3.min(liY)};
}

function drawGGEChart(ggeData)
{
    const margin = 60;
    const width = 1000 - 2 * margin;
    const height = 600 - 2 * margin;

    //the overall svg
    var barsvg = d3.select("#coversvg")
    var title = barsvg.append('g')

    title.append("text")
    .attr("text-anchor", "begin")
    .attr("x", width/2 - margin*2)
    .attr("y", 30)
    .style("font-size", "24px")
    .text("Greenhouse gas emission in 2018")
    .style('font-weight', 'bold')

    var chart = barsvg.append('g')
                        .attr('transform', `translate(${margin}, ${margin})`);

    var globalMinMaxGGE = getGlobalMinMaxGGE(ggeData)
    var globalMinMaxGGEPC = getGlobalMinMaxGGEPC(ggeData)
    

    var xScale = d3.scaleBand()
                    .domain(ggeData.map(function (d) { return d.Country; }))
                    .range([0, width])
                    .padding(0.4)
    var yScale = d3.scaleLinear()
                    .domain([0, globalMinMaxGGE['globalMax']])
                    .range([height, 0])

    var zScale = d3.scaleLinear()
                    .domain([0, globalMinMaxGGEPC['globalMax']])
                    .range([height, 0])
    
    var x_axis = d3.axisBottom(xScale);

    var y_axis = d3.axisLeft(yScale)

    var z_axis = d3.axisRight(zScale)

    

    //add y axis 
    chart.append("g")
            .attr('class', 'x_axis')
            .attr('transform', `translate(0, ${height})`)
            .call(x_axis);
    chart.append('g')
        .call(y_axis)
    
    //add z axis 
    chart.append('g')
        .attr("transform", "translate(" + width + " ,0)")
        .call(z_axis)

    //add axis label for x axis 
    chart.append("text")
        .attr("text-anchor", "middle")
        .attr("x", width/2)
        .attr("y", height + margin/2 + 15)
        .text("Country");

    //add axis label for z axis 
    var wpadright = width + 30;
    chart.append('g')
        .attr('transform', 'translate(' + wpadright + ', ' + height/2 + ')')
        .append('text')
        .attr('text-anchor', 'middle')
        .attr('transform', 'rotate(90)')
        .text('Greenhouse gas emission per capital')

    // add axis label for y axis 
    chart.append('g')
        .attr('transform', 'translate(' + -40 + ', ' + height/2 + ')')
        .append('text')
        .attr('text-anchor', 'middle')
        .attr('transform', 'rotate(-90)')
        .text('Greenhouse gas emission')


    // add bars to the chart
    var multibar = chart.selectAll(".bar")
                        .data(ggeData)
                        .enter().append("g")
                        .attr("class", "bar")

    multibar.append('rect')
        .attr('x', (s) => xScale(s.Country))
        .attr('y', (s) => yScale(s.GGE))
        .attr('height', (s) => height - yScale(s.GGE))
        .attr('width', xScale.bandwidth()/2)
        .style('fill', '#fc9d62')
        .attr('class', 'GGERect')


    multibar.append('rect')
        .attr('x', (s) => xScale(s.Country) + xScale.bandwidth()/2)
        .attr('y', (s) => zScale(s.GGEPC))
        .attr('height', (s) => height - zScale(s.GGEPC))
        .attr('width', xScale.bandwidth()/2)
        .style('fill', '#8da0cb')
        .attr('class', 'GGEPCRect')
    
    // // feed the data to the line chart 
    // var line = d3.line()
    //     .x(function(d, i) { return xScale(d.Country) + xScale.bandwidth() / 2; })
    //     .y(function(d) { return zScale(d.GGEPC); })
    //     .curve(d3.curveMonotoneX);

    // //add line to the chart 
    // chart.append("path")
    //     .attr("class", "line") // Assign a class for styling
    //     .attr("d", line(ggeData));
    
    // // add legend 
    chart.append('circle')
        .style("fill", "#fc9d62")
        .attr("r", 10)
        .attr("cx", 250)
        .attr("cy", 10);
    
    chart.append("text")
        .attr("text-anchor", "begin")
        .attr("x", 250 + 20)
        .attr("y", 15)
        .text("Greenhouse gas emission");

    chart.append('circle')
        .style("fill", "#8da0cb")
        .attr("r", 10)
        .attr("cx", 250)
        .attr("cy", 40);
    
    chart.append("text")
        .attr("text-anchor", "begin")
        .attr("x", 250 + 20)
        .attr("y", 45)
        .text("Greenhouse gas emission per capital");
    
}
