if (bccEllipticalOrbit == null){
        var bccEllipticalOrbit = {
                'controls' : {}
        };
}

bccEllipticalOrbit.controls.base = function(parameters){
	this.init = function(){
		this.parameters = parameters;
	}
	this.init();

	this.doSomething = function(){
		console.log('base doing something');
	};
}
