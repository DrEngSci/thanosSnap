window.onload = function(){


var imageDataArray = [];
var canvasCount = 15;
var playOnOff = 0;



    $(".spanCss").click(function(){

      html2canvas($(this).parents(".title")[0]).then(canvas => {
      //Divi image'a çevirdim
        ctx = canvas.getContext("2d");
        var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        var pixelArr = imageData.data;
        createBlankImageData(imageData);
        //bir array açıp tüm pixelleri içine attım
        for (let i = 0; i < pixelArr.length; i+=4) {
          let p = Math.floor((i/pixelArr.length) *canvasCount);
          let a = imageDataArray[weightedRandomDistrib(p)];
          a[i] = pixelArr[i];
          a[i+1] = pixelArr[i+1];
          a[i+2] = pixelArr[i+2];
          a[i+3] = pixelArr[i+3];
        }
        //her bi imageData için canvas açıp hedefi -burada dust olma durumu- gönderdim
        for (let i = 0; i < canvasCount; i++) {
          let c = newCanvasFromImageData(imageDataArray[i], canvas.width, canvas.height);
          c.classList.add("dust");
          $("body").append(c);
        }
        //tüm image text sildim
      $(this).parents(".title").children().not(".dust").fadeOut(1500); // WARNING: FADEOUT DİKKAT ET!!
        //animasyonu koydum

        $(".dust").each( function(index){
          animateBlur($(this),0.8,800);
          setTimeout(() => {
            animateTransform($(this),100,-100,chance.integer({ min: -15, max: 15 }),400+(110*index));
          }, 70*index);
          //tüm her şey solunca canvası sildim
          $(this).delay(50*index).fadeOut((100*index)+00,"easeInQuint",()=> {$( this ).remove();});
          myAudio();
        });
      });
    });

    function myAudio() {
        if(playOnOff == 0) {
            let audio = new Audio('audio/trick.mov');
            audio.loop = false;
            audio.play();
            playOnOff = 1;
        } else {
          playOnOff = 0;
        }
    }

    function weightedRandomDistrib(peak) {
      var prob = [], seq = [];
      for(let i=0;i<canvasCount;i++) {
        prob.push(Math.pow(canvasCount-Math.abs(peak-i),3));
        seq.push(i);
      }
      return chance.weighted(seq, prob);
    }
    function animateBlur(elem,radius,duration) {
      var r =0;
      $({rad:0}).animate({rad:radius}, {
          duration: duration,
          easing: "easeOutQuad",
          step: function(now) {
            elem.css({
                  filter: 'blur(' + now + 'px)'
              });
          }
      });
    }
    function animateTransform(elem,sx,sy,angle,duration) {
      var td = tx = ty =0;
      $({x: 0, y:0, deg:0}).animate({x: sx, y:sy, deg:angle}, {
          duration: duration,
          easing: "easeInQuad",
          step: function(now, fx) {
            if (fx.prop == "x")
              tx = now;
            else if (fx.prop == "y")
              ty = now;
            else if (fx.prop == "deg")
              td = now;
            elem.css({
                  transform: 'rotate(' + td + 'deg)' + 'translate(' + tx + 'px,'+ ty +'px)'
              });
          }
      });
    }
    function createBlankImageData(imageData) {
      for(let i=0;i<canvasCount;i++)
      {
        let arr = new Uint8ClampedArray(imageData.data);
        for (let j = 0; j < arr.length; j++) {
            arr[j] = 0;
        }
        imageDataArray.push(arr);
      }
    }
    function newCanvasFromImageData(imageDataArray ,w , h) {
      var canvas = document.createElement('canvas');
          canvas.width = w;
          canvas.height = h;
          tempCtx = canvas.getContext("2d");
          tempCtx.putImageData(new ImageData(imageDataArray, w , h), 0, 0);

      return canvas;
    }
}
