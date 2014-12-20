// https://developers.google.com/mobile/articles/webapp_fixed_ui
// https://github.com/filamentgroup/Overthrow/
// http://bradfrostweb.com/blog/mobile/fixed-position/

define(['./os', './event'], function(){

    var os = $.os;
    function scrollFix() {

        $('.js-no-bounce').on('touchmove', function(event){
            event.preventDefault();
        });

        var $scene = $('.ui-scene');
        var $content = $('.ui-scene-content', $scene);
        if(!$content[0] || !$scene[0]) return;

        // Variables to track inputs
        var startTopScroll;

        // Handle the start of interactions
        $(document).on('touchstart', '.ui-scene', function(event){
            var scene = event.currentTarget;
            startTopScroll = scene.scrollTop;

            if(startTopScroll <= 0)
                scene.scrollTop = 1;

            if(startTopScroll + scene.offsetHeight >= scene.scrollHeight)
                scene.scrollTop = scene.scrollHeight - scene.offsetHeight - 1;

        }).on('touchmove', '.ui-scene', function(event){
                var scene = event.currentTarget;
                // TODO cache element select
                var content = scene.querySelector('.ui-scene-content');
                // Offset value have include content and border
                if( content.offsetHeight < scene.clientHeight ||
                    content.offsetWidth < scene.clientWidth){
                    // your element have overflow
                    return event.preventDefault();
                }
            })
    }

    // Add ScrollFix only for iOS
    if(os.ios >= 5 ) {
        scrollFix();
    }else{
        var html = document.documentElement;
        html.className = html.className + ' ' + 'js-no-overflow-scrolling';
    }
});
