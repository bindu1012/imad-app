//counter code
var button = document.getElementById('counter');

button.onclick = function () {
  
  //create a request object
   var request = new XMLHttpRequest();
  //capture the response andstore it in a variable
    request.onreadystatechange = function () {
        if(request.readystate === XMLHttpRequest.DONE){
          //take some action
        }
        if(request.status === 200){
            var counter = request.responseText;
            var span = document.getElementById('count');
            span.innerHTML=counter.toString();
      }
      //not done yet
  };
//make a request
request.open('GET', 'http://bbhargavi1012.imad.hasura-app.io/counter', true );
request.send(null);
};

//submit name
var nameinput = document.getElementById('name');
var name = nameInput.value;
var submit = document.getElementById('submit_btn');
submit.onclick = function () {
    //made a request to the server and send the name
    //capture the list of name and render it as a list
    var names = ['name1', 'name2', 'name3', 'name4'];
    var list = '';
    for(var i=0; i<names.length; i++){
        list += '<li>'+names[1]+ '</li>';
    }
    var ul = document.getElementById('namelist');
    ui.innerHTML = list;
};