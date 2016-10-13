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



//ȡ���ֵ
function getRangeRandom(low,hight){
    return Math.ceil(Math.random()*(hight-low)+low);
}


//ȡ��б�Ƕ�-30��30�����ֵ

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

        // ���props������ָ��������ͼƬ��λ�ã���ʹ��
        if (this.props.arrange.pos) {
            styleObj = this.props.arrange.pos;
        }

        // ���props������ָ��������ͼƬ����ת�Ƕȣ���ʹ��
        if (this.props.arrange.rotate) {
            (['MozTransform','WebkitTransform','msTransform','transform']).forEach(function(value){
                styleObj[value]='rotate('+this.props.arrange.rotate+'deg)';
            }.bind(this))
        }

        // ���props������ָ��������ͼƬҪ���棬��ʹ��
        var imgFigureClassName = 'img-figure';
        imgFigureClassName += this.props.arrange.isInverse ? ' is-inverse' : '';

        // ���props������ָ��������ͼƬ������λ�ã���ʹ��
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

        //ȡ��Ҫ�����ϲ��ͼƬ״̬��Ϣ(splice,������������ɾ�������ұ��浽imgsTopArr)
        topImgSpliceIndex=Math.ceil(Math.random()*(imgsArr.length-topImgNum));
        imgsTopArr=imgsArr.splice(topImgSpliceIndex,topImgNum)

        //����λ���ϲ��ͼƬ

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

        //�������������ͼƬ

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

        //splice ������������-������ָ��λ�ò���������Ԫ�ء�������������һ����������ʼλ�ã����ڶ���������0����������������������

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
        //�õ���̨��С
        var stageDom=this.refs.stage,
            stageW=stageDom.scrollWidth,
            stageH=stageDom.scrollHeight,
            halfstageW=stageW/2,
            halfstageH=stageH/2;

        //����ͼƬ��С
        var imgDom=ReactDOM.findDOMNode(this.refs.imgfigure0),
            imgW=imgDom.scrollWidth,
            imgH=imgDom.scrollHeight,
            halfimgW=imgW/2,
            halfimgH=imgH/2;

        /*��Χ��С*/

        //��������ͼƬλ��

        this.constant.centerPos={
            left:halfstageW-halfimgW,
            top:halfstageH-halfimgH
        };

        //ˮƽλ�÷�Χ��С
        this.constant.hPosRange={
            leftSecX:[-halfimgW,halfstageW-halfimgW*3],
            rightSecX:[halfstageW+halfimgW,stageW-halfimgW],
            y:[-halfimgH,stageH-halfimgH]
        };
        //��ֱλ�÷�Χ��С
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