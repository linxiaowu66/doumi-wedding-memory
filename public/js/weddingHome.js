$(function () {
  var r = 0;
  var hadDrawPoint = 0;
  var time = 10; //每个点之间的时间间隔
  var intervalId;
  var totalDrawPoint = 360; //分割为 360 个点
  var startRadian = Math.PI;
  var ctx;
  var startX = 0;
  var startY = 0;
  var radian; //弧度
  var radianDecrement; //弧度增量
  var canvas;

  function drawLove() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');

    var WINDOW_HEIGHT = window.screen.height;
    var WINDOW_WIDTH = document.body.clientWidth;

    canvas.width = WINDOW_WIDTH;
    canvas.height = WINDOW_HEIGHT;

    if (WINDOW_WIDTH > 1199) {
      r = WINDOW_WIDTH * 0.014;
    } else if (WINDOW_WIDTH >= 768 && WINDOW_WIDTH <= 1199) {
      r = WINDOW_WIDTH * 0.03;
    } else {
      r = WINDOW_WIDTH * 0.028;
    }

    startX = canvas.width / 2;
    startY = (canvas.height * 3) / 8;

    ctx.strokeStyle = 'red';
    ctx.lineWidth = 1; //设置线的宽度
    radian = startRadian; //弧度设为初始弧度
    radianDecrement = (Math.PI * 2) / totalDrawPoint;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.moveTo(getX(radian), getY(radian)); //移动到初始点
    intervalId = setInterval(printHeart, time);
  }

  function getX(t) {
    //由弧度得到 X 坐标
    return startX + r * (16 * Math.pow(Math.sin(t), 3));
  }

  function getY(t) {
    //由弧度得到 Y 坐标
    return (
      startY -
      r *
        (13 * Math.cos(t) -
          5 * Math.cos(2 * t) -
          2 * Math.cos(3 * t) -
          Math.cos(4 * t))
    );
  }

  //x = 16 sin^3 t, y = (13 cos t - 5 cos 2t - 2 cos 3t - cos 4t)
  function printHeart() {
    radian += radianDecrement;
    ctx.lineTo(getX(radian), getY(radian)); //在旧点和新点之间连线

    hadDrawPoint++;
    ctx.stroke(); //画线
    if (hadDrawPoint >= totalDrawPoint) {
      clearInterval(intervalId);
      hadDrawPoint = 0;
      radian = startRadian;
      /*
       we hope to add this navigator contenrt after finishing drawing the love
       */
      $linkPage =
        '<ul id = "navContent">' +
        '<li><a href="meetEachOther">相识</a></li>' +
        '<li><a href="knowEachOther">相知</a></li>' +
        '<li><a href="loveEachOther">相爱</a></li>' +
        '<li><a href="togetherAlways">相伴相守一生</a></li>' +
        '</ul>';
      $('.overlay-menu').append($linkPage);
    }
  }

  $('#toggle').click(function (event) {
    event.preventDefault();
    $(this).find('.top').toggleClass('active');

    $(this).find('.middle').toggleClass('active');
    $(this).find('.bottom').toggleClass('active');
    // $("#overlay").toggleClass("open");

    if ($('#overlay').hasClass('open')) {
      $('#overlay').removeClass('open');
      $('#canvas').remove();
      $('#navContent').remove();
    } else {
      $('#overlay').addClass('open');
      var $canvas =
        '<canvas id = "canvas">您的浏览器不支持canvas标签。</canvas>';
      $('.overlay-menu').append($canvas);
      drawLove();
    }
  });

  const loveTime = new Date(2013, 2, 7, 18, 18, 18).getTime();

  $('.countdown').ClassyCountdown({
    theme: 'flat-colors-wide',
    start: loveTime,
  });

  function updatePaging(totalCount, pageSize = 6, currentPage) {
    if ($('#pagination')) {
      var counts,
        pagehtml = '';

      if (totalCount % pageSize == 0) {
        counts = parseInt(totalCount / pageSize);
      } else {
        counts = parseInt(totalCount / pageSize) + 1;
      }

      //只有一页内容
      if (totalCount <= pageSize) {
        pagehtml = '';
      }
      //大于一页内容
      if (totalCount > pageSize) {
        if (currentPage > 1) {
          pagehtml += '<li><a id = "prePage">上一页</a></li>';
        }
        for (var i = 0; i < counts; i++) {
          if (i >= currentPage - 3 && i < currentPage + 3) {
            if (i == currentPage - 1) {
              pagehtml +=
                '<li class="active pageId"><a>' + (i + 1) + '</a></li>';
            } else {
              pagehtml += '<li><a class="pageId">' + (i + 1) + '</a></li>';
            }
          }
        }
        if (currentPage < counts) {
          pagehtml += '<li><a id="nextPage">下一页</a></li>';
        }
      }
      $('#pagination li').remove();
      $('#pagination').html(pagehtml);
    }
  }

  function successAction(data) {
    var dataLength = data.list.length;
    var idx = 0;
    var cur_count = 0;
    var commonStr =
      '<li class="media"><a class="pull-left" href="#">' +
      '<img class="media-object" src="https://blogimage.5udou.cn/imgCommon/people.jpg " alt="..."></a>' +
      '<div class="media-body">';
    $('#nick-name').val('');
    $('#advice').val('');
    $('#blessing').val('');
    $('.media-list li').each(function (index) {
      if (index <= dataLength - 1) {
        var str =
          data.list[index].nickname +
          '<span style = "font-size:0.8rem">·' +
          data.list[index].timeDescription +
          '</span>';
        $(this).find('.media-heading').html(str);

        $(this).find('#blessing-text').html(data.list[index].blessing);
      } else {
        $(this).remove();
      }
      cur_count++;
    });

    if (cur_count < dataLength) {
      for (idx = cur_count; idx < dataLength; idx++) {
        var str =
          '<h3 class="media-heading">' +
          data.list[idx].nickname +
          '<span>·' +
          data.list[idx].timeDescription +
          '</span></h3>' +
          '<div id="blessing-text">' +
          data.list[idx].blessing +
          '</div></div></li>';
        $('.media-list').append(commonStr + str);
      }
    }

    updatePaging(data.total, data.pageSize, data.pageIndex);
  }

  function showToast(msg) {
    $('.toast').addClass('active');
    $('.toast p').html(msg);
    setTimeout(function () {
      $('.toast').removeClass('active');
      $('.toast p').text('');
    }, 2000);
  }

  $('#save').click(function () {
    var nickname = $('#nick-name').val();
    var advice = $('#advice').val();
    var blessing = $('#blessing').val();
    $('.name-tips, .blessing-tips').text('');
    if (!nickname) {
      showToast('昵称是必填的哦^_^');
      return;
    }

    if (!blessing) {
      showToast('求祝福^_^');
      return;
    }
    $.ajax({
      type: 'POST',
      url: '/api/blessing',
      data: {
        nickname,
        advice,
        blessing,
      },
      dataType: 'json',
      success: function (data) {
        if (data.data) {
          showToast('恭喜您成为第' + data.data.total + '个为豆米送上祝福的人');
          successAction(data.data);
        } else {
          showToast(data.msg);
        }
      },
      error: function (jqXHR) {
        showToast('发生错误：' + jqXHR.status);
      },
    });
  });
  function getBlessingList(jumpPage) {
    $.ajax({
      type: 'GET',
      url: '/api/blessing/list',
      data: {
        pageIndex: jumpPage,
        pageSize: 6,
      },
      dataType: 'json',
      success: function (data) {
        if (data.data) {
          successAction(data.data);
        } else {
          showToast(data.msg);
        }
      },
      error: function (jqXHR) {
        showToast('发生错误：' + jqXHR.status);
      },
    });
  }

  $(document).on('click', '#nextPage', function () {
    var currentPage = parseInt($('#pagination').find('.active a').html());
    getBlessingList(currentPage + 1);
  });
  $(document).on('click', '#prePage', function () {
    var currentPage = parseInt($('#pagination').find('.active a').html());
    getBlessingList(currentPage - 1);
  });
  $(document).on('click', '.pageId', function () {
    var jumpPage = 0;
    jumpPage = $(this).html();
    getBlessingList(jumpPage);
  });
});
