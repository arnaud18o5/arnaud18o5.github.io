import './Header.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import 'jquery/dist/jquery.min.js'
import bootstrap from 'bootstrap/dist/js/bootstrap.min.js'
import SignUpModal from "./SignUpModal"
import React, { useEffect,useState} from "react";


function Header(props) { 
  var username = "";
  var password = "";
  const [cookies, setCookies] = useState(props.cookies);
  const [isLogged, setIsLogged] = useState(props.isLogged);
  console.log(props.logged)

  /*useEffect(()=>{
    setCookies(props.cookies);
    cook = props.cookies;
    console.log("useeffect");
  }, [cookies]);*/

  /*var cookies = props.cookies;
  const [username, setUsername] = useState(props.cookies.username);
  const [password, setPassword] = useState('');
  const [logged, setLogged] = useState(props.cookies.isLogged);
  console.log("cookies.isLogged.header = " + props.cookies.isLogged);
  console.log("logged const header = " + logged);

  
  useEffect(() => {
    if(props.cookies.isLogged !== logged){
      setLogged(props.cookies.isLogged);
    }
    if(props.cookies !== cookies){
      cookies = props.cookies;
      setUsername(props.cookies.username);
      setLogged(props.cookies.isLogged);
    }
    console.log("changement header = " + logged);
  })*/

  /*useEffect(() => {
    console.log(props.cookies)
    if(props.cookies.isLogged === 'true'){
      props.handleLoging('true');
    }
    else if(props.cookies.isLogged === 'false'){
        props.handleLoging('false');
    }
  })*/

  useEffect(() => {
    if(props.cookies.username !== null && props.cookies.username !== undefined){
      console.log("isLogged à true")
      var updatedCookies = props.cookies;
      updatedCookies.isLogged = 'true';
      setCookies(updatedCookies);
    }
    else{
      setIsLogged(props.cookies.isLogged);
    }
  }, [props.cookies, username])

  useEffect(() => {
    if(cookies === null){
      var updatedCookies = new Object(); // changer ca pour le faire a la fin du setcookies
      updatedCookies.isLogged = 'false';
      setCookies(updatedCookies);
    }
    else{
      setIsLogged(props.cookies.isLogged);
    }
  }, [cookies])
  function login(){
    fetch("https://lauriari-arvr.azurewebsites.net/auth/login",{
      method:'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: username,
      password: password })
    }).then((response) => 
      response.json()
    )
    .then((data) => 
      cblogin(data)
    )
    .catch((error) => {
      wrongLogin(error);
    })
    props.handleLoging('Loading');
  }

  function register(u, p){
    username = u;
    password = p;
    fetch("https://lauriari-arvr.azurewebsites.net/auth/register",{
      method:'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: u,
      password: p,
      contentManager: 1})
    }).then((response) => {
      login();
    })
  }

  function disconnect(){
    props.handleCookie('false', 'token');
    props.handleCookie('false', 'username')
    props.handleCookie('true', 'isLogged', 'false', {path:'/'})
    setIsLogged('false');
    //setCookies(null); // probleme de synchro ici 
    //setLogged('false');
  }

  function cblogin(data){
    props.handleCookie('true', 'token', data.message, {path:'/'});
    props.handleCookie('true', 'username', username, {path:'/'});
    props.handleCookie('true', 'isLogged', 'true', {path:'/'});
    setIsLogged("true");
    //setLogged('true');
  }

  function wrongLogin(error){
    showModal("Sign-In-Modal-Error");
  }

  console.log("isLogged = " + isLogged)
  if(isLogged === 'true'){
      return(
        <>
        <nav class="navbar bg-dark">
          <div class="left-buttons d-flex justify-content-start">
          <a class="navbar-brand" style={{width:"8%", margin: "0"}}href="#"><img src="/logo.jpg" alt="" width="100%" class="d-inline-block align-text-top"></img></a>
            <div class="link p-2 bd-highlight">
              <button onClick={() => props.handlePage('home')} class="btn btn-link nav-link active text-light fs-5">Home</button>
            </div>
            <div class="link p-2 bd-highlight">
              <button  onClick={() => props.handlePage('workspace')}class="btn btn-link nav-link text-light fs-5">My Workspace</button>
            </div>
          </div>
          <div className="right-buttons d-flex justify-content-end">
            <button className="btn btn-primary" onClick={disconnect}>{cookies.username}</button>
          </div>
        </nav>
        </>
      )
  }
    else if(isLogged === 'false'){
      return (
        <>
          <nav class="navbar bg-dark">
            <div class="left-buttons d-flex justify-content-start">
            <div class="link p-2 bd-highlight">
              <button  onClick={() => props.handlePage('home')} class="btn btn-link nav-link active text-light fs-5">
                <img src="./public/logo.jpg" alt="" ></img>
              </button>
            </div>
              <div class="link p-2 bd-highlight">
                <button  onClick={() => props.handlePage('home')} class="btn btn-link nav-link active text-light fs-5">Home</button>
              </div>
              <div class="link p-2 bd-highlight">
                <button  onClick={() => props.handlePage('workspace')}class="btn btn-link nav-link text-light fs-5">My Workspace</button>
              </div>
            </div>
            <div className="right-buttons d-flex justify-content-end">
              <div className="p-2 bd-highlight">
                <button class="btn btn-outline-light" onClick={() => showModal('Sign-In-Modal')}>Login</button>
              </div>
              <div className="p-2 bd-highlight">
                <button class="btn btn-warning" onClick={() => showModal('Sign-Up-Modal')}>Sign-Up</button>
              </div>
            </div>
          </nav>
          <SignUpModal handleRegistration={register}></SignUpModal>
          <div class="modal fade" id="Sign-In-Modal" aria-hidden="true" aria-labelledby="exampleModalToggleLabel" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="exampleModalToggleLabel">Login to your account</h5>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                <div class="input-group mb-3">
                  <span class="input-group-text" id="basic-addon1">@</span>
                  <input type="text" class="form-control" onChange={(e) => username = e.target.value} placeholder="Username" aria-label="Username" aria-describedby="basic-addon1"></input>
                </div>
                <div class="input-group mb-3">
                  <span class="input-group-text" id="basic-addon1">Password</span>
                  <input type="password" class="form-control" onChange={(e) => password = e.target.value} placeholder="Password" aria-label="Username" aria-describedby="basic-addon1"></input>
                </div>
                  <div className="d-flex justify-content-center">
                    <button type="submit" class="btn btn-primary justify-content-center" data-bs-dismiss="modal" onClick={() => login("Sign-In-Modal")}>Sign-In</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal fade" id="Sign-In-Modal-Error" aria-hidden="true" aria-labelledby="exampleModalToggleLabel" tabindex="-1">
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalToggleLabel">Login to your account</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
              <div class="input-group mb-3">
                <span class="input-group-text" id="basic-addon1">Username</span>
                <input type="text" class="form-control is-invalid" onChange={(e) => username = e.target.value} id="validationServerUsername" aria-describedby="inputGroupPrepend3 validationServerUsernameFeedback" required></input>
                <div id="validationServerUsernameFeedback" class="invalid-feedback">
                  Enter your username again.
                </div>
              </div>
              <div class="input-group mb-3">
                <span class="input-group-text" id="basic-addon1">Password</span>
                <input type="password" class="form-control is-invalid" onChange={(e) => password = e.target.value} id="validationServerUsername" aria-describedby="inputGroupPrepend3 validationServerUsernameFeedback" required></input>
                <div id="validationServerUsernameFeedback" class="invalid-feedback">
                  Enter your password again.
                </div>
              </div>
                <div className="d-flex justify-content-center">
                  <button type="submit" class="btn btn-primary justify-content-center" data-bs-dismiss="modal" onClick={() => login("Sign-In-Modal")}>Sign-In</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        </>    
      );
    }
  else{
    setIsLogged('false');
    return (
      <>
        <nav class="navbar bg-dark">
          <div class="left-buttons d-flex justify-content-start">
            <div class="link p-2 bd-highlight">
              <button  onClick={() => props.handlePage('home')} class="btn btn-link nav-link active text-light fs-5">
                <img src="./public/logo.jpg" alt="" ></img>
              </button>
            </div>
            <div class="link p-2 bd-highlight">
              <button  onClick={() => props.handlePage('home')} class="btn btn-link nav-link active text-light fs-5">Home</button>
            </div>
            <div class="link p-2 bd-highlight">
              <button  onClick={() => props.handlePage('workspace')}class="btn btn-link nav-link text-light fs-5">My Workspace</button>
            </div>
          </div>
          <div className="right-buttons d-flex justify-content-end">
            <div class="spinner-border text-light" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>
        </nav>
        </>
      
    );

    
  }
} ;

function closeModal(modal){
  var myModal = new bootstrap.Modal(document.getElementById(modal), {
    keyboard: false
  });
  myModal.modal('hide');
};

function showModal(modal){
  var myModal = new bootstrap.Modal(document.getElementById(modal), {
    keyboard: false
  });
  myModal.show();
}


export default Header;
