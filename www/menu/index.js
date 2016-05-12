/**
 * Created by egorov on 10.04.2015.
 */
s('.template-menu').pageInit(function (menu) {
    // Save block to value
    var subMenuBlock = s('.template-sub-menu');

    // Size window with open sub-menu
    var windowSubMenuWidth = 1000;

    var collapse2 = s('.collapser').click(function (clicked) {
        subMenuBlock.toggleClass('collapsed');
    });

    // Automatic hidden sub-menu
    automaticHiddenSubMenu(subMenuBlock, windowSubMenuWidth);

    // added animation to left (big) menu
    var bigMenu = $('.template-menu');

    bigMenu.mouseleave(function () {
        bigMenu.addClass('minimized');
    });

    // Mobile menu
    s('#mobile-menu-button').click(function(btn){
        btn.toggleClass('open');
        s('.template-menu').toggleClass('open');
        s('body').toggleClass('mobile-open');
    });

    bigMenu.mouseenter(function () {
        bigMenu.removeClass('minimized');

        s('.text').css('display', 'block');
        templateMenuSliderInit(s('.template-menu-list'));
    });
    
    // if there is no submenu add class for current active item
    if (s('.template-sub-menu').length == 0) {
        s('.active', menu).addClass('active-without-submenu');
    }
});

s('body').pageInit(function(){
    tilesInit();
    window.onresize = function(event) {
        tilesInit();
    };
});

var initContentWidth = function() {
    var elem = s('#content');
    var table = s('.table2');
    if (elem.width() < table.elements[table.elements.length-1].width()) {
        s('.table-switcher').hide();
        table.elements[table.elements.length-1].removeClass('default');
        table.elements[table.elements.length-1].addClass('tiles');
    }
};

var tilesInit = function() {
    var table = s('.table2');
    if (window.innerWidth < 768) {
        table.addClass('mobile-version');
    } else {
        table.removeClass('mobile-version');
        if(table.elements !== null) {
            initContentWidth();
        }
    }
};

/**
 * Function which automatic hidden sub-menu
 * @param subMenuBlock - DOM element
 * @param windowWidth - window size with open sub-menu
 */
var automaticHiddenSubMenu = function(subMenuBlock, windowWidth) {
    // After window resize
    s(window).resize(function() {
        if (innerWidth < windowWidth && !subMenuBlock.hasClass('collapsed')) {
            subMenuBlock.toggleClass('collapsed');
        }
    });

    // If window width smaller value - hide submenu
    if (innerWidth < windowWidth) {
        subMenuBlock.toggleClass('collapsed');
    }
};
