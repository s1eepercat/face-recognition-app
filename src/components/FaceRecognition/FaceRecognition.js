import React from 'react';
import './FaceRecognition.css';

const FaceRecognition = ({ imageUrl, box }) => {

    const length = box.length;
    const boxes = [];

    for (let i = 0; i < length; i++) {
        boxes.push(<div className='bounding-box' key={i} style={{ top: box[i].topRow, right: box[i].rightCol, bottom: box[i].bottomRow, left: box[i].leftCol }}></div>);
    }

    return (
        <div className='center ma'>
            <div className='absolute mt2 mb6'>
                <img id='inputimage' alt='' src={imageUrl} width='500px' height='auto' />
                {boxes}
            </div>
        </div >
    );
}

export default FaceRecognition;
