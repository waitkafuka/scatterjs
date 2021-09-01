import Bezier from "../lib/Bezier";

function Scatter(options) {
    let defaultOptions = {
        num: 50,
        animateSpeed: 50,
        //散播动画曲线
        spreadBezier: [0.15, 0.43, 0, 0.99],
        //散播之后的动画曲线
        animateBezier: [0.79, 0.01, 0, 0.76],
        spreadDelay: 300,
        maxDistance: 20,//最大位移距离
    }
    options = Object.assign(defaultOptions, options);

    function isIE() {
        return !!window.ActiveXobject || "ActiveXObject" in window
    }

    function isIE11() {
        return /Trident\/7\./.test(navigator.userAgent)

    }

    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function (cb) {
            return setTimeout(function () {
                cb()
            }, 1000 / 60);
        }
    }
    //创建圆点容器
    function createScatterContainer() {
        let containerNode = document.querySelector('#scatter-container-scatterjs');
        if (containerNode) {
            if (isIE() || isIE11()) {
                containerNode.removeNode()
            } else {
                containerNode.remove()
            }
        }
        let container = document.createElement('div');
        container.style.position = 'absolute';
        container.style.zIndex = -1;
        container.style.top = 0;
        container.style.left = 0;
        container.style.right = 0;
        container.id = 'scatter-container-scatterjs';
        document.body.appendChild(container);
    }

    //创建单个圆点，创建之后圆点的位置在页面中心
    function createScatter(width, height, top, left, backgroundColor, opacity) {
        let box = document.createElement('div');
        box.className = 'single-scatter-scatterjs';
        box.style.position = 'absolute';
        box.style.borderRadius = '50%';
        box.style.backgroundColor = backgroundColor;
        box.style.opacity = 0.0001;
        box.style.width = width + 'px';
        box.style.height = height + 'px';
        // box.style.display = 'none';

        let centerTop = document.documentElement.clientHeight / 2;
        let centerLeft = document.documentElement.clientWidth / 2;
        box.style.top = centerTop + 'px';
        box.style.left = centerLeft + 'px';
        box.style.transform = 'translate(-50%,-50%)';

        //把数据记录在data中,后续扩散使用
        box.data = {};
        box.data.centerTop = centerTop;
        box.data.centerLeft = centerLeft;
        box.data.top = top;
        box.data.left = left;
        box.data.width = width;
        box.data.height = height;
        box.data.opacity = opacity;
        document.querySelector('#scatter-container-scatterjs').appendChild(box);
    }

    //获取指定范围的随机数，isRound表示是否取整
    function getRandom(min, max, isRound) {
        let random = min + Math.random() * max;
        random = random.toFixed(5);
        return isRound ? Math.round(random) : Number(random);
    }

    //创建指定数量的圆点
    function createScatters(num) {
        createScatterContainer();
        let clientWidth = document.documentElement.clientWidth;
        let clientHeight = document.documentElement.clientHeight;
        for (let index = 0; index < num; index++) {
            //宽度在10-50px之间
            let size = getRandom(10, 50, true);
            let top = getRandom(100, clientHeight - 300, true);
            let left = getRandom(50, clientWidth - 200, true);
            let backgroundColor = 'rgb(' + getRandom(150, 255, true) + ',255,255)'
            let opacity = getRandom(0, 0.2);
            createScatter(size, size, top, left, backgroundColor, opacity);
        }
    }

    //获取随机方向，使动画更分散和真实。分上下左右 左上 右上 左下 右下8个方向，分别用1 2 3 4 5 6 7 8表示
    //方向不那么正态分布，8会多一些
    function getRandomOrient() {
        let random = Math.round(Math.random() * 10);
        //大于8的都返回8
        return random > 8 ? 8 : random;
    }

    //圆点从中心扩散到四周
    function spreadAll() {
        let bezier = new Bezier(...options.spreadBezier);
        let scatters = document.querySelectorAll('.single-scatter-scatterjs');
        let duration = 1000;
        let flushTime = 16;
        let abs = Math.abs;
        for (let i = 0; i < scatters.length; i++) {
            let scatter = scatters[i];
            let baseLeft = Number(scatter.style.left.replace('px', ''));
            let baseTop = Number(scatter.style.top.replace('px', ''));
            let moveLeft = scatter.data.left - scatter.data.centerLeft;
            let moveTop = scatter.data.top - scatter.data.centerTop;
            let speedLeft = moveLeft / duration * flushTime;
            let speedTop = moveTop / duration * flushTime;
            let speedOpacity = scatter.data.opacity / duration * flushTime;
            speedOpacity = Number(speedOpacity.toFixed(7));
            //已经移动的距离绝对值，用来判断移动边界
            let needMoveLeftAbs = abs(moveLeft);
            let needMoveTopAbs = abs(moveTop);
            let needOpacity = scatter.data.opacity;
            let movedLeft = 0;
            let movedTop = 0;
            let renderedOpacity = 0;
            let intervalId = setInterval(() => {
                //动画终止条件
                // console.log(abs(movedLeft), needMoveLeftAbs, abs(movedTop), needMoveTopAbs, renderedOpacity, needOpacity);
                // console.log(abs(movedLeft) > needMoveLeftAbs, abs(movedTop) > needMoveTopAbs, renderedOpacity > needOpacity);
                if (abs(movedLeft) >= needMoveLeftAbs && abs(movedTop) >= needMoveTopAbs && renderedOpacity >= needOpacity) {
                    clearInterval(intervalId);
                }
                //已经移动的距离
                movedLeft += speedLeft;
                movedTop += speedTop;
                renderedOpacity += speedOpacity;
                let originOpacity = Number(scatter.style.opacity);
                //动画进程百分比
                let percent = abs(movedLeft) / needMoveLeftAbs;

                scatter.style.left = baseLeft + (bezier(percent) * moveLeft) + 'px';
                scatter.style.top = baseTop + (bezier(percent) * moveTop) + 'px';
                scatter.style.opacity = originOpacity + speedOpacity;
            }, flushTime);
        }
    }

    //让所有圆点开始移动
    function startMoveAll() {
        //创建贝塞尔缓动曲线
        let bezier = new Bezier(...options.animateBezier);
        let scatters = document.querySelectorAll('.single-scatter-scatterjs');
        //最大位移距离，超过之后反向运动
        let MAX_DISTANCE = options.maxDistance;
        for (let i = 0; i < scatters.length; i++) {
            let scatter = scatters[i];
            scatter.style || (scatter.style = {});
            //步进值，使用随机数，使每个元素的速度产生区别
            let STEP_DISTANCE = getRandom(2, 5, true) / 5000 * options.animateSpeed;
            //获取随机方向
            let orient = getRandomOrient();
            //当前偏移量
            let currentMove = 0;
            let step = STEP_DISTANCE;
            function move() {
                //到达最大位移距离之后，需要反向运动
                if (currentMove > MAX_DISTANCE || currentMove < 0) {
                    step = -step;
                }
                //计算当前位移所在整段动画阶段的百分比
                let percent = Math.abs(currentMove) / MAX_DISTANCE;
                currentMove += step;
                //根据贝塞尔曲线做一个缓动效果（将当前位移量根据百分比做一个衰减，达到曲线的效果）
                let actualCurrentMove = Number(bezier(percent).toFixed(3)) * currentMove;
                let transform = '';
                switch (orient) {
                    //向上
                    case 1:
                        transform = 'translate(0, ' + -actualCurrentMove + 'px)';
                        break;
                    //向下
                    case 2:
                        transform = 'translate(0, ' + actualCurrentMove + 'px)';
                        break;
                    //向左
                    case 3:
                        transform = 'translate(' + -actualCurrentMove + 'px, 0)';
                        break;
                    //向右
                    case 4:
                        transform = 'translate(' + actualCurrentMove + 'px, 0)';
                        break;
                    //向左上
                    case 5:
                        transform = 'translate(' + -actualCurrentMove + 'px, ' + -actualCurrentMove + 'px)';
                        break;
                    //向右上
                    case 6:
                        transform = 'translate(' + actualCurrentMove + 'px, ' + -actualCurrentMove + 'px)';
                        break;
                    //向左下
                    case 7:
                        transform = 'translate(' + -actualCurrentMove + 'px, ' + actualCurrentMove + 'px)';
                        break;
                    //向右下
                    case 8:
                        transform = 'translate(' + actualCurrentMove + 'px, ' + actualCurrentMove + 'px)';
                        break;
                    default:
                        transform = 'translate(' + actualCurrentMove + 'px, ' + actualCurrentMove + 'px)';
                        break;
                }
                scatter.style.transform = transform;
                window.requestAnimationFrame(move);
            }
            window.requestAnimationFrame(move);
        }
    }

    createScatters(options.num);
    setTimeout(() => {
        spreadAll();
        startMoveAll();
    }, options.spreadDelay);
}

export default Scatter;