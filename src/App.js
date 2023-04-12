import { useState, useRef } from 'react';
import preprocessImage from './preprocess';
import Tesseract from 'tesseract.js';
import './App.css';
 
function App() {
  const [image, setImage] = useState("");
  const [text, setText] = useState("banana");
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
 
  const handleChange = (event) => {
    setImage(URL.createObjectURL(event.target.files[0]))
  }

  const handleVoice = (event) => {
     let speech = new SpeechSynthesisUtterance();
     speech.lang = "en";
     speech.text = text
     window.speechSynthesis.speak(speech);
  }
 
  const handleClick = () => {
    
    window.img = imageRef
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
 
    ctx.drawImage(imageRef.current, 0, 0);
    //ctx.putImageData(canvas,0,0);
    const dataUrl = canvas.toDataURL("image/jpeg");
    Tesseract.recognize(
      dataUrl,'eng',
      { 
        logger: m => console.log(m) 
      }
    )
    .catch (err => {
      console.error(err);
    })
    .then(result => {
      // Get Confidence score
      let confidence = result.confidence
      console.log(result)
      window.result = result
      // Get full output
      let text = result.data.text
      setText(text);
    })
    /*
    */
  }
 
  return (
    <div className="App">
      <main className="App-main">
        <h3>Actual image uploaded</h3>
        <img 
           src={image} 
           ref={imageRef} 
           />
        <h3>Canvas</h3>
        <canvas ref={canvasRef} width={1700} height={2000}></canvas>
          <h3>Extracted text</h3>
        <div className="pin-box">
          <p> {text} </p>
        </div>
        <input type="file" onChange={handleChange} />
        <button onClick={handleClick} style={{height:50}}>Convert to text</button>
        <button onClick={handleVoice} style={{height:50}}>Listen to text</button>
      </main>
    </div>
  );
}
 
export default App 
