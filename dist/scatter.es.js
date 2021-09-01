import 'core-js/modules/web.timers.js';
import 'core-js/modules/es.number.to-fixed.js';
import 'core-js/modules/es.number.constructor.js';
import 'core-js/modules/es.regexp.exec.js';
import 'core-js/modules/es.string.replace.js';
import 'core-js/modules/es.array.iterator.js';
import 'core-js/modules/es.array-buffer.slice.js';
import 'core-js/modules/es.object.to-string.js';
import 'core-js/modules/es.typed-array.float32-array.js';
import 'core-js/modules/es.typed-array.copy-within.js';
import 'core-js/modules/es.typed-array.every.js';
import 'core-js/modules/es.typed-array.fill.js';
import 'core-js/modules/es.typed-array.filter.js';
import 'core-js/modules/es.typed-array.find.js';
import 'core-js/modules/es.typed-array.find-index.js';
import 'core-js/modules/es.typed-array.for-each.js';
import 'core-js/modules/es.typed-array.includes.js';
import 'core-js/modules/es.typed-array.index-of.js';
import 'core-js/modules/es.typed-array.iterator.js';
import 'core-js/modules/es.typed-array.join.js';
import 'core-js/modules/es.typed-array.last-index-of.js';
import 'core-js/modules/es.typed-array.map.js';
import 'core-js/modules/es.typed-array.reduce.js';
import 'core-js/modules/es.typed-array.reduce-right.js';
import 'core-js/modules/es.typed-array.reverse.js';
import 'core-js/modules/es.typed-array.set.js';
import 'core-js/modules/es.typed-array.slice.js';
import 'core-js/modules/es.typed-array.some.js';
import 'core-js/modules/es.typed-array.sort.js';
import 'core-js/modules/es.typed-array.subarray.js';
import 'core-js/modules/es.typed-array.to-locale-string.js';
import 'core-js/modules/es.typed-array.to-string.js';

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;

  try {
    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}

function _construct(Parent, args, Class) {
  if (_isNativeReflectConstruct()) {
    _construct = Reflect.construct;
  } else {
    _construct = function _construct(Parent, args, Class) {
      var a = [null];
      a.push.apply(a, args);
      var Constructor = Function.bind.apply(Parent, a);
      var instance = new Constructor();
      if (Class) _setPrototypeOf(instance, Class.prototype);
      return instance;
    };
  }

  return _construct.apply(null, arguments);
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

//创建贝塞尔曲线函数
function Bezier(mX1, mY1, mX2, mY2) {
  var NEWTON_ITERATIONS = 4;
  var NEWTON_MIN_SLOPE = 0.001;
  var SUBDIVISION_PRECISION = 0.0000001;
  var SUBDIVISION_MAX_ITERATIONS = 10;
  var kSplineTableSize = 11;
  var kSampleStepSize = 1.0 / (kSplineTableSize - 1.0);
  var float32ArraySupported = typeof Float32Array === 'function';

  function A(aA1, aA2) {
    return 1.0 - 3.0 * aA2 + 3.0 * aA1;
  }

  function B(aA1, aA2) {
    return 3.0 * aA2 - 6.0 * aA1;
  }

  function C(aA1) {
    return 3.0 * aA1;
  }

  function calcBezier(aT, aA1, aA2) {
    return ((A(aA1, aA2) * aT + B(aA1, aA2)) * aT + C(aA1)) * aT;
  }

  function getSlope(aT, aA1, aA2) {
    return 3.0 * A(aA1, aA2) * aT * aT + 2.0 * B(aA1, aA2) * aT + C(aA1);
  }

  function binarySubdivide(aX, aA, aB, mX1, mX2) {
    var currentX,
        currentT,
        i = 0;

    do {
      currentT = aA + (aB - aA) / 2.0;
      currentX = calcBezier(currentT, mX1, mX2) - aX;

      if (currentX > 0.0) {
        aB = currentT;
      } else {
        aA = currentT;
      }
    } while (Math.abs(currentX) > SUBDIVISION_PRECISION && ++i < SUBDIVISION_MAX_ITERATIONS);

    return currentT;
  }

  function newtonRaphsonIterate(aX, aGuessT, mX1, mX2) {
    for (var i = 0; i < NEWTON_ITERATIONS; ++i) {
      var currentSlope = getSlope(aGuessT, mX1, mX2);

      if (currentSlope === 0.0) {
        return aGuessT;
      }

      var currentX = calcBezier(aGuessT, mX1, mX2) - aX;
      aGuessT -= currentX / currentSlope;
    }

    return aGuessT;
  }

  function LinearEasing(x) {
    return x;
  }

  if (!(0 <= mX1 && mX1 <= 1 && 0 <= mX2 && mX2 <= 1)) {
    throw new Error('bezier x values must be in [0, 1] range');
  }

  if (mX1 === mY1 && mX2 === mY2) {
    return LinearEasing;
  } // Precompute samples table


  var sampleValues = float32ArraySupported ? new Float32Array(kSplineTableSize) : new Array(kSplineTableSize);

  for (var i = 0; i < kSplineTableSize; ++i) {
    sampleValues[i] = calcBezier(i * kSampleStepSize, mX1, mX2);
  }

  function getTForX(aX) {
    var intervalStart = 0.0;
    var currentSample = 1;
    var lastSample = kSplineTableSize - 1;

    for (; currentSample !== lastSample && sampleValues[currentSample] <= aX; ++currentSample) {
      intervalStart += kSampleStepSize;
    }

    --currentSample;
    var dist = (aX - sampleValues[currentSample]) / (sampleValues[currentSample + 1] - sampleValues[currentSample]);
    var guessForT = intervalStart + dist * kSampleStepSize;
    var initialSlope = getSlope(guessForT, mX1, mX2);

    if (initialSlope >= NEWTON_MIN_SLOPE) {
      return newtonRaphsonIterate(aX, guessForT, mX1, mX2);
    } else if (initialSlope === 0.0) {
      return guessForT;
    } else {
      return binarySubdivide(aX, intervalStart, intervalStart + kSampleStepSize, mX1, mX2);
    }
  }

  return function BezierEasing(x) {
    if (x === 0 || x === 1) {
      return x;
    }

    return calcBezier(getTForX(x), mY1, mY2);
  };
}

function Scatter(options) {
  var defaultOptions = {
    num: 50,
    animateSpeed: 50,
    //散播动画曲线
    spreadBezier: [0.15, 0.43, 0, 0.99],
    //散播之后的动画曲线
    animateBezier: [0.79, 0.01, 0, 0.76],
    spreadDelay: 300,
    maxDistance: 20 //最大位移距离

  };
  options = _extends(defaultOptions, options);

  function isIE() {
    return !!window.ActiveXobject || "ActiveXObject" in window;
  }

  function isIE11() {
    return /Trident\/7\./.test(navigator.userAgent);
  }

  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = function (cb) {
      return setTimeout(function () {
        cb();
      }, 1000 / 60);
    };
  } //创建圆点容器


  function createScatterContainer() {
    var containerNode = document.querySelector('#scatter-container-scatterjs');

    if (containerNode) {
      if (isIE() || isIE11()) {
        containerNode.removeNode();
      } else {
        containerNode.remove();
      }
    }

    var container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.zIndex = -1;
    container.style.top = 0;
    container.style.left = 0;
    container.style.right = 0;
    container.id = 'scatter-container-scatterjs';
    document.body.appendChild(container);
  } //创建单个圆点，创建之后圆点的位置在页面中心


  function createScatter(width, height, top, left, backgroundColor, opacity) {
    var box = document.createElement('div');
    box.className = 'single-scatter-scatterjs';
    box.style.position = 'absolute';
    box.style.borderRadius = '50%';
    box.style.backgroundColor = backgroundColor;
    box.style.opacity = 0.0001;
    box.style.width = width + 'px';
    box.style.height = height + 'px'; // box.style.display = 'none';

    var centerTop = document.documentElement.clientHeight / 2;
    var centerLeft = document.documentElement.clientWidth / 2;
    box.style.top = centerTop + 'px';
    box.style.left = centerLeft + 'px';
    box.style.transform = 'translate(-50%,-50%)'; //把数据记录在data中,后续扩散使用

    box.data = {};
    box.data.centerTop = centerTop;
    box.data.centerLeft = centerLeft;
    box.data.top = top;
    box.data.left = left;
    box.data.width = width;
    box.data.height = height;
    box.data.opacity = opacity;
    document.querySelector('#scatter-container-scatterjs').appendChild(box);
  } //获取指定范围的随机数，isRound表示是否取整


  function getRandom(min, max, isRound) {
    var random = min + Math.random() * max;
    random = random.toFixed(5);
    return isRound ? Math.round(random) : Number(random);
  } //创建指定数量的圆点


  function createScatters(num) {
    createScatterContainer();
    var clientWidth = document.documentElement.clientWidth;
    var clientHeight = document.documentElement.clientHeight;

    for (var index = 0; index < num; index++) {
      //宽度在10-50px之间
      var size = getRandom(10, 50, true);
      var top = getRandom(100, clientHeight - 300, true);
      var left = getRandom(50, clientWidth - 200, true);
      var backgroundColor = 'rgb(' + getRandom(150, 255, true) + ',255,255)';
      var opacity = getRandom(0, 0.2);
      createScatter(size, size, top, left, backgroundColor, opacity);
    }
  } //获取随机方向，使动画更分散和真实。分上下左右 左上 右上 左下 右下8个方向，分别用1 2 3 4 5 6 7 8表示
  //方向不那么正态分布，8会多一些


  function getRandomOrient() {
    var random = Math.round(Math.random() * 10); //大于8的都返回8

    return random > 8 ? 8 : random;
  } //圆点从中心扩散到四周


  function spreadAll() {
    var bezier = _construct(Bezier, _toConsumableArray(options.spreadBezier));

    var scatters = document.querySelectorAll('.single-scatter-scatterjs');
    var duration = 1000;
    var flushTime = 16;
    var abs = Math.abs;

    var _loop = function _loop(i) {
      var scatter = scatters[i];
      var baseLeft = Number(scatter.style.left.replace('px', ''));
      var baseTop = Number(scatter.style.top.replace('px', ''));
      var moveLeft = scatter.data.left - scatter.data.centerLeft;
      var moveTop = scatter.data.top - scatter.data.centerTop;
      var speedLeft = moveLeft / duration * flushTime;
      var speedTop = moveTop / duration * flushTime;
      var speedOpacity = scatter.data.opacity / duration * flushTime;
      speedOpacity = Number(speedOpacity.toFixed(7)); //已经移动的距离绝对值，用来判断移动边界

      var needMoveLeftAbs = abs(moveLeft);
      var needMoveTopAbs = abs(moveTop);
      var needOpacity = scatter.data.opacity;
      var movedLeft = 0;
      var movedTop = 0;
      var renderedOpacity = 0;
      var intervalId = setInterval(function () {
        //动画终止条件
        // console.log(abs(movedLeft), needMoveLeftAbs, abs(movedTop), needMoveTopAbs, renderedOpacity, needOpacity);
        // console.log(abs(movedLeft) > needMoveLeftAbs, abs(movedTop) > needMoveTopAbs, renderedOpacity > needOpacity);
        if (abs(movedLeft) >= needMoveLeftAbs && abs(movedTop) >= needMoveTopAbs && renderedOpacity >= needOpacity) {
          clearInterval(intervalId);
        } //已经移动的距离


        movedLeft += speedLeft;
        movedTop += speedTop;
        renderedOpacity += speedOpacity;
        var originOpacity = Number(scatter.style.opacity); //动画进程百分比

        var percent = abs(movedLeft) / needMoveLeftAbs;
        scatter.style.left = baseLeft + bezier(percent) * moveLeft + 'px';
        scatter.style.top = baseTop + bezier(percent) * moveTop + 'px';
        scatter.style.opacity = originOpacity + speedOpacity;
      }, flushTime);
    };

    for (var i = 0; i < scatters.length; i++) {
      _loop(i);
    }
  } //让所有圆点开始移动


  function startMoveAll() {
    //创建贝塞尔缓动曲线
    var bezier = _construct(Bezier, _toConsumableArray(options.animateBezier));

    var scatters = document.querySelectorAll('.single-scatter-scatterjs'); //最大位移距离，超过之后反向运动

    var MAX_DISTANCE = options.maxDistance;

    var _loop2 = function _loop2(i) {
      var scatter = scatters[i];
      scatter.style || (scatter.style = {}); //步进值，使用随机数，使每个元素的速度产生区别

      var STEP_DISTANCE = getRandom(2, 5, true) / 5000 * options.animateSpeed; //获取随机方向

      var orient = getRandomOrient(); //当前偏移量

      var currentMove = 0;
      var step = STEP_DISTANCE;

      function move() {
        //到达最大位移距离之后，需要反向运动
        if (currentMove > MAX_DISTANCE || currentMove < 0) {
          step = -step;
        } //计算当前位移所在整段动画阶段的百分比


        var percent = Math.abs(currentMove) / MAX_DISTANCE;
        currentMove += step; //根据贝塞尔曲线做一个缓动效果（将当前位移量根据百分比做一个衰减，达到曲线的效果）

        var actualCurrentMove = Number(bezier(percent).toFixed(3)) * currentMove;
        var transform = '';

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
    };

    for (var i = 0; i < scatters.length; i++) {
      _loop2(i);
    }
  }

  createScatters(options.num);
  setTimeout(function () {
    spreadAll();
    startMoveAll();
  }, options.spreadDelay);
}

export { Scatter as default };
