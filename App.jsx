import React from 'react';

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






class App extends React.Component{
    render(){
        var controllerUnits=[],
            imgFigures=[];
        return(
          <section className="stage">
              <section>dfd</section>
              <nav></nav>
          </section>
        );
    }
}

export default App;