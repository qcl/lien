(function($) {

  $.lientalks = function(options) {

    var settings = $.extend({
        api: null,
        image: [
          'http://qcl.github.io/lien/img/lien.png',
          'http://qcl.github.io/lien/img/lien-1.png',
          'http://qcl.github.io/lien/img/lien-2.png'
        ],
        height: 450, // image height
        width: 466, // image width
        effect: 'default', // options: default, fast, slow, veryslow, jump, sneaky
        popup_effect: 'fade', // options: default, fade, slide, zoom
        popup_radius: '8px', // popup radius
        popup_color: 'black', // popup font color
        popup_bgcolor: 'beige', // popup background color
        readmore_color: 'brown', // popup font color
        comein_position: 80, // show lien after scroll more than percent of page height
        default_text: '你好，我是連戰的兒子連勝文', // the words show in popup before loading done
        enter_from: 'right', // options: left, right
        enter_distance: -130 // the distance to window side

        //left: -130, // remove this option after ver2.0
    }, options);

    createLien(settings);

    var container = $('#lien_come_container'),
        lien_image = $('#lien_come_container img'),
        popup = $('#lien_popup'),
        close = $('#lien_close_popup');

    $(window).scroll(function(){
      var scroll = $(window).scrollTop(),
          window_h = $(window).height(),
          page_h = $(document).height(),
          come_in = {},come_out = {};
      come_in[settings.enter_from] = settings.enter_distance+'px';
      come_out[settings.enter_from] = '-'+(settings.width)+'px';

      if((scroll+window_h) > (page_h*(settings.comein_position/100))) {
        if(container.css(settings.enter_from) == '-'+settings.width+'px') {
          switch(settings.effect) {
            case 'fast':
              container.animate(come_in, 100, function() {
                popupIn(settings.popup_effect);
              });
              break;

            case 'slow':
              container.animate(come_in, 1000, function() {
                popupIn(settings.popup_effect);
              });
              break;

            case 'veryslow':
              container.animate(come_in, 10000, function() {
                popupIn(settings.popup_effect);
              });
              break;

            case 'jump':
              container
                .css('bottom','-'+settings.height+'px')
                .css(settings.enter_from,settings.enter_distance);
              container
                .animate({bottom: 0}, 300)
                .animate({bottom: '-10px'}, 50)
                .animate({bottom: 0}, 50)
                .animate({bottom: '-10px'}, 50)
                .animate({
                  bottom: 0
                }, 300, function() {
                  popupIn(settings.popup_effect);
                });
              break;

            case 'sneaky':
              var sneaky_pos1 = {},
                  sneaky_pos2 = {},
                  sneaky_pos3 = {};
              sneaky_pos1[settings.enter_from] = '-'+(settings.width*0.54)+'px';
              sneaky_pos2[settings.enter_from] = '-'+(settings.width*0.6)+'px';
              sneaky_pos3[settings.enter_from] = '-'+(settings.width*0.7)+'px';

              container
                .animate(sneaky_pos1, 2000).delay(2000)
                .animate(sneaky_pos2, 1000).delay(1000)
                .animate(sneaky_pos1, 1000).delay(2000)
                .animate(sneaky_pos3, 2000).delay(1000)
                .animate(come_in, 3000, function() {
                  popupIn(settings.popup_effect);
                });
              break;

            default:
              container.animate(
                come_in, 500, function() {
                  popupIn(settings.popup_effect);
              });
              break;
          }
        }
      }
      else {
        if(container.css(settings.enter_from) == settings.enter_distance+'px') {
          popup.hide();
          container.animate(come_out, 100);
          loadData(settings);
        }
      }
    });
    lien_image.click(function(){
      var come_out_forever = {};
      come_out_forever[settings.enter_from] = '-'+(settings.width+10)+'px';
      popup.remove();
      container.animate(come_out_forever, 100);
    });
    close.click(function(){
      popup.hide();
      loadData(settings);
    });
  };

  function createLien(settings){
    var img_src,arrow_pos;
    if($.isArray(settings.image)==true)
      img_src = settings.image[Math.floor(Math.random()*(settings.image.length))];
    else
      img_src = settings.image;
    if(settings.enter_from == 'left')
      arrow_pos = 'right';
    else
      arrow_pos = 'left';
    var object = '<div id="lien_come_container" style="width:'+settings.width+'px; height:'+settings.height+'px; '+settings.enter_from+':-'+settings.width+'px; bottom:0;"><img src="'+img_src+'" style="width:'+settings.width+'px; height:'+settings.height+'px;"><div id="lien_popup" style="'+settings.enter_from+':'+((settings.width)*0.8)+'px;top:'+(settings.height*0.28)+'px;-webkit-border-radius:'+settings.popup_radius+';-moz-border-radius:'+settings.popup_radius+';border-radius:'+settings.popup_radius+';background-color:'+settings.popup_bgcolor+'"><div id="lien_says" style="color:'+settings.popup_color+'">'+settings.default_text+'<a href="http://taipeihope.tw" target="_blank" class="lien_readmore" style="color:'+settings.readmore_color+'">了解更多連勝文的政見</a></div><div id="lien_popup_arrow_shadow" style="border-'+arrow_pos+': 40px solid rgba(0,0,0,.1);'+settings.enter_from+': -40px;"></div><div id="lien_popup_arrow" style="border-'+arrow_pos+': 42px solid '+settings.popup_bgcolor+';'+settings.enter_from+': -40px;"></div><div id="lien_close_popup">X</div></div></div>';
    $('body').append(object);
    loadData(settings);
  }

  function loadData(settings){
    
    //TODO: settings.api
    
    // Use YQL to prevent the access control allow origin problem
    var api = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20json%20where%20url%3D%27http%3A%2F%2Fqcl.github.io%2Flien%2Fapi%2Fofficial-policy%27&format=json";

    var posts = {}, says;
    $.get(api,function(results){
       
      var i = 0;
      $.each(results.query.results.json.json,function(ind,item){
        posts[i] = item; i++;
      });
      
      var post = posts[Math.floor(Math.random()*(i-1))]
          link = '<a href="'+post.url+'" target="_blank" class="lien_readmore" style="color:'+settings.readmore_color+'">了解更多連勝文的政見</a>';
      
      var title = (post.title).replace(/連勝文政見/g,"").replace(/- /g,"");
      var content = stringReplace(post.plain_content);
        
      says = '<p id="lien_say_hi" style="color:'+settings.popup_color+'">'+settings.default_text+'<br>我提出「'+title.substring(4)+'」</p>'+content.substring(0,60)+'...</p>'+link;

      $('#lien_says').scrollTop(0).html(says).promise().done(function(){
        $('p').removeAttr("style"); $('span').removeAttr("style");
      });
      
    });
  }

  function stringReplace(string){
    return string.replace(/連勝文/g,'我')
      .replace(/台北市長候選人/g,'')
      .replace(/我表示/g,'我認為')
      .replace(/我指出/g,'我認為');
  }

  function popupIn(effect) {
    switch(effect) {

      case 'fade':
        $('#lien_popup').fadeIn('slow');
        break;

      case 'slide':
        $('.lien_readmore').hide(function(){
          $('#lien_popup').slideDown('fast',function(){
            $('.lien_readmore').fadeIn();
          });
        });
        break;

      case 'zoom':
        $('#lien_says').hide(function(){
          $('#lien_popup').show('slow',function(){
            $('#lien_says').fadeIn();
          });
        });
        break;

      default:
        $('#lien_popup').show();
        break;
    }
  }

}(jQuery));
