(function ( $ )
{

    var InfinityLightbox = function(element, options)
    {
        var wHeight,wWidth,aspect,origWidth,origHeight,
            $this,image,images,number,direction,originalPosition;

        $this = $(element);

        var template = '<div id="inflo">'
                    +'<div id="inflc"></div>'
                    +'<div id="infllc">'
                    +'<div class="arrow left"></div></div>'
                    +'<div id="inflrc">'
                    +'<div class="arrow right"></div></div>'
                    +'<div id="infliw">'
                    +'<div id="infli"></div>'
                    +'<div id="inflh">'
                    +'<div id="inflht"></div>'
                    +'</div></div>'
                    +'<div id="inflil"><div class="spinner">'
                    +'<div class="bounce1"></div>'
                    +'<div class="bounce2"></div>'
                    +'<div class="bounce3"></div>'
                    +'</div></div></div>';

        var byId = function(id)
        {
            return $(document.getElementById(id));
        };

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
            caption: 'Изображение $a из $b',
            margin: 100,
            marginMobile: 10,
            speed1: 200,
            speed2: 200,
            helper: true,
            helperType: 'number',
            animateImage: function(width, height, margin, direction)
            {
                var box = byId('infliw');

                if( box.width() == Math.floor(width) && box.height() == Math.floor(height) )
                {
                    byId('#inflil').hide();
                    $('#infli > img').css({'opacity': 1});
                } else {
                    box.css(
                        {'margin-top': margin, 'width': Math.floor(width), 'height': Math.floor(height)}
                    )
                    .on('webkitTransitionEnd transitionend oTransitionEnd otransitionend MSTransitionEnd', function()
                    {
                        byId('inflil').hide();
                        $('#infli > img').css({'opacity': 1});
                    });
                }
            },
            clearBox: function(direction)
            {
                var img = $('#infli > img');
                if(img != null && img != 'underfined')
                {
                    img.css({'opacity': 0});
                    byId('infli').empty();
                }
            }
        }, options || {});

        var resize = function()
        {
            direction = '';
            var margin = $('#infli > img').attr('data-margin');
            imageProcess($('#infli > img').get(0), margin);
        }

        var prev = function()
        {
            var context = $('#infli > img').attr('data-context');
            var link = $('#'+context+' a[data-img="'+$('#infli > img').attr('src')+'"]').prev();
            link.children('img').data('direction', 'prev');
            link.children('img').click();
            $(document).trigger('infinity-prev');
        }

        var next = function()
        {
            var context = $('#infli > img').attr('data-context');
            var link = $('#'+context+' a[data-img="'+$('#infli > img').attr('src')+'"]').next();
            link.children('img').data('direction', 'next');
            link.children('img').click();
            $(document).trigger('infinity-next');
        }

        var close = function()
        {
            $this.find('a > img').data('direction', '');
            $('#inflo').hide();
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

            if( imgWidth > wWidth )
            {
                imgWidth = wWidth;
                imgHeight = imgWidth/aspect;
            } else if( imgHeight > wHeight )
            {
                imgHeight = wHeight;
                imgWidth = imgHeight*aspect;
            }

            marginTop = (-1)*imgHeight/2-4;
            
            $(image)
            .css({'opacity': 0})
            .attr('data-aspect', aspect)
            .attr('data-margin', margin)
            .attr('data-context', $this.context.id)
            .css(imgTrans);
            byId('infli')
            .empty()
            .append(image);

            settings.animateImage(imgWidth, imgHeight, marginTop, direction);
        }

        $this.data('settings', settings);
        
        if( byId('inflo').length == 0 )
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

            $('#infliw, #infli').css(transition(settings.speed1));

            direction = $(e.target).data('direction') || '';

            $(document).trigger('infinity-open');

            e.preventDefault();
            e.stopPropagation ? e.stopPropagation() : (e.cancelBubble=true);

            $('body').css({'overflow':'hidden'});

            if( isMobile.any() )
            {
                $('#infllc, #inflrc').addClass('mobile');
                byId('inflo').css({'background-color':'#000'});
                byId('inflc').show();
            }

            $('#inflrc, #infllc').css({'opacity': '1'}).show();

            settings.clearBox(direction);

            byId('inflo').show();
            byId('inflil').show();
            byId('inflh').show();

            links = $this.find('a[data-img]');

            number = links.index($(e.target).parent('a'));
            if( number === -1 )
            {
                number = links.index($(e.target));
            }
            length = links.length;

            if(number == length-1)
            {
                $('#inflrc').css({'opacity': '0'}).hide();
            }
            if(number == 0)
            {
                $('#infllc').css({'opacity': '0'}).hide();
            }
            if( settings.helper === true )
            {
                if( settings.helperType == 'number' )
                {
                    $('#inflht').text(settings.caption.replace('$a', (number+1)).replace('$b', length));
                } else if( settings.helperType == 'alt' ) {
                    var alt = $(e.target).attr('alt') || '';
                    if( alt !== '' )
                    {
                        byId('inflht').text(alt);
                    } else {
                        byId('inflh').hide();
                    }
                }
            } else {
                byId('inflh').hide();
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
                image.src = links[number].getAttribute('data-img');
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

        byId('inflrc').off('click');
        
        byId('inflrc').on('click', next);

        byId('infllc').off('click');

        byId('infllc').on('click', prev);

        byId('infli').off('touchmove');
        byId('infli').off('touchstart');

        byId('infli').on('touchstart', function(e)
        {
            var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
            originalPosition = touch.clientX;
        })

        byId('infli').on('touchmove', function(e)
        {

            var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
            var x = touch.clientX,
                dx;

            dx = ( x > originalPosition ) ? 'right' : 'left';

            if( dx === 'right' )
            {
                prev();
            } else {
                next();
            }

        });

        byId('inflo').click(function(e)
        {
            if($(e.target).attr('id') === 'inflo')
            {
                close();
            }
        });

        byId('inflc').click(close);
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

}) ( window.jQuery);