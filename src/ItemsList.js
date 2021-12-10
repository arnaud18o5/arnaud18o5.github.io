import React, { useEffect,useState} from "react";

export default function ItemsList(props){
    const [items, setItems] = useState(null);
    const [choice, setChoice] = useState(null);

    useEffect(() => {
        console.log("useEffect itemlist changed")
        //if(items === null){
            if(props.items !== null){
                var newItems = props.items;
                newItems.map((item) => {
                    if(item !== choice)
                        item.classN = "list-group-item list-group-item-action";
                })
                setItems(newItems);
            }
       // }
    }, [props])

    /*useEffect(() => {
        if(items !== null){
            var updatedItems = items.map((item) => {
                if(item.classN === null){
                item.classN = "list-group-item list-group-item-action";
                }
            });
            setItems(updatedItems);
        }
    }, [items])*/

    useEffect(() => {
        console.log("change item in item list")
        if(choice !== null){
            items.map((item) => {
                if(item.classN === "list-group-item list-group-item-action active"){
                    props.changeItem(item);
                    console.log("click on an item")
                }
            })
        }
    }, [items])

    

    function handleClick(id){
            var updatedItems = items.map((item) => item._id === id ? {
                ...item,
                classN: "list-group-item list-group-item-action active"
                } : {...item,
                classN:"list-group-item list-group-item-action"});
                items.map((item) => {if(item._id === id)  setChoice(items)});
            setItems(updatedItems)
            
    }


    if(items !== null){
        return(
            <div className=" card w-25 p-3 h-75 start-0" style={{height:"75%"},{backgroundColor:"#EFEFEF"},{padding:"0"}}>
                
                <div class="list-group w-100" style={{margin:"0"}}>
                    <div className="list-group-item gray-400 d-flex justify-content-between align-items-center ">My items : <button class="btn btn-sm btn-secondary" onClick={props.addItem}>+</button></div>
                    {items.map(d => (
                        <button class={d.classN} aria-current="true" onClick={() => handleClick(d._id)}><div className="list-group-item d-flex justify-content-between align-items-center " style={{borderWidth:"0", backgroundColor:"transparent"}}>{d.name}<button class="btn btn-danger btn-sm position-absolute top-25 end-0" onClick={() => props.deleteItem(d._id)}>X</button></div></button>
                    ))}
                </div>
            </div>
        )
    }
    else{
        return(
            <p>Rien a afficher</p>
        );
    }
    
}