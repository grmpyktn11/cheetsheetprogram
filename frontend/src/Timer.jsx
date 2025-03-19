import "./timer.css";
import duck from "./assets/duck.gif"
function Timer(){
    

    return(
        <div className="container">
        <h1 className="title" >29:58</h1>
        <div className="button-holder">
            <button className="cool-button">PAUSE</button>
            <button className="cool-button">RESET</button>
            <input type="checkbox"></input>
             
        </div>
        <img src={duck} style={{width:"80px", height:"90px", marginLeft:"70px", marginTop:"-20px"}}></img>
    </div>
    )
}

export default Timer