var margin = {top: 20, right: 50, bottom: 30, left: 50},
            width = 960 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

var parseDate = d3.timeParse("%Y%m%d");
var monthDate = d3.timeParse("%Y%m");

var x = techan.scale.financetime()
        .range([0, width]);
var crosshairY = d3.scaleLinear()
        .range([height, 0]);

var y = d3.scaleLinear()
        .range([height - 60, 0]);

var yVolume = d3.scaleLinear()
        .range([height , height - 60]);

var xScale = d3.scaleBand().range([0, width]).padding(0.1);
var yScale = d3.scaleLinear().rangeRound([height, height - 22]);
var monthYScale = d3.scaleLinear().rangeRound([height, height - 15])


var sma0 = techan.plot.sma()
        .xScale(x)
        .yScale(y);

var sma1 = techan.plot.sma()
        .xScale(x)
        .yScale(y);
var ema2 = techan.plot.ema()
        .xScale(x)
        .yScale(y);
var candlestick = techan.plot.candlestick()
        .xScale(x)
        .yScale(y);

var volume = techan.plot.volume()
//        .accessor(candlestick.accessor())
        .xScale(x)
        .yScale(yVolume);
var xAxis = d3.axisBottom()
        .scale(x);

var yAxis = d3.axisLeft()
        .scale(y);
var volumeAxis = d3.axisLeft(yVolume)
        .ticks(3)
        .tickFormat(d3.format(",.3s"));
var ohlcAnnotation = techan.plot.axisannotation()
        .axis(yAxis)
        .orient('left')
        .format(d3.format(',.2f'));
var timeAnnotation = techan.plot.axisannotation()
        .axis(xAxis)
        .orient('bottom')
        .format(d3.timeFormat('%Y-%m-%d'))
//        .width(65)
        .translate([0, height]);

var crosshair = techan.plot.crosshair()
        .xScale(x)
        .yScale(crosshairY)
        .xAnnotation(timeAnnotation)
        .yAnnotation(ohlcAnnotation)
        .on("enter", enter)
        .on("out", out)
        .on("move", move);
var textSvg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var svgText = textSvg.append("g")
            .attr("class", "description")
            .append("text")
//            .attr("x", margin.left)
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "start")
            .text("");

var svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var dataArr;
var fileName;
loadJSON("data.json");

function loadJSON(file) {
    fileName = file;
    svg.selectAll("*").remove();
    d3.json(file, function(error, data) {
    var accessor = candlestick.accessor();
    var jsonData = data["Data"];
//    console.log(jsonData);
    data = 
        jsonData
//            .slice(0, 200)
        .map(function(d) {
        return {
            date: parseDate(d[0]),
            open: +d[3],
            high: +d[4],
            low: +d[5],
            close: +d[6],
            volume: +d[9],
            change: +d[7],
            percentChange: +d[8],
            fiveMA: +d[10],
            twentyMA: +d[11],
            sixtyMA: +d[12]
        };
    }).sort(function(a, b) { return d3.ascending(accessor.d(a), accessor.d(b)); });
    
    
    var newData = jsonData.map(function(d) {
        return {
            date: parseDate(d[0]),
            volume: d[9]
        }
    }).reverse();
        
    svg.append("g")
            .attr("class", "candlestick");
    svg.append("g")
            .attr("class", "sma ma-0");
    svg.append("g")
            .attr("class", "sma ma-1");
    svg.append("g")
            .attr("class", "ema ma-2");
//    svg.append("g")
//            .attr("class", "volume");
    svg.append("g")
            .attr("class", "volume axis");
    svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")");

    svg.append("g")
            .attr("class", "y axis")
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Price ($)");
    
    
    // Data to display initially
    draw(data.slice(0, data.length), newData);
    // Only want this button to be active if the data has loaded
    d3.select("button").on("click", function() { draw(data); }).style("display", "inline");
});
}
function loadJSON2(file) {
    fileName = file;
    svg.selectAll("*").remove();
    d3.json(file, function(error, data) {
    var accessor = candlestick.accessor();
    var jsonData = data["Data"];
    console.log(jsonData);
    data = 
        jsonData
//            .slice(0, 200)
        .map(function(d) {
        return {
            date: monthDate(d[0]),
            open: +d[3],
            high: +d[4],
            low: +d[5],
            close: +d[6],
            volume: +d[10],
            change: +d[7],
            percentChange: +d[8],
//            fiveMA: +d[10],
//            twentyMA: +d[11],
//            sixtyMA: +d[12]
        };
    }).sort(function(a, b) { return d3.ascending(accessor.d(a), accessor.d(b)); });
    
    
    var newData = jsonData.map(function(d) {
        return {
            date: monthDate(d[0]),
            volume: d[10]
        }
    }).reverse();
        
    svg.append("g")
            .attr("class", "candlestick");
    svg.append("g")
            .attr("class", "sma ma-0");
    svg.append("g")
            .attr("class", "sma ma-1");
    svg.append("g")
            .attr("class", "ema ma-2");
//    svg.append("g")
//            .attr("class", "volume");
    svg.append("g")
            .attr("class", "volume axis");
    svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")");

    svg.append("g")
            .attr("class", "y axis")
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Price ($)");
    
    
    // Data to display initially
    draw(data.slice(0, data.length), newData);
    // Only want this button to be active if the data has loaded
    d3.select("button").on("click", function() { draw(data); }).style("display", "inline");
});
}

function draw(data, volumeData) {
//    console.log(data.map(function(d){ return d.date}));
    console.log(volumeData);
    console.log(data[0]);
    x.domain(data.map(candlestick.accessor().d));
    y.domain(techan.scale.plot.ohlc(data, candlestick.accessor()).domain());
    
    xScale.domain(volumeData.map(function(d){return d.date;}))
    yScale.domain([0, d3.max(volumeData, function(d) {return d.volume;})]);
    monthYScale.domain([0, d3.max(volumeData, function(d) {return d.volume;})]);
    
    var chart = svg.selectAll("volumeBar")
        .data(volumeData)
        .enter().append("g");
    chart.append("rect")
        .attr("class", "volumeBar")
        .attr("x", function(d) {return xScale(d.date)})
        .attr("height", function(d){
            if (fileName == "data.json") {
                return height - yScale(d.volume);
            } else {
                return height - monthYScale(d.volume);
            }
        })
        .attr("y", function(d) {
            if (fileName == "data.json") {
                 return yScale(d.volume);
            } else {
                return monthYScale(d.volume);
            }
        })
        .attr("width", xScale.bandwidth())
        .style("fill", function(d, i) {
//            console.log(d + ", " + i);
            if (data[i].change > 0) { return "#FF0000"} else if (data[i].change < 0) {
                return "#00AA00"
            } else {
               return "#DDDDDD" 
            }
            
    });
  svg.selectAll("g.x.axis").call(xAxis.ticks(7).tickFormat(d3.timeFormat("%m/%d")).tickSize(-height, -height));
    svg.selectAll("g.y.axis").call(yAxis.ticks(10).tickSize(-width, -width));
    yVolume.domain(techan.scale.plot.volume(data).domain());   
    svg.append("g")
        .attr("class", "crosshair")
//            .datum({ x: x.domain()[80], y: 67.5})
        .call(crosshair)
    
    
    
//    
//   var volumeBar =   svg.select("g.volume").datum(data);
//    volumeBar.on("mouseover", handleMouseOver);
    
//    volumeBar.style('fill', function(d, i) { 
//        console.log(volumeBar.d);
//        return '#DDDDDD'
//    });
//    volumeBar.call(volume);

    var state = svg.selectAll("g.candlestick").datum(data);
    state.call(candlestick)
//        .on("enter", function(d) { test(d);})
        .on("move", move)
//        .on("mouseover", test);
        .each(function(d) {
        dataArr = d;
    });
    state
        .on("mouseover", function(d, i) {
        svgText.text("hahahah");
        console.log("d: " + d[i].date + "i: " + i);
        
            
    })
    
    
    svg.select("g.sma.ma-0").datum(techan.indicator.sma().period(10)(data)).call(sma0);
    svg.select("g.sma.ma-1").datum(techan.indicator.sma().period(20)(data)).call(sma0);
    svg.select("g.ema.ma-2").datum(techan.indicator.sma().period(50)(data)).call(sma0);

    svg.select("g.volume.axis").call(volumeAxis);
    

    
}
function handleMouseOver(d, i ){ 
}
function test(d) {
    console.log("ga " + d);
}

function enter() {
//    coordsText.style("display", "inline");
}

function out() {
//    coordsText.style("display", "none");
}

function move(coords, index) {
//    console.log(coords.x + "," + coords.y)
//    coordsText.text(timeAnnotation.format()(coords.x) + ", " + ohlcAnnotation.format()(coords.y));
    
    var i;
    for (i = 0; i < dataArr.length; i ++) {
        if (coords.x === dataArr[i].date) {
            svgText.text(d3.timeFormat("%Y/%m/%d")(coords.x) + ", 開盤：" + dataArr[i].open + ", 高：" + dataArr[i].high + ", 低："+ dataArr[i].low + ", 收盤："+ dataArr[i].close + ", 漲跌：" + dataArr[i].change + ", 成交量：" + dataArr[i].volume); 
//                         + "(" + dataArr[i].percentChange + "%)" + ", 成交量： " + dataArr[i].volume + ", 5MA: " + dataArr[i].fiveMA + ", 20MA: " + dataArr[i].twentyMA + ", 60MA: " + dataArr[i].sixtyMA );
        }
    }
}









