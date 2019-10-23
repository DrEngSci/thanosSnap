window.onload = function(){

var imageDataArray = [];
var canvasCount = 15;
var playOnOff = 0;
var handAnim = 0;

$(function(){
    function myFunc(){
      //html12canvas hazır kütüphane, seçilen bölgeyi canvas'a çeviriyor
      html2canvas($(this).parents(".title")[0]).then(canvas => {
      ctx = canvas.getContext("2d");
      //Tüm canvası pixellere ayırıp araya atıyo
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
      //Şimdi aşağıdaki distributed pixellerden canvas oluşturuyoruz.
      for (let i = 0; i < canvasCount; i++) {
        let c = newCanvasFromImageData(imageDataArray[i], canvas.width, canvas.height);
        c.classList.add("dust");
        $("body").append(c);
      }
      //Animasyonu oluşturuyoruz, fadeOut jquery kütüphanesinden geliyo
      $(this).parents(".title").children().not(".dust").fadeOut(1500); // WARNING: FADEOUT DİKKAT ET!!

      //Burada ise artık animasyonun steplerini ayarlıyoruz.
      /*
        3 aşamadan oluşuyor:
            Blur = Yumuşak geçişi sağlıyor.
            Transform = Pixelleri orijinal pozisyonundan uzaklaştırıyor
            Fade Out = Bu ise pixelleri solduruyor.
        JQueryde blur ve transform olmadığından ikisi için aşağıya fonksiyon açıyoruz.
      */
      $(".dust").each( function(index){
        animateBlur($(this),0.8,800);
        setTimeout(() => {
        animateTransform($(this),100,-100,chance.integer({ min: -15, max: 15 }),400+(110*index)); 
        }, 70*index);
        $(this).delay(50*index).fadeOut((100*index),"easeInQuint",()=> {$(this).remove();});

      });
    });
  }
  $(".spanCss").click(myFunc);
  $(".spanCss").click(myAudio);
});

function myAudio() {
      let audio = new Audio('audio/trick.mov');
      audio.loop = false;
      audio.play();
}

function trick() {
  if(handAnim == 0) {
      console.log('thanos');
      let audio = new Audio('audio/trick.mov');
      audio.loop = false;
      audio.play();
      gauntlet.src = 'img/2.png';
      setTimeout(function() {
          gauntlet.src = 'img/3.png';
      },400)
      setTimeout(function() {
          gauntlet.src = 'img/4.png';
      },1000)
      setTimeout(function() {
          gauntlet.src = 'img/5.png';
      },1200)
      handAnim = 1;
  } else {
      handAnim = 0;
  }
}

  //Resmi random olarak sileceği için nereden başlayacağını bilemiyouz.
  //Amacımız top to bottom silme işlemi uygulamak.
  //Bunun için quadratic bir distribution oluşturuyoruz.
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
