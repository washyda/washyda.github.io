//封装的缓动动画函数
function animate(obj,target,callback) {
    //不停点击会不停添加定时器产生bug,在执行前应该清除定时器
    clearInterval(obj.timer);
    //不用var重复使用内存，为对象添加属性
    obj.timer = setInterval(function () {
        var step = (target - obj.offsetLeft) / 10;
        //无限除不尽，并不会到达我们想要的位置
        //每次走的步数不应该为小数，使用Math的方法取舍 往右应该往大取
        //step = Math.ceil(step);
        //返回的位置不对，往反方向走为负数，应该向小值取
        step = step > 0 ? Math.ceil(step) : Math.floor(step);
        if (obj.offsetLeft === target) {
            //执行完毕清除定时器
            clearInterval(obj.timer);
            //执行完后判断callback执行
            if (callback) {
                callback();
            }
        }
        obj.style.left = obj.offsetLeft + step + 'px';
    },15);
}
window.addEventListener('DOMContentLoaded',function () {
    //dom元素加载完动态生成原点
    var ul = document.querySelector('.image');
    var ol = document.querySelector('.circle');
    for (var i = 0;i < ul.children.length;i++) {
        let lis = document.createElement('li');
        lis.setAttribute('date-index',i);
        i === 0 ? lis.className = 'current' : lis.className = '';
        ol.appendChild(lis);
    }
});
window.addEventListener('load',function () {
    //页面以及样式加载完后执行
    var spans = document.querySelector('.focus').querySelectorAll('span');
    var arrow_l = spans[0];
    var arrow_r = spans[1];
    var box = document.querySelector('.focus');
    var ul = document.querySelector('.image');
    var ol = document.querySelector('.circle');
    var foucsWidth = box.offsetWidth;
    //放置出现按钮
    box.addEventListener('mouseenter',function () {
        for (var i = 0;i < spans.length;i++) {
            spans[i].style.display = 'block';
        }
        //清除定时器
        clearInterval(timer);
        timer = null;
    });
    box.addEventListener('mouseleave',function () {
        for (var i = 0;i < spans.length;i++) {
            spans[i].style.display = 'none';
        }
        //添加定时器
        timer = setInterval(function() {
            arrow_r.click();
        },2000);
    });
    //作为全局变量
    var number = 0;
    var circle = 0;
    //点击小圆圈切换轮播图
    for (var i=0;i<ol.children.length;i++) {
        ol.children[i].addEventListener('click',function (event) {
            for (var i = 0;i < ol.children.length;i++) {
                ol.children[i].className = '';
            }
            this.className = 'current';
            var index = this.getAttribute('date-index');
            animate(ul,-index * foucsWidth);
            number = index;
            circle = index;
            event.stopPropagation();
         });
    }
    //复制节点无缝轮播
    ul.appendChild(ul.children[0].cloneNode(true));
    arrow_r.addEventListener('click',function () {
        if (number === ul.children.length-1) {
            ul.style.left = 0;
            number = 0;
        }
        number++;
        animate(ul,-number * foucsWidth);
        circle++;
        if (circle === ol.children.length) {
            circle = 0;
        }
        circleCurren();
    });
    arrow_l.addEventListener('click',function () {
        if (number === 0) {
            number = ul.children.length-1;
            ul.style.left = -number * foucsWidth + 'px';
        }
        number--;
        animate(ul,-number * foucsWidth);
        circle--;
        if (circle < 0) {
            circle = 3;
        }
        circleCurren();
    });
    function circleCurren() {
        for (var i = 0;i < ol.children.length;i++) {
            ol.children[i].className = '';
        }
        ol.children[circle].className = 'current';
    }
    var timer = setInterval(function() {
        arrow_r.click();
    },2000);
});