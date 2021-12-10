
import { data } from "jquery";
import React, { useEffect,useState} from "react";
import ItemsList from './ItemsList';
import ItemViewer from "./ItemViewer";
import PoisList from './PoisList';
import ItemDetail from './ItemDetail';

function Workspace(props){
    var cookies;
    var nItem = new newItem();
    var nPois = new newPois();
    var name = '';
    const [data, setData] = useState(null);
    const [item, setItem] = useState(null);
    const [state, setState] = useState(null);
    const [typeItem, setTypeItem] = useState('noChoice');
    const [pois, setPois] = useState(false);
    const [newPos, setNPos] = useState({x: "0", y:"0", z:"0"});

    
    useEffect(() => {
        cookies = props.cookies;
        if(props.logged === 'true'){
            refreshItemsList();
        }
    }, [props]);


    useEffect(() => {
    })

    function refreshItemsList(){
        fetch("https://lauriari-arvr.azurewebsites.net/aritem/contentmanager",{
            method: 'GET',
            headers:{'Authorization':'Bearer ' +props.cookies.token}}).then((response) => {
                return response.json()})
                .then((data) => setData(data))
                .catch((e) => noData());
    }

    function upLoadItem(){
        setState("uploadingItem");
        let formData = new FormData();
        formData.append('name', name);
        formData.append('description', nItem.description);
        formData.append('category', nItem.category);
        formData.append('latitude', nItem.latitude);
        formData.append('longitude', nItem.longitude);
        if(typeItem === "2D"){
            formData.append('avatar', nItem.file);
            fetch("https://lauriari-arvr.azurewebsites.net/aritem/",{
                method: 'POST',
                headers:{'Authorization':'Bearer ' + props.cookies.token},
                body: formData
            }).then((response) => {
                return response.json();
            }).then((data) => {
                if(data.message === "Uploaded item to Azure and updated DB🤗"){
                    setState("noItemSelected");
                    refreshItemsList();
                }
                else{
                    setState("newItem")
                }
            })
        }
        else if(typeItem === "3D"){
            const myGltfFile = {...nItem.gltfFile, type :"model/gltf+json"};
            const myBinFile = {...nItem.binFile, type :"octet-stream"};
            formData.append('gltf', nItem.gltfFile);
            formData.append('bin', nItem.binFile);
            formData.append('logoImageReference', nItem.logoImageReference);
            if(nItem.textureFiles !== null){
            Array.from(nItem.textureFiles).forEach(item => {
                formData.append('imageGallery', item, item.name);
            })
            //formData.append("imageGallery[]",nItem.textureFiles);
            }
            else{
                formData.append('imageGallery', undefined);
            }
            var myHeaders = new Headers();
            myHeaders.append("Authorization", 'Bearer ' + props.cookies.token);

            var requestOptions = {
                method: 'POST',
                //headers: myHeaders,
                headers:{'Authorization':'Bearer ' + props.cookies.token},
                body: formData,
                mode: "cors"
              };
            fetch("https://lauriari-arvr.azurewebsites.net/aritem/3d",
                requestOptions
            ).then((response) => {
                return response.json();
            }).then((data) => {
                if(data.message === "Uploaded item to Azure and updated DB🤗"){
                    setState("noItemSelected");
                    refreshItemsList();
                }
                else{
                    setState("newItem")
                }
            })
        }
    }

    
    function dItem(id){
        const requestOptions = {
            method: 'DELETE',
            headers:{'Authorization':'Bearer ' + props.cookies.token}
          };
        fetch("https://lauriari-arvr.azurewebsites.net/aritem/delete/"+id, requestOptions).then((response) => {
            refreshItemsList();
        });
    }

    function changeTypeItem(value){
        if(value === "2"){
            setTypeItem('3D');
        }
        else if(value === "1"){
            setTypeItem('2D');
        }
        else{
            setTypeItem('noChoice');
        }
    }

    useEffect(() => {
        setState("ItemSelected")
    }, [item])

    useEffect(() => {
        if(data !== null && state !== "newItem"){
            setState('noItemSelected');
        }
        console.log("data changed ")
    }, [data]);


    function newItem(){
        this.name = "";
        this.description = "";
        this.latitude = "";
        this.longitude = "";
        this.category = "";
        this.file = null;
        this.gltfFile = null;
        this.binFile = null;
        this.textureFiles = null;
        this.logoImageReference = null;
    }

    function newPois(){
        this.avatar = null;
        this.name = "";
        this.description = "";
        this.category = "";
        this.latitude = "";
        this.longitude = "";
        this.x = "0";
        this.y = "0";
        this.z = "0";
    }

    function noData(){
        setData(null);
        setItem(null);
    }

    function handleClick(item){
        const newItem = item;
        setItem(newItem);
    }

    function addItem(){
        setState('newItem');
    }

    function itemOnClick(x, y, z){
            nPois.x = x.toString();
            nPois.y=  y.toString();
            nPois.z = z.toString();
            setNPos({
                x: x.toString(),
                y: (y + 2).toString(),
                z: z.toString()
            })
            console.log(newPos.x, newPos.y, newPos.z)
    }


    const editItem = (id, data, detail) => {
        let url = "https://lauriari-arvr.azurewebsites.net/aritem/update/" + id + "?param=" + detail;
        var myInit;
        if(detail === "category"){
            myInit = { method: 'PATCH',
               headers: { 'Content-Type': 'application/json' , 'Authorization':'Bearer ' + props.cookies.token},
               body: JSON.stringify({ category: data})
            }
        }
        else if(detail === "description"){
            myInit = { method: 'PATCH',
               headers: { 'Content-Type': 'application/json' , 'Authorization':'Bearer ' + props.cookies.token},
               body: JSON.stringify({ description: data})
            }
        }
        else if(detail === "name"){
            myInit = { method: 'PATCH',
               headers: { 'Content-Type': 'application/json' , 'Authorization':'Bearer ' + props.cookies.token},
               body: JSON.stringify({ name: data})
            }
        }
        else if(detail === "longitude"){
            myInit = { method: 'PATCH',
               headers: { 'Content-Type': 'application/json' , 'Authorization':'Bearer ' + props.cookies.token},
               body: JSON.stringify({ longitude: data})
            }
        }
        else if(detail === "latitude"){
            myInit = { method: 'PATCH',
               headers: { 'Content-Type': 'application/json' , 'Authorization':'Bearer ' + props.cookies.token},
               body: JSON.stringify({ latitude: data})
            }
        }
        fetch("https://lauriari-arvr.azurewebsites.net/aritem/update/" + id + "?param=" + detail,myInit).then((response) => 
                response.json())
                .then((data) => {
                    if(data.message === "Updated " + detail){
                        console.log("changement bien effectue")
                        return data;
                    }
                    else{
                        return 0;
                    }
                })
    }

    function addPois(id){
        var formdata = new FormData();
        formdata.append("avatar", nPois.avatar);
        formdata.append("name", nPois.name);
        formdata.append("description",nPois.description);
        formdata.append("category", nPois.category);
        formdata.append("latitude", nPois.latitude);
        formdata.append("longitude", nPois.longitude);
        formdata.append("x", newPos.x);
        formdata.append("y", newPos.y);
        formdata.append("z", newPos.z);
        console.log(nPois.x, nPois.y, nPois.z);
        var requestOptions = {
        method: 'POST',
        headers:{'Authorization':'Bearer ' + props.cookies.token},
        body: formdata,
        redirect: 'follow'
        };

        fetch("https://lauriari-arvr.azurewebsites.net/aritem/pois/" + id, requestOptions)
        .then(response => response.json())
        .then(result => {
            if(result.message === "Added a new point of interest!"){
                setPois(false);
                refreshItemsList();
            }
            else{
                console.log("add a toaster : error pois")
            }
        })
        .catch(error => console.log('error', error));
    }

    if(props.logged === 'false'){
        return (
            <>
            <p>You have to be connected to see your workspace. test</p>
            
            </>
        )
    }
    else if(props.logged === 'Loading'){
        return(
            <>
                <div class="spinner-border" role="status">
                    <span class="visually-hidden">Loading...</span> 
                </div>
            </>
        )
    }
    else if(item !== null && state === 'ItemSelected'){
        if(pois != true){
            return(
                <div class="d-flex justify-content-start" style={{margin: "1% 0 5% 1%"}}>
                    <ItemsList items={data} deleteItem={dItem} changeItem={handleClick} addItem={addItem}></ItemsList>
                    <div class="card w-50" style={{margin:"0 1% 0 1%"}, {padding:"2%"}}>
                        <div class="d-flex justify-content-start" style={{padding:"0 0 5% 0"}}>
                                <img src={"https://lauriaristorage.blob.core.windows.net/" + item.logoImageReference} style={{width: "5%", margin: "0 2% 0 0"}}alt="" />
                                <h2>{item.name}</h2>
                        </div>
                        <div className="d-flex justify-content-around" style={{padding:"5%"}}>
                            <div>
                                <ItemDetail editItem={editItem} data={item.description} id={item._id} detail={"description"}></ItemDetail>
                                <ItemDetail editItem={editItem} data={item.latitude} id={item._id} detail={"latitude"}></ItemDetail>
                                <ItemDetail editItem={editItem} data={item.longitude} id={item._id} detail={"longitude"}></ItemDetail>
                                <ItemDetail editItem={editItem} data={item.category} id={item._id} detail={"category"}></ItemDetail>
                                <p>QR Code for your items</p>
                                <div class="d-flex flex-column align-items-center">
                                    <img src={item.QRCode} alt="" />
                                    <a href={item.QRCode} download={item.name}><button class="btn btn-secondary btn-sm">Download me</button></a>
                                </div>
                            </div>
                            <ItemViewer link={item.objectReference} click={itemOnClick}></ItemViewer>
                        </div>
                        <div className="d-flex justify-content-start">
                            <button class="btn btn-primary" style={{margin: "0 1% 0 0"}}onClick={() => setPois(true)}>Add a point of interest to your item</button>
                            <button class="btn btn-secondary" onClick={() => console.log("click")}>Edit the item</button>
                        </div>
                    </div>
                    <PoisList pois={item.pois}></PoisList>
                    
                </div>       
            )
            
        }
        else{                   
        return(     
            <div class="d-flex justify-content-start" style={{margin: "1% 0 0 1%"}}>
            <ItemsList items={data} deleteItem={dItem} changeItem={handleClick} addItem={addItem}></ItemsList>
            <div class="card w-50" style={{margin:"0 1% 0 1%"}, {padding:"2%"}}>
                <div class="d-flex justify-content-start" style={{padding:"0 0 5% 0"}}>
                        <img src={"https://lauriaristorage.blob.core.windows.net/" + item.logoImageReference} style={{width: "5%", margin: "0 2% 0 0"}}alt="" />
                        <h2>{item.name}</h2>
                </div>
                <div className="d-flex justify-content-around" style={{padding:"0 0 5% 0"}}>
                    <div>
                        <h5>Description :</h5>
                        <p>{item.description}</p>
                        <p><strong>Location: </strong>{item.latitude} ; {item.longitude}</p>
                        <p><strong>Category: </strong>{item.category}</p>
                        <p>QR Code for your items</p>
                        <div class="d-flex flex-column align-items-center">
                            <img src={item.QRCode} alt="" />
                            <a href={item.QRCode} download={item.name}><button class="btn btn-secondary btn-sm">Download me</button></a>
                        </div>
                    </div>
                    <ItemViewer link={item.objectReference} click={itemOnClick}  ></ItemViewer>
                </div>
                
                    <div class="mb-3">
                        <label for="formFile" class="form-label">Choose a logo for the point of interest.</label>
                        <input class="form-control" id="file-input" onChange={(e) => nPois.avatar = e.target.files[0]} placeholder="Choose a file" type="file" onChange={(e) => nItem.file = e.target.files[0]}></input>
                    </div>
                    <div class="input-group mb-3">
                        <span class="input-group-text" id="basic-addon1">Name</span>
                        <input type="text" class="form-control" placeholder="Name of the point of interest" onChange={(e) => nPois.name = e.target.value} aria-label="Username" aria-describedby="basic-addon1"></input>
                    </div>
                    <div class="input-group mb-3">
                        <span class="input-group-text" id="basic-addon1">Description</span>
                        <textarea class="form-control" aria-label="With textarea" onChange={(e) => nPois.description = e.target.value}></textarea>
                    </div>
                    <div class="input-group mb-3">
                        <span class="input-group-text" id="basic-addon1">Category</span>
                        <input type="text" class="form-control" placeholder="Category of the point of interest" onChange={(e) => nPois.category = e.target.value} aria-label="Username" aria-describedby="basic-addon1"></input>
                    </div>
                    <div class="input-group mb-3">
                        <span class="input-group-text" id="basic-addon1">Latitude</span>
                        <input type="text" class="form-control" placeholder="Latitude of the point of interest" onChange={(e) => nPois.latitude = e.target.value} aria-label="Username" aria-describedby="basic-addon1"></input>
                        <span class="input-group-text" id="basic-addon1">Longitude</span>
                        <input type="text" class="form-control" placeholder="Longitude of the point of interest" onChange={(e) => nPois.longitude = e.target.value} aria-label="Username" aria-describedby="basic-addon1"></input>
                    </div>
                    <div class="input-group mb-3">
                        <span class="input-group-text" id="basic-addon1">X Value</span>
                        <input type="text" class="form-control" onChange={(e) => nPois.x = e.target.value} placeholder="X Value"  value={newPos.x} aria-label="Username" aria-describedby="basic-addon1"></input>
                        <span class="input-group-text" id="basic-addon1">Y Value</span>
                        <input type="text" class="form-control" onChange={(e) => nPois.y = e.target.value} placeholder="Y Value"  value={newPos.y}aria-label="Username" aria-describedby="basic-addon1"></input>
                        <span class="input-group-text" id="basic-addon1">Z Value</span>
                        <input type="text" class="form-control" onChange={(e) => nPois.z = e.target.value} placeholder="Z Value"  value={newPos.z}aria-label="Username" aria-describedby="basic-addon1"></input>
                    </div>
                    <div class="d-flex flex-row-reverse bd-highlight">
                        <button class="btn btn-primary" style={{margin:"0 0 0 1%"}} onClick={() => addPois(item._id)}>Add the point of interest</button>
                        <button class="btn btn-warning " onClick={() => setPois(false)}>Cancel</button>
                    </div>
                </div>
                <PoisList pois={item.pois}></PoisList>/*
            </div>
        )
        } //onChange={(e) => nPois.x = e.target.value}
    }
    else if(state === 'noItemSelected'){
        return (
            <div class="d-flex justify-content-start" style={{margin: "1% 0 0 1%"}}>
                <ItemsList items={data} deleteItem={dItem} changeItem={handleClick} addItem={addItem}></ItemsList>
            </div>
        );

    }
    else if(state === 'newItem'){
        if(typeItem === 'noChoice'){
            return(
                <div class="d-flex justify-content-start" style={{margin: "1% 0 0 1%"}}>
                    <ItemsList items={data} deleteItem={dItem} changeItem={handleClick} addItem={addItem}></ItemsList>
                    <div class="card w-50" style={{margin:"0 1% 0 1%"}, {padding:"5%"}}>
                        <h3>Add new Item</h3>
                        <select class="form-select" aria-label="Default select example" onChange={(e) => changeTypeItem(e.target.value)}>
                            <option value="0">Choose the type of your new Item</option>
                            <option value="1">2D Item</option>
                            <option value="2">3D Item</option>
                        </select>
                    </div>
                </div>
            )
        }
        else if(typeItem === "2D"){
            console.log('2D click');
            return(
                <>
                    <div class="d-flex justify-content-start" style={{margin: "1% 0 0 1%"}}>
                        <ItemsList items={data} deleteItem={dItem} changeItem={handleClick} addItem={addItem}></ItemsList>
                        <div class="card w-50" style={{margin:"0 1% 0 1%"}, {padding:"5%"}}>
                            <ul>
                                <h3>Add new Item</h3>
                                <select class="form-select mb-3" aria-label="Default select example" onChange={(e) => changeTypeItem(e.target.value)}>
                                    <option value="1" selected>2D Item</option>
                                    <option value="2">3D Item</option>
                                </select>
                                <div class="input-group mb-3">
                                    <span class="input-group-text" id="basic-addon1">Title</span>
                                    <input type="text" class="form-control" onChange={(e) => name = e.target.value} placeholder="Title" aria-label="Title" aria-describedby="basic-addon1"></input>
                                </div>
                                <div class="input-group mb-3">
                                    <span class="input-group-text">Description</span>
                                    <textarea class="form-control" onChange={(e) => nItem.description = e.target.value} aria-label="Description"></textarea>
                                </div>
                                <div class="input-group mb-3">
                                    <span class="input-group-text" id="basic-addon1">Latitude</span>
                                    <input type="text" class="form-control" onChange={(e) => nItem.latitude = e.target.value} placeholder="Latitude" aria-label="Latitude" aria-describedby="basic-addon1"></input>
                                    <span class="input-group-text" id="basic-addon1">Longitude</span>
                                    <input type="text" class="form-control" onChange={(e) => nItem.longitude = e.target.value} placeholder="Longitude" aria-label="Longitude" aria-describedby="basic-addon1"></input>
                                </div>
                                <div class="input-group mb-3">
                                    <span class="input-group-text" id="basic-addon1">Category</span>
                                    <input type="text" class="form-control" onChange={(e) => nItem.category = e.target.value} placeholder="Category" aria-label="Category" aria-describedby="basic-addon1"></input>
                                </div>
                                <div class="mb-3">
                                    <label for="formFile" class="form-label">Choose a file for your 2D item.</label>
                                    <input class="form-control" id="file-input" placeholder="Choose a file" type="file" onChange={(e) => nItem.file = e.target.files[0]}></input>
                                </div>
                                <button type="submit" class="btn btn-primary" onClick={upLoadItem}>Upload</button>
                            </ul>
                        </div>
                    </div>
                </>
            )
        } 
        else if(typeItem === "3D"){
            console.log('3d click')
            return(
                <>
                    <div class="d-flex justify-content-start" style={{margin: "1% 0 0 1%"}}>
                        <ItemsList items={data} deleteItem={dItem} changeItem={handleClick} addItem={addItem}></ItemsList>
                        <div class="card w-50" style={{margin:"0 1% 0 1%"}, {padding:"5%"}}>
                            <ul>
                                <h3>Add new Item</h3>
                                <select class="form-select mb-3" aria-label="Default select example" onChange={(e) => changeTypeItem(e.target.value)}>
                                    <option value="1">2D Item</option>
                                    <option value="2" selected>3D Item</option>
                                </select>
                                <div class="mb-3">
                                    <label for="formFile" class="form-label">Choose a logo for your item.</label>
                                    <input class="form-control"  placeholder="Choose a file" accept="" type="file" onChange={(e) => nItem.logoImageReference = e.target.files[0]}></input>
                                </div>
                                <div class="input-group mb-3">
                                    <span class="input-group-text" id="basic-addon1">Title</span>
                                    <input type="text" class="form-control" onChange={(e) => name = e.target.value} placeholder="Title" aria-label="Title" aria-describedby="basic-addon1"></input>
                                </div>
                                <div class="input-group mb-3">
                                    <span class="input-group-text">Description</span>
                                    <textarea class="form-control" onChange={(e) => nItem.description = e.target.value} aria-label="Description"></textarea>
                                </div>
                                <div class="input-group mb-3">
                                    <span class="input-group-text" id="basic-addon1">Latitude</span>
                                    <input type="text" class="form-control" onChange={(e) => nItem.latitude = e.target.value} placeholder="Latitude" aria-label="Latitude" aria-describedby="basic-addon1"></input>
                                    <span class="input-group-text" id="basic-addon1">Longitude</span>
                                    <input type="text" class="form-control" onChange={(e) => nItem.longitude = e.target.value} placeholder="Longitude" aria-label="Longitude" aria-describedby="basic-addon1"></input>
                                </div>
                                <div class="input-group mb-3">
                                    <span class="input-group-text" id="basic-addon1">Category</span>
                                    <input type="text" class="form-control" onChange={(e) => nItem.category = e.target.value} placeholder="Category" aria-label="Category" aria-describedby="basic-addon1"></input>
                                </div>
                                <div class="mb-3">
                                    <label for="formFile" class="form-label">Choose a GLTF file.</label>
                                    <input class="form-control"  placeholder="Choose a file" accept=".gltf" type="file" onChange={(e) => nItem.gltfFile = e.target.files[0]}></input>
                                </div>
                                <div class="mb-3">
                                    <label for="formFile" class="form-label">Choose a BIN file.</label>
                                    <input class="form-control"  placeholder="Choose a file" accept=".bin" type="file" onChange={(e) => nItem.binFile = e.target.files[0]}></input>
                                </div>
                                <div class="mb-3">
                                    <label for="formFile" class="form-label">Choose the textures files.</label>
                                    <input class="form-control" id="file-input" placeholder="Choose a file" type="file" multiple onChange={(e) => nItem.textureFiles = e.target.files}></input>
                                </div>
                                <button type="submit" class="btn btn-primary" onClick={upLoadItem}>Upload</button>
                            </ul>
                        </div>
                    </div>
                </>
            )
        }
    }
    else if(state === "uploadingItem"){
        return(
            <>
            <ItemsList items={data} deleteItem={dItem} changeItem={handleClick} addItem={addItem}></ItemsList>
            <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span> 
            </div>
            </>
        )
    }
    else{
        return(
            <>
                <div class="spinner-border" role="status">
                    <span class="visually-hidden">Loading...</span> 
                </div>
            </>
        )
    }
}


function ProjectDetails(){

}

export default Workspace;