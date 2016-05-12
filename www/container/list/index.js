/**
 * Created by egorov on 10.04.2015.
 */
/**
 *
 * @param table DOM table element
 * @param pager
 * @param sizeBlock
 * @param asyncCompleteHandler External handler after async table rendering
 * @param custom_pager
 * @param customResponse response for update table
 * @constructor
 */
function templateList(table, pager, sizeBlock, asyncCompleteHandler, custom_pager, customResponse) {

    var completeHandler = asyncCompleteHandler !== undefined ? asyncCompleteHandler : false;

    /** Event: Publish/unpublish material */
    function publish(obj) {
        // ������� �������������
        if (confirm(obj.a('title'))) {
            // Perform ajax request and update JS on success
            s.ajax(s('a.publish_href', obj.parent()).a('href'), init, FormData, function() {
                loader.hide();
            }, function() {
                // Create generic loader
                var loader = new Loader(table);

                // Show loader with i18n text and black bg
                loader.show('', true);
                return true;
            });
        }
    }

    /** Event: Remove material */
    function remove(obj) {
        if (confirm(obj.a('title'))) {
            s.ajax(obj.a('href'), init, FormData, function() {
                loader.hide();
            }, function() {
                // Create generic loader
                var loader = new Loader(table);

                // Show loader with i18n text and black bg
                loader.show('', true);
                return true;
            });
        }
    }

    /** Event: Copy material */
    function copy(obj) {
        if (confirm(obj.a('title'))) s.ajax(obj.a('href'), init);
    }

    function init(serverResponse) {
        // If we have response from server
        if (serverResponse) try {
            // Parse JSON response
            serverResponse = JSON.parse(serverResponse);
            
            if (serverResponse.error_message) {
                alert(serverResponse.error_message);
            }
        } catch (e) {

        }

        try {

            // TODO: Remove when material app will be updated
            if (serverResponse.table_html) table.html(serverResponse.table_html);
            if (serverResponse.table_pager) pager.html(serverResponse.table_pager);
            if (serverResponse.table_sizeBlock) sizeBlock.html(serverResponse.collection_sizeBlock);

            // If we have collection html - update it
            if (serverResponse.collection_html) table.html(serverResponse.collection_html);
            if (serverResponse.collection_pager) pager.html(serverResponse.collection_pager);
            if (serverResponse.collection_sizeBlock) sizeBlock.html(serverResponse.collection_sizeBlock);
            
            if (completeHandler) {
                completeHandler(table, pager);
            }
        } catch (e) {

        }

        

        // If we have successful event response or no response at all(first init)
        if (!serverResponse || (serverResponse && serverResponse.status)) {
            // Add fixed header to materials table
            table.fixedHeader('.table2-header-row', '.table2-body');

            // Bind publish event
            s('input#published', table).click(publish, true, true);

            // Bind remove event
            s('a.delete', table).click(remove, true, true);

            s('a.edit', table).tinyboxAjax({
                html : 'html',
                renderedHandler : function(respTxt, tb) {
                    s('.cms_table_form').ajaxSubmit(function(response){
                        tb._close();
                        init(serverResponse);
                    })
                }
            });

            s('.collection-sort-link', table).each(function(link){
                var currentHREF = link.a('href') + link.a('link-attr');
                link.a('href', currentHREF);

                // Create generic loader
                var loader = new Loader(table);

                link.ajaxClick(function(response) {
                    loader.hide();
                    init(response);
                }, function(){
                    // Show loader with i18n text and black bg
                    loader.show('', true);
                    return true;
                });
            });

            custom_pager = (custom_pager === undefined || !custom_pager) ? false : true;
            if (!custom_pager) {
                s('a', pager).each(function(obj) {
                    obj.ajaxClick(function(response) {
                        loader.hide();
                        init(response);
                        tilesInit();
                    }, function(){
                        // Create generic loader
                        var loader = new Loader(table);

                        // Show loader with i18n text and black bg
                        loader.show('', true);
                        return true;
                    });
                });
            }

        }

        (s('.table2-row-notfound', table).length || s('.table2-row-empty', table).length)
            ? s('.table-switcher').hide()
            : s('.table-switcher').css('display', 'inline-block');
    }



    // Cache search field
    //var searchField = s();

    var cmsnav = '0'; //s('#cmsnav_id').val();
    if (s('#cmsnav_id').val().length) {
        cmsnav = s('#cmsnav_id').val();
    }

    // Init table live search
    s('input#search').search(new Array(cmsnav), function(){
        // Create generic loader
        var loader = new Loader(table);
        // Show loader with i18n text and black bg
        loader.show(s('.loader-text').val(), true);
    }, function(response){
        loader.hide();
        init(response);
    });

    // Table view switching
    var switchToTable = s('.icon2-table');
    var switchToBlocks = s('.icon2-th');
    switchToTable.click(function(){
        // Add fixed header to materials table
        table.fixedHeader('.table2-header-row', '.table2-body');
        switchToTable.hide();
        switchToBlocks.show();
        table.removeClass(switchToBlocks.a('tableclass'));
        table.addClass(switchToTable.a('tableclass'));
    });

    switchToBlocks.click(function(){
        s('.__fixedHeaderClone ').remove();
        switchToBlocks.hide();
        switchToTable.show();
        table.removeClass(switchToTable.a('tableclass'));
        table.addClass(switchToBlocks.a('tableclass'));
    });

    // Init table
    init(customResponse);
}


// Check exits .table2
if (s('.table2').length == 0) {
    // if not exits DOM elements .table2 then hang keydown on DOM elements #search
    s('input#search').keydown(function(obj, p, e){
        // if key 'enter'
        if (e.which == 13) {
            // if input symbols quantity more than 2
            if (obj.val().length > 2) {
                // redirect to table with response
                s(location).a('href', obj.a('url')+'0/'+obj.val());
            }
        }
    });
}


// Bind list logic
s('.table2').pageInit(function(table){
    if (!table.hasClass('custom-table2')) {
        templateList(table, s('.table-pager'), s('.sizeSelect'), function() {
            SamsonCMS_Input.update(s('body'));
        });
    }
});
