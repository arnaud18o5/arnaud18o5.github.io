import React, { useEffect,useState} from "react";

export default function ItemDetail(props){

    const [state, setState] = useState(false);
    const [newData, setNewData] = useState(props.data);
    
    useEffect(() => {
        if(newData === 0){
            setNewData(props.data);
            console.log("probleme")
        }
    },[newData]);
    
    if(!state){
        return(
            <>
            <div className="d-flex flex-row mb-3">
                <div className="d-flex flex-column bd-highlight mb-3">
                    <h5>{props.detail}</h5>
                    <p>{newData}</p>
                </div>
                <button class="btn btn-secondary btn-sm" onClick={() => setState(true)}>Edit</button>
            </div>
            </>
        )
    }
    else{
        return(
            <>
                <div className="d-flex align-self-center">
                    <div className="d-flex flex-column bd-highlight mb-3">
                        <h5>{props.detail}</h5>
                        <input type="text" placeholder={props.data}onChange={(e) => setNewData(e.target.value)}></input>
                    </div>
                    <div>
                    <button class="btn btn-secondary btn-sm" onClick={()=> {
                        props.editItem(props.id, newData, props.detail)
                        setState(false);
                    }}>Validate</button>
                    </div>
                    
                </div>
            </>
        )
    }
}