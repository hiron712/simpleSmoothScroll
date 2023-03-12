import simpleSmoothScroll from "./simpleSmoothScroll";

function init(){
  let sms = new simpleSmoothScroll({
    deceleration : 0.2
  });
}
window.addEventListener('load', init);


