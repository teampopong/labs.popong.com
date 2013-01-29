(function () {

var TMPL_COMMENT = $('#tmpl-comment').html();
var comments = [
    {
        'author': '강철',
        'date': '2011.09.02 11:42',
        'content': 'JavaScript는 초보 개발자가 오류를 저지를 수 있는 다양한 종류의 크고 작은 함정을 지니고 있다. 이런 자바스크립트의 나쁜 특성들은 때때로 버그를 스노볼처럼 키워가며 무시무시한 결과를 가져올 수 있다.'
    },
    {
        'author': '최승준',
        'date': '2011.09.03 12:45',
        'content': '솔직히 코딩을 그리 수퍼 잘한다 할 수 없지만.왜 일케 코딩 이야기는 마음이 편안하고 즐거운 것일까요.하하.잼있다.오래오래 할 수 있으면 좋겠다는~ 물론 누가 그걸로 일 시키면 도망갈꺼지만!'
    },
    {
        'author': '양정민',
        'date': '2011.09.04 16:23',
        'content': '@cornchz 그냥 아 이런것도 있구나 하면서 읽어봤음. 그러나 역시 잘 모르겠음'
    },
    {
        'author': '최승준',
        'date': '2011.09.04 18:20',
        'content': '시간을 멈추고 윤리를 무시하고 현생 전 인류의 뇌를 1시간만 동시에 빌려서 그리드컴퓨팅으로 뭔가를 계산하거나 푼다고 하면 뭘 해야할까.이런 관점에서라면 지나가는 행인들이 유휴자원으로 보인다. ㅋㅋㅋ'
    }
];

$.each(comments, function (i, comment) {
    var commentHtml = Mustache.render(TMPL_COMMENT, comment);
    if (!!i) {
        $('#childcomments').prepend(commentHtml);
    } else {
        $('#maincomment').append($(commentHtml).children());
    }
});

// Animation for the moment a child comment is selected.
$('#childcomments .comment:not(.newcomment)').click(function () {

    // change 'position' attribute to 'absolute'
    var $this = $(this),
        o = $this.position();

    $this.css({
        'position': 'absolute',
        'left': o.left,
        'top': o.top
    });

    // hide children comments slowly
    $('#childcomments .comment').not(this).slideUp();

    // slowly move it to the place of the main comment
    o = $('#maincomment').position();
    $('#maincomment').css('visibility', 'hidden');
    $(this).animate({
            left: o.left,
            top: o.top
            }, 1000, function () {
                $('#maincomment').css('visibility', '');
                $(this).hide();
                $(this).css({
                    'position': '',
                    'left': '',
                    'top': ''
                });
                $('#childcomments .comment').slideDown();
            });
});

$('.newcomment').click(function () {
    $('.cmd-newcomment').hide();
    $('.writecomment').show();
});

$('.writecomment .embed').click(function () {
    var $popup = $('#embedpopup');
    $popup.css({
        'left': (window.innerWidth - $popup.width())/2,
        'top': (window.innerHeight - $popup.height())/2
    }).show();
});

$('#embedpopup').click(function () {
    $(this).hide();
});

}());
