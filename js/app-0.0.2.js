$(document).ready(function(){
	app.c.init();
	app.v.init();
	app.c.listeners();
})
/////////////////////////////////////////////////////////////////////////////////

var app={m:{},v:{},c:{}};

/////////////////////////////////////////////////////////////////////////////////


/////////////////////////////////////////////////////////////////////////////////

app.c.init=function(){
	app.m.password=false;
	app.m.metadata={"name":"Signum Velox","version":"0.0.2"};
	var b=app.c.bounds();
	app.m.genome={};
	app.m.genome.r=[];
	app.m.genome.rf=[];
	app.m.genome.color=[];
	app.m.genome.lw=[];
	app.m.genome.steps=[];
	app.m.genome.incrementMod=[];
	app.m.genome.ngonN=[];
	app.m.genome.ngonR=[];
	app.m.genome.rotation=[];
	app.m.genome.fadeColor=[];
	app.m.genome.fadeRadius=[];
};

app.c.listeners=function(){
	$("#mitLicense").on("click",function(){
		$("#license").slideToggle();
	});


	$("input#clear").on("click",function(){
		$("div#icons").html("");
		for (var i=0;i<1;i++){
			var iconWidth=$("input[name=size]:checked").val();
			iconWidth=parseInt(iconWidth);
			app.v.icon("div#icons",iconWidth);
			//console.log(iconWidth);
		}
	});


};

app.c.save=function(id){
	if (!id){return false;}
		var dataURL=document.getElementById(id).toDataURL();
		$.ajax({
			  type: "POST",
			  url: "http://peopleofthebit.com/dev/iconic/php/createRecord.php",
			  data: {image:dataURL,password:app.m.password}
			}).done(function(o) {
			});
};

app.c.bounds=function(){	
	var b=app.m.bounds={};
	b.left=0;
	b.top=0;
	b.right=$(document).width();
	b.bottom=$(document).height();
	b.centerX=b.right/2;
	b.centerY=b.bottom/2;

	return b;
};

app.c.opts=function(width,height){
	var opts={}
	opts.width=width;
	opts.height=height;
	opts.color=davis.mutateColor(davis.darwin([davis.randomColor()],app.m.genome.color));
	opts.ngonN=davis.mutate(davis.darwin([davis.randomColor()],app.m.genome.ngonN));
	opts.ngonR=davis.mutate(davis.darwin([width/4+davis.random(width/4)],app.m.genome.ngonR))
	return opts;
};

app.c.breed=function(n){
	var g=app.m.genome;
	g.color.push(n.color);
	g.ngonN.push(n.ngonN);
	g.ngonR.push(n.ngonR);
};

/////////////////////////////////////////////////////////////////////////////////

app.v.layout=function(){
	var d="";
	d+="<div class='wrapper'><input type='text' value='Velox'></div>";
	d+="<p>click more for a new icon. when you find one you like, click it to save. To change the letter, type something new in the box above.</p>";
	d+="<div id='radios'><form action=''>";

		d+="<table><tr>";
			d+="<td><input type='radio' name='size' value='1024'><br>1024</td>";
			d+="<td><input type='radio' name='size' value='512' checked><br>512</td>";
			d+="<td><input type='radio' name='size' value='144' ><br>144</td>";
			d+="<td><input type='radio' name='size' value='72' ><br>72</td>";
		d+="</tr></table>";
	d+="</form></div>";
	d+="<div id='icons'></div>";
	d+="<div id='controlls'>";
		d+="<input type='button' value='more' id='clear'></input>";
	d+="</div>";
	d+="<p>click the icons you save below for a png version</p>"
	d+="<div id='saved'></div>";
	d+=davis.license();

	$("body").html(d);
};

app.v.init=function(){
	var b=app.m.bounds;
	app.v.style();
	app.v.layout();
	iconWidth=parseInt($("input[name=size]:checked").val());
	app.v.icon("div#icons",iconWidth);
};

app.v.icon=function(target,width){
	app.m.text=$("input[type=text]").val().split("")[0];

	var width=width || 144;
	var height=width;
	var target=target || "body";
	var id=davis.randomWord()+davis.random(100);
	var opts=app.c.opts(width,height);

	var c=app.v.canvas(width,height,id);
	$(target).append(c);
	$("div#icons canvas#"+id).on("click",function(){

		app.c.breed(opts);

		$("div#saved").prepend(this);

		if ($("div#icons > canvas").size()<1){
			var iconWidth=$("input[name=size]:checked").val();
			iconWidth=parseInt(iconWidth);
			app.v.icon("div#icons",iconWidth);
		}

		$("div#saved canvas#"+id).on("click",function(){
		 	var dataURL = this.toDataURL();
		    if (!window.open(dataURL)) {
		        document.location.href = dataURL;
		    }
		});


		//send it to the database
		if (app.m.password){app.c.save(id);}

	});


	c=document.getElementById(id);
	var ctx=c.getContext("2d");
	
	app.v.radial(ctx,opts);
	davis.maybe(1,3,function(){	
		ctx.clearRect(0, 0, width, height);
		app.v.textIcon(ctx,opts);
	})

	//app.v.textIcon(ctx,width,height);
	//app.v.bilateral(ctx,width,height);
	//app.v.radial(ctx,width,height);

};


app.v.textIcon=function(ctx,opts){
	var width=opts.width || 512;
	var height=opts.height || 512;
	var color=opts.color || davis.randomColor();
	var ngonN=opts.ngonN || 3+davis.random(6);
	var ngonR=opts.ngonR || width/4+davis.random(width/4);

	ctx.beginPath();
	var gradient=ctx.createLinearGradient(0,0,0,height);
	gradient.addColorStop(0,color);
	gradient.addColorStop(1,davis.pick([color,davis.randomColor(),"#000","#fff",davis.alpha(color,0)]));
	ctx.fillStyle=gradient;
	ctx.fillRect(0,0,width,height);
	
	
	for (var j=0;j<davis.random(4);j++){
		var r=davis.random(width/2);
		var rf=davis.random(width/2);
		var color=davis.randomColor();
		davis.maybe(2,3,function(){color=davis.randomColor("grey");});
		var lw=1+davis.random(width/10);
		var steps=1+davis.random(30);
		var incrementMod=davis.random(3)*90;
		var n=davis.random(6);
		var rotation=90*davis.random(3);
		var fadeColor=davis.pick(["rgba(0,0,0,0)","rgba(255,255,255,0)"]);
		var fadeRadius=Math.random();
		davis.maybe(1,5,function(){fadeRadius=0;});
		davis.maybe(1,5,function(){fadeRadius=false;});
		for (var i=0;i<steps;i++){
			var increment=i*360/steps;
			var x=geo.getPoint(width/2,height/2,rf,increment+incrementMod).x2;
			var y=geo.getPoint(width/2,height/2,rf,increment+incrementMod).y2;

			app.v.circle({
				n:n,
				gradient:true,
				context:ctx,
				x:x,
				y:y,
				r:r,
				rotation:rotation,
				lineWidth:lw,
				color:color,
				fadeColor:fadeColor,
				fadeRadius:fadeRadius
			});	
		}
	}

	pattern=ctx.createPattern(ctx.canvas,"no-repeat");
	ctx.clearRect(0, 0, width, height);


	app.v.ngon({
		n:ngonN,
		gradient:true,
		context:ctx,
		x:width/2,
		y:height/2,
		r:ngonR,
		fill:pattern,
		lineWidth:davis.random(width/15)
	});	

	var x=width/2;
	var y=height/2;
	var fonts=[
		"Verdana, Geneva, sans-serif",
		"Courier, monospace",
		"Monaco, monospace",
		"Helvetica, sans-serif",
		"Impact, Charcoal, sans-serif",
		"cursive, sans-serif",
		"'Arial Black', Gadget, sans-serif",
		"'Times New Roman', Times, serif",
		"'Palatino Linotype', 'Book Antiqua', Palatino, serif"
	];
	var text=app.m.text;
	if (typeof text!="string"){
		text=" ";
	}
	davis.maybe(1,4,function(){text=text.toUpperCase();});
	davis.maybe(1,4,function(){text=text.toLowerCase();});
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.font="900 "+((width/4)+davis.random(width/4))+"px "+davis.pick(fonts);
	//ctx.fillStyle=pattern;
	ctx.fillStyle="#fff";
	ctx.fillText(text,x,y);
};


app.v.bilateral=function(ctx,width,height){
	var color=davis.randomColor();
	var strokeStyle=davis.alpha(davis.randomColor("grey"),(0.5+(Math.random()/2)));
	var fillStyle=davis.alpha(color,Math.random());
	for (var i=0;i<4;i++){
		davis.maybe(1,2,function(){

			var lineWidth=1+davis.random(width/100);
			var r=davis.random(width/3);

			var x=r+lineWidth+davis.random((width/2)-r-lineWidth);
			var y=r+lineWidth+davis.random((height)-(2*(r+lineWidth)));
			ctx.beginPath();
			ctx.strokeStyle=strokeStyle;
			ctx.arc(x,y,r,0,2*Math.PI);
			ctx.lineWidth=lineWidth;
			ctx.fillStyle=fillStyle;
			ctx.fill();
			ctx.stroke();
			ctx.beginPath();
			x=width/2+(width/2)-x;
			ctx.arc(x,y,r,0,2*Math.PI);
			ctx.fillStyle=fillStyle;
			ctx.fill();
			ctx.stroke();
		});
	}
	for (var i=0;i<3;i++){
		davis.maybe(1,2,function(){
			var lineWidth=1+davis.random(width/100);
			var r=davis.random(width/3);
			var x=width/2;
			var y=r+lineWidth+davis.random((height)-(2*(r+lineWidth)));
			ctx.beginPath();
			ctx.strokeStyle=strokeStyle;
			ctx.arc(x,y,r,0,2*Math.PI);
			ctx.lineWidth=lineWidth;
			ctx.fillStyle=fillStyle;
			davis.maybe(1,3,function(){ctx.fill();});
			ctx.stroke();
		})
	}
};

app.v.radial=function(ctx,opts){
	var width=opts.width || 512;
	var height=opts.height || 512;
	ctx.beginPath();
	ctx.arc(width/2,width/2,davis.random(width/2),0,2*Math.PI);
	ctx.strokeStyle=davis.randomColor();
	ctx.lineWidth=1+davis.random(0.5*width);
	ctx.stroke();
	
	
	for (var j=0;j<davis.random(4);j++){
		var r=davis.random(width/2);
		var rf=davis.random(width/2);
		var color=opts.color || davis.randomColor();
		davis.maybe(2,3,function(){color=davis.randomColor("grey");});
		var lw=1+davis.random(width/10);
		var steps=1+davis.random(30);
		var incrementMod=davis.random(3)*90;
		var n=davis.random(6);
		var rotation=90*davis.random(3);
		var fadeColor=davis.pick(["rgba(0,0,0,0)","rgba(255,255,255,0)"]);
		var fadeRadius=Math.random();
		davis.maybe(1,5,function(){fadeRadius=0;});
		davis.maybe(1,5,function(){fadeRadius=false;});
		for (var i=0;i<steps;i++){
			var increment=i*360/steps;
			var x=geo.getPoint(width/2,height/2,rf,increment+incrementMod).x2;
			var y=geo.getPoint(width/2,height/2,rf,increment+incrementMod).y2;

			app.v.circle({
				n:n,
				gradient:true,
				context:ctx,
				x:x,
				y:y,
				r:r,
				rotation:rotation,
				lineWidth:lw,
				color:color,
				fadeColor:fadeColor,
				fadeRadius:fadeRadius
			});	
		}
	}
};

app.v.circle=function(c){
	var ctx= c.context || false;
	var x=c.x || 100;
	var y=c.y || x;
	var r=c.r || 10;
	var color=c.color || davis.randomColor("grey");
	var fadeColor=c.fadeColor || "rgba(0,0,0,0)";
	var fadeRadius=c.fadeRadius || Math.random();
	var cr=ctx.canvas.width/2;
	//console.log(cw);
	var gradient=ctx.createRadialGradient(cr,cr,(fadeRadius*cr),cr,cr,cr);
	gradient.addColorStop(0,color);
	gradient.addColorStop(1,fadeColor);
	var lineWidth=c.lineWidth || 1;
	ctx.beginPath();
	ctx.arc(x,y,r,0,2*Math.PI);
	ctx.strokeStyle=gradient;
	ctx.lineWidth=lineWidth;

	ctx.stroke();


	return true;
};

app.v.ngon=function(c){
	var n=c.n || 3;

	var ctx= c.context || false;
	var x=c.x || 100;
	var y=c.y || x;
	var r=c.r || 100;
	if (n%2==0){
		var rotation=360/(n*2)*davis.random(n*2);
	} 
	else {
		var rotation=90+(180*davis.random(2));
	};
	rotation=c.rotation || rotation;
	var color=c.color || davis.randomColor("grey");
	var lineWidth=c.lineWidth || 1;
	var fill=c.fill || davis.randcomColor();
	ctx.beginPath();
	for (var i=0;i<n+2;i++){
		var nx=geo.getPoint(x,y,r,rotation+(i*360/n)).x2;
		var ny=geo.getPoint(x,y,r,rotation+(i*360/n)).y2;
		ctx.lineTo(nx,ny);
	}
	ctx.lineJoin='miter';
	ctx.strokeStyle=color;
	ctx.lineWidth=lineWidth;
	ctx.fillStyle=fill;
	ctx.fill();
	ctx.stroke();
	return true;
};
app.v.canvas=function(w,h,id){
	var c="";
	c+="<canvas width='"+w+"' height='"+h+"' id='"+id+"'></canvas>";
	return c;
};

app.v.style=function(){
	davis.style("body",{
		"width":"100%",
		"margin":"0px",
		"padding":"0px",
		"text-align":"center",
		"background":"#eee"
	});
	davis.style("canvas",{
		"margin":"10px",
		"cursor":"pointer",
		"width":""+(Math.min(app.m.bounds.right,app.m.bounds.bottom)/3)+"px",
		"height":""+(Math.min(app.m.bounds.right,app.m.bounds.bottom)/3)+"px"
	});
	davis.style("div",{
		"text-align":"center",
		"border":"1px solid #111",
		"margin":"20px"
	});
	davis.style("input[type=text]",{
		"font-size":"3em",
		"color":"#111",
		"width":"100%",
		"text-align":"center",
		"margin-top":"30px"
	});
	davis.style("input[type=button]",{
		"font-size":"3em",
		"width":"100%",
		"margin":"0px",
		"cursor":"pointer",
		"background":"#EC1313",
		"color":"#fff"
	});
	davis.style("table",{
		"width":"100%",
		"table-layout":"fixed",
		"text-align":"center"
	});
	davis.style("input[type=radio]",{
		"margin-top":"20px",
		"width":"20px",
		"height":"20px"
	});
	davis.style(".wrapper",{
		"border":"0",
		"padding":"0"
	});

};