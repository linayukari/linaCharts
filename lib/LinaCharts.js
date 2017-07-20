/**
 * @author lina
 * 
 */
LinaCharts = function( canvasId ){

	console.log("LinaCharts 1.0.0");
	this.ucanvas = document.getElementById(canvasId);

	this.renderer = new THREE.WebGLRenderer({
        canvas:this.ucanvas,
        antialias:true, //设置抗锯齿
    });
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(70, 6 / 6, 10, 5000);
    this.controls = new THREE.OrbitControls( this.camera, this.renderer.domElement );

};

LinaCharts.prototype = {
	constructor: LinaCharts,

	init:function(camera_dis){
		this.renderer.setClearColor(0xf0f0f0);   
       	this.renderer.setSize(this.ucanvas.offsetWidth,this.ucanvas.offsetHeight); 

       	this.camera.position.set(camera_dis/1.3, camera_dis/4, camera_dis/1.3);
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));
        this.scene.add(this.camera);

        var light = new THREE.AmbientLight(0x444444);
        this.scene.add(light);
        light = new THREE.DirectionalLight( 0xffffff,0.3 );
        light.position.set( 200, 0, 0 );
        this.scene.add( light ); 
        light = new THREE.DirectionalLight( 0xffffff,0.3 );
        light.position.set( -200, 0, 0 );
        this.scene.add( light );  
        light = new THREE.DirectionalLight( 0xffffff,0.3 );
        light.position.set( 0, 0, -200 );
        this.scene.add( light ); 
        light = new THREE.DirectionalLight( 0xffffff,0.3 );
        light.position.set( 0, 0, 200 );
        this.scene.add( light );  
        light = new THREE.DirectionalLight( 0xffffff,0.5);
        light.position.set(0, 200,0 );
        this.scene.add( light );
	},

	render:function(){
		//bing(this)很重要，为了不丢失对象
        requestAnimationFrame(this.render.bind(this));
        this.renderer.render(this.scene,this.camera);
        this.controls.update();	
	},

    //坐标系和标签
    axes:function(scene,x_label,y_label,z_unit,data){

        var max_z = 0;
        for(var i=0;i < data.length;i++){
            for(var j=0;j < data[i].length;j++){
                if(data[i][j][2] > max_z){
                    max_z = data[i][j][2];
                }
            }
        }
        var z_length = (max_z - max_z%z_unit)/z_unit + 1;
        var camera_dis = (x_label.length+1)*30 + z_length*10;
        this.init(camera_dis);
        //绘制xy坐标面
        var geometry = new THREE.BoxGeometry( (x_label.length+1)*20,(x_label.length+1)*20,1);
        var material = new THREE.MeshPhongMaterial( {color: 0xB3B3B3,opacity:0.5,transparent:true} ); 
        var cylinder = new THREE.Mesh( geometry, material ); 
        cylinder.lookAt(new THREE.Vector3(0, 100, 0));
        cylinder.position.set((x_label.length+1)*10,0,(x_label.length+1)*10); 
        scene.add( cylinder );     

        //绘制z轴
        for(var i=1;i < z_length;i++){
            var geometry = new THREE.Geometry();
            geometry.vertices.push( new THREE.Vector3( 0, i*10, 0 ) );
            geometry.vertices.push( new THREE.Vector3( 0, i*10, (x_label.length+1)*20 ) );
            var line = new THREE.Line( geometry, new THREE.LineBasicMaterial( { color: 0xB3B3B3} ) );//绿色 z
            scene.add( line );  

            var geometry = new THREE.Geometry();
            geometry.vertices.push( new THREE.Vector3( 0, i*10, 0 ) );
            geometry.vertices.push( new THREE.Vector3( (y_label.length+1)*20, i*10, 0 ) );
            var line = new THREE.Line( geometry, new THREE.LineBasicMaterial( { color: 0xB3B3B3} ) );//绿色 z
            scene.add( line );        
        }
 
        //标签 
        var loader = new THREE.FontLoader();
        loader.load( 'lib/font/FZYaoTi_Regular.js', function ( font ) {
            var text_style = {
                font: font,
                size: 4,
                height: 1,
                curveSegments: 12,//曲线上点的数量
                bevelThickness: 0.1, //文本斜面深度
                bevelSize: 0.1, //斜面离轮廓的距离
                bevelEnabled: true //是否打开曲面
            }


            for(var i = 0;i < x_label.length;i++){
                var textGeo = new THREE.TextGeometry( x_label[i], text_style );
                var textMaterial = new THREE.MeshPhongMaterial( {color: 0xB3B3B3} ); 
                var mesh = new THREE.Mesh( textGeo, textMaterial );
                //对于文字，先设置lookat和先设置position是不一样的
                mesh.lookAt(new THREE.Vector3(100, 0, 150));
                mesh.position.set( (i+1)*20, -4, (x_label.length+1)*20+10 ); 
                scene.add( mesh );                    
            }  
            
            for(var i = 0;i < y_label.length;i++){
                var textGeo = new THREE.TextGeometry( y_label[i], text_style );
                var textMaterial = new THREE.MeshPhongMaterial( {color: 0xB3B3B3} ); 
                var mesh = new THREE.Mesh( textGeo, textMaterial );
                //对于文字，先设置lookat和先设置position是不一样的
                mesh.lookAt(new THREE.Vector3(100, 0, 150));
                mesh.position.set( (y_label.length+1)*20+5, -4, (i+1)*20 ); 
                scene.add( mesh );                    
            } 
            console.log(z_length);
            
            for(var i = 0;i < z_length;i++){
                var textGeo = new THREE.TextGeometry(z_unit*i, text_style );
                var textMaterial = new THREE.MeshPhongMaterial( {color: 0xB3B3B3} ); 
                var mesh = new THREE.Mesh( textGeo, textMaterial );
                mesh.lookAt(new THREE.Vector3(0, 0,100));
                mesh.position.set( -(""+z_unit*i).length*2, i*10, (x_label.length+1)*20+5 ); 
                scene.add( mesh );                    
            }  

            //标注数量
            /*
            for(var i = 0;i < data.length;i++){
                var textGeo = new THREE.TextGeometry(data[i][2], text_style );
                var textMaterial = new THREE.MeshPhongMaterial( {color: 0xB3B3B3} ); 
                var mesh = new THREE.Mesh( textGeo, textMaterial );
                mesh.lookAt(new THREE.Vector3(0, 0,100));
                mesh.position.set( data[i][0]*20, data[i][2]/z_unit*10+5, data[i][1]*20 ); 
                scene.add( mesh );                    
            } 
            */
                     
        });

        
    },

    //金字塔图
	pyramid:function(title,color,style){
        var arrL = color.length;
        var camera_dis = arrL*14 + arrL*18;
		this.init(camera_dis);
        
        var scene = this.scene;
        var e_ups;
        var e_dws;
        var e_int;
        
        for(var i = 0;i < arrL;i++){
            if(style == 1){
                e_ups = (arrL - i - 1)*10;
                e_dws = (arrL - i)*10;
                e_int = i*18;
            }else if(style == 2){
                e_ups = (arrL - i - 1)*10;
                e_dws = (arrL - i)*10;
                e_int = i*15;              
            }else if(style == 3){
                e_ups = (arrL - i)*10;
                e_dws = (arrL - i)*10;
                e_int = i*15;
            }
            var geometry = new THREE.CylinderGeometry( e_ups,e_dws, 15,50);
            var material = new THREE.MeshPhongMaterial( {color: color[i],opacity:0.9,transparent:true} ); 
            var cylinder = new THREE.Mesh( geometry, material ); 
            cylinder.position.set(0,e_int, 0); 
            scene.add( cylinder );                     
        }

        var loader = new THREE.FontLoader();
        loader.load( 'lib/font/FZYaoTi_Regular.js', function ( font ) {
            var text_style = {
                font: font,
                size: 6,
                height: 2,
                curveSegments: 12,//曲线上点的数量
                bevelThickness: 0.1, //文本斜面深度
                bevelSize: 0.1, //斜面离轮廓的距离
                bevelEnabled: true //是否打开曲面
            }

            for(var i = 0;i < arrL;i++){
                if(style == 1){
                    e_int = i*18-5;

                }else if(style == 2){
                    e_int = i*15-3;

                }else if(style == 3){
                    e_int = i*15;
                }

                var textGeo = new THREE.TextGeometry( title[i], text_style );
                var textMaterial = new THREE.MeshPhongMaterial( {color: color[i]} ); 
                var mesh = new THREE.Mesh( textGeo, textMaterial );
                //对于文字，先设置lookat和先设置position是不一样的
                mesh.lookAt(new THREE.Vector3(0, 0, 100));
                mesh.position.set( (arrL-i)*10, e_int, 0 ); 
                scene.add( mesh );                    

            }     
        });             
        this.renderer.render(scene, this.camera);

        this.render();
	},

    //柱状图
    bar:function(x_label,y_label,x_color,z_unit,data,style){
    
        var scene = this.scene;
        this.axes(scene,x_label,y_label,z_unit,data);
        //绘图
        for(var i = 0;i < data.length;i++){
            for(var j=0;j <data[i].length;j++){
                if(style == 1){
                    var geometry = new THREE.CylinderGeometry( 8,8,data[i][j][2]/z_unit*10,50);
                }else if(style == 2){
                    var geometry = new THREE.BoxGeometry( 10,data[i][j][2]/z_unit*10,10);
                }
                
                var material = new THREE.MeshPhongMaterial( {color: x_color[i%(x_label.length)],opacity:1,transparent:true} ); 
                var cylinder = new THREE.Mesh( geometry, material ); 
                cylinder.position.set(data[i][j][0]*20, data[i][j][2]/z_unit*5, data[i][j][1]*20); 
                scene.add( cylinder ); 
            }                  
        } 
        this.render();
    },

    //饼状图
    pie:function(title,data,color,unit,style){
        var scene = this.scene;
        var arrL = color.length;
        var camera_dis = 130;
        this.init(camera_dis);
        
        all_data = 0;
        max_data = 0;
        for(var i=0;i<data.length;i++){
            all_data = all_data + data[i];
            if(data[i] >= max_data){
                max_data = data[i];
            }
        }

        var in_radius;
        var height;

        var all_angle = 0;
        
        for(var i=0;i<title.length;i++){
            if(style == 1){
                var geometry = this.sector(0,50,data[i]/all_data*360,unit);

            }else if(style == 2){
                var geometry = this.sector(0,50,data[i]/all_data*360,data[i]/unit);

            }else if(style == 3){
                var geometry = this.sector(10,50,data[i]/all_data*360,unit);

            }else if(style == 4){
                var geometry = this.sector(10,50,data[i]/all_data*360,data[i]/unit);

            }
            var material = new THREE.MeshPhongMaterial( {color: color[i],opacity:1,transparent:true} ); 
            var mesh = new THREE.Mesh( geometry, material );
            mesh.lookAt(new THREE.Vector3(0, 100, 0));
            mesh.position.set(0,0,0); 
            mesh.rotateZ(all_angle);

            mesh.translateOnAxis(new THREE.Vector3(5*Math.cos(data[i]/all_data*Math.PI) , 5*Math.sin(data[i]/all_data*Math.PI), 0),1);

            scene.add( mesh );
            all_angle = all_angle + data[i]/all_data*2*Math.PI;
        }

        var loader = new THREE.FontLoader();
        loader.load( 'lib/font/FZYaoTi_Regular.js', function ( font ) {
            var text_style = {
                font: font,
                size: 6,
                height: 2,
                curveSegments: 12,//曲线上点的数量
                bevelThickness: 0.1, //文本斜面深度
                bevelSize: 0.1, //斜面离轮廓的距离
                bevelEnabled: true //是否打开曲面
            }

            all_angle = 0;
            for(var i=0;i<title.length;i++){
                var textGeo = new THREE.TextGeometry( title[i], text_style );
                var textMaterial = new THREE.MeshPhongMaterial( {color: color[i]} ); 
                var mesh = new THREE.Mesh( textGeo, textMaterial );
                mesh.lookAt(new THREE.Vector3(0, 0, 100));

                var ly = 0;
                if((style == 1)||(style == 3) ){
                    ly = unit+2;

                }else if((style == 2)||(style == 4)){
                    ly = data[i]/unit +2;

                }
                mesh.position.set(0, ly+20*Math.sin(45/180*Math.PI), 0 ); 
                mesh.rotateY((all_angle+(data[i]/all_data/2*360))/180*Math.PI);
                //是移动当前点到设定点的距离的n倍，后面一个参数表示几倍
                mesh.translateOnAxis(new THREE.Vector3(60, 0,0),1);
                scene.add( mesh );
                //绘制线段
                var geometry = new THREE.Geometry();
                geometry.vertices.push( new THREE.Vector3( 0, ly, 0 ) );
                geometry.vertices.push( new THREE.Vector3( 20*Math.cos(45/180*Math.PI), 20*Math.sin(45/180*Math.PI)+ly, 0 ) );
                geometry.vertices.push( new THREE.Vector3( 20, ly+20*Math.sin(45/180*Math.PI), 0 ) );
                var line = new THREE.Line( geometry, new THREE.LineBasicMaterial( { color: 0xB3B3B3} ) );
                line.rotateY((all_angle+(data[i]/all_data/2*360))/180*Math.PI);
                //是移动当前点到设定点的距离的n倍，后面一个参数表示几倍
                line.translateOnAxis(new THREE.Vector3(40, 0,0),1);
                scene.add( line );

                all_angle = all_angle + data[i]/all_data*360;
            }
     
        }); 
        this.render();
    },

    //绘制扇形,参数是角度
    sector:function(in_radius,out_radius,angle,height){
        var trackShape = new THREE.Shape();
        if(in_radius == 0){
            trackShape.moveTo(0,0);

        }else{
            trackShape.moveTo(in_radius,0);
            trackShape.absarc( 0, 0, in_radius, 0 ,angle/180*Math.PI, false );            
        }

        trackShape.lineTo(out_radius*Math.cos(angle/180*Math.PI),out_radius*Math.sin(angle/180*Math.PI));
        
        trackShape.absarc( 0, 0, out_radius, angle/180*Math.PI,0, true );
        trackShape.lineTo(in_radius,0);        

        var extrudeSettings = { amount: height, bevelEnabled: false, steps: 1, };
        return new THREE.ExtrudeGeometry( trackShape, extrudeSettings );        

    },

    //折线图
    line:function(x_label,y_label,x_color,z_unit,data){
        var scene = this.scene;
        this.axes(scene,x_label,y_label,z_unit,data);
        //绘图
        for(var i = 0;i < data.length;i++){
            for(var j=0;j <data[i].length;j++){
                //绘制点
                var geometry = new THREE.SphereGeometry( 2,20,20);
                var material = new THREE.MeshPhongMaterial( {color: x_color[i%(x_label.length)],opacity:1,transparent:true} ); 
                var cylinder = new THREE.Mesh( geometry, material ); 
                cylinder.position.set(data[i][j][0]*20, data[i][j][2]/z_unit*10, data[i][j][1]*20); 
                scene.add( cylinder ); 

                //连接线段
                if((i< data.length -1)){
                    var geometry = new THREE.Geometry();
                    geometry.vertices.push( new THREE.Vector3( data[i][j][0]*20, data[i][j][2]/z_unit*10, data[i][j][1]*20 ) );
                    geometry.vertices.push( new THREE.Vector3( data[i+1][j][0]*20, data[i+1][j][2]/z_unit*10, data[i+1][j][1]*20 ) );
                    var line = new THREE.Line( geometry, new THREE.LineBasicMaterial( { color: 0x7ec0ee} ) );//绿色 z
                    scene.add( line );                    
                }
                //连接线段
                if((j< data[i].length -1)){
                    var geometry = new THREE.Geometry();
                    geometry.vertices.push( new THREE.Vector3( data[i][j][0]*20, data[i][j][2]/z_unit*10, data[i][j][1]*20 ) );
                    geometry.vertices.push( new THREE.Vector3( data[i][j+1][0]*20, data[i][j+1][2]/z_unit*10, data[i][j+1][1]*20 ) );
                    var line = new THREE.Line( geometry, new THREE.LineBasicMaterial( { color: 0x7ec0ee} ) );//绿色 z
                    scene.add( line );                    
                }                
            }                  
        } 
        this.render();
    },

    //测试
    test:function(){
        var scene = this.scene;
        var camera_dis = 100;
        this.init(camera_dis);

        var trackShape = new THREE.Shape();
        trackShape.moveTo(1,0);
        //trackShape.absarc( 0, 0, 1, 0 ,360/180*Math.PI, false );
        //var now1 = trackShape.currentPoint;
        //console.log(now1);
        trackShape.moveTo(10,0);
        
        trackShape.absarc( 0, 0, 10, 0 ,45/180*Math.PI, false );
        var now1 = trackShape.currentPoint;
        console.log(now1);
        
        //trackShape.moveTo(10,0);

        trackShape.lineTo(50*Math.cos(45/180*Math.PI),50*Math.sin(45/180*Math.PI));
        
        trackShape.absarc( 0, 0, 50, 45/180*Math.PI,0, true );
        trackShape.lineTo(9.8,0);
        /*
        var now2 = trackShape.currentPoint;
        console.log(now2);
        trackShape.moveTo(now2.x,now2.y);
        trackShape.lineTo(now1.x,now1.y);
        */

        var geometry = new THREE.ShapeGeometry( trackShape );
        var material = new THREE.LineBasicMaterial({color: 0x00EE00});
        var line = new THREE.Line( geometry, material );
        scene.add( line );
        this.render();

    }

}