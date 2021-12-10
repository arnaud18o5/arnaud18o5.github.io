import React, { useEffect,useState} from "react";

export default function PoisList(props){

    return(
        <>
            <div className="card" style={{width: "20%"}}>
                <div class="accordion" id="accordionExample">
                    <div className="list-group-item gray-400 d-flex justify-content-between align-items-center ">Points of interest of the item :</div>
                    {props.pois.map(d => (
                        <div class="accordion-item">
                            <h2 class="accordion-header" id="headingOne">
                            <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target={"#collapse" + props.pois.indexOf(d)} aria-expanded="true" aria-controls={"collapse" + props.pois.indexOf(d)}>
                                <img style={{width:"10%"}}src={"https://lauriaristorage.blob.core.windows.net/"+d.poiImage}></img>   {d.name}
                            </button>
                            </h2>
                            <div id={"collapse" + + props.pois.indexOf(d)} class="accordion-collapse collapse show" aria-labelledby={"heading" + props.pois.indexOf(d)} data-bs-parent="#accordionExample">
                                <div class="accordion-body">

                                    <p><strong>Description : </strong>{d.description}</p>
                                    <p><strong>Category : </strong>{d.category}</p>
                                    <p><strong>Location : </strong>{d.latitude} ; {d.longitude}</p>
                                    <p><strong>Position : </strong>x: {d.mapCoordinates.x} ; y: {d.mapCoordinates.y} ; z: {d.mapCoordinates.z}</p>
                                </div>
                            </div>  
                        </div>                  
                    ))}
                </div>
            </div>
        </>
    );
}