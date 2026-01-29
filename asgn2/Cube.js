class Cube{
  constructor(){
    this.type='cube';
    //this.position = [0.0, 0.0, 0.0];
    this.color = [1.0, 1.0, 1.0, 1.0];
    //this.size = 5.0;
    //this.segments = 10;
    this.matrix = new Matrix4();
  }

  drawCube(M, color){
    //var xy = this.position;
    var rgba = color;
    //var size = this.size;
    
    // Pass the color of a point to u_FragColor variable
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
    
    // pass matrix to u_ModelMatrix attribute
    gl.uniformMatrix4fv(u_ModelMatrix, false, M.elements);

    // front of cube
    drawTriangle3D([0.0,0.0,0.0,  1.0,1.0,0.0,  1.0,0.0,0.0]);
    drawTriangle3D([0.0,0.0,0.0,  0.0,1.0,0.0,  1.0,1.0,0.0]);

    // back of cube
    drawTriangle3D([0.0,0.0,1.0,  1.0,1.0,1.0,  1.0,0.0,1.0]);
    drawTriangle3D([0.0,0.0,1.0,  0.0,1.0,1.0,  1.0,1.0,1.0]);

    gl.uniform4f(u_FragColor, rgba[0]*.9, rgba[1]*.9, rgba[2]*.9, rgba[3]);

    // top of cube
    drawTriangle3D([0.0,1.0,0.0,  1.0,1.0,1.0,  1.0,1.0,0.0]);
    drawTriangle3D([0.0,1.0,0.0,  0.0,1.0,1.0,  1.0,1.0,1.0]);

    // bottom of cube
    drawTriangle3D([0.0,0.0,0.0,  1.0,0.0,1.0,  1.0,0.0,0.0]);
    drawTriangle3D([0.0,0.0,0.0,  0.0,0.0,1.0,  1.0,0.0,1.0]);

    // right of cube
    drawTriangle3D([1.0,0.0,0.0,  1.0,1.0,1.0,  1.0,0.0,1.0]);
    drawTriangle3D([1.0,0.0,0.0,  1.0,1.0,0.0,  1.0,1.0,1.0]);

    // left of cube
    drawTriangle3D([0.0,0.0,0.0,  0.0,1.0,1.0,  0.0,0.0,1.0]);
    drawTriangle3D([0.0,0.0,0.0,  0.0,1.0,0.0,  0.0,1.0,1.0]);

    // keep point  order
    // change z axis for bac
    //gl.uniform4f(u_FragColor, rgba[0]*.9, rgba[1]*.9, rgba[2]*.9, rgba[3]);
  }

  render(){
    this.drawCube(this.matrix, this.color);
    //var xy = this.position;
    ///var rgba = this.color;
    //var size = this.size;
    
    // Pass the color of a point to u_FragColor variable
    ///gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
    
    // pass matrix to u_ModelMatrix attribute
    ///gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

    // front of cube
    ///drawTriangle3D([0.0,0.0,0.0,  1.0,1.0,0.0,  1.0,0.0,0.0]);
    ///drawTriangle3D([0.0,0.0,0.0,  0.0,1.0,0.0,  1.0,1.0,0.0]);

    // back of cube
    ///drawTriangle3D([0.0,0.0,1.0,  1.0,1.0,1.0,  1.0,0.0,1.0]);
    ///drawTriangle3D([0.0,0.0,1.0,  0.0,1.0,1.0,  1.0,1.0,1.0]);

    ///gl.uniform4f(u_FragColor, rgba[0]*.9, rgba[1]*.9, rgba[2]*.9, rgba[3]);

    // top of cube
    ///drawTriangle3D([0.0,1.0,0.0,  1.0,1.0,1.0,  1.0,1.0,0.0]);
    ///drawTriangle3D([0.0,1.0,0.0,  0.0,1.0,1.0,  1.0,1.0,1.0]);

    // bottom of cube
    ///drawTriangle3D([0.0,0.0,0.0,  1.0,0.0,1.0,  1.0,0.0,0.0]);
    ///drawTriangle3D([0.0,0.0,0.0,  0.0,0.0,1.0,  1.0,0.0,1.0]);

    // right of cube
    ///drawTriangle3D([1.0,0.0,0.0,  1.0,1.0,1.0,  1.0,0.0,1.0]);
    ///drawTriangle3D([1.0,0.0,0.0,  1.0,1.0,0.0,  1.0,1.0,1.0]);

    // left of cube
    ///drawTriangle3D([0.0,0.0,0.0,  0.0,1.0,1.0,  0.0,0.0,1.0]);
    ///drawTriangle3D([0.0,0.0,0.0,  0.0,1.0,0.0,  0.0,1.0,1.0]);

    // keep point  order
    // change z axis for bac
    //gl.uniform4f(u_FragColor, rgba[0]*.9, rgba[1]*.9, rgba[2]*.9, rgba[3]);
  }
}