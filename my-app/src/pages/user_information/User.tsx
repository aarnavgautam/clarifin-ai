import React from 'react'
import "./User.css";

const User = () => {
  return (
    <section className="user_information_container">
      <h1>Awesome. Tell us more about you.</h1>
      
      <div className="user_selections">
        <form>
          <div className="form_row">
            <div className="user_option">
              <label htmlFor="gender">Gender:</label>
              <input type="text" id="gender" required />
            </div>
            <div className="user_option">
              <label htmlFor="age">Age:</label>
              <input type="text" id="age" required />
            </div>
          </div>
          <div className="form_row">
            <div className="user_option">
              <label htmlFor="ethnicity">Ethnicity:</label>
              <input type="text" id="ethnicity" required />
            </div>
            <div className="user_option">
              <label htmlFor="annual_income">Annual Income:</label>
              <input type="text" id="annual_income" required />
            </div>
          </div>
        </form>
      </div>
    </section>
  )
}

export default User