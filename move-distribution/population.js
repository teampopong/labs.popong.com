(function () {

var DIST_SECTIONS = [0, 2, 5, 10, 20, 50, 100, 200, 500],
	NUM_SECTIONS = DIST_SECTIONS.length;

var w = 960,
	h = 500,
	x = d3.scale.linear().range([0, w]),
	y = d3.scale.linear().range([0, h - 40]),
	color = d3.scale.category20();

// An SVG element with a bottom-right origin.
var svg = d3.select("#chart")
	.append("svg:g")
	.attr("transform", "translate(" + x(0) + "," + (h - 20) + ")scale(1,-1)");

// A sliding container to hold the bars.
var body = svg.append("svg:g")
	.attr("transform", "translate(0,0)");

// A container to hold the y-axis rules.
var rules = svg.append("svg:g");

function getDistIdx(val) {
	for (var i = 0; i < NUM_SECTIONS && val > DIST_SECTIONS[i];) i++;
	return i;
}

function toDistribution(data) {
	// Convert strings to numbers.
	data.forEach(function (d) {
		d.count = +d.count;
	});

	// Compute the extent of the data set in count.
	var maxcount = d3.max(data, function (d) { return d.count; });

	var dist = [];
	data.forEach(function (d) {
		var idx = getDistIdx(d.count);
		dist[idx] = dist[idx] && dist[idx]+1 || 1;
	});

	var res = [];
	for (var i = 0, len = dist.length; i < len; i++) {
		res.push({
			x: i,
			y: dist[i]
		});
	}

	return res;
}

d3.csv("population.csv", function (data) {

	data = toDistribution(data);

	// Update the scale domains.
	x.domain([0, data.length]);
	y.domain([0, d3.max(data, function (d) { return d.y; })]);

	// Add rules to show the population values.
	rules = rules.selectAll(".rule")
		.data(y.ticks(10))
		.enter().append("svg:g")
		.attr("class", "rule")
		.attr("transform", function (d) { return "translate(0," + y(d) + ")"; });

	rules.append("svg:line")
		.attr("x2", w);

	// y축 (사람 수) 라벨 표시
	rules.append("svg:text")
		.attr("x", -35)
		.attr("dy", ".35em")
		.attr("transform", "scale(1,-1)")
		.text(function (count) { return count + '명'; });

	// Add labeled rects for each birthyear.
	var years = body.selectAll("g")
		.data(DIST_SECTIONS)
		.enter().append("svg:g")
		.attr("transform", function (d, i) { return "translate(" + x(i) + ",0)"; });

	// 막대 그리기
	years.selectAll("rect")
		.data([0])
		.enter().append("svg:rect")
		.attr("x", 1)
		.attr("rx", "1em")
		.attr("ry", "1em")
		.attr("width", x(1) - 2)
		.attr("height", 1e-6);

	// 막대 그리기 (animation)
	var colorIdx = 0;
	years.selectAll("rect")
		.data(function(d) { return [data[DIST_SECTIONS.indexOf(d)].y] || [0]; })
		.attr('fill', function (d) { return d3.gradient(d3.select('#chart'), color(colorIdx++), 0, color(colorIdx++), 100); })
		.transition()
		.duration(750)
		.attr("height", y);

	// 막대 텍스트
	years.append("svg:text")
		.attr("y", -6)
		.attr("x", x(1) / 2)
		.attr("transform", "scale(1,-1)")
		.attr("text-anchor", "middle")
		.style("fill", "#000")
		.text(function (d) { return ''+data[DIST_SECTIONS.indexOf(d)].y; });

	// x축(발의안 수) 라벨 표시
	svg.append("svg:g").selectAll("text")
		.data(DIST_SECTIONS)
		.enter().append("svg:text")
		.attr("text-anchor", "middle")
		.attr("transform", function(d, i) { return "translate(" + x(i+1) + ",-4)scale(1,-1)"; })
		.attr("dy", ".71em")
		.text(function (d) { return d+'개'; } );

});

})();
