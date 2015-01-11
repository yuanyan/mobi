define(function(){
    var showEvent = 'show:drawer';
    var hideEvent = 'hide:drawer';
    var tapEvent = 'tap';

    var LEFT = 'left';
    var RIGHT = 'right';

    function Drawer(element, options){
        this.$element  = $(element);
        this.dragging = false;
        this.startX = this.lastX = this.offsetX = this.newX = null;
        this.options = options
    }

    Drawer.DEFAULTS = {
        show: true,
        thresholdX: 20,        // How far to drag before triggering
        edgeX: 60,             // How far from edge before triggering
        side: LEFT,
        transitionSpeed: 0.3,
        easing: 'ease'
    };

    Drawer.prototype.toggle = function () {
        return this[!this.isShown ? 'show' : 'hide']()
    };

    Drawer.prototype.show = function(){
        var e  = $.Event(showEvent);
        this.$element.trigger(e);
        if (this.isShown || e.isDefaultPrevented()) return;
        this.isShown = true;
        var options = this.options;
        var side = options.side;

        var width = this.$element.width();
        var that = this;
        requestAnimationFrame(function() {
            that.transitionX(width);
        });

    };

    Drawer.prototype.hide = function(){
        var e = $.Event(hideEvent);
        this.$element.trigger(e);
        if (!this.isShown || e.isDefaultPrevented()) return;
        this.isShown = false;
        var options = this.options;
        var side = options.side;

        var that = this;
        requestAnimationFrame(function() {
             that.transitionX(0);
        });

    };

    Drawer.prototype.translateX = function(x){
        var dragger = this.dragger;
        dragger.style.transform = dragger.style.webkitTransform = 'translate3d(' + x + 'px, 0, 0)';
    };

    Drawer.prototype.transitionX = function(x){
        var options = this.options;
        var dragger = this.dragger;
        dragger.style.transition = dragger.style.webkitTransition = 'all ' + options.transitionSpeed + 's ' + options.easing;
        this.translateX(x);
    };

    Drawer.prototype.drag = function(dragger, e) {
        if(e.defaultPrevented) {
            return;
        }

        this.dragger = dragger;
        var draggerWidth = dragger.clientWidth;

        var options = this.options;
        var edgeX = options.edgeX;
        var thresholdX = options.thresholdX;

        var side = options.side;
        var towards = side == LEFT? RIGHT: LEFT;

        if(!this.startX) {
            this.startX = e.touches[0].pageX;
            console.log('startX:', this.startX)
        }

        this.lastX = e.touches[0].pageX;

        if(!this.dragging) {
            console.log(this.startX < edgeX, Math.abs(this.lastX - this.startX) > thresholdX)

            if(!this.isShown &&
                // Dragged 15 pixels and finger is by edge
                (
                    (towards == RIGHT && this.startX < edgeX) ||
                    (towards == LEFT && this.startX > (draggerWidth - edgeX))
                )&&
                Math.abs(this.lastX - this.startX) > thresholdX ){

                this.dragging = true;
                this.offsetX = this.lastX - this.startX;

                console.log('Starting drag');
                console.log('Offset:', this.offsetX);

            }else if(this.isShown && Math.abs(this.lastX - this.startX) > thresholdX){
                this.dragging = true;
            }

        } else {
            var newX = this.newX = this.lastX - this.startX - this.offsetX;

            if(this.isShown){
                var width = this.$element.width();
                newX = width + newX;
            }

            var that = this;
            console.log('newX:', newX);
            requestAnimationFrame(function() {
                that.translateX(newX)
            });

        }

        if(this.dragging) {
            e.preventDefault();
        }
    };

    Drawer.prototype.stop = function(dragger, e) {

        this.startX = null;
        this.lastX = null;
        this.offsetX = null;

        if(!this.dragging) {
            return;
        }

        this.dragging = false;

        var options = this.options;
        var side = options.side;
        var towards = side == LEFT? RIGHT: LEFT;

        console.log('End drag');

        var width = this.$element.width();

        if(Math.abs(this.newX) > width/2){  // halfway
            this.isShown? this.hide(): this.show();
        } else {
            var that = this;
            requestAnimationFrame(function() {
                that.isShown?
                that.transitionX(towards == RIGHT? width: -width):
                that.transitionX(0)
            });
        }
    };


    $.fn.drawer = function(option, dragger, event) {

        return this.each(function () {
            var $this   = $(this);
            var data    = $this.data('drawer');
            var options = $.extend({}, Drawer.DEFAULTS, $this.data(), typeof option == 'object' && option);

            if (!data) {
                data = new Drawer(this, options);
                $this.data('drawer', data);
            }
            if (typeof option == 'string') data[option](dragger, event);
            else if (options.show) data.show(dragger)
        })
    };

    $(document).on(tapEvent, '[data-toggle="drawer"]', function (e) {

        var $this   = $(this);
        var $target = $($this.attr('data-target'));
        var option  = $target.data('drawer') ? 'toggle' : $.extend({}, $target.data(), $this.data());

        if ($this.is('a')) e.preventDefault();

        $target.drawer(option, this)
    });

    $(document).on('tap touchstart touchmove touchend', '[data-dragger="drawer"]', function (e) {

        var $this   = $(this);
        var $target = $($this.attr('data-target'));

        if ($this.is('a')) e.preventDefault();

        var type = e.type;

        if(type== 'touchstart' || type == 'touchmove'){
            $target.drawer('drag', this, e)
        }else if(type == 'touchend'){
            $target.drawer('stop', this, e)
        }

        if(type == 'tap'){
            $target.drawer('hide', this, e)
        }

    })

})
