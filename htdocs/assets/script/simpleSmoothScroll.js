export default class simpleSmoothScroll {
  constructor(option) {
    this.checkRequestAnimationFrame();

    this.option = {
      deceleration : 0.2
    };

    for(let prop in option){
      this.option[prop] = option[prop];
    }

    this.start();

    return this;
  }
  checkRequestAnimationFrame(){
    if ( !window.requestAnimationFrame ) {
      window.requestAnimationFrame = ( function() {
        return window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame ||
          window.oRequestAnimationFrame ||
          window.msRequestAnimationFrame ||
          window.requestAnimationFrame ||
          function( /* function FrameRequestCallback */ callback, /* DOMElement Element */ element ) {
            window.setTimeout( callback, 1000 / 60 );
          };
      } )();
      window.cancelAnimationFrame = ( function() {
        return window.webkitCancelAnimationFrame ||
          window.mozRequestAnimationFrame ||
          window.oCancelAnimationFrame ||
          window.msCancelAnimationFrame ||
          window.cancelAnimationFrame ||
          function( /* function FrameRequestCallback */ callback, /* DOMElement Element */ element ) {
            window.clearTimeout( callback );
          };
      } )();
    }
  }

  scrollTop(){
    return (window.pageYOffset || document.documentElement.scrollTop);
  }

  start(){
    let self = this;
    let scrl = self.scrollTop();
    self.arrivalTop = scrl;
    let top = 100000000000;
    let scrtmr = {};

    window.addEventListener('wheel',(e)=>{
      if(e.preventDefault) e.preventDefault();
      if(e.stopPropagation) e.stopPropagation();
      let y = e.deltaY;

      self.arrivalTop += y;
      if(isNaN(self.arrivalTop)){
        self.arrivalTop = 0;
        scrl = 0;
      }
      top = document.querySelector('body').offsetHeight - window.innerHeight;
      if(self.arrivalTop < 0) self.arrivalTop = 0;
      else if(self.arrivalTop > top) self.arrivalTop = top;
      cancelAnimationFrame(scrtmr);
      scrtmr = requestAnimationFrame(step);

    },{passive:false});

    window.addEventListener('touchend',(e)=>{
      scrl = self.arrivalTop = self.scrollTop();
    },{passive:false});
    window.addEventListener('keyup',(e)=>{
      scrl = self.arrivalTop = self.scrollTop();
    },{passive:false});

    function step(){
      scrl += (self.arrivalTop - scrl) * self.option.deceleration;

      if(scrl < 0) scrl = 0;

      window.scrollTo(0,scrl);

      if(Math.abs(self.arrivalTop - scrl) < 2){
        window.scrollTo(0,self.arrivalTop);
        cancelAnimationFrame(scrtmr);
      }else{
        scrtmr = requestAnimationFrame(step);
      }
    }

    self.scrollTo = (hash,margin)=>{
      margin = margin || 0;
      let $arv = document.querySelector(`${ hash }`);
      if($arv){
        self.arrivalTop = $arv.getBoundingClientRect().top + self.scrollTop() - margin;
        scrtmr = requestAnimationFrame(step);
      }
    };

  }

}
