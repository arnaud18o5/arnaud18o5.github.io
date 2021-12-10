import React, { Component }  from 'react';

function SignUpModal(props){
  var username = '';
  var password ='';

    return(
        <div class="modal fade" id="Sign-Up-Modal" aria-hidden="true" aria-labelledby="exampleModalToggleLabel" tabindex="-1">
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalToggleLabel">Create a new account</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
              <div class="input-group mb-3">
                <span class="input-group-text" id="basic-addon1">@</span>
                <input type="text" onChange={(e) => username = e.target.value} class="form-control" placeholder="Username" aria-label="Username" aria-describedby="basic-addon1"></input>
              </div>
              <div class="input-group mb-3">
                <span class="input-group-text" id="basic-addon1">Password</span>
                <input type="password" onChange={(e) => password = e.target.value} class="form-control" placeholder="Username" aria-label="Username" aria-describedby="basic-addon1"></input>
              </div>
                <div className="d-flex justify-content-center">
                  <button type="submit" onClick={() => {props.handleRegistration(username, password); console.log("click sur sign up")}} class="btn btn-primary justify-content-center" data-bs-dismiss="modal" >Sign-Up</button>
                </div>
              </div>
            </div>
          </div>
        </div>
    );
}

export default SignUpModal;