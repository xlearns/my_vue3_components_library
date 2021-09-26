class FrameState{
  maxFrame:Number
  currFrame:Number
  minFrame:Number
  currTime:any
  elapseTime:any
  _sTime:any
  _sTFrame:any
  timer:any
  constructor(){
    //name
    this.timer = null
    //最大
    this.maxFrame = 0
    //当前
    this.currFrame = 0
    //最小
    this.minFrame = 0
    //当前时间
    this.currTime = 0
    //每帧运行时间
    this.elapseTime = 0
    //每秒开始时间
    this._sTime = 0
    //每秒总帧数
    this._sTFrame = 0
  }
  //启动
  start(){
    this.currTime = this._sTime = new Date()
  }
  //更新
  update(){
    let ftime:any = new Date()
    if(ftime - this._sTime>=1000){
      this.currFrame = this._sTFrame
      this.maxFrame =  this.maxFrame>= this._sTFrame?this.maxFrame:this._sTFrame
      this.minFrame =  this.minFrame<= this._sTFrame?this.minFrame:this._sTFrame

      this._sTFrame = 0
      this._sTime = ftime
    }else{
      ++this._sTFrame
    }
    this.elapseTime = ftime - this.currTime
    this.currTime = ftime
  }
}
export default FrameState