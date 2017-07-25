function generatechord(matrix1){
  d3.csv("Datanew/species-oceanic.csv", function(cities) {
  //d3.json("matrix2.json", function(matrix2) {


    var gs= [2, 3, 1, 1, 2 ,5, 0];//6, 6.7, 4, 3, 2, 3, 2
    var ls= [5, 2, 0,0,0, 5, 0, 1];//3.7,  6.7, 6.7, 9.3, 6.7, 9.3, 2.7, 6.7
    var eco= [7,12,7,10,8,8,12,9];

    // var arr = [2, 3, 1, 1, 2 ,5, 0,5, 2, 0,0,0, 5, 0, 1,7/3,12/3,7/3,10/3,8/3,8/3,12/3,9/3];
    var arr = [6, 6.7, 4, 3, 2, 3, 2,3.7,  6.7, 6.7, 9.3, 6.7, 9.3, 2.7, 6.7];
    // Compute the chord layout.
    layout.matrix(matrix1);

    // Add a group per neighborhood.
    var group = svg.selectAll(".group")
        .data(layout.groups)
      .enter().append("g")
        .attr("class", "group")        
        .on("mouseover", mouseover)
        .on("mouseout", mouseout);

    // Add a mouseover title.
    group.append("title").text(function(d, i) {
       return cities[i].name + ", Total Value:" + formatPercent(d.value) 
    });

    // Add the group arc.
    var groupPath = group.append("path")
        .attr("id", function(d, i) { return "group" + i; })
        .attr("d", arc)
        .style("fill", function(d, i) { return cities[i].color; })
        .style("stroke", function(d, i, j) { return "black"; })
        .style("stroke-width", function(d, i) { return arr[d.index] *0.85; });

    // Add a text label.
    var groupText = group.append("text")
        //.attr("x", function(d, i){console.log( groupPath[0][i].getTotalLength()/2);})   //6
        .attr("dy", 15)
         

//     groupText.append("textPath")
//         .attr("xlink:href", function(d, i) { return "#group" + i; })
//         .text(function(d, i) { return cities[i].name; });

    // Remove the labels that don't fit. :(
//     groupText.filter(function(d, i) { return groupPath[0][i].getTotalLength() / 2 - 30 < this.getComputedTextLength(); })
//         .remove();
    
        
      group.append("svg:text")
      .each(function(d,i) { d.angle = (d.startAngle + d.endAngle) / 2; })
      .attr("dy", ".35em")
      .attr("text-anchor", function(d) { return d.angle > Math.PI ? "end" : null; })
      .attr("transform", function(d) {
        return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
            + "translate(" + (innerRadius + 33) + ")"
            + (d.angle > Math.PI ? "rotate(180)" : "");
      })
      .text(function(d,i) { return cities[i].name; })
      .style("fill", function(d, i) { return cities[i].color; })
    .attr("shape-rendering","crispEdges")
    .attr("font-family","Arial")
    .attr("font-size","13px");


    // Add the chords.
    var chord = svg.selectAll(".chord")
        .data(layout.chords)
      .enter().append("path")
        .attr("class", "chord")
        .style("fill", function(d,i) { 
          //console.log(d);
          //console.log(matrix2[d.source.index][d.target.index]);
          // if(matrix1[d.source.index][d.target.index] ==1 ) return 'purple';
          // else if(matrix1[d.source.index][d.target.index] ==2 ) return 'cyan';
          // else if(matrix1[d.source.index][d.target.index] ==3 ) return '#696969';
          // else if(matrix1[d.source.index][d.target.index] ==4 ) return 'blue';
          // else return 'red';

          if(matrix1[d.source.index][d.target.index] <1.9 ) return 'purple';
          else if(matrix1[d.source.index][d.target.index] >=2 && matrix1[d.source.index][d.target.index] <=2.99) return 'cyan';
          else if(matrix1[d.source.index][d.target.index] >=3 && matrix1[d.source.index][d.target.index] <=3.99 ) return '#696969';
          else if(matrix1[d.source.index][d.target.index] >=4&& matrix1[d.source.index][d.target.index] <=4.99) return 'blue';
          else return 'red';

          //return cities[d.source.index].color; 
        })
        .style("opacity", function(d){
           if (showchords==2){
             if(matrix1[d.source.index][d.target.index] < 0) return 0;
             else return 1;
           }
           else if (showchords==3){
             if(matrix1[d.source.index][d.target.index] > 0) return 0;
             else return 1;
           }
        })
        .attr("d", path)
        .on("mouseover", chordmouseover)
        .on("mouseout", chordmouseout);

    //Add an elaborate mouseover title for each chord.
    chord.append("title").text(function(d) {
      //console.log(matrix2[d.source.index][d.target.index]);
      var temp=1;
      if(matrix2[d.source.index][d.target.index] < 0) temp=-1;
      return cities[d.source.index].name
          + " → " + cities[d.target.index].name
          + ": " + formatPercent(d.source.value*temp)
          + "\n" + cities[d.target.index].name
          + " → " + cities[d.source.index].name
          + ": " + formatPercent(d.target.value*temp);
    });

   function mouseover(d, i) {
       svg.selectAll("path.chord")
        .filter(function(d) { 
          //console.log(d);
          if(showchords==1)  return d.source.index !== i && d.target.index !== i; 
          else if(showchords==2) { 
             if(matrix1[d.source.index][d.target.index] > 0) return d.source.index !== i && d.target.index !== i; 
          }
          else if(showchords==3) { 
             if(matrix1[d.source.index][d.target.index] < 0) return d.source.index !== i && d.target.index !== i; 
          }
        })
        .transition()
        .style("opacity", 0.15);
    }
    function mouseout(d, i) {
       svg.selectAll("path.chord")
        .filter(function(d) { 
          if(showchords==1)  return d.source.index !== i && d.target.index !== i; 
          else if(showchords==2) { 
             if(matrix1[d.source.index][d.target.index] > 0) return d.source.index !== i && d.target.index !== i; 
          }
          else if(showchords==3) { 
             if(matrix1[d.source.index][d.target.index] < 0) return d.source.index !== i && d.target.index !== i; 
          }
        })
        .transition()
        .style("opacity", 1);
    }
    
  function chordmouseover(d, i) {
       svg.selectAll("path.chord")
        .filter(function(d) { 
          //console.log(d);
          if(showchords==1)  return true; 
          else if(showchords==2) { 
             if(matrix1[d.source.index][d.target.index] > 0) return true; 
          }
          else if(showchords==3) { 
             if(matrix1[d.source.index][d.target.index] < 0) return true; 
          }
        })
        .transition()
        .style("opacity", 0.15);

        if(showchords==2) { 
             if(matrix1[d.source.index][d.target.index] > 0) d3.select(this).transition().style("opacity", 1);
          }
          else if(showchords==3) { 
             if(matrix1[d.source.index][d.target.index] < 0) d3.select(this).transition().style("opacity", 1);
          }
          else d3.select(this).transition().style("opacity", 1);
        
    }
    function chordmouseout(d, i) {
       svg.selectAll("path.chord")
        .filter(function(d) { 
          if(showchords==1)  return true; 
          else if(showchords==2) { 
             if(matrix1[d.source.index][d.target.index] > 0) return true; 
          }
          else if(showchords==3) { 
             if(matrix1[d.source.index][d.target.index] < 0) return true; 
          }
        })
        .transition()
        .style("opacity", 1);
    }

 //Append Legend
var teams = [
  "Global Solutions " ,
  "Local Solutions",
  "Ecosystem Components ",  "Climate Drivers","",
  "Chord Value= 5",
  "Chord Value= 4 - 4.99",
  "Chord Value= 3 - 3.99",
  "Chord Value= 2 - 2.99",
  "Chord Value= 1 - 1.99"];

var colors = [ "#DF7C00", "#BFAE40", "#8bc48a", "#DB7093", "white", "red","rgba(0,0,255,0.75)","#696969","cyan", "purple"];  //#083E77 bluish

var color = d3.scale.ordinal()      //custom color scale for teams
                .range(colors)
                .domain(teams);
svg.append("rect")   
.attr("x",((width/4)))
.attr("y",-height/2)
.attr("width",180)
.attr("height",210)
.attr("style","fill-opacity:0;stroke:black;stroke-width:1.5px");

var legend = svg.append("g")
    .attr("class", "legend")
    .attr("width", 150)
    .attr("height", 150)
    .attr("transform", "translate("+ ((width/4)+5) + ",-"+ ((height/2)-10) +" )");

var gs = legend.selectAll("g.keybox")
          .data(teams).enter().append("g")
          .attr("class", "keybox")
          .attr("width", 80)
          .attr("height", 15);

gs.append("text")
  .attr("class","keybox").attr("x",function(d,i){
    if(i<10){return 15;}
    else{return 90;}})
  .attr("y",function(d,i){
    if(i<10){return i*20 +9;}
    else{return (i-4)*20 +9;}})
  .text(function(d,i){
    return teams[i];})
  .attr("font-size","14px");
  

gs.append("rect")        
  .attr("x",function(d,i){
    if(i<10){return 0;}
    else{return 75;}})
  .attr("y",function(d,i){
     if(i<10){return i*20;
     }
     else{return (i-4) * 20;}})
  .attr("width",10)
  .attr("height",10)
  .style("fill",function(d, i){
    return colors[i];});



  //});
});

} //#8bc48a #fd8b8a