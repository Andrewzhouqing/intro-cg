vsSource = 
`   #version 300 es
    in vec2 a_position;
    in vec3 a_color;
    uniform vec2 u_rotation;
    // uniform vec2 u_resolution;
    out vec3 v_color;

    void main(void)
    {
        // calculate rotated position
        vec2 rotatedPosition = vec2(a_position.x * u_rotation.y - a_position.y * u_rotation.x,
                                 a_position.x * u_rotation.x + a_position.y * u_rotation.y);
        
        // convert position to -1 -> 1
        // vec2 clipPosition = (rotatedPosition / u_resolution) * 2.0 - 1.0;

        // gl_Position = vec4(clipPposition, 0, 1);
        gl_Position = vec4(rotatedPosition, 0, 1);
        v_color = a_color;
        }  
`;

fsSource = 
`   #version 300 es
    precision mediump float;

    in vec3 v_color;
    out vec4 frag_color;

    void main(void){
        frag_color = vec4(v_color, 1);
    }
`;

function main()
{
    const canvas = document.getElementById("canvas");
    const gl = canvas.getContext("webgl2");
    if(!gl){
        return;
    }

    const program = createProgramFromSource(gl, vsSource, fsSource);

    // get the locations of attributes
    const positionLocation = gl.getAttribLocation(program, "a_position");
    const colorLocation = gl.getAttribLocation(program, "a_color");

    // get the locations of uniforms
    const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
    const rotationLocation = gl.getUniformLocation(program, "u_rotation");
    
    let positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    // setup geometry
    setGeometry(gl);

    let colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    setColors(gl);

    let angle = 0;
    let ang_delta = 1;
    let rotation = [0, 1];
    let stop;
    function drawLoop(now){
        if(angle >= 360){
            angle = 0;
        }
        angle += ang_delta;
        let radian = angle * Math.PI / 180;
        rotation[0] = Math.sin(radian);
        rotation[1] = Math.cos(radian);
        drawScene();

        stop = requestAnimationFrame(drawLoop);
    }

    // drawScene();
    drawLoop();

    function drawScene(){
        // clear the canvas
        gl.clear(gl.COLOR_BUFFER_BIT);

        // specific program
        gl.useProgram(program);

        // turn on position attribute
        gl.enableVertexAttribArray(positionLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
        gl.vertexAttribPointer(
            positionLocation, 2, gl.FLOAT, false, 0, 0);
            
        gl.enableVertexAttribArray(colorLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.vertexAttribPointer(
            colorLocation, 4, gl.FLOAT, false, 0, 0);
        
        gl.uniform2fv(rotationLocation, rotation);
        
        gl.drawArrays(gl.TRIANGLES, 0, 6);
    }

    function setGeometry(gl){
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array([
                0.25, 0.25,
                0.25, -0.25,
                -0.25, 0.25,
                0.25, -0.25,
                -0.25, 0.25,
                -0.25, -0.25
            ]),
            gl.STATIC_DRAW
        );
    }

    function setColors(gl){
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array(
                [ Math.random(), Math.random(), Math.random(), 1,
                Math.random(), Math.random(), Math.random(), 1,
                Math.random(), Math.random(), Math.random(), 1,
                Math.random(), Math.random(), Math.random(), 1,
                Math.random(), Math.random(), Math.random(), 1,
                Math.random(), Math.random(), Math.random(), 1]),
            gl.STATIC_DRAW
        );
    }
}

main();

