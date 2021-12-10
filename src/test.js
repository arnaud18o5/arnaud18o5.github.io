import React, { useEffect,useState} from "react";

export default function Test(props){
    const [value, setValue] = useState('rien');

    useEffect(()=>{
        setValue(props.value);
    })

    return(
        <p>{value}</p>
    )
}