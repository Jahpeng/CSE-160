function drawPicture(){
    //console.log("In FUNC");
    //gl.uniform4f(u_FragColor, 1.0, 0.0, 0.0, 1.0);
    //console.log("Got Color");
    //drawTriangle([0.0, 0.0, -1.0, 1.0, 1.0, 1.0]);
    //console.log("Got Location");

    //upper face
    gl.uniform4f(u_FragColor, 0.32, 0.48, 0.22, 1.0);
    drawTriangle([0.0, 0.0, -0.5, 0.5, 0.0, 1.0]);

    gl.uniform4f(u_FragColor, 0.32, 0.48, 0.22, 1.0);
    drawTriangle([0.0, 0.0, 0.5, 0.5, 0.0, 1.0]);

    // eyes
    gl.uniform4f(u_FragColor, 0.76, 0.60, 0.42, 1.0);
    drawTriangle([-0.2, 0.5, -0.1, 0.5, -0.2, 0.7]);

    gl.uniform4f(u_FragColor, 0.76, 0.60, 0.42, 1.0);
    drawTriangle([0.2, 0.5, 0.1, 0.5, 0.2, 0.7]);

    // nose
    gl.uniform4f(u_FragColor, 0.22, 0.28, 0.14, 1.0);
    drawTriangle([-0.08, 0.3, -0.02, 0.35, -0.08, 0.4]);

    gl.uniform4f(u_FragColor, 0.22, 0.28, 0.14, 1.0);
    drawTriangle([0.08, 0.3, 0.02, 0.35, 0.08, 0.4]);

    // ears
    gl.uniform4f(u_FragColor, 0.32, 0.48, 0.22, 1.0);
    drawTriangle([-0.2, 0.8, -0.4, 0.8, -0.2, 0.98]);

    gl.uniform4f(u_FragColor, 0.48, 0.28, 0.22, 1.0);
    drawTriangle([-0.22, 0.82, -0.35, 0.82, -0.22, 0.92]);

    gl.uniform4f(u_FragColor, 0.32, 0.48, 0.22, 1.0);
    drawTriangle([0.2, 0.8, 0.4, 0.8, 0.2, 0.98]);

    gl.uniform4f(u_FragColor, 0.48, 0.28, 0.22, 1.0);
    drawTriangle([0.22, 0.82, 0.35, 0.82, 0.22, 0.92]);

    // mouth
    gl.uniform4f(u_FragColor, 0.65, 0.18, 0.15, 1.0);
    drawTriangle([0.0, 0.0, -0.5, 0.5, -0.6, 0.38]);

    gl.uniform4f(u_FragColor, 0.65, 0.18, 0.15, 1.0);
    drawTriangle([0.0, 0.0, -0.6, 0.38, 0.0, -0.1]);

    gl.uniform4f(u_FragColor, 0.65, 0.18, 0.15, 1.0);
    drawTriangle([0.0, 0.0, 0.5, 0.5, 0.6, 0.38]);

    gl.uniform4f(u_FragColor, 0.65, 0.18, 0.15, 1.0);
    drawTriangle([0.0, 0.0, 0.6, 0.38, 0.0, -0.1]);

    // teeth left
    gl.uniform4f(u_FragColor, 1.0, 1.0, 1.0, 1.0);
    drawTriangle([-0.6, 0.38, -0.5, 0.3, -0.5, 0.38]);

    gl.uniform4f(u_FragColor, 1.0, 1.0, 1.0, 1.0);
    drawTriangle([-0.4, 0.2, -0.27, 0.1, -0.27, 0.2]);

    gl.uniform4f(u_FragColor, 1.0, 1.0, 1.0, 1.0);
    drawTriangle([-0.25, 0.05, -0.08, -0.1, -0.08, 0.05]);

    gl.uniform4f(u_FragColor, 1.0, 1.0, 1.0, 1.0);
    drawTriangle([-0.4, 0.3, -0.4, 0.4, -0.3, 0.3]);

    gl.uniform4f(u_FragColor, 1.0, 1.0, 1.0, 1.0);
    drawTriangle([-0.2, 0.1, -0.2, 0.2, -0.1, 0.1]);
    
    // teeth right
    gl.uniform4f(u_FragColor, 1.0, 1.0, 1.0, 1.0);
    drawTriangle([0.6, 0.38, 0.5, 0.3, 0.5, 0.38]);

    gl.uniform4f(u_FragColor, 1.0, 1.0, 1.0, 1.0);
    drawTriangle([0.4, 0.2, 0.27, 0.1, 0.27, 0.2]);

    gl.uniform4f(u_FragColor, 1.0, 1.0, 1.0, 1.0);
    drawTriangle([0.25, 0.05, 0.08, -0.1, 0.08, 0.05]);

    gl.uniform4f(u_FragColor, 1.0, 1.0, 1.0, 1.0);
    drawTriangle([0.4, 0.3, 0.4, 0.4, 0.3, 0.3]);

    gl.uniform4f(u_FragColor, 1.0, 1.0, 1.0, 1.0);
    drawTriangle([0.2, 0.1, 0.2, 0.2, 0.1, 0.1]);

    // cheeks
    gl.uniform4f(u_FragColor, 0.32, 0.48, 0.22, 1.0);
    drawTriangle([-0.6, 0.38, -0.6, -0.1, 0.0, -0.1]);

    gl.uniform4f(u_FragColor, 0.32, 0.48, 0.22, 1.0);
    drawTriangle([0.6, 0.38, 0.6, -0.1, 0.0, -0.1]);
}