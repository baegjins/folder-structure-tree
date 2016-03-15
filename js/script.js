$(document).ready(function () {

    // VAR DECLARATION
    var sidebar = $('#sidebar'), doc = $(document);
    var selectedEl, pos, posLeft, posTop;
    var selectedItemPath, targetPath;

    // This timeout, started on mousedown, triggers the beginning of a hold
    var holdStarter = null;
    // This is how many milliseconds to wait before recognizing a hold
    var holdDelay = 250;
    // This flag indicates the user is currently holding the mouse down
    var holdActive = false;
    var mover = false;

    var lastSelectedDisk = localStorage.getItem('disk');

    // show loading animation
    sidebar.html('<ul class="filetree start"><li class="wait">' + 'Generating Tree...' + '<li></ul>');

    if (lastSelectedDisk){
        $('.disks').val(lastSelectedDisk);
        getfilelist(sidebar, lastSelectedDisk + ':/');
    } else {
        getfilelist(sidebar, $('.disks option').eq(0).val() + ":/");
    }

    // FUNCTIONS
    function getfilelist(cont, root) {
        $(cont).addClass('wait');

        $.ajax({
            url: 'folderTree.php',
            method: 'POST',
            data: {
                dir: root
            },
            success: function (data) {
                $(cont).find('.start').html('');
                $(cont).removeClass('wait').append(data);
                $(cont).find('ul:hidden').slideDown({
                    duration: 500,
                    easing: null
                });
                selectedEl = undefined;
            }
        });
    }

    function clickFn() {
        var entry = $(this);

        if (entry.hasClass('folder')) {
            if (entry.hasClass('collapsed')) {
                entry.find('ul').remove();
                getfilelist(entry, escape($(this).find('a').attr('rel')));
                entry.removeClass('collapsed').addClass('expanded');
            } else {
                entry.find('ul').slideUp({
                    duration: 500,
                    easing: null
                });
                entry.removeClass('expanded').addClass('collapsed');
            }
        }
        return false;
    }

    function diskChangeFn() {
        sidebar.html('');
        getfilelist(sidebar, $(this).val() + ':/');
    }

    function mouseDownFn(e) {
        e.stopPropagation();
        selectedEl = this;
        selectedItemPath = $(this).find('a').attr('rel');

        holdStarter = setTimeout(function () {
            if(selectedEl){
                pos = $(selectedEl).parent().offset(),
                posLeft = pos.left,
                posTop = pos.top;

                doc.on('mousemove', '#sidebar', mouseMoveFn);
                holdStarter = null;
                holdActive = true;
            }
        }, holdDelay);
    }

    function mouseUpFn(e) {
        e.stopPropagation();

        if (selectedItemPath) {
            if (holdStarter) {
                clearTimeout(holdStarter);
            } else if (holdActive) {
                holdActive = false;
                targetPath = $(this).find('a').attr('rel');

                $.ajax({
                    method: 'POST',
                    url: './index.php',
                    data: {
                        'selectedItemPath': selectedItemPath,
                        'targetPath': targetPath
                    },
                    success: function () {
                        localStorage.setItem('disk', $('.disks').val());
                        sidebar.html('');
                        getfilelist(sidebar, lastSelectedDisk + ':/');
                    }
                });
            }
        }

        if (selectedEl) {
            $(selectedEl).removeAttr('style');
            selectedEl = undefined;
        }
    }

    function mouseMoveFn(e) {
        e.stopPropagation();
        if(selectedEl){
            $(selectedEl).css('position', 'absolute');
            $(selectedEl).css('left', e.pageX - posLeft + 10 + 'px');
            $(selectedEl).css('top', e.pageY - posTop + 10 + 'px');
        }
    }

    // EVENTS
    $('.disks').change(diskChangeFn);

    sidebar.on('click', 'li', clickFn);

    sidebar.on('mousedown', 'li', mouseDownFn);

    sidebar.on('mouseup', 'li', mouseUpFn);

    sidebar.on('mouseup mouseleave', function () {
        if (selectedEl) {
            $(selectedEl).removeAttr('style');
            selectedEl = undefined;
        }
    });
});
