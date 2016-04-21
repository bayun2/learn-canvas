'use strict';
import Kinetic from 'kinetic';

class Index {
  constructor(config) {
    this.defaultWidth = 440;
    this.defaultHeight = 310;

    this.k = config.containerWidth/this.defaultWidth;
    config.containerHeight = this.defaultHeight * this.k;
    config.scoerFontSize = 24 * this.k;
    config.labelMargin = 10 * this.k;
    config.labelFontSize = 20 * this.k;
    config.scorePercentFontSize = 12 * this.k;
    config.stepWidth = config.stepWidth * this.k;
    // 数据为0时显示一个step而不是一个点
    config.step = config.step + config.zeroStep;
    // 根据lable的字号和margin来决定雷达图从什么点开始画
    // 横向距离，4个字的宽度+一个margin
    // 纵向距离，1个字的高度+一个margin
    config.x = config.labelMargin + config.labelFontSize*4;
    config.y = config.labelMargin + config.labelFontSize;
    config.maxRadius = config.stepWidth * config.step;
    config.maxDiameter = config.maxRadius*2;
    this.stage = new Kinetic.Stage({
      container: config.container,
      width: config.containerWidth,
      height: config.containerHeight
    })
    this.layer = new Kinetic.Layer();
    this.drawCoordinate(config);
    this.drawData(config);
    this.drawScore(config);
    this.drawLabel(config);
    this.stage.add(this.layer);
    this.stage.draw();
  }

  drawCoordinate(config) {
    var i = 0;
    for (config.step; config.step > 0; config.step--) {
      var points = [config.maxRadius, config.stepWidth*i, config.maxDiameter-(config.stepWidth*i), config.maxRadius, config.maxRadius, config.maxDiameter-(config.stepWidth*i), config.stepWidth*i, config.maxRadius];
      i++;
      var line = new Kinetic.Line({
        x: config.x,
        y: config.y,
        points: points,
        stroke: config.stroke,
        tension: 0,
        closed: true,
        dashEnabled: true,
        dash: [5, 5]
      });
      this.layer.add(line);
    }
    var xline = new Kinetic.Line({
      x: config.x,
      y: config.y,
      points: [0, config.maxRadius, config.maxDiameter, config.maxRadius],
      stroke: config.stroke
    });
    var yline = new Kinetic.Line({
      x: config.x,
      y: config.y,
      points: [config.maxRadius, 0, config.maxRadius, config.maxDiameter],
      stroke: config.stroke
    });
    this.layer.add(xline);
    this.layer.add(yline);
  }

  drawData(config) {
    var points = [
      config.maxRadius,
      config.maxRadius-config.data[0]*this.k-(config.stepWidth*config.zeroStep),
      config.maxRadius+config.data[1]*this.k+(config.stepWidth*config.zeroStep),
      config.maxRadius,
      config.maxRadius,
      config.maxRadius+config.data[2]*this.k+(config.stepWidth*config.zeroStep),
      config.maxRadius-config.data[3]*this.k-(config.stepWidth*config.zeroStep),
      config.maxRadius
    ];
    var circle = new Kinetic.Circle({
      x: points[0]+config.x,
      y: points[1]+config.y,
      radius: config.circleRadius,
      fill: config.circleFill,
      stroke: config.circleStroke,
      strokeWidth: config.circleStrokeWidth
    });
    circle.on('click', function() {
      alert(0)
    })
    var circle1 = new Kinetic.Circle({
      x: points[2]+config.x,
      y: points[3]+config.y,
      radius: config.circleRadius,
      fill: config.circleFill,
      stroke: config.circleStroke,
      strokeWidth: config.circleStrokeWidth
    });
    circle1.on('click', function() {
      alert(1)
    })
    var circle2 = new Kinetic.Circle({
      x: points[4]+config.x,
      y: points[5]+config.y,
      radius: config.circleRadius,
      fill: config.circleFill,
      stroke: config.circleStroke,
      strokeWidth: config.circleStrokeWidth
    });
    circle2.on('click', function() {
      alert(2)
    })
    var circle3 = new Kinetic.Circle({
      x: points[6]+config.x,
      y: points[7]+config.y,
      radius: config.circleRadius,
      fill: config.circleFill,
      stroke: config.circleStroke,
      strokeWidth: config.circleStrokeWidth
    });
    circle3.on('click', function() {
      alert(3)
    })
    var line = new Kinetic.Line({
      x: config.x,
      y: config.y,
      points: points,
      stroke: config.dataConcatStroke,
      fill: config.dataConcatFill,
      tension: 0,
      closed: true
    });
    var group = new Kinetic.Group({
      x: config.x+config.maxDiameter/2,
      y: config.y+config.maxDiameter/2,
      scale: {
        x:0,
        y:0
      }
    });
    group.add(line);
    group.add(circle);
    group.add(circle1);
    group.add(circle2);
    group.add(circle3);
    this.layer.add(group);
    var tween = new Kinetic.Tween({
      node: group,
      x: 0,
      y: 0,
      scaleX:1,
      scaleY:1,
      duration: 1,
      easing: Kinetic.Easings.EaseInOut
    });
    tween.play();
  }

  drawScore(config) {
    var score = new Kinetic.Text({
      text: config.score,
      fontSize: config.scoerFontSize,
      fontFamily: config.scoerFontFamily,
      fill: config.scoerFill
    });
    var x = (config.maxDiameter - score.width())/2+config.x;
    var y = (config.maxDiameter - score.height())/2 - config.stepWidth/2+config.y;
    score.x(x);
    score.y(y);

    var scorePercent = new Kinetic.Text({
      text: config.scorePercent,
      fontSize: config.scorePercentFontSize,
      fontFamily: config.scorePercentFontFamily,
      fill: config.scorePercentFill
    });
    var x = (config.maxDiameter - scorePercent.width())/2+config.x;
    var y = (config.maxDiameter - scorePercent.height())/2 + config.stepWidth/2+config.y;
    scorePercent.x(x);
    scorePercent.y(y);

    this.layer.add(score);
    this.layer.add(scorePercent);
  }

  drawLabel(config) {
    // 盈利能力
    var profitability = new Kinetic.Text({
      text: config.profitability,
      fontSize: config.labelFontSize,
      fontFamily: config.labelFontFamily,
      fill: config.labelFill
    });
    profitability.x((config.maxDiameter - profitability.width())/2+config.x);
    profitability.y(0);

    // 稳定性
    var consistency = new Kinetic.Text({
      width: config.labelFontSize*4,
      align: 'center',
      text: config.consistency,
      fontSize: config.labelFontSize,
      fontFamily: config.labelFontFamily,
      fill: config.labelFill
    });
    consistency.x(0);
    consistency.y((config.maxDiameter - consistency.height())/2+config.y);

    // 风险控制
    var riskCtrl = new Kinetic.Text({
      text: config.riskCtrl,
      fontSize: config.labelFontSize,
      fontFamily: config.labelFontFamily,
      fill: config.labelFill
    });
    riskCtrl.x(config.maxDiameter+config.x+config.labelMargin);
    riskCtrl.y((config.maxDiameter - riskCtrl.height())/2+config.y);

    // 活跃程度
    var activity = new Kinetic.Text({
      text: config.activity,
      fontSize: config.labelFontSize,
      fontFamily: config.labelFontFamily,
      fill: config.labelFill
    });
    activity.x((config.maxDiameter - profitability.width())/2+config.x);
    activity.y(config.maxDiameter+config.y+config.labelMargin);

    this.layer.add(profitability);
    this.layer.add(consistency);
    this.layer.add(riskCtrl);
    this.layer.add(activity);
  }
}
var config = {
  container: 'container',
  containerWidth: 214,
  stepWidth: 20,
  step: 5,
  stroke: 'grey',
  data: [60, 20, 0, 100],
  circleRadius: 5,
  circleStroke: 'white',
  circleStrokeWidth: 2,
  circleFill: 'green',
  dataConcatStroke: 'green',
  dataConcatFill: 'rgba(0,255,0,0.5)',
  zeroStep: 1,
  score: '80.56',
  scoerFontFamily: 'Calibri',
  scoerFill: 'green',
  scorePercent: '0.13%',
  scorePercentFontFamily: 'Calibri',
  scorePercentFill: 'green',
  labelFontFamily: 'Calibri',
  labelFill: 'grey',
  profitability: '盈利能力',
  consistency: '稳定性',
  riskCtrl: '风险控制',
  activity: '活跃程度'
}
new Index(config);
module.exports = Index;
