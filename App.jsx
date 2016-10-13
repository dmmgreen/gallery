import React from 'react';
import ReactDOM from 'react-dom';
import './styles/style.css';

var imagesData=require('./data/imageDatas.json');

imagesData=(function getImageUrl(imgArr){
    for(var i=0,j=imgArr.length;i<j;i++){
        var simpleImageData=imgArr[i];
        simpleImageData.imageUrl='./images/'+imgArr[i].fileName;
        imgArr[i]=simpleImageData;
    }
    return imgArr;
})(imagesData);



//取随机值
function getRangeRandom(low,hight){
    return Math.ceil(Math.random()*(hight-low)+low);
}


//取倾斜角度-30到30的随机值

function getRangeRotate(){
    return (Math.random()>0.5 ? '':'-')+Math.ceil(Math.random()*30);
}

class ImgFigure extends React.Component{
    handleClick(ev){
        ev.stopPropagation();
        ev.preventDefault();
        if(this.props.arrange.isCenter){
            this.props.inverse();
        }else{
            this.props.center();
        }
    }
    render(){
        var styleObj = {};

        // 如果props属性中指定了这张图片的位置，则使用
        if (this.props.arrange.pos) {
            styleObj = this.props.arrange.pos;
        }

        // 如果props属性中指定了这张图片是旋转角度，则使用
        if (this.props.arrange.rotate) {
            (['MozTransform','WebkitTransform','msTransform','transform']).forEach(function(value){
                styleObj[value]='rotate('+this.props.arrange.rotate+'deg)';
            }.bind(this))
        }

        // 如果props属性中指定了这张图片要翻面，则使用
        var imgFigureClassName = 'img-figure';
        imgFigureClassName += this.props.arrange.isInverse ? ' is-inverse' : '';

        // 如果props属性中指定了这张图片是中心位置，则使用
        if (this.props.arrange.isCenter) {
            styleObj.zIndex=11;
        }


        return(
            <figure className={imgFigureClassName} style={styleObj} onClick={ev=>this.handleClick(ev)}>
                <img src={this.props.data.imageUrl} alt={this.props.data.title} />
                <figcaption>
                    <h2 className="img-title">
                        {this.props.data.title}
                        <div className="img-back">
                            <p>
                                {this.props.data.desc}
                            </p>
                        </div>
                    </h2>
                </figcaption>
            </figure>
        );
    }
}


class ControlUnits extends React.Component{
    handleClick(ev){
        ev.stopPropagation();
        ev.preventDefault();
        if(this.props.arrange.isCenter){
            this.props.inverse();
        }else{
            this.props.center();
        }
    }
    render(){
        var controlClass='controll-unit';
        controlClass += this.props.arrange.isCenter ? ' is-center' : '';
        controlClass += this.props.arrange.isInverse ? ' is-inverse' : '';
        return(
            <span className={controlClass} onClick={ev=>this.handleClick(ev)}></span>
        )
    }
}

class App extends React.Component{
    constructor(props){
        super(props);
        this.state= {
            imgsArrangeArr: []
        }
    }

    center(index){
       return (
           function (){
               return this.rearrange(index);
           }.bind(this)
       )
    }

    inverse(index){
        return function () {
            var imgsArrangeArr = this.state.imgsArrangeArr;

            imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;

            this.setState({
                imgsArrangeArr: imgsArrangeArr
            });
        }.bind(this);
    }
    rearrange(centerIndex){
          var imgsArr=this.state.imgsArrangeArr,
              constant=this.constant,
              vPosRange=constant.vPosRange,
              hPosRange=constant.hPosRange,
              centerPos=constant.centerPos,
              hPosRangeLeftSecX=hPosRange.leftSecX,
              hPosRangeRightSecX=hPosRange.rightSecX,
              hPosRangeY=hPosRange.y,
              vPosRangeX=vPosRange.x,
              vPosRangetopY=vPosRange.topY,


              imgsTopArr=[],
              topImgSpliceIndex=0,
              topImgNum=Math.floor(Math.random()*2),
              imgsCenterArr=imgsArr.splice(centerIndex,1);

        imgsCenterArr[0]={
            pos:centerPos,
            isCenter:true,
            rotate:0
        };

        //取出要布局上侧的图片状态信息(splice,两个参数用于删除，并且保存到imgsTopArr)
        topImgSpliceIndex=Math.ceil(Math.random()*(imgsArr.length-topImgNum));
        imgsTopArr=imgsArr.splice(topImgSpliceIndex,topImgNum)

        //布局位于上侧的图片

        imgsTopArr.map(function(value,index){
           imgsTopArr[index]={
               pos:{
                   left:getRangeRandom(vPosRangeX[0],vPosRangeX[1]),
                   top:getRangeRandom(vPosRangetopY[0],vPosRangetopY[1])
               },
               isCenter:false,
               rotate:getRangeRotate()
           }
        });

        //布局左右两侧的图片

        for(var i=0,j=imgsArr.length,k=j/2;i<j;i++){
            var hPosRangeLORX=null;
            if(i<k){
                hPosRangeLORX=hPosRangeLeftSecX;
            }else{
                hPosRangeLORX=hPosRangeRightSecX;
            }

            imgsArr[i]={
                pos:{
                    left:getRangeRandom(hPosRangeLORX[0],hPosRangeLORX[1]),
                    top:getRangeRandom(hPosRangeY[0],hPosRangeY[1])
                },
                isCenter:false,
                rotate:getRangeRotate()
            }
        }

        //splice 三个参数插入-向数组指定位置插入任意项元素。三个参数，第一个参数（起始位置），第二个参数（0），第三个参数（插入的项）

        if(imgsTopArr && imgsTopArr[0]){
            imgsArr.splice(topImgSpliceIndex,0,imgsTopArr[0]);
        }

        imgsArr.splice(centerIndex,0,imgsCenterArr[0]);

        this.setState({
           imgsArrangeArr:imgsArr
        });
    }
    constant(){
        return ({
            centerPos:{
                left:0,
                top:0
            },
            hPosRange:{
                leftSecX:[0,0],
                rightSecX:[0,0],
                y:[0,0]
            },
            vPosRange:{
                x:[0,0],
                topY:[0,0]
            }
        })
    }
    componentDidMount(){
        //拿到舞台大小
        var stageDom=this.refs.stage,
            stageW=stageDom.scrollWidth,
            stageH=stageDom.scrollHeight,
            halfstageW=stageW/2,
            halfstageH=stageH/2;

        //单个图片大小
        var imgDom=ReactDOM.findDOMNode(this.refs.imgfigure0),
            imgW=imgDom.scrollWidth,
            imgH=imgDom.scrollHeight,
            halfimgW=imgW/2,
            halfimgH=imgH/2;

        /*范围大小*/

        //设置中心图片位置

        this.constant.centerPos={
            left:halfstageW-halfimgW,
            top:halfstageH-halfimgH
        };

        //水平位置范围大小
        this.constant.hPosRange={
            leftSecX:[-halfimgW,halfstageW-halfimgW*3],
            rightSecX:[halfstageW+halfimgW,stageW-halfimgW],
            y:[-halfimgH,stageH-halfimgH]
        };
        //垂直位置范围大小
        this.constant.vPosRange={
            x:[halfstageW-imgW,halfstageW],
            topY:[-halfimgH,halfstageH-halfimgH*3]
        };

        this.rearrange(0);
    }
    render(){
        var controllerUnits=[],
            imgFigures=[];
        imagesData.map(function(value,index){
            if(!this.state.imgsArrangeArr[index]){
                this.state.imgsArrangeArr[index]={
                    pos:{
                        left:0,
                        top:0
                    },
                    isCenter:false,
                    rotate:0,
                    isInverse:false
                }
            }
            imgFigures.push(<ImgFigure data={value} key={index} arrange={this.state.imgsArrangeArr[index]} center={this.center(index)} inverse={this.inverse(index)}  ref={'imgfigure'+index}/>);
            controllerUnits.push(<ControlUnits  data={value} key={index} arrange={this.state.imgsArrangeArr[index]} center={this.center(index)} inverse={this.inverse(index)}/>);
        }.bind(this));
        return(
          <section className="stage" ref="stage">
              <section className="img-sec">
                  {imgFigures}
              </section>
              <nav className="controll-nav">
                  {controllerUnits}
              </nav>
          </section>
        );
    }
}

export default App;