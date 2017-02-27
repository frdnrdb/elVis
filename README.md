# elVis
element visibility / inview / impression

Default: 
~~~~  
elVis('classname', callbackFunction);
~~~~  

With options:
~~~~  
elVis(query, callback, {
  time: 1000,         // INT: minimum milliseconds on screen, defaults to 500
  part: 100           // INT: minimum percentage of element visible, defaults to 50
  selector: 'attr'    // STRING: class|id|attr|tag, defaults to class
}};
~~~~  

Callback object:
~~~~  
{
  "item": "1/3",
  "seen": "27/02/2017, 01:31:21",
  "props": {
    "class": "elvis element one",
    "id": "some id",
    "random-attribute": "some data"
  }
}
~~~~  
