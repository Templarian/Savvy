describe('Format', function () {

    it('blank to blank', function () {
        var $div = $('<div>');
        $div.appendMulti([
            ''
        ]);
        $div.savvy();
        expect($div).toBeHtml('');
    });

    it('blank lines to blank', function () {
        var $div = $('<div>');
        $div.appendMulti([
            '',
            '',
            ''
        ]);
        $div.savvy();
        expect($div).toBeHtml('');
    });
    
    it('# to h1', function () {
        var $div = $('<div>');
        $div.appendMulti([
            '# Header 1'
        ]);
        $div.savvy();
        expect($div).toBeHtml('<h1>Header 1</h1>');
    });

    it('## to h2', function () {
        var $div = $('<div>');
        $div.appendMulti([
            '## Header 2'
        ]);
        $div.savvy();
        expect($div).toBeHtml('<h2>Header 2</h2>');
    });

    it('### to h3', function () {
        var $div = $('<div>');
        $div.appendMulti([
            '### Header 3'
        ]);
        $div.savvy();
        expect($div).toBeHtml('<h3>Header 3</h3>');
    });

    it('#### to h4', function () {
        var $div = $('<div>');
        $div.appendMulti([
            '#### Header 4'
        ]);
        $div.savvy();
        expect($div).toBeHtml('<h4>Header 4</h4>');
    });

    it('##### to h5', function () {
        var $div = $('<div>');
        $div.appendMulti([
            '##### Header 5'
        ]);
        $div.savvy();
        expect($div).toBeHtml('<h5>Header 5</h5>');
    });

    it('###### to h6', function () {
        var $div = $('<div>');
        $div.appendMulti([
            '###### Header 6'
        ]);
        $div.savvy();
        expect($div).toBeHtml('<h6>Header 6</h6>');
    });

    it('# to h1 with italic', function () {
        var $div = $('<div>');
        $div.text('# Header 1 _italic_');
        $div.savvy();
        expect($div).toBeHtml('<h1>Header 1 <em>italic</em></h1>');
    });

    it('# to h1 with link', function () {
        var $div = $('<div>');
        $div.text('# Header 1 [link](http://d.com)');
        $div.savvy();
        expect($div).toBeHtml('<h1>Header 1 <a href="http://d.com">link</a></h1>');
    });

    it('Header and Paragraph', function () {
        var $div = $('<div>');
        $div.appendMulti([
            '# Header 1',
            '',
            'Hello World!'
        ]);
        $div.savvy();
        expect($div).toBeHtml('<h1>Header 1</h1><p>Hello World!</p>');
    });

    it('paragraph to p', function () {
        var $div = $('<div>');
        $div.text('Paragraph');
        $div.savvy();
        expect($div).toBeHtml('<p>Paragraph</p>');
    });

    it('paragraph br to p br p', function () {
        var $div = $('<div>');
        $div.appendMulti([
            'Line 1',
            'Line 2'
        ]);
        $div.savvy();
        expect($div).toBeHtml('<p>Line 1<br>Line 2</p>');
    });

    it('paragraph with brackets to p with brackets', function () {
        var $div = $('<div>');
        $div.text('Paragraph [testing]');
        $div.savvy();
        expect($div).toBeHtml('<p>Paragraph [testing]</p>');
    });

    it('paragraph multi line', function () {
        var $div = $('<div>');
        $div.appendMulti([
            'Paragraph 1',
            '',
            'Paragraph 2',
            '',
            'Paragraph 3'
        ]);
        $div.savvy();
        expect($div).toBeHtml('<p>Paragraph 1</p><p>Paragraph 2</p><p>Paragraph 3</p>');
    });

    it('inline code', function () {
        var $div = $('<div>');
        $div.text('Hello `World`!');
        $div.savvy();
        expect($div).toBeHtml('<p>Hello <code>World</code>!</p>');
    });

    it('codeblock basic', function () {
        var $div = $('<div>');
        $div.appendMulti([
            '```',
            'code',
            '```'
        ]);
        $div.savvy();
        expect($div).toBeHtml('<pre><code>code</code></pre>');
    });

    it('codeblock text', function () {
        var $div = $('<div>');
        $div.appendMulti([
            '```text',
            'code',
            '```'
        ]);
        $div.savvy();
        expect($div).toBeHtml('<pre><code class="text">code</code></pre>');
    });

    it('codeblock text title', function () {
        var $div = $('<div>');
        $div.appendMulti([
            '```text Hello World!',
            'code',
            '```'
        ]);
        $div.savvy();
        expect($div).toBeHtml('<pre><div>Hello World!</div><code class="text">code</code></pre>');
    });

    it('bold basic', function () {
        var $div = $('<div>');
        $div.text('*Hello* World!');
        $div.savvy();
        expect($div).toBeHtml('<p><strong>Hello</strong> World!</p>');
    });

    it('bold escape *', function () {
        var $div = $('<div>');
        $div.text('*Hello \\* World!*');
        $div.savvy();
        expect($div).toBeHtml('<p><strong>Hello * World!</strong></p>');
    });

    it('italic basic', function () {
        var $div = $('<div>');
        $div.text('_Hello_ World!');
        $div.savvy();
        expect($div).toBeHtml('<p><em>Hello</em> World!</p>');
    });

    it('italic escape _', function () {
        var $div = $('<div>');
        $div.text('_Hello \\\_ World!_');
        $div.savvy();
        expect($div).toBeHtml('<p><em>Hello _ World!</em></p>');
    });

    it('bold italic basic', function () {
        var $div = $('<div>');
        $div.text('*Hello* _World_!');
        $div.savvy();
        expect($div).toBeHtml('<p><strong>Hello</strong> <em>World</em>!</p>');
    });

    it('bold italic wrap', function () {
        var $div = $('<div>');
        $div.text('*Hello _World_*!');
        $div.savvy();
        expect($div).toBeHtml('<p><strong>Hello <em>World</em></strong>!</p>');
    });

    it('Superscript basic', function () {
        var $div = $('<div>');
        $div.text('x^2^');
        $div.savvy();
        expect($div).toBeHtml('<p>x<sup>2</sup></p>');
    });

    it('Subscript basic', function () {
        var $div = $('<div>');
        $div.text('x~2~');
        $div.savvy();
        expect($div).toBeHtml('<p>x<sub>2</sub></p>');
    });

    it('strikethrough basic', function () {
        var $div = $('<div>');
        $div.text('-strikethrough-');
        $div.savvy();
        expect($div).toBeHtml('<p><del>strikethrough</del></p>');
    });

    it('link basic', function () {
        var $div = $('<div>');
        $div.text('[foo](http://bar.com/)');
        $div.savvy();
        expect($div).toBeHtml('<p><a href="http://bar.com/">foo</a></p>');
    });

    it('image basic', function () {
        var $div = $('<div>');
        $div.text('Image: ![](http://foo.com/bar.png)');
        $div.savvy();
        expect($div).toBeHtml('<p>Image: <img alt="" src="http://foo.com/bar.png"></p>');
    });

    it('figure image basic', function () {
        var $div = $('<div>');
        $div.text('![](http://foo.com/bar.png)');
        $div.savvy();
        expect($div).toBeHtml('<figure><img alt="" src="http://foo.com/bar.png"></figure>');
    });

    it('figure image alt', function () {
        var $div = $('<div>');
        $div.text('![Hello World!](http://foo.com/bar.png)');
        $div.savvy();
        expect($div).toBeHtml('<figure><img alt="Hello World!" src="http://foo.com/bar.png"></figure>');
    });

    it('inline image link basic', function () {
        var $div = $('<div>');
        $div.text('[![](http://foo.com/bar.png)](http://bar.com/)');
        $div.savvy();
        expect($div).toBeHtml('<p><a href="http://bar.com/"><img alt="" src="http://foo.com/bar.png"></a></p>');
    });

    it('inline image alt link basic', function () {
        var $div = $('<div>');
        $div.text('[![Hello World!](http://foo.com/bar.png)](http://bar.com/)');
        $div.savvy();
        expect($div).toBeHtml('<p><a href="http://bar.com/"><img alt="Hello World!" src="http://foo.com/bar.png"></a></p>');
    });

    it('list unordered basic', function () {
        var $div = $('<div>');
        $div.appendMulti([
            '- Item 1',
            '- Item 2',
            '- Item 3'
        ]);
        $div.savvy();
        expect($div).toBeHtml('<ul><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul>');
    });

    it('list unordered indent', function () {
        var $div = $('<div>');
        $div.appendMulti([
            '- Item 1',
            ' - Item 2',
            '- Item 3'
        ]);
        $div.savvy();
        expect($div).toBeHtml('<ul><li>Item 1<ul><li>Item 2</li></ul></li><li>Item 3</li></ul>');
    });

    it('list unordered syntax error', function () {
        var $div = $('<div>');
        $div.appendMulti([
            '- Item 1',
            '  - Item 2',
            '- Item 3'
        ]);
        $div.savvy();
        expect($div).toBeHtml('<ul><li>Item 1<ul>[Syntax Error:   - Item 2]</ul></li><li>Item 3</li></ul>');
    });

    it('list ordered basic', function () {
        var $div = $('<div>');
        $div.appendMulti([
            '1. Item 1',
            '2. Item 2',
            '3. Item 3'
        ]);
        $div.savvy();
        expect($div).toBeHtml('<ol><li>Item 1</li><li>Item 2</li><li>Item 3</li></ol>');
    });

    it('list ordered indent', function () {
        var $div = $('<div>');
        $div.appendMulti([
            '1. Item 1',
            ' a. Item a',
            ' b. Item b',
            '2. Item 2'
        ]);
        $div.savvy();
        expect($div).toBeHtml('<ol><li>Item 1<ol type="a"><li>Item a</li><li>Item b</li></ol></li><li>Item 2</li></ol>');
    });

    it('list ordered start indent', function () {
        var $div = $('<div>');
        $div.appendMulti([
            '2. Item 2',
            ' b. Item b',
            ' c. Item c',
            '3. Item 3'
        ]);
        $div.savvy();
        expect($div).toBeHtml('<ol start="2"><li>Item 2<ol type="a" start="2"><li>Item b</li><li>Item c</li></ol></li><li>Item 3</li></ol>');
    });

    it('blockquote single-line', function () {
        var $div = $('<div>');
        $div.appendMulti([
            '> Line 1'
        ]);
        $div.savvy();
        expect($div).toBeHtml('<blockquote><p>Line 1</p></blockquote>');
    });

    it('blockquote multi-line', function () {
        var $div = $('<div>');
        $div.appendMulti([
            '> Line 1',
            '> Line 2',
            '> Line 3'
        ]);
        $div.savvy();
        expect($div).toBeHtml('<blockquote><p>Line 1<br>Line 2<br>Line 3</p></blockquote>');
    });

    it('blockquote advanced', function () {
        var $div = $('<div>');
        $div.appendMulti([
            '> # Header 1',
            '>',
            '> *Bold*'
        ]);
        $div.savvy();
        expect($div).toBeHtml('<blockquote><h1>Header 1</h1><p><strong>Bold</strong></p></blockquote>');
    });

    it('blockquote recursive', function () {
        var $div = $('<div>');
        $div.appendMulti([
            '> Line 1',
            '>',
            '>> # Header 1',
            '>>',
            '>> *Bold*',
            '>',
            '> Line 3'
        ]);
        $div.savvy();
        expect($div).toBeHtml('<blockquote><p>Line 1</p><blockquote><h1>Header 1</h1><p><strong>Bold</strong></p></blockquote><p>Line 3</p></blockquote>');
    });

});

describe('variable', function () {

    it('basic', function () {
        var $div = $('<div>');
        $div.appendMulti([
            '@foo bar',
            '',
            '@foo'
        ]);
        $div.savvy();
        expect($div).toBeHtml('<p>bar</p>');
    });

    it('undefined', function () {
        var $div = $('<div>');
        $div.appendMulti([
            'For example email@foo.com'
        ]);
        $div.savvy();
        expect($div).toBeHtml('<p>For example email@foo.com</p>');
    });

    it('multiline (two) basic', function () {
        var $div = $('<div>');
        $div.appendMulti([
            '@foo bar',
            '@hello world',
            '',
            '@foo @hello'
        ]);
        $div.savvy();
        expect($div).toBeHtml('<p>bar world</p>');
    });

    it('multiline (three) basic', function () {
        var $div = $('<div>');
        $div.appendMulti([
            '@foo bar',
            '@hello world',
            '@key value',
            '',
            '@foo @hello @key'
        ]);
        $div.savvy();
        expect($div).toBeHtml('<p>bar world value</p>');
    });

    //it('braces basic', function () {
    //    var $div = $('<div>');
    //    $div.appendMulti([
    //        '@foo{',
    //        '    bar',
    //        '}',
    //        '',
    //        '@foo'
    //    ]);
    //    $div.savvy();
    //    expect($div).toBeHtml('<p>bar</p>');
    //});

    it('override', function () {
        var $div = $('<div>');
        $div.appendMulti([
            '@foo bar1',
            '@@foo bar2',
            '',
            '@foo'
        ]);
        $div.savvy();
        expect($div).toBeHtml('<p>bar2</p>');
    });

});

describe('function', function () {

    it('basic', function () {
        var $div = $('<div>');
        $div.appendMulti([
            '@basic(){',
            '  World',
            '}',
            '',
            'Hello @basic()!'
        ]);
        $div.savvy();
        expect($div).toBeHtml('<p>Hello World!</p>');
    });

    it('undefined', function () {
        var $div = $('<div>');
        $div.appendMulti([
            'Hello @basic()!'
        ]);
        $div.savvy();
        expect($div).toBeHtml('<p>Hello [Syntax Error: Function "basic" is not set]!</p>');
    });

    it('script defined', function () {
        var $div = $('<div>');
        window.foo = function () { };
        spyOn(window, 'foo');
        $div.appendMulti([
            'Hello @script(foo, bar)!'
        ]);
        $div.savvy();
        expect($div).toBeHtml('<p>Hello !</p>');
        expect(window.foo).toHaveBeenCalledWith('bar');
    });

    it('script undefined', function () {
        var $div = $('<div>');
        window.foo = function () { };
        spyOn(window, 'foo');
        $div.appendMulti([
            'Hello @script(foo, 10)!'
        ]);
        $div.savvy();
        expect($div).toBeHtml('<p>Hello !</p>');
        expect(window.foo).not.toHaveBeenCalledWith('bar');
    });

    it('links twitter username', function () {
        var $div = $('<div>');
        $div.appendMulti([
            '@twitter(user){',
            '  <a href="https://twitter.com/@user">@@user</a>',
            '}',
            '',
            'Link: @twitter(username)'
        ]);
        $div.savvy();
        expect($div).toBeHtml('<p>Link: <a href="https://twitter.com/username">@username</a></p>');
    });

    //it('with script call', function () {
    //    var $div = $('<div>');
    //    window.testScriptCall = function (value) {
    //        
    //    };
    //    spyOn(window, 'testScriptCall');
    //    $div.appendMulti([
    //        '@executeScript(){',
    //        '  @script(testScriptCall, foo bar)',
    //        '}',
    //        '',
    //        '@executeScript()'
    //    ]);
    //    $div.savvy();
    //    expect(window.testScriptCall).toHaveBeenCalledWith('foo bar');
    //});

});