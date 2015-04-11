var b = require('..');

describe("html", function() {
    describe(".tag()", function() {
        var tag = b.html.tag;

        it("generates tags", function() {
            expect(tag('br')).to.equal('<br>');
        });
        it("supports attributes", function() {
            expect(tag('input', { type: 'text', value: 'val' })).to.equal('<input type="text" value="val">');
        });
        it("supports content", function() {
            expect(tag('b', 'bold')).to.equal('<b>bold</b>');
        });
        it("supports empty content tags", function() {
            expect(tag('b', '')).to.equal('<b></b>');
        });
        it("escapes attributes", function() {
            expect(tag('input', { value: '<>"\'&' })).to.equal('<input value="&lt;&gt;&quot;&#39;&amp;">');
        });
        it("supports attributes and content in any order", function() {
            expect(tag('span', { class: 'cls'}, 'content')).to.equal('<span class="cls">content</span>');
            expect(tag('span', 'content', { class: 'cls'})).to.equal('<span class="cls">content</span>');
        });
        it("supports boolean attributes", function() {
            expect(tag('input', { disabled: true })).to.equal('<input disabled>');
        });
        it("does not show attributes that are null or undefined", function() {
            expect(tag('span', { null: null, undef: undefined, false: false })).to.equal('<span false="">');
        });

        describe("with a custom escape method", function() {
            var m;
            before(function() { m = b.html.escape; });
            after(function() { b.html.escape = m; });

            it("uses the custom escape method", function() {
                b.html.escape = function() { return "custom escape method"; }
                expect(tag('input', { value: '<>"\'&' })).to.equal('<input value="custom escape method">');
            });
        });
    });

    describe(".escape()", function() {
        var escape = b.html.escape;
        it("escapes special html characters", function() {
            expect(escape('<>"\'&')).to.equal('&lt;&gt;&quot;&#39;&amp;');
        });
    });
});
