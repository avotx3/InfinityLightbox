(function ( $ )
{

    var InfinityLightbox = function(element, options)
    {
        var wHeight,wWidth,aspect,origWidth,origHeight,
            $this,image,images,number,direction,originalPosition;

        $this = $(element);

        var template = '<div id="lightbox-overlay">'
                    +'<div id="lightbox-close"></div>'
                    +'<div id="img-wrapper">'
                    +'<div id="left-control">'
                    +'<div class="arrow left"></div></div>'
                    +'<div id="img"></div>'
                    +'<div id="right-control">'
                    +'<div class="arrow right"></div></div>'
                    +'<div id="helper">'
                    +'<div id="helper-text"></div>'
                    +'</div></div>'
                    +'<div id="img-loading"><div class="spinner">'
                    +'<div class="bounce1"></div>'
                    +'<div class="bounce2"></div>'
                    +'<div class="bounce3"></div>'
                    +'</div></div></div>';

        var isMobile = {
            Android: function() {
                return navigator.userAgent.match(/Android/i);
            },
            BlackBerry: function() {
                return navigator.userAgent.match(/BlackBerry/i);
            },
            iOS: function() {
                return navigator.userAgent.match(/iPhone|iPad|iPod/i);
            },
            Opera: function() {
                return navigator.userAgent.match(/Opera Mini/i);
            },
            Windows: function() {
                return navigator.userAgent.match(/IEMobile/i);
            },
            any: function() {
                return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
            }
        };

        images = [];

        number = 0;
        
        var settings = $.extend({
            caption1: 'Изображение',
            caption2: 'из',
            margin: 100,
            marginMobile: 10,
            speed1: 200,
            speed2: 200,
            helper: true,
            helperType: 'number',
            animateImage: function(width, height, margin, direction)
            {
                var box = $('#img-wrapper');

                if( box.width() == Math.floor(width) && box.height() == Math.floor(height))
                {
                    $('#img-loading').hide();
                    $('#img > img').css({'opacity': 1});
                } else {
                    box.css(
                        {'margin-top': margin, 'width': Math.floor(width), 'height': Math.floor(height)}
                    )
                    .on('webkitTransitionEnd transitionend oTransitionEnd otransitionend MSTransitionEnd', function()
                    {
                        $('#img-loading').hide();
                        $('#img > img').css({'opacity': 1});
                    });
                }
            },
            clearBox: function(direction)
            {
                $('#img > img').css({'opacity': 0}).parent().empty();
            }
        }, options || {});

        var resize = function()
        {
            direction = '';
            var margin = $('#img > img').attr('data-margin');
            imageProcess($('#img > img').get(0), margin);
        }

        var prev = function()
        {
            var context = $('#img > img').attr('data-context');
            var link = $('#'+context+' a[data-img="'+$('#img > img').attr('src')+'"]').prev();
            link.children('img').data('direction', 'prev');
            link.children('img').click();
            $(document).trigger('infinity-prev');
        }

        var next = function()
        {
            var context = $('#img > img').attr('data-context');
            var link = $('#'+context+' a[data-img="'+$('#img > img').attr('src')+'"]').next();
            link.children('img').data('direction', 'next');
            link.children('img').click();
            $(document).trigger('infinity-next');
        }

        var close = function()
        {
            $this.find('a > img').data('direction', '');
            $('#lightbox-overlay').hide();
            $('body').css({'overflow-y':'scroll'});
            $(document).trigger('infinity-close');
        }

        var transition = function(speed)
        {
            return {
                    '-webkit-transition': 'all '+speed+'ms ease 0s',
                    '-moz-transition': 'all '+speed+'ms ease 0s',
                    '-o-transition': 'all '+speed+'ms ease 0s',
                    'transition': 'all '+speed+'ms ease 0s'
                }
        }

        var keydown = function(e)
        {
            if( e.keyCode === 37 )
            {
                prev();
            } else if( e.keyCode === 39 ) {
                next();
            }
        }

        var imageProcess = function(image, margin)
        {
            var aspect,marginTop,imgWidth,imgHeight,
                imgTrans  = transition(settings.speed2);

            aspect = image.width / image.height;

            wWidth = $(window).width()-margin*2-8;
            wHeight = $(window).height()-margin*2-8;

            if( wWidth > wHeight )
            {
                imgHeight = wHeight;
                imgWidth = imgHeight*aspect;
            } else {
                imgWidth = wWidth;
                imgHeight = imgWidth/aspect;
            }

            marginTop = (-1)*imgHeight/2-4;
            
            $(image)
            .css({'opacity': 0})
            .attr('data-aspect', aspect)
            .attr('data-margin', margin)
            .attr('data-context', $this.context.id)
            .css(imgTrans);
            $('#img')
            .empty()
            .append(image);

            settings.animateImage(imgWidth, imgHeight, marginTop, direction);
        }

        $this.data('settings', settings);
        
        if( $('#lightbox-overlay').length == 0 )
        {
            $('body').append(template);
        }

        if( $this.attr('id') == null )
        {
            var uniqueNum = Math.floor( Math.random()*99 );
            $this.attr('id', 'infinityLightbox'+uniqueNum);
        }

        $this.find('a[data-img]').click(function(e)
        {

            var settings = $this.data('settings'),
                links;

            $('#img-wrapper, #img').css(transition(settings.speed1));

            direction = $(e.target).data('direction') || '';

            $(document).trigger('infinity-open');

            wHeight = $(window).height();
            wWidth = $(window).width();

            e.preventDefault();
            e.stopPropagation ? e.stopPropagation() : (e.cancelBubble=true);

            $('body').css({'overflow':'hidden'});

            if( isMobile.any() )
            {
                $('#left-control, #right-control').addClass('mobile');
                $('#lightbox-overlay').css({'background-color':'#000'});
                $('#lightbox-close').show();
            }

            $('#right-control, #left-control').css({'opacity': '1'}).show();

            settings.clearBox(direction);
            $('#lightbox-overlay').show();
            $('#img-loading').show();
            $('#helper').show();

            links = $this.find('a[data-img]');

            number = links.index($(e.target).parent('a'));
            if( number === -1 )
            {
                number = links.index($(e.target));
            }
            length = links.length;

            if(number == length-1)
            {
                $('#right-control').css({'opacity': '0'}).hide();
            }
            if(number == 0)
            {
                $('#left-control').css({'opacity': '0'}).hide();
            }
            if( settings.helper === true )
            {
                if( settings.helperType == 'number' )
                {
                    $('#helper-text').text(settings.caption1+' '+(number+1)+' '+settings.caption2+' '+length);
                } else if( settings.helperType == 'alt' ) {
                    var alt = $(e.target).attr('alt') || '';
                    if( alt !== '' )
                    {
                        $('#helper-text').text(alt);
                    } else {
                        $('#helper').hide();
                    }
                }
            } else {
                $('#helper').hide();
            }

            if( isMobile.any() )
            {
                margin = settings.marginMobile;
            } else {
                margin = settings.margin;
            }

            if( images[number] != null )
            {
                imageProcess(images[number], margin);
            } else {
                image = new Image();
                image.src = $(links.get(number)).attr('data-img');
                $(image).load(function(){
                    images[number] = image;
                    imageProcess(image, margin);
                });
            }
            
            $(window).off('resize', resize);

            $(window).on('resize', resize);


            $(document).off('keydown', keydown);

            $(document).on('keydown', keydown);

        });   

        $('#right-control').unbind('click');
        
        $('#right-control').click(next);

        $('#left-control').unbind('click');

        $('#left-control').click(prev);

        $('#img').off('touchmove');
        $('#img').off('touchstart');

        $('#img').on('touchstart', function(e)
        {
            var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
            originalPosition = touch.clientX;
        })

        $('#img').on('touchmove', function(e)
        {

            var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
            var x = touch.clientX,
                dx;

            dx = Math.abs( x - originalPosition );

            if( dx > $(window).width()*0.05 )
            {
                var dirx = ( x > originalPosition ) ? "right" : "left";
                if( dirx == 'right' )
                {
                    prev();
                } else {
                    next();
                }
            }

        });

        $('#lightbox-overlay').click(function(e)
        {
            if($(e.target).attr('id') === 'lightbox-overlay')
            {
                close();
            }
        });

        $('#lightbox-close').click(close);
    };

    $.fn.infinityLightbox = function(options)
    {
        return this.each(function()
        {
            var element = $(this);

            if (element.data('infinityLightbox')) return;

            var infinityLightbox = new InfinityLightbox(this, options);

            element.data('infinityLightbox', infinityLightbox);
        });
    };

}( jQuery ));