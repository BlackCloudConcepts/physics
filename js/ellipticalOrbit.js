bccEllipticalOrbit.controls.ellipticalOrbit = function(parameters){
	bccEllipticalOrbit.controls.base.call(this);
	this.init = function(){
		this.parameters = parameters;
		this.parameters.semiMajorAxis = (this.parameters.perihelion+this.parameters.aphelion)/2;
	};
	this.init();

	this.prototype = Object.create(bccEllipticalOrbit.controls.base.prototype);

	this.load = function(){
		var _this = this;
		var a = this.parameters.semiMajorAxis;
		var e = this.parameters.eccentricity;
		var arrOrbit = [];
		// prefer the typical counter-clockwise representation
		//   (though either could be correct depending on the viewing orientation)
		// so reversed the loop which draws the orbit in the proper direction
		//  (though it doesn't matter as all 360 degrees are drawn to complete the ellipse)
		for (var d = this.parameters.revolution; d >= 1; d--){
			var theta = (d/(this.parameters.revolution/360))*(Math.PI/180);
			var r = (a*(1-(e*e)))/(1+(e*(Math.cos(theta))));
			// solve for orbit / d3
			var x = Math.cos(theta)*r;
			var y = Math.sin(theta)*r;
			var color = '';
			var text = '';
			if (this.parameters.label == 'earth'){
				if (d%90 == 0)
					text = (Math.round(r*100)/100).toFixed(3);
				if (d >= 273){
					color = 'green';
					if (d%90 == 45)
						text = 'Spring';
				} else if (d >= 182){
					color = 'red';
					if (d%90 == 45)
						text = 'Summer';
				} else if (d >= 91){
					color = 'brown';
					if (d%90 == 45)
						text = 'Fall';
				} else {
					color = 'blue';
					if (d%90 == 45)
						text = 'Winter';
				}
			}
			x = x+this.parameters.offset;
			y = y+this.parameters.offset;	
			arrOrbit.unshift({
				radius : 1,
				x : x,
				y : y,
				d : d,
				r : r,
				color : color,
				text : text
			});
		}

		arrOrbit.push({
			radius : 12,
			x : this.parameters.offset,
			y : this.parameters.offset,
			d : undefined,
			r : undefined,
			color : 'yellow',
			text : 'sun'
		});

			
	//      console.log(arrOrbit);

		// SVG ORBIT PLOT
		/*
		var svgSelection = d3.select("#myorbit").append("svg")
			.attr("width", 900)
			.attr("height", 900)
			.attr("id", "svg");
		*/

		// define circles
		d3.select('svg').selectAll('.circle_'+_this.parameters.label)
			.data(arrOrbit)
			.enter()
			.append('circle')
			.attr('r', function(d){
				return d.radius;
			})
			.attr('cx', function(d){
				return d.x;
			})
			.attr('cy', function(d){
				return d.y;
			})
			.attr('id', function(d){
				return _this.parameters.label+'_'+d.d;
			})
			.attr('class', function(d){
				return '.circle_'+_this.parameters.label;
			})
			.style('fill', function(d){
				return d.color;
			});

		// orbit text
		d3.select('svg').selectAll('.text_'+_this.parameters.label)
			.data(arrOrbit)
			.enter()
			.append('text')
			.attr("x", function(d) {
				return d.x;
			})
			.attr("y", function(d) {
				return (d.y)+4;
			})
			.text( function (d) {
				return d.text;
			})
			.attr("font-family", "arial")
			.attr("text-anchor", "middle")
			.attr("font-size", "8pt")
			.attr("fill", "#999999");

		// show planet motion in a counter clockwise path
		var interval = this.parameters.startday;
		setInterval(function(){
			// set all circles back to normal
			var pre = interval+1;
			if (pre > _this.parameters.revolution-1)
				pre = 1;
			d3.select('#'+_this.parameters.label+'_'+pre)
				.attr('r', function(d){
					return d.radius;
				})
				.style('fill', function(d){
					return d.color;
				});

			d3.select('#'+_this.parameters.label+'_'+interval)
				.attr('r', function(d){
					return d.radius*5;
				})
				.style('fill', function(d){
					return '#666666';
				});

			_this.parameters.dataContainer.html('Day : '+(_this.parameters.revolution-interval)+' --- Distance : '+(Math.round(arrOrbit[interval].r*100)/100).toFixed(3)+'&nbsp;million km');
	
			interval--;
			if (interval < 0)
				interval = _this.parameters.revolution-1;

		}, 100);
	};
	
};
