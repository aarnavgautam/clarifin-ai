import React, { useState, useEffect, ChangeEvent } from 'react';
import './User.css';
import next from '../../assets/next_arrow.png';
import { db} from '../../firebaseConfig/firebase.js';
import {doc, setDoc} from 'firebase/firestore';
import {useNavigate, useLocation} from 'react-router-dom';

const User = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formValues, setFormValues] = useState({
    gender: '',
    age: '',
    ethnicity: '',
    income: '',
  });


  const [allCompleted, setAllCompleted] = useState(false);

  const handleDropdownChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNextPage = async () => {
    try {
      await setDoc(doc(db, 'users', location.state.uid), {
        ...formValues,  
      });
      console.log(formValues);
      setAllCompleted(true);
      navigate('/profile', {state: {uid: location.state.uid}});
    } catch (error) {
      console.error("Error setting document: ", error);
    }
  };

  useEffect(() => {
    const allFilled = Object.values(formValues).every((value) => value !== '');
    setAllCompleted(allFilled);
  }, [formValues]);

  return (
    <section className="user_information_container">
      <h1>Awesome. Tell us more about you.</h1>

      <div className="user_selections">
        <form>
          <div className="form_row">
            <div className="user_option">
              <label htmlFor="gender">Gender:</label>
              <select
                id="gender"
                name="gender"
                value={formValues.gender}
                onChange={handleDropdownChange}
                required
              >
                <option value="">Select your gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="non-binary">Non-binary</option>
                <option value="not-specified">Not Specified</option>
              </select>
            </div>

            <div className="user_option">
              <label htmlFor="age">Age:</label>
              <select
                id="age"
                name="age"
                value={formValues.age}
                onChange={handleDropdownChange}
                required
              >
                <option value="">Select your age range</option>
                <option value="under-18">Under 18</option>
                <option value="18-24">18-24</option>
                <option value="25-34">25-34</option>
                <option value="35-44">35-44</option>
                <option value="45-54">45-54</option>
                <option value="55-64">55-64</option>
                <option value="65-or-older">65 or older</option>
                <option value="prefer-not-to-say">Prefer not to say</option>
              </select>
            </div>
          </div>

          <div className="form_row">
            <div className="user_option">
              <label htmlFor="ethnicity">Ethnicity:</label>
              <select
                id="ethnicity"
                name="ethnicity"
                value={formValues.ethnicity}
                onChange={handleDropdownChange}
                required
              >
                <option value="">Select your ethnicity</option>
                <option value="hispanic">Hispanic or Latino</option>
                <option value="white">White</option>
                <option value="black">Black or African American</option>
                <option value="asian">Asian</option>
                <option value="pacific">Native Hawaiian or other Pacific Islander</option>
                <option value="two-plus">Two or more races</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="user_option">
              <label htmlFor="income">Annual Income:</label>
              <select
                id="income"
                name="income"
                value={formValues.income}
                onChange={handleDropdownChange}
                required
              >
                <option value="">Select your annual income</option>
                <option value="under-20000">Less than $20,000</option>
                <option value="20000-34999">$20,000 - $34,999</option>
                <option value="35000-49999">$35,000 - $49,999</option>
                <option value="50000-74999">$50,000 - $74,999</option>
                <option value="75000-99999">$75,000 - $99,999</option>
                <option value="100000-149999">$100,000 - $149,999</option>
                <option value="150000-199999">$150,000 - $199,999</option>
                <option value="200000-299999">$200,000 - $299,999</option>
                <option value="300000-more">$300,000 or more</option>
              </select>
            </div>
          </div>
        </form>
      </div>

      {allCompleted && <img src={next} onClick = {handleNextPage} className="nextLogo pulse fade-in" alt="Next logo" />}
    </section>
  );
};

export default User;
