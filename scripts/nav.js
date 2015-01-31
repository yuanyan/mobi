define(['./transition'], function(){

    var backTransitionMap  = {
        'slide-in'  : 'slide-out',
        'slide-out' : 'slide-in',
        'fade'       : 'fade',
        'fade-expand': 'fade',
        'fade-contract' : 'fade'
    };

    var forwardStack = [];

    var translate = function ($to, $from, transition, complete) {

        var enter = /in$/.test(transition);

        var toDirection  = enter ? 'right' : 'left';
        var fromDirection = enter ? 'left' : 'right';

        if (transition === 'fade') {
            $from.addClass('in')
               .addClass('fade');

            $to.addClass('fade');
        }

        if (/slide/.test(transition)) {
            $to.addClass('sliding-in')
                .addClass(toDirection)
                .addClass('sliding');

            $from.addClass('sliding');
        }

        $to.addClass('active');

        if (!transition) {
            if (complete) {
                complete();
            }
        }

        if (transition === 'fade') {
            $from[0].offsetWidth; // force reflow
            $from.removeClass('in');

            var fadeFromEnd = function () {
                $from.off($.support.transition.end, fadeFromEnd);

                $to.addClass('in')
                    .on($.support.transition.end, fadeToEnd)
                    .emulateTransitionEnd(300);
            };
            var fadeToEnd = function () {
                $to.off($.support.transition.end, fadeToEnd)
                   .removeClass('fade')
                   .removeClass('in');

                $from.removeClass('active');

                if (complete) {
                    complete();
                }
            };

            $from.on($.support.transition.end, fadeFromEnd)
                .emulateTransitionEnd(300);

        }

        if (/slide/.test(transition)) {

            var slideEnd = function () {
                $to.off($.support.transition.end, slideEnd)
                    .removeClass('sliding')
                    .removeClass('sliding-in')
                    .removeClass(toDirection);

                $from.removeClass('active')
                    .removeClass('sliding');

                if (complete) {
                    complete();
                }
            };

            $from[0].offsetWidth; // force reflow
            $from.addClass(fromDirection);

            $to[0].offsetWidth; // force reflow
            $to.removeClass(toDirection)
                .on($.support.transition.end, slideEnd)
                .emulateTransitionEnd(300);
        }

        document.body.offsetHeight; // force reflow to prevent scroll
    };

    var FORWARD = 'forward';

    $.fn.nav = function(option){
        option = option || {};

        return this.each(function () {
            var $this = $(this);
            var direction = option.direction || $this.attr('data-direction') || FORWARD;
            var $from;
            var $to;
            var transition;

            if(direction === FORWARD){
                $from = option.from || $this.parents('app-scene');
                $to = option.to || $($this.attr('data-nav'));
                transition = option.transition || $this.attr('data-transition') || 'slide-in';
                forwardStack.push({
                    id: +new Date,
                    transition: transition,
                    $from: $from,
                    $to: $to
                });
            }else{
                var state = forwardStack.pop();
                $from = state.$to;
                $to = state.$from;
                transition = backTransitionMap[state.transition];
            }

            translate(
                $to,
                $from,
                transition,
                function () {
                    var $back = $('.back');
                    if(forwardStack.length)
                        $back.addClass('active');
                    else
                        $back.removeClass('active');                }
            );

        })
    }

    $(document).on('tap', '[data-nav]', function (e) {
        e.preventDefault();
        $(this).nav();
    })

    $(document).on('tap', '.back', function (e) {
        e.preventDefault();
        $(this).nav({
            direction: 'back'
        });
    })


})