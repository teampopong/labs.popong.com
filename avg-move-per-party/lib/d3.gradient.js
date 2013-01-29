(function () {

if (typeof d3 === 'undefined') {
	return;
}

if (typeof d3.gradient === 'undefined') {
	d3.gradient = D3Gradient;
}

var getUniqueGradientId = (function () {
	var nextId = 1;
	return function () {
		while (document.getElementById('g'+nextId)) nextId++;
		return 'g'+nextId;
	};
}());

function toPercentile(v) {
	if (typeof v === 'string') {
		v = ''+v;
		if (v[v.length - 1] !== '%') {
			v = parseInt(v, 10) + '%';
		}
		return v;
	} else if (typeof v === 'number') {
		return v+'%';
	} else {
		throw {
			name: 'WrongPassedArgumentTypeError',
			message: 'function toPercentile(): argument should be either string or number'
		};
	}
}

function D3Gradient(svg, startColor, startStop, endColor, endStop, opacity) {
	opacity = opacity || 1;
	if (endStop[endStop.length - 1] !== '%') {
		endStop = parseInt(endStop, 10) + '%';
	}

	var gradientId = getUniqueGradientId();

	var gradient = svg.append('svg:linearGradient')
		.attr('id', gradientId)
		.attr('x1', '0%')
		.attr('y1', '0%')
		.attr('x2', '100%')
		.attr('y2', '100%');

	gradient.append('svg:stop')
		.attr('offset', startStop)
		.attr('stop-color', startColor)
		.attr('stop-opacity', opacity);

	gradient.append('svg:stop')
		.attr('offset', endStop)
		.attr('stop-color', endColor)
		.attr('stop-opacity', opacity);
	
	return 'url(#'+gradientId+')';
}

}());
