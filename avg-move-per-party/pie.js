(function () {

var w = 500,
	h = 500,
	r = Math.min(w, h) / 2,
	color = d3.scale.category20(),
	donut = d3.layout.pie(),
	arc = d3.svg.arc().innerRadius(r * .5).outerRadius(r);

d3.csv('party.csv', function (data) {

	var parties = [];
	data = (function (data) {
		var tmp = {};
		data.forEach(function (d) {
			var party = d.party;
			if (typeof tmp[party] === 'undefined') {
				tmp[party] = {
					move: 0,
					num: 0
				};
			}
			tmp[party].move += +d.nummove;
			tmp[party].num++;
		});

		var res = [];
		for (var i in tmp) {
			if (!tmp[i].move) { console.log(i); continue; }
			parties.push(i);
			res.push(tmp[i].move / tmp[i].num);
		}
		return res;
	}(data));

	var vis = d3.select('#chart')
		.data([data]);

	var arcs = vis.selectAll("g.arc")
		.data(donut)
		.enter().append("svg:g")
		.attr("class", "arc")
		.attr("transform", "translate(" + r + "," + r + ")");

	var colorIdx = 0;
	arcs.append("svg:path")
		.attr("fill", function(d, i) { return d3.gradient(vis, color(colorIdx++), 0, color(colorIdx++), 100, 0.9);  })
		.attr("d", arc);

	arcs.append("svg:text")
		.attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
		.attr("dy", ".35em")
		.attr("text-anchor", "middle")
		.text(function(d, i) { return parties[i] + ' ' + d.value.toFixed(2); });

	// shadow effect
	// FIXME: refactoring or find better way
	vis = d3.select('#chart')
		.data([[1]]);

	arcs = vis.selectAll("g.arc2")
		.data(donut)
		.enter().append("svg:g")
		.attr("class", "arc2")
		.attr("transform", "translate(" + r + "," + r + ")");

	colorIdx = 0;
	arcs.append("svg:path")
		.attr("fill-opacity", 0)
		.attr('filter', 'url(#dropshadow)')
		.attr("d", arc);
});

}());
