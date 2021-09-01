## 
## 使用方法：  
1. 直接在html中引入`./dist/scatter.js`，或者`require('@waitkafuka/scatterjs')`  
2. 创建实例并传入参数：  
```javascript
new Scatter(options)
```
## options支持参数：
名称|备注|默认值  
-|-|-
num|生成的圆点数量|50  
spreadDelay|圆点散播之前的延迟时间|300  
spreadBezier|圆点散播时候的贝塞尔曲线参数|[0.15, 0.43, 0, 1]
animateBezier|圆点就位之后的运动贝塞尔曲线参数|[0.79, 0.01, 0, 0.76] 
animateSpeed|圆点就位之后的运动速度|50  
maxDistance|圆点最大位移距离|20  