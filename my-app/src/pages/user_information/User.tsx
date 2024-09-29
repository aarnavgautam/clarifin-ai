import React, { useState, useEffect, ChangeEvent } from 'react';
import './User.css';
import next from '../../assets/next_arrow.png';
import { auth, db } from '../../firebaseConfig/firebase.js';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate} from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';

const User = () => {
  const navigate = useNavigate();

  const [formValues, setFormValues] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    gender: '',
    age: '',
    ethnicity: '',
    income: '',
  });

  const [allCompleted, setAllCompleted] = useState(false);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSignUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formValues.email, formValues.password);
      // Store user info in Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        firstName: formValues.firstName,
        lastName: formValues.lastName,
        gender: formValues.gender,
        age: formValues.age,
        ethnicity: formValues.ethnicity,
        income: formValues.income,
      });
      console.log('Sign-up successful:', userCredential.user);
      navigate('/profile', { state: { uid: userCredential.user.uid } }); // Navigate to profile page
    } catch (error) {
      console.error('Sign-up failed', error);
      alert('Sign-up failed. Please try again.');
    }
  };

  const handleNextPage = () => {
    if (allCompleted) {
      handleSignUp();
    }
  };

  useEffect(() => {
    const allFilled = Object.values(formValues).every((value) => value.trim() !== '');
    setAllCompleted(allFilled);
  }, [formValues]);

  return (
    <section className="user_information_container">
      <h1>Tell us more about you.</h1>

      <div className="user_selections">
        <form>
          {/* First Name Field */}
          <div className="form_row">
            <div className="user_option">
              <label htmlFor="firstName">First Name:</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formValues.firstName}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Last Name Field */}
            <div className="user_option">
              <label htmlFor="lastName">Last Name:</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formValues.lastName}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          {/* Email and Password */}
          <div className="form_row">
            <div className="user_option">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formValues.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="user_option">
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formValues.password}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          {/* Existing fields for gender, age, etc. */}
          <div className="form_row">
            <div className="user_option">
              <label htmlFor="gender">Gender:</label>
              <select
                id="gender"
                name="gender"
                value={formValues.gender}
                onChange={handleInputChange}
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
                onChange={handleInputChange}
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

          {/* Existing fields for ethnicity and income */}
          <div className="form_row">
            <div className="user_option">
              <label htmlFor="ethnicity">Ethnicity:</label>
              <select
                id="ethnicity"
                name="ethnicity"
                value={formValues.ethnicity}
                onChange={handleInputChange}
                required
              >
                <option value="">Select your ethnicity</option>
                <option value="hispanic">Hispanic or Latino</option>
                <option value="white">White</option>
                <option value="black">Black or African American</option>
                <option value="asian">Asian</option>
                <option value="pacific">Native Hawaiian or other Pacific Islander</option>
                <option value="two-plus">Two or more races</option>
                <option value="not-specified">Not Specified</option>
              </select>
            </div>

            <div className="user_option">
              <label htmlFor="income">Income:</label>
              <select
                id="income"
                name="income"
                value={formValues.income}
                onChange={handleInputChange}
                required
              >
                <option value="">Select your income range</option>
                <option value="under-25k">Under $25,000</option>
                <option value="25k-50k">$25,000 - $50,000</option>
                <option value="50k-75k">$50,000 - $75,000</option>
                <option value="75k-100k">$75,000 - $100,000</option>
                <option value="over-100k">Over $100,000</option>
                <option value="prefer-not-to-say">Prefer not to say</option>
              </select>
            </div>
          </div>

          <img src={next} onClick = {handleNextPage} className = "nextLogo pulse fade-in" alt="Next" />
        </form>
      </div>
    </section>
  );
};

export default User;

