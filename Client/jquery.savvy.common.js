// https://github.com/Templarian/Savvy
(function ($) {
    $.savvy.fn = {
        twitter: function (user) {
            var $a = $('<a>');
            $a.attr('href', 'https://twitter.com/' + user);
            $a.text('@' + user);
            this.append($a);
        },
        hashtag: function (text) {
            var $a = $('<a>');
            $a.attr('href', 'https://twitter.com/https://twitter.com/search?q=%23' + text);
            $a.text('#' + text);
            this.append($a);
        },
        tweet: function (id) {
            var $container = this.append($('<div>'));
            $.savvy.ajax({
                url: '/api/tweet/' + id,
                success: function (data) {
                    $container.append($(data.html));
                },
                failure: function () {
                    $container.append('[Error: Failed to load tweet]');
                }
            });
        }
    };
}(window.jQuery || angular.element));