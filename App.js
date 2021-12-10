import Header from './Header'
import { useCookies } from "react-cookie"
import React, {useEffect, useState} from "react";
import Workspace from './Workspace';
import './App.css'

export default function App(){
    const [cookies, setCookie, removeCookie] = useCookies(["user"]);
    const [loggedInUser, setLoggedInUser] = useState('false');
    const [test, setTest] = useState();

    

    useEffect(() => {
        if(cookies.username === undefined){
            setLoggedInUser('false')
        }
        else{
            setLoggedInUser('true')
        }
    });

    useEffect(() => {
        /*var updatedCookies = cookies;
        console.log(cookies.username);
        if(cookies.username === undefined && loggedInUser==='true'){
            setLoggedInUser('false');
            updatedCookies.isLogged = 'false';
            setCookie(updatedCookies);
        }
        else if(cookies.username !== undefined && loggedInUser === 'false'){
            setLoggedInUser('true');
            updatedCookies.isLogged = 'true';
            setCookie(updatedCookies);
        }*/
    },[loggedInUser, cookies]);

    useEffect(() => {
        console.log(cookies.username)
        console.log(loggedInUser);
        //console.log(loggedInUser);
    }, [loggedInUser])

    function handleLogged(value){
        setLoggedInUser(value)
    }


    function handleCookie(set, name, value, options){
        console.log("handle cookies")
        if(set === 'true'){
            setCookie(name, value, options);
            if(name!=='isLogged' || value !== 'false'){
                setLoggedInUser('true');
            }
            else if(name === 'isLogged' && value === 'false'){
                setLoggedInUser('false');
            }
        }
        else{
            removeCookie(name);
            setLoggedInUser('false');
        }
    }
    return(
        <>
            <Header handleLoging={handleLogged} logged={loggedInUser} cookies={cookies} handleCookie={handleCookie} ></Header>
            <Workspace cookies={cookies} logged={loggedInUser} ></Workspace>
            <gltf-viewer interactive width="300" height="300" src="../public/corridorFloor.gltf"></gltf-viewer>
            <img src="../public/corridorFloor.gltf" alt="" />
        </>
    )
}