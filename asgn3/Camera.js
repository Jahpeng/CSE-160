class Camera{
    constructor(){
        this.eye = new Vector3([0,1,14]);  //og (0,0,3)
        console.log(this.eye)
        this.at = new Vector3([0,0,-100]); //-100
        this.up = new Vector3([0,1,0]);

        this.speed = .1;
        this.sensitivity = 10;
    }

    forward(){
        //var d = new Vector3(this.at.elements).sub(this.eye);
        //d = d.normalize();
        //this.eye.add(d);
        //this.at.add(d);
        var d = new Vector3();
        d.set(this.at);
        d.sub(this.eye);
        d.normalize();
        d.mul(this.speed);
        this.eye.add(d);
        this.at.add(d);
    }

    back(){
        //var d = new Vector3(this.at.elements).sub(this.eye);
        //d = d.normalize();
        //this.eye = this.eye.sub(d);
        //this.at = this.at.sub(d);

        var d = new Vector3();
        d.set(this.at);
        d.sub(this.eye);
        d.normalize();
        d.mul(this.speed);
        this.eye.sub(d);
        this.at.sub(d);
    }

    left(){
        var d = new Vector3(this.at.elements).sub(this.eye);
        d.normalize();
        d = d.mul(-1);
        var left = Vector3.cross(d, this.up);
        left = left.normalize();
        left.mul(this.speed);
        this.eye = this.eye.add(left);
        this.at = this.at.add(left);
    }

    right(){
        var d = new Vector3(this.at.elements).sub(this.eye);
        d = d.normalize();
        d = d.mul(1);
        var left = Vector3.cross(d, this.up);
        left = left.normalize();
        left.mul(this.speed);
        this.eye = this.eye.add(left);
        this.at = this.at.add(left);
    }

    rotateLeft(duration){
        // var d = new Vector3(this.at.elements).sub(this.eye);
        // d = d.normalize();
        // var r = d.magnitude();//Math.sqrt((d.elements[0]**2)+(d.elements[1]**2))
        // var theta = Math.atan2(d.elements[2], d.elements[0]);
        // theta = theta + ((90*(Math.PI/180)));
        // var newX = r * Math.cos(theta);
        // var newY = r * Math.sin(theta);
        // d.elements = [newX, d.elements[1], newY];
        // console.log("ROTATION d IS:", d);
        // //this.at = //this.eye.add(d);
        // this.at = new Vector3(this.eye.elements).add(d);
        //this.eye.add(d);
        //this.at.add(d);
        


        
        var d = new Vector3(this.at.elements).sub(this.eye);
        
        d = d.normalize();
        
        var m = new Matrix4();
        m.rotate(5,0,1,0);
        d = m.multiplyVector3(d);
        this.at = new Vector3(this.eye.elements).add(d);

        //fix attempt
        //this.eye.elements[1] = 1
        //console.log(this.eye.elements[1])
        


    }
    rotateLeftMouse(duration){
        // var d = new Vector3(this.at.elements).sub(this.eye);
        // d = d.normalize();
        // var r = d.magnitude();//Math.sqrt((d.elements[0]**2)+(d.elements[1]**2))
        // var theta = Math.atan2(d.elements[2], d.elements[0]);
        // theta = theta + ((90*(Math.PI/180)));
        // var newX = r * Math.cos(theta);
        // var newY = r * Math.sin(theta);
        // d.elements = [newX, d.elements[1], newY];
        // console.log("ROTATION d IS:", d);
        // //this.at = //this.eye.add(d);
        // this.at = new Vector3(this.eye.elements).add(d);
        //this.eye.add(d);
        //this.at.add(d);
        


        
        var d = new Vector3(this.at.elements).sub(this.eye);
        
        d = d.normalize();
        
        var m = new Matrix4();
        m.rotate(g_pos[0],0,1,0);
        d = m.multiplyVector3(d);
        this.at = new Vector3(this.eye.elements).add(d);
        


    }

    rotateRight(){
        var d = new Vector3(this.at.elements).sub(this.eye);
        
        d = d.normalize();
        
        var m = new Matrix4();
        m.rotate(-5,0,1,0);
        d = m.multiplyVector3(d);
        this.at = new Vector3(this.eye.elements).add(d);
        
        //fix attempt
        //this.eye.elements[1] = 1
        //console.log(this.eye.elements[1])
    }
    rotateRightMouse(){
        var d = new Vector3(this.at.elements).sub(this.eye);
        
        d = d.normalize();
        
        var m = new Matrix4();
        m.rotate(g_pos[0],0,1,0);
        d = m.multiplyVector3(d);
        this.at = new Vector3(this.eye.elements).add(d);
    }
}