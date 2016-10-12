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



class ImgFigure extends React.Component{
    render(){
        return(
            <figure className="img-figure">
                <img src={this.props.data.imageUrl} alt="" />
                <figcaption>
                    <h2 className="img-title">
                        {this.props.data.title}
                    </h2>
                </figcaption>
            </figure>
        );
    }
}


class App extends React.Component{
    constructor(props){
        super(props);
        this.state= {
            imgsArrangeArr: []
        }
    }
    rearrange(){
          var imgsArr=this.state.imgsArrangeArr,
              constant=this.constant(),
              vPosRange=constant.vPosRange,
              hPosRange=constant.hPosRange,
              centerPos=constant.centerPos,
              hPosRangeLeftSecX=hPosRange.leftSecX,
              hPosRangeRightSecX=hPosRange.rightSecX;

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

    }
    render(){
        var controllerUnits=[],
            imgFigures=[];
        imagesData.map(function(value,index){
            imgFigures.push(<ImgFigure data={value} key={index} ref={'imgfigure'+index}/>);
        });
        return(
          <section className="stage" ref="stage">
              <section className="img-sec">
                  {imgFigures}
              </section>
              <nav>
                  {controllerUnits}
              </nav>
          </section>
        );
    }
}

export default App;