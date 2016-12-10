/*----------------------------------------------
        1. Slick Using
-----------------------------------------------*/

$(document).ready(function () {

    $('.slider-for').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        fade: true,
        draggable: false,
        adaptiveHeight: true,
        asNavFor: '.slider-nav'
    });
    
    $('.slider-nav').slick({
        slidesToShow: 6,
        slidesToScroll: 1,
        asNavFor: '.slider-for',
        infinite: false,
        swipeToSlide: true,
        responsive: [
        {
            breakpoint: 992,
            settings: {
                slidesToShow: 3,
                slidesToScroll: 1
            }
        },
        {
            breakpoint: 768,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 1
            }
        }
        ],
        focusOnSelect: true
    });
});

/*-----------------------------------------------------
            2. Portfolio
------------------------------------------------------*/

/*----------------------  2.1 Using mixitup for filtering  -----------------*/

$(document).ready(function () {
    var $container = $('#portfolioItems'),
        $controls = $('.controls');

    $container.mixItUp({
        controls: {
            enable: false
        }
    });

    $controls.on('click', '.filter', function(){
        var $btn = $(this),
        filter = $btn.attr('data-filter');
    
        $btn.addClass('active').siblings().removeClass('active');

        $container.mixItUp('filter', 'none', function(){
            $container.mixItUp('filter', filter);
        });
    });
});

/*------------------ 2.2 portfolio items hover-style ---------------------*/

$(document).ready(function () {
    $('.portfolio-item > .item-img').each( function() {
        $(this).hoverdir({
            hoverDelay : 50
        }); 
    });
    $(".portfolio-item > .item-img").hover(function() {
        $(this).find("a").css("box-shadow", "0px 0px 15px #b6b5b5");
    }, function() {
        $(this).find("a").css("box-shadow", "none");
    });
});

/*---------------  2.3 portfolio items are zoomed by nivo lightbox  -----------*/

$(document).ready(function () {
    $('.item-zoom').nivoLightbox({
        type:'inline',
    });

    $('#videoBtn').nivoLightbox({
        beforeHideLightbox: function(){
            $(".nivo-lightbox-content iframe").remove();
        }
    });
});


/*------------------------------------------
            3. Contact form
------------------------------------------*/

$(document).ready(function () {

    $("#contactForm").submit(function(e){

        e.preventDefault();

        var postData        = $(this).serializeArray(),
            formURL         = $(this).attr("action"),
            $cfResponse     = $('#contactFormResponse'),
            $cfsubmit       = $("#cfsubmit"),
            cfsubmitText    = $cfsubmit.text();

        $cfsubmit.text("Sending...");


        $.ajax(
            {
                url : formURL,
                type: "POST",
                data : postData,
                success:function(data)
                {
                    $cfResponse.html(data);
                    $cfsubmit.fadeOut(1000);
                    $( '#contactForm' ).each(function(){
                        this.reset().fadeOut(1000);
                    });
                },
                error: function(data)
                {
                    alert("Error occurd! Please try again");
                }
            });

        return false;

    });
});

/*-----------------------------------------
            Preloader
--------------------------------------------*/

$(document).ready(function() {
    
    setTimeout(function(){
        $('body').addClass('loaded');
    }, 3000);
    
});

/*-----------------------------------------
            wow initialization
--------------------------------------------*/

$(document).ready(function() {
    new WOW().init();
});