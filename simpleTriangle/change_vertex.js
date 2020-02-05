var vertexShaderSource =  `
	attribute vec2 a_position;

	void main(){
		gl_Position = vec4(a_position, 0, 1);
	}
`;

var fragmentShaderSource = `
	precision mediump float;

	void main(){
		gl_FragColor = vec4(0, 0, 0.5, 1);
	}
`;

function createShader(gl, type, source){
	let shader = gl.createShader(type);
	gl.shaderSource(shader, source);
	gl.compileShader(shader);
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
	    alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
	    gl.deleteShader(shader);
	    return null;
  	}
  	return shader;
}

function createProgram(gl, vertexShader, fragmentShader){
	let program = gl.createProgram();
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);
	if(!gl.getProgramParameter(program, gl.LINK_STATUS)){
		alert('An error occurred linking the program: ' + gl.getProgramInfoLog(program));
		gl.deleteProgram(program);
		return null;
	}
	return program;
}

var v1_x = 0;
var v1_y = 0.5;
var v2_x = 0.5;
var v2_y = -0.5;
var v3_x = -0.5;
var v3_y = -0.5;

function v1XChange(){
	v1_x = document.getElementById('v1_x_range').value;
	document.getElementById('v1_x_value').innerHTML = v1_x;
	updateVertexPos();
}

function v1YChange(){
	v1_y = document.getElementById('v1_y_range').value;
	document.getElementById('v1_y_value').innerHTML = v1_y;
	updateVertexPos();
}

function v2XChange(){
	v2_x = document.getElementById('v2_x_range').value;
	document.getElementById('v2_x_value').innerHTML = v2_x;
	updateVertexPos();
}

function v2YChange(){
	v2_y = document.getElementById('v2_y_range').value;
	document.getElementById('v2_y_value').innerHTML = v2_y;
	updateVertexPos();
}

function v3XChange(){
	v3_x = document.getElementById('v3_x_range').value;
	document.getElementById('v3_x_value').innerHTML = v3_x;
	updateVertexPos();
}

function v3YChange(){
	v3_y = document.getElementById('v3_y_range').value;
	document.getElementById('v3_y_value').innerHTML = v3_y;
	updateVertexPos();
}

function updateVertexPos(){
	positions = [
		v1_x, v1_y,
		v2_x, v2_y,
		v3_x, v3_y,
	];
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
	gl.drawArrays(gl.TRIANGLES, 0, 3);
}

var canvas = document.getElementById("canvas");
var gl = canvas.getContext("webgl");

function main(){
	
	if(!gl){
		alert("Unable to initial WebGl");
		return;
	}

	var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
	var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

	var program = createProgram(gl, vertexShader, fragmentShader);

	var attribLocation = gl.getAttribLocation(program, "a_position");

	// initial position data
	var positionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

	var positions = [
		0, 0.5,
		0.5, -0.5,
		-0.5, -0.5,
	];

	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

	gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

	// clear the canvas
	gl.clearColor(0, 0, 0, 0);
	gl.clear(gl.COLOR_BUFFER_BIT);

	gl.useProgram(program);
	gl.enableVertexAttribArray(attribLocation);
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

	// attribute of data
	var size = 2;
	var type = gl.FLOAT;
	var normalize = false;
	var stride = 0;
	var offset = 0;
	gl.vertexAttribPointer(attribLocation, size, type, normalize, stride, offset);

	// execute
	var primitiveType = gl.TRIANGLES;
	var offset = 0;
	var count = 3;
	gl.drawArrays(primitiveType, offset, count);

}

main();