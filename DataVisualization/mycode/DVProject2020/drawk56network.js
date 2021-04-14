function drawGraph(nodes, links)
{
    var graphsvg = d3.select("#graphsvg")
    var gwidth = graphsvg.node().getBoundingClientRect().width
    var gheight = graphsvg.node().getBoundingClientRect().height
    // graphsvg.style("background-color", '#ECE7E7')
    
    var isAnimating = false;

    var simulation = d3.forceSimulation(nodes)
        .force('charge', d3.forceManyBody().strength(-1500))
        .force('center', d3.forceCenter(gwidth /3, gheight / 2))
        .force('link', d3.forceLink().links(links))
        .stop(); // stop the tick after finishing calculate the positionf for nodes and link
        // .on('tick', ticked);

    var link = graphsvg.selectAll('line')
                        .data(links)
                        .enter()
                        .append('line')
                        .attr('class', 'link')
                        .attr('id', function(d) {
                            // console.log(d)
                            var tarname = d.source.Name;
                            var desname = d.target.Name;
                            var tagid = "#" + tarname.replace(/ /g,'') + desname.replace(/ /g,'');
                            return tagid;
                        })
    
    var node = graphsvg.selectAll('node')
                        .data(nodes)
                        .enter()
                        .append('g')
                        .attr('class', 'node')
                        .attr('Name', function(d) {return d.Name})
                        .attr('index', function(d) {return d.index})
                        .attr('id', function(d){
                            // console.log(d)
                            var tagid = "node"
                            tagid = tagid + d.Name.replace(/ /g,'')
                            // console.log(tagid)
                            return tagid
                        })
                        
    
                        
                        
    
    var circle = node.append('circle')
                    .attr('r', 20)
                    .attr('cx', 20)
                    .attr('cy', 20)
                    .attr('id', function(d){
                        return d.Name.replace(/ /g,'')
                    })
                    .call(d3.drag().on('drag', dragged))
                    
        
    var label = node.append('text')
                    .attr('text-anchor', 'middle')
                    .attr('font-size', '10px')
                    .text(function(d){
                        var thisname = d.Name;
                        var matches = thisname.match(/\b(\w)/g);
                        var tag = matches.join('');
                        return tag
                    })
                    .attr('id', function(d){
                        var tagid = "label"
                        tagid = tagid + d.Name.replace(/ /g,'')
                        // console.log(tagid)
                        return tagid

                    })
    
    for (var i = 0, n = Math.ceil(Math.log(simulation.alphaMin()) / Math.log(1 - simulation.alphaDecay())); i < n; ++i) {
        simulation.tick(); // tick until finish calculating the final position of all nodes and links
    }

    node
        .attr("x", function(d) { return d.x; })
        .attr("y", function(d) { return d.y; });
    circle
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; })
    label
        .attr('dx', function(d) {return d.x})
        .attr('dy', function(d) {return d.y + 3})
    
    link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; })

    var giang = d3.select("#Giang").style('fill', '#fc9d62') 
    var cong = d3.select("#DangMinhCong").style('fill', '#fc9d62') 
    var nguyen = d3.select("#NgoDinhNguyen").style('fill', '#fc9d62') 
    var quan = d3.select("#KhacQuan").style('fill', '#fc9d62') 
    var thinh = d3.select("#HungThinh").style('fill', '#fc9d62')
    var tranh = d3.select("#TrungAnh").style('fill', '#fc9d62')

    d3.selectAll('circle')
        .on('mouseover', showName)
        .on('mouseout', unshowName)
        .on('dblclick', showGroup)
        // .call(d3.drag()
        //     .on('start', startDrag)
        //     .on('drag', dragging)
        // )
    
    function showName()
    {
        //get mouse position
        var coordinates= d3.mouse(this);
        var x = coordinates[0];
        var y = coordinates[1];
        var cirid = d3.select(this).attr('id')
        var cx = d3.select(this).attr('cx')
        var cy = d3.select(this).attr('cy')

        var nodeid = "#node"+cirid
        var thisnode = d3.select(nodeid)
        console.log(thisnode.attr('Name'))
        graphsvg.append('text')
                .attr('x', cx)
                .attr('y', cy - 20)
                .attr('text-anchor', 'middle')
                .attr('font-size', '13px')
                .attr('id', 'nametoshow')
                .text(thisnode.attr('Name'))
        
    }
    function unshowName()
    {
        graphsvg.select('#nametoshow')
                .remove()
    }
    function showGroup()
    {
        if (!isAnimating)
        {
            isAnimating = true;
            var cirid = d3.select(this).attr('id')
            // console.log(cirid)
            var nodeid = "#node" + cirid
            var thisnode = d3.select(nodeid)
            var thisid = thisnode.attr('index')
            var groupids = nodes[thisid].Group
            // console.log(groupids)

            for (var i = 0; i < groupids.length; i++)
            {
                var groupid = groupids[i]
                var num = groups[groupid].Number // get number of member of this group
                var points = [] //to store all the points of the group path

                for(var k = 0; k < num; k++)
                {
                    var memname = groups[groupid].Mem[k];
                    var memtag = "#" + memname.replace(/ /g,'')
                    var memx = d3.select(memtag).attr('cx')
                    var memy = d3.select(memtag).attr('cy')
                    points.push([memx, memy]);
                }
                var memname = groups[groupid].Mem[0]
                var memtag = "#"
                memtag += memname.replace(/ /g,'')
                var memx = d3.select(memtag).attr('cx')
                var memy = d3.select(memtag).attr('cy')
                points.push([memx, memy]);
                
                var lineFunction = d3.line()
                                    .x(function(d){return d[0];})
                                    .y(function(d){return d[1];})
                                    .curve(d3.curveMonotoneX);
                
                var gpath = graphsvg.append("path")
                                    .attr("d", lineFunction(points))
                                    .attr("stroke", "red")
                                    .attr("stroke-width", 3)
                                    .attr("fill", "none")
                                    .attr("opacity", "0.0")                    
                
                gpath.transition()
                    .duration(3000)
                    .delay(i*6000)
                    .attr('opacity', "1.0")
                
                gpath.transition()
                    .duration(3000)
                    .delay(i*6000 + 3000)
                    .attr("opacity", "0.0")
                var num = groups[groupid].Number
        
                for(var j = 0; j < num; j++)
                {
                    var memname = groups[groupid].Mem[j];
                        var memtag = "#"
                        memtag += memname.replace(/ /g,'')
                        d3.select(memtag)
                            .transition()
                            .duration(3000)
                            .delay((i)*6000)
                            .attr('r', 35)
                
                        d3.select(memtag)
                            .transition()
                            .duration(3000)
                            .delay((i)*6000 + 3000)
                            .attr('r', 20)
                }
                
            }
            setTimeout(endofanimation, 6000*groupids.length)
            function endofanimation()
            {
                isAnimating = false;
                console.log('Animation finish')
                d3.select("#graphsvg").selectAll('path').remove()
            }
        }
    }

    function dragged(d)
    {
        if (!isAnimating)
        {
            graphsvg.select('#nametoshow').remove()
            d.x = d3.event.x, d.y = d3.event.y;
            var thisele = d3.select(this)
            var labelid = "#label" + thisele.attr('id')

            thisele.attr("cx", d.x).attr("cy", d.y);
            d3.select(labelid).attr('dx', d.x).attr('dy', d.y+3)
            
            link.filter(function(l) { return l.source === d; }).attr("x1", d.x).attr("y1", d.y);
            link.filter(function(l) { return l.target === d; }).attr("x2", d.x).attr("y2", d.y);
        }
        else
        {
            console.log('Cannot drag while animating')
        }
    }
    graphsvg.append('text')
            .attr('x', gwidth/2)
            .attr('y', 40)
            .attr('text-anchor', 'middle')
            .attr('font-size', '24')
            .text('Connections on Facebook')
            .style('font-weight', 'bold')
}
function explainNetwork()
{
    //explaination box for the network 
    var expsvg = d3.select("#expsvg")
    var ewidth = expsvg.node().getBoundingClientRect().width
    var eheight = expsvg.node().getBoundingClientRect().height 
    // expsvg.style("background-color", '#ECE7E7')

    expsvg.append('text')
        .attr('x', 20)
        .attr('y', 30)
        .attr('text-anchor', 'begin')
        .text('Connections on Facebook of 6 members in the class with other classmates')
        .style('font-weight', 'bold')

    expsvg.append('text')
        .attr('x', 20)
        .attr('y', 50)
        .attr('text-anchor', 'begin')
        .text('Connections on Facebook of Giang, Trung Anh, Nguyen Ngo Dinh, Khac Quan, Dang Minh Cong, Hung Thinh.')
    
    expsvg.append('text')
        .attr('x', 20)
        .attr('y', 90)
        .attr('text-anchor', 'begin')
        .text('Interaction instruction:')
        .style('font-weight', 'bold')
    
    expsvg.append('text')
        .attr('x', 20)
        .attr('y', 110)
        .attr('text-anchor', 'begin')
        .text('Move the mouse over the node to see full name')

    expsvg.append('text')
        .attr('x', 20)
        .attr('y', 130)
        .attr('text-anchor', 'begin')
        .text('Drag the node to move')
    
    expsvg.append('text')
        .attr('x', 20)
        .attr('y', 150)
        .attr('text-anchor', 'begin')
        .text('Double click to the node to see all the close groups of friends contain this person')
        
}