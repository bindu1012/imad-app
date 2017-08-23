console.log('Loaded!');
//change the text of the main text div
var element=document.getElementById('main-text');
element.innerHTML='new value';
//move the image
var img=document.getElementById("madi");
var marginLeft=0;
function moveRight () {
 marginLeft = marginLeft+1;
 img.style.marginLeft = marginLeft+ 'px';
}
img.onclick = function() {
    var interavl = setInterval(moveRight, 50);
    
  img.style.marginLeft = '100px'  ;
};