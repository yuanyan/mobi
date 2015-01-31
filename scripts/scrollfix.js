// https://developers.google.com/mobile/articles/webapp_fixed_ui
// https://github.com/filamentgroup/Overthrow/
// http://bradfrostweb.com/blog/mobile/fixed-position/

define(['./os'], function(){

    var os = $.os;
    function scrollFix() {

        $('.no-bounce').on('touchmove', function(event){
            event.preventDefault();
        });

        var $scene = $('app-scene');
        var $content = $('app-scene-content', $scene);
        if(!$content[0] || !$scene[0]) return;

        // Variables to track inputs
        var startTopScroll;

        // Handle the start of interactions
        $(document).on('touchstart', 'app-scene', function(event){
            var scene = event.currentTarget;
            startTopScroll = scene.scrollTop;

            if(startTopScroll <= 0)
                scene.scrollTop = 1;

            if(startTopScroll + scene.offsetHeight >= scene.scrollHeight)
                scene.scrollTop = scene.scrollHeight - scene.offsetHeight - 1;

        }).on('touchmove', 'app-scene', function(event){
                var scene = event.currentTarget;
                // TODO cache element select
                var content = scene.querySelector('app-scene-content');
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
        html.className = html.className + ' ' + 'no-overflow-scrolling';
    }
});
