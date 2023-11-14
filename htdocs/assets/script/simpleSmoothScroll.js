export default class simpleSmoothScroll {
  constructor(option) {
    this.checkRequestAnimationFrame();

    this.option = {
      distance: 1,
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
  getStyle(element){
    return (element.currentStyle || document.defaultView.getComputedStyle(element, ''));
  }
  iframeScroll(flg){
    flg = flg || false;
    let iframe = document.querySelectorAll('iframe');
    iframe.forEach(($iframe)=>{
      if(flg){
        $iframe.style.pointerEvents = 'none';
      }else{
        $iframe.style.pointerEvents = 'auto';
      }
    });
  }
  start(){
    let self = this;
    let scrl = self.scrollTop();
    self.arrivalTop = scrl;
    let top = 100000000000;
    let scrtmr = {};
    let scrchk = {};
    let prevTop = 0;
    let count = 0;

    let $html = document.querySelector('html');
    let htmlStyle = self.getStyle($html);
    let htmlTop = parseInt(htmlStyle.marginTop);

    window.addEventListener('load',()=>{
      setTimeout(()=>{
        self.arrivalTop = self.scrollTop();
      },10);
    },false);

    document.addEventListener("DOMContentLoaded", ()=>{
      let anchor = document.querySelectorAll('a[href^="#"]');

      anchor.forEach(($anchor)=>{
        $anchor.addEventListener('click',(e)=>{
          e.preventDefault();
          count = 0;
          let href = e.currentTarget.getAttribute('href');
          self.scrollTo(href);
          return false;
        },false);
      });
    });

    window.addEventListener('wheel',(e)=>{
      let $dialog = document.querySelectorAll('dialog[open]');
      if($dialog.length > 0){
        return false;
      } else{
        if(e.preventDefault) e.preventDefault();
        if(e.stopPropagation) e.stopPropagation();
      }

      let y = e.deltaY;

      self.arrivalTop += y * self.option.distance;
      if(isNaN(self.arrivalTop)){
        self.arrivalTop = 0;
        scrl = 0;
      }
      top = document.querySelector('body').offsetHeight - window.innerHeight;
      if(self.arrivalTop < 0) self.arrivalTop = 0;
      else if(self.arrivalTop > top + htmlTop) self.arrivalTop = top + htmlTop;
      cancelAnimationFrame(scrtmr);
      scrtmr = requestAnimationFrame(step);
      cancelAnimationFrame(scrchk);
      self.iframeScroll(true);
    },{passive:false});

    window.addEventListener('touchend',(e)=>{
      scrl = self.arrivalTop = self.scrollTop();
    },{passive:false});
    window.addEventListener('keyup',(e)=>{
      scrl = self.arrivalTop = self.scrollTop();
    },{passive:false});

    window.addEventListener('scroll',(e)=>{
      scrl = self.scrollTop();
    },{passive:false});

    function step(){
      scrl += (self.arrivalTop - scrl) * self.option.deceleration;

      if(scrl < 0) scrl = 0;

      window.scrollTo(0,scrl);

      if(Math.abs(self.arrivalTop - scrl) < 2){
        window.scrollTo(0,self.arrivalTop);
        cancelAnimationFrame(scrtmr);
      }else{
        if(Math.abs(self.arrivalTop - scrl) < 20){
          self.iframeScroll(false);
        }
        scrtmr = requestAnimationFrame(step);
      }
    }

    self.scrollTo = (hash,margin)=>{
      margin = margin || 0;
      let $arv = document.querySelector(`${ hash }`);
      if($arv){
        prevTop = self.scrollTop();
        self.arrivalTop = $arv.getBoundingClientRect().top + self.scrollTop() - margin;
        scrtmr = requestAnimationFrame(step);
      }
    };

    ////
    function checkScroll(){
      if(prevTop === self.scrollTop()){
        count++;
        if(count > 5){
          cancelAnimationFrame(scrchk);
          scrl = self.arrivalTop = self.scrollTop();
        }else{
          scrchk = requestAnimationFrame(checkScroll);
        }
      }else{
        count = 0;
        scrchk = requestAnimationFrame(checkScroll);
      }
      prevTop = self.scrollTop();
    }
  }

}
