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
  selector: 'attr',   // STRING: class|id|attr|tag, defaults to class
  find: 'src'         // STRING: looks at selector children and returns the first match
}};
~~~~  

Callback object:
~~~~  
{
  "item": "1/3",
  "seen": "27/02/2017, 10:58:07",
  "props": {
    "class": "elvis one",
    "id": "firstelement",
    "some-attribute": "some data",
    "src": "image.png"
  }
}
~~~~  
