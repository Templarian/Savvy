// https://github.com/Templarian/Savvy
(function ($) {
    $.fn.savvy = function () {
        /// <signature>
        ///  <summary>Convert contents into HTML.</summary>
        /// </signature>
        /// <signature>
        ///  <summary>Parse text into content.</summary>
        ///  <param name="text" type="String">Text to be parsed.</param>
        /// </signature>
        var args = Array.prototype.slice.call(arguments);
        if (args.length == 0) {
            $.savvy(this);
        } else {
            if (typeof args[0] == 'string') {
                $.savvy(this, args[0]);
            }
            return this.filter("a").append(function () {
                return " (" + this.href + ")";
            });
        }
    };
    $.savvy = function (element, text) {
        /// <summary>Perform</summary>
        text = text || element.html();
        element.empty();
        for (var i in element.data()) {
            element.removeData(i);
        }
        if (text.match(/^\s*$/)) { return; }
        var savvy = new $.savvy.Instance(element);
        text = text.replace(/\r/g, '');
        $.savvy.stepBlock(savvy, element, text);
    };
    $.savvy.stepBlock = function (savvy, element, text) {
        /// <summary>Step through lines for matches</summary>
        text = '\n' + text + '\n\n';
        var lexer = new $.savvy.Lexer(element, text);
        lexer.step([
            [/^\n(?=\n\n)/, function (element, text) {
                // Remove extra lines
            }],
            [/^\n?\n?[#]+ [^\n]+\n?/, function (element, text) {
                var m = text.match(/(#+) ([^\n]+)/);
                var $header = $('<h' + m[1].length + '>');
                $.savvy.stepText(savvy, $header, m[2]);
                element.append($header);
            }],
            [/^\n?!\[/, function (element, text) {
                var $img = $('<img>'),
                    src = '',
                    alt = '',
                    writeHref = false;
                lexer.step([
                    [/^\)/, function (element, text) {
                        $figure = $('<figure>');
                        $img.attr('alt', alt);
                        $img.attr('src', src);
                        $figure.append($img);
                        element.append($figure);
                        return true;
                    }],
                    [/^\]\(/, function (element, text) {
                        writeHref = true;
                    }],
                    [/^./, function (element, text) {
                        if (writeHref) {
                            src += text;
                        } else {
                            alt += text;
                        }
                    }]
                ]);
            }],
            [/^\n?```[\s\S]+?\n```/, function (element, text) {
                var m = text.match(/```([^\s]+)? ?([^\n]+)?\n([\s\S]*?)\n```/);
                var language = m[1] || 'text',
                    title = m[2] || '';
                var $pre = $('<pre>');
                var $code = $('<code>');
                $code.text(m[3]);
                if (m[1]) {
                    $code.addClass(language);
                }
                if (m[2]) {
                    var $title = $('<div>');
                    $title.text(m[2]);
                    $pre.append($title);
                }
                $pre.append($code);
                element.append($pre);
            }],
            [/^(?:\n?(?:\s*-|\s*\w{1,2}\.)\s[^\n]+|-\s[^\n]+)+/, function (element, text) {
                var m = text.match(/(?!\n)(\s*)(-|\w+\.)\s[^\n]+|-+\s[^\n]+/g),
                    list = [[null, element]], // parent, currentChild
                    indent = 0;
                for (var i = 0, c = m.length; i < c; i++) {
                    var itemCaptures = m[i].match(/(\s*)(-|\w+\.)\s(.*)/),
                        $li = $('<li>');
                    var indentCurrent = itemCaptures[1].length + 1;
                    if (indent < indentCurrent) {
                        var bullet = $.savvy.getBullet(itemCaptures[2]),
                            $list = bullet.type == '-' ? $('<ul>') : $('<ol>');
                        if (bullet.type.match(/[ia]/i)) {
                            $list.attr('type', bullet.type);
                        }
                        if (bullet.start != 1) {
                            $list.attr('start', bullet.start);
                        }
                        list[indent][1].append($list);
                        list.push([$list, null]);
                    } else if (indent > indentCurrent) {
                        list.pop();
                    }
                    indent = indentCurrent;
                    if (list.length == indent + 1) {
                        $li.text(itemCaptures[3]);
                        list[indent][1] = $li;
                        list[indent][0].append($li);
                    } else {
                        list[list.length - 1][0].append('[Syntax Error: ' + m[i] + ']');
                    }
                }
                //return true;
            }],
            [/^\n?(?:(?:&gt;|>)+.*(?:\n?|$))+/, function (element, text) {
                var old = text.split(/\n/), lines = [];
                for (var i = 0; i < old.length; i++) {
                    if (old[i] === '') { continue; }
                    lines.push(old[i].match(/(?:&gt; ?|> ?)(.*)/)[1]);
                }
                $blockquote = $('<blockquote>');
                element.append($blockquote);
                $.savvy.stepBlock(savvy, $blockquote, lines.join('\n'));
            }],
            [/^\n?@\w+\([^\)]*\)\{\n(?:\s{2,}[^\n]*)+\n\}\n?/, function (element, text) {
                var m = text.match(/\n?@(\w+)\(([^\)]*)\)\{\n((?:\s{2,}[^\n]*)+)\n\}/),
                    name = m[1],
                    parameters = m[2] === '' ? [] : m[2].split(/, ?/),
                    template = m[3];
                element.data('$' + name, {
                    parameters: parameters,
                    template: template.replace(/  (.*)/g, '$1')
                                      .replace(/&lt;/g, '<')
                                      .replace(/&gt;/g, '>')
                                      .replace(/&amp;/g, '&')
                });
            }],
            [/^\n?(\@\@?\w+\s+[^\n]*)/, function (element, text) {
                var variable = text.match(/^(@@?)([^\s]+)\s+(.*)$/);
                if (typeof element.data(variable[2]) == 'undefined' || variable[1].length == 2) {
                    savvy.setData(variable[2], variable[3]);
                } else {
                    return null; // Try the next one below
                }
            }],
            [/^\n?\n?([\s\S]+?)\n(?=\n|&gt;|>)/, function (element, text) {
                var $paragraph = $('<p>');
                var r = $.savvy.stepText(savvy, $paragraph, text);
                if ($paragraph.html().match(/^(\s*|<br>)$/)) {
                    return;
                }
                element.append($paragraph);
                return r;
            }],
            [/^[\s\S]+/, function (element, text) {
                // Trailing new lines
            }]
        ]);
    };
    $.savvy.stepText = function (savvy, element, text) {
        /// <summary>Step over inline text.</summary>
        /// <param name="savvy" type="$.savvy.Instance">Element binded data.</param>
        /// <param name="element" type="Object">jQuery Element</param>
        /// <param name="text" type="String">Text</param>
        var lexerText = new $.savvy.Lexer(element, text);
        lexerText.step([
            [/^\n(?!\n)/, function (element, text) {
                element.append($('<br>'));
            }],
            [/^\\\*/, function (element, text) {
                element.append('*');
            }],
            [/^\\_/, function (element, text) {
                element.append('_');
            }],
            [/^\\-/, function (element, text) {
                element.append('-');
            }],
            [/^\*/, function (element, text) {
                var $strong = $('<strong>');
                lexerText.step([
                    [/^\*/, function (element, text) {
                        element.append($strong);
                        return true;
                    }],
                    [/^(?:\\\*|[^\*])+/, function (element, text) {
                        return $.savvy.stepText(savvy, $strong, text);
                    }]
                ]);
            }],
            [/^_/, function (element, text) {
                var $italic = $('<em>');
                lexerText.step([
                    [/^_/, function (element, text) {
                        element.append($italic);
                        return true;
                    }],
                    [/^(?:\\_|[^_])+/, function (element, text) {
                        return $.savvy.stepText(savvy, $italic, text);
                    }]
                ]);
            }],
            [/^`/, function (element, text) {
                var $code = $('<code>');
                lexerText.step([
                    [/\^s\`/, function (element, text) {
                        $code.append('`');
                    }],
                    [/^`/, function (element, text) {
                        element.append($code);
                        return true;
                    }],
                    [/^./, function (element, text) {
                        $code.append(text);
                    }]
                ]);
            }],
            [/^!\[(?:\\\]|[^\]])*\]\((?:[^\)]*)\)/, function (element, text) {
                var $img = $('<img>'),
                    m = text.match(/^!\[((?:\\\]|[^\]])*)\]\(([^\)]*)\)/);
                $img.attr('alt', m[1] || '');
                $img.attr('src', m[2] || '');
                element.append($img);
            }],
            [/^\[(?:!\[(?:\\\]|[^\]])*\]\([^\)]*\)|\\\]|[^\]])+\]\([^\)]*\)/, function (element, text) {
                var $a = $('<a>'),
                    m = text.match(/^\[((?:!\[(?:\\\]|[^\]])*\]\([^\)]*\)|\\\]|[^\]])+)\]\(([^\)]*)\)/);
                $.savvy.stepText(savvy, $a, m[1]);
                $a.attr('href', m[2]);
                element.append($a);
            }],
            [/^\^/, function (element, text) {
                var $sup = $('<sup>');
                lexerText.step([
                    [/^\^/, function (element, text) {
                        element.append($sup);
                        return true;
                    }],
                    [/^(?:\\\^|[^\^])+/, function (element, text) {
                        return $.savvy.stepText(savvy, $sup, text);
                    }]
                ]);
            }],
            [/^~/, function (element, text) {
                var $sub = $('<sub>');
                lexerText.step([
                    [/^~/, function (element, text) {
                        element.append($sub);
                        return true;
                    }],
                    [/^(?:\\~|[^~])+/, function (element, text) {
                        return $.savvy.stepText(savvy, $sub, text);
                    }]
                ]);
            }],
            [/^\-/, function (element, text) {
                var $strike = $('<del>');
                lexerText.step([
                    [/^-/, function (element, text) {
                        element.append($strike);
                        return true;
                    }],
                    [/^(?:\\-|[^-])+/, function (element, text) {
                        return $.savvy.stepText(savvy, $strike, text);
                    }]
                ]);
            }],
            [/^@\w+\([^\)]*\)/, function (element, text) {
                var m = text.match(/@(\w+)\(([^\)]*)\)/),
                    name = m[1],
                    args = m[2] === '' ? [] : m[2].split(/, ?/);
                if (name == 'script') {
                    var func = args.shift();
                    if (window[func]) {
                        window[func].apply(element, args);
                    } else {
                        element.append('[Error: Invalid JavaScript function]');
                    }
                    return;
                }
                var data = savvy.getData('$' + name);
                if (data) {
                    var template = data.template;
                    for (var i = 0, c = args.length; i < c; i++) {
                        var regex = new RegExp('(\{@' + data.parameters[i] + '\}|@' + data.parameters[i] + ')', 'g');
                        template = template.replace(regex, savvy.getData(args[i].substr(1)) || args[i]);
                    }
                    try {
                        var match = template.match(/^([^<]*)([\s\S]*?)([^>]*)$/);
                        if (match[1] !== '') { element.append(match[1]); }
                        if (match[2] !== '') { element.append($(match[2])); }
                        if (match[3] !== '') { element.append(match[3]); }
                    } catch (e) { element.append('[Syntax Error: Invalid Template]'); }
                } else {
                    if (name in $.savvy.fn) {
                        for (var j = 0; j < args.length; j++) {
                            args[j] = savvy.getData(args[j].substr(1)) || args[j].substr(1);
                        }
                        $.savvy.fn[name].apply(element, args);
                    } else {
                        element.append('[Syntax Error: Function "' + name + '" is not set]');
                    }
                }
            }],
            [/^@\w+/, function (element, text) {
                var m = text.match(/@(.*)/),
                    data = savvy.getData(m[1]);
                element.append(data || text);
            }],
            [/^[^\n]/, function (element, text) {
                element.append(text);
            }],
            [/^\n\n/, function (element, text) {
                return true;
            }],
            [/^./, function (element, text) { // Optimize for a single capture for everything else!
                element.append(text);
            }]
        ]);
    };
    $.savvy.Instance = function (element) {
        /// <summary></summary>
        this.setData = function (key, value) {
            element.data(key, value);
        };
        this.getData = function (key) {
            return element.data(key);
        };
    };
    $.savvy.getBullet = function (bullet, li) {
        /// <summary></summary>
        bullet = bullet.replace('.', '');
        if (bullet == '-') {
            return { type: '-', start: 1 };
        } else if (!isNaN(bullet)) {
            return { type: '1', start: bullet };
        } else if (this.isRomanNumeral(bullet)) {
            return {
                type: this.isCaptial(bullet) ? 'I' : 'i',
                start: this.romanNumeralToInteger(bullet)
            };
        } else if (this.isAlpha(bullet)) { // i ii
            return {
                type: this.isCaptial(bullet) ? 'A' : 'a',
                start: this.alphaToInteger(bullet)
            };
        } else {
            li.append('[Syntax Error: Invalid bullet "' + bullet + '"]');
            return { type: '1', start: 1 };
        }
    };
    $.savvy.isAlpha = function (str) {
        return !!str.match(/^[a-z]+$/i);
    };
    $.savvy.isCaptial = function (str) {
        /// <summary></summary>
        /// <returns type=""></returns>
        return !str.match(/^[a-z]+$/);
    };
    $.savvy.isRomanNumeral = function (roman) {
        /// <summary>Is Roman Numeral</summary>
        /// <param name="Roman" type="String"></param>
        /// <returns type="Boolean">Is the string in romain numeral format.</returns>
        return !!roman.match(/^M{0,4}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/i);
    };
    $.savvy.romanNumeralToInteger = function (roman) {
        /// <summary>Roman numeral to integer position, Ex: i -> 1, iv -> 4</summary>
        /// <param name="roman" type="Number"></param>
        /// <returns type="Integer">Position</param>
        var roman = roman.toUpperCase().split(''),
            lookup = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 },
            num = 0, val = 0;
        while (roman.length) {
            val = lookup[roman.shift()];
            num += val * (val < lookup[roman[0]] ? -1 : 1);
        }
        return num;
    };
    $.savvy.alphaToInteger = function (str) {
        /// <summary>Letter to integer position, Ex: a -> 1, aa-> 27</summary>
        /// <param name="str" type="String">Ex: a, b, aa</param>
        /// <returns type="Integer">Position</returns>
        var m = str.match(/[a-z]+/i)
        return (m[0].charCodeAt(0) - 96) + (m[0].length - 1) * 26;
    };
    $.savvy.Lexer = function (element, data) {
        /// <summary></summary>
        this.element = element;
        this.data = data;
        this.index = 0;
        this.step = function (tokens) {
            var i = 0;
            loop: do {
                for (var t = 0; t < tokens.length; t++) {
                    var m = null;
                    if (m = this.data.substr(this.index).match(tokens[t][0])) {
                        this.revertTo = this.index;
                        this.index += m[0].length;
                        var r = tokens[t][1](element, m.length > 1 ? m[1] : m[0]);
                        if (typeof r == 'undefined') {
                            continue loop;
                        } else if (r) {
                            break loop;
                        } else if (r === null) {
                            this.index = this.revertTo;
                            continue;
                        } else {
                            return false;
                        }
                    }
                }
                i++;
            } while (this.index != this.data.length && i < 100);
            if (i == 1000) {
                element.append('[Error]');
            }
            return true;
        };
    };
    $.savvy.ajax = function (o) {
        /// <summary>jQuery and jqLite compatible Ajax</summary>
        if (window.jQuery) {
            $.ajax({
                type: o.type || 'GET',
                url: o.url,
                success: o.success,
                error: o.failure || function () { }
            });
        } else {
            angular.injector(['ng']).invoke(function ($http) {
                $http({
                    method: o.type || 'GET',
                    url: o.url
                }).success(o.success)
                  .error(o.failure || function () { });
            });
        }
    };
    $.savvy.fn = {};
}(window.jQuery || angular.element));