var testApp = testApp || {};
testApp.ReferenceBookView = function(model) {
    this._model = model;
};

testApp.ReferenceBookView.prototype = {
    //метод для запуска событий
    fireEvent: function (type, data, context) {
        Observable.prototype.fireEvent(type, data, context);
    },

    //метод для прослушивания событий
    listen: function (type, method, scope, context) {
        Observable.prototype.listen(type, method, scope, context);
    },

    //метод который запускается сразу после инициализации объекта
    init: function () {
        if(!this._model.data.reference_book) return;

        var that = this;

        this.renderReferenceBook(that._model.data.reference_book);

        $('#showReference').off();
        $('#showReference').click(function () {
            $('#reference-book-wrapper').toggle();
        });

        $('#reference-book-wrapper').find('.close-reference-book').off();
        $('#reference-book-wrapper').find('.close-reference-book').click(function() {
            $('#reference-book-wrapper').hide();
        });

        $('#reference-book').find('.ref-menu li').click(function(e) {
            var id = $(e.currentTarget).attr('id');
            id = id.substring(9);
            that.showReferenceItem(id);
        });

        if(typeof MathJax !== 'undefined') {
            MathJax.Hub.Register.StartupHook("End",function () {
                $('#showReference').removeClass('disabled');
            });

            MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
        } else {
            $('#showReference').removeClass('disabled');
        }

    },

    renderReferenceBook: function(data) {
        var templateSource = $('#reference-book-tmpl').html();
        var template = Handlebars.compile(templateSource);
        var rendered = template(data);
        $('#reference-book-wrapper').append(rendered);
        this.showReferenceItem(1);

        /*$('#reference-book').find('.ref-content > div').each(function() {
            testHelpers.singleScrolling('#' + $(this).attr('id'), 60);
        });*/
    },

    showReferenceItem: function(id) {
        $('#reference-book').find('.ref-content > div').hide();
        $('#ref-item-' + id).show();
        $('#reference-book').find('.ref-menu li').removeClass('active-ref-item');
        $('#ref-link-' + id).addClass('active-ref-item');
    }
};