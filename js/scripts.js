/**
 * File navigation.js.
 *
 * Handles toggling the navigation menu for small screens and enables TAB key
 * navigation support for dropdown menus.
 */
(function () {
    var i, len, focusableElements, firstFocusableElement, lastFocusableElement;

    var container = $('#site-navigation')[0];
    if (!container) {
        return;
    }

    var button = $('#menu-toggle')[0];
    if ('undefined' === typeof button) {
        return;
    }

    // Set vars.
    var html = $('html')[0], body=$('body')[0];
  
    var menu = container.getElementsByTagName('ul')[0];
    var menuWrapper = window.document.getElementById('main-navigation-wrapper');

    // Hide menu toggle button if menu is empty and return early.
    if ('undefined' === typeof menu) {
        button.style.display = 'none';
        return;
    }

    menu.setAttribute('aria-expanded', 'false');
    if (-1 === menu.className.indexOf('nav-menu')) {
        menu.className += ' nav-menu';
    }

    button.onclick = function () {
        if (-1 !== container.className.indexOf('toggled')) {
            closeMenu(); // Close menu.
        } else {
            html.className += ' disable-scroll';
            body.className += ' main-navigation-open';
            container.className += ' toggled';
            button.className += ' toggled';
            button.setAttribute('aria-expanded', 'true');
            menu.setAttribute('aria-expanded', 'true');

            // Set focusable elements inside main navigation.
            focusableElements = container.querySelectorAll([
                'a[href]', 'area[href]', 'input:not([disabled])', 'select:not([disabled])', 'textarea:not([disabled])',
                'button:not([disabled])', 'iframe', 'object', 'embed', '[contenteditable]',
                '[tabindex]:not([tabindex^="-"])'
            ]);
            firstFocusableElement = focusableElements[0];
            if (firstFocusableElement) {
                lastFocusableElement = focusableElements[focusableElements.length - 1];

                // Redirect last Tab to first focusable element.
                lastFocusableElement.addEventListener('keydown',
                    function(e) {
                        if ((e.keyCode === 9 && !e.shiftKey)) {
                            e.preventDefault();
                            button.focus(); // Set focus on first element - that's actually close menu button.
                        }
                    });

                // Redirect first Shift+Tab to toggle button element.
                firstFocusableElement.addEventListener('keydown',
                    function(e) {
                        if ((e.keyCode === 9 && e.shiftKey)) {
                            e.preventDefault();
                            button.focus(); // Set focus on last element.
                        }
                    });
            }
            // Redirect Shift+Tab from the toggle button to last focusable element.
            button.addEventListener('keydown',
                function (e) {
                    if ((e.keyCode === 9 && e.shiftKey)) {
                        e.preventDefault();
                        lastFocusableElement.focus(); // Set focus on last element.
                    }
                });
        }
    };

    // Close menu using Esc key.
    window.document.addEventListener('keyup',
        function (event) {

            if (event.keyCode == 27) {
                if (-1 !== container.className.indexOf('toggled')) {
                    closeMenu(); // Close menu.
                }
            }

        });

    // Close menu clicking menu wrapper area.
    menuWrapper.onclick = function (e) {
        if (e.target === menuWrapper && -1 !== container.className.indexOf('toggled')) {
            closeMenu(); // Close menu.
        }
    };

    // Close menu function.
    function closeMenu() {
        html.className = html.className.replace(' disable-scroll', '');
        body.className = body.className.replace(' main-navigation-open', '');
        container.className = container.className.replace(' toggled', '');
        button.className = button.className.replace(' toggled', '');
        button.setAttribute('aria-expanded', 'false');
        menu.setAttribute('aria-expanded', 'false');
        button.focus();
    }

    // Get all the link elements within the menu.
    var links = menu.getElementsByTagName('a');
    var subMenus = menu.getElementsByTagName('ul');

    // Each time a menu link is focused or blurred, toggle focus.
    for (i = 0, len = links.length; i < len; i++) {
        links[i].addEventListener('focus', toggleFocus, true);
        links[i].addEventListener('blur', toggleFocus, true);
    }

    /**
     * Sets or removes .focus class on an element.
     */
    function toggleFocus() {
        var self = this;

        // Move up through the ancestors of the current link until we hit .nav-menu.
        while (-1 === self.className.indexOf('nav-menu')) {

            // On li elements toggle the class .focus.
            if ('li' === self.tagName.toLowerCase()) {
                if (-1 !== self.className.indexOf('focus')) {
                    self.className = self.className.replace(' focus', '');
                } else {
                    self.className += ' focus';
                }
            }

            self = self.parentElement;
        }
    }

    /**
     * Toggles `focus` class to allow submenu access on tablets.
     */
    (function (container) {
        var touchStartFn,
            i,
            parentLink = container.querySelectorAll('.menu-item-has-children > a, .page_item_has_children > a');

        if ('ontouchstart' in window) {
            touchStartFn = function (e) {
                var menuItem = this.parentNode, i;

                if (!menuItem.classList.contains('focus')) {
                    e.preventDefault();
                    for (i = 0; i < menuItem.parentNode.children.length; ++i) {
                        if (menuItem === menuItem.parentNode.children[i]) {
                            continue;
                        }
                        menuItem.parentNode.children[i].classList.remove('focus');
                    }
                    menuItem.classList.add('focus');
                } else {
                    menuItem.classList.remove('focus');
                }
            };

            for (i = 0; i < parentLink.length; ++i) {
                parentLink[i].addEventListener('touchstart', touchStartFn, false);
            }
        }
    }(container));

})();

/**
 * Skip link focus fix.
 *
 * Helps with accessibility for keyboard only users.
 *
 * Learn more: https://git.io/vWdr2
 */
(function () {
    var isIe = /(trident|msie)/i.test(window.navigator.userAgent);

    if (isIe && window.document.getElementById && window.addEventListener) {
        window.addEventListener('hashchange',
            function () {
                var id = window.location.hash.substring(1),
                    element;

                if (!(/^[A-z0-9_-]+$/.test(id))) {
                    return;
                }

                element = window.document.getElementById(id);

                if (element) {
                    if (!(/^(?:a|select|input|button|textarea)$/i.test(element.tagName))) {
                        element.tabIndex = -1;
                    }

                    element.focus();
                }
            },
            false);
    }
})();


cash.fn.highlight = function (pat) {
    function innerHighlight(node, pat) {
        var skip = 0;
        if (node.nodeType === 3) {
            var pos = node.data.toUpperCase().indexOf(pat);
            pos -= (node.data.substr(0, pos).toUpperCase().length - node.data.substr(0, pos).length);
            if (pos >= 0) {
                var emnode = window.document.createElement('em');
                var middlebit = node.splitText(pos);
                middlebit.splitText(pat.length);
                var middleclone = middlebit.cloneNode(true);
                emnode.appendChild(middleclone);
                middlebit.parentNode.replaceChild(emnode, middlebit);
                skip = 1;
            }
        }
        else if (node.nodeType === 1 && node.childNodes && !/(script|style)/i.test(node.tagName)) {
            for (var i = 0; i < node.childNodes.length; ++i) {
                i += innerHighlight(node.childNodes[i], pat);
            }
        }
        return skip;
    }
    return this.length && pat && pat.length ? this.each(function () {
        innerHighlight(this, pat.toUpperCase());
    }) : this;
};


$(function () {
    var index = elasticlunr(function () {
        this.addField('title');
        this.addField('description');
        this.setRef('slug');
    });
    var showSearchResults = function (results, needle) {
        if (results) {
            $('.search-result-list').empty();
            for (var key in results) {
                if (results.hasOwnProperty(key)) {
                    var item = results[key].doc;
                    var resultItem = '<li>';
                    resultItem += '<a href="./' + item.slug + '" >';
                    resultItem += '<h2>' + item.title + '</h2>';
                    resultItem += '<p>' + item.description + '</p>';
                    resultItem += '</a>';
                    resultItem += '</li>';
                    $('.search-result-list').append(resultItem);
                }
            }
            var split = needle.split(' ');
            
            split.forEach(function(el) {
                $('.search-result-list').highlight(el);
            });
           
        }
    };

    var searchChange = function () {
        var inputText = $('.search-input')[0].value;
        if (inputText.length > 3) {
            $('.search-result-meta').empty();
            if (index.documentStore.length === 0) {
                fetch(window.uploadsFolder+'search.json')
                    .then(function (response) {
                        return response.json();
                    }).then(function (json) {
                        for (var key in json) {
                            if (json.hasOwnProperty(key)) {
                                index.addDoc(json[key]);
                            }
                        }
                        var res = index.search(inputText,
                            {
                                fields: {
                                    title: { boost: 2 },
                                    description: { boost: 1 }
                                }
                            });
                        showSearchResults(res, inputText);


                    });
            } else {
                var res = index.search(inputText,
                    {
                        fields: {
                            title: { boost: 2 },
                            description: { boost: 1 }
                        }
                    });
                showSearchResults(res, inputText);
            }
        } else {
            $('.search-result-meta').html('Type to start searching');
            $('.search-result-list').empty();
        }
    }

    var resetSearch = function () {
        $('.search-input')[0].value = '';
        $('.search-result-meta').html('Type to start searching');
        $('.search-result-list').empty();
    }

    $('.search-input')[0].addEventListener('keyup', searchChange);
    $('.search-input')[0].addEventListener('input', searchChange);
    $('.reset-search')[0].addEventListener('click', resetSearch);


});