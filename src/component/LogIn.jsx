import React from 'react';

export default class LogIn extends React.Component {
   login = (e) => {
      e.preventDefault();
      this.props.history.push(`/userinterface/${this.user.value}`);
   }

   render() {
      return(
         <React.Fragment>
            <div className="cpn__login">
               <form onSubmit={this.login}>
                  <label>User</label>
                  <input
                     required 
                     type="text"
                     ref={(input) => {
                        this.user = input;      
                     }}
                  />
               </form>
            </div>
         </React.Fragment>
      )
   }
}