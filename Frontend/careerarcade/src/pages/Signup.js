import React from 'react'

const Signup = () => {
  return (
    <div className="container">
          <h2>Signup</h2>
          <form onSubmit={handleSubmit}>
          <input type="text" autoFocus placeholder="Name" name='name' className="input-field" onChange={handleChange}/>
                <input type="email" placeholder="Email" name='email' className="input-field" onChange={handleChange}/>
                <input type="password" placeholder="Password" name='password' className="input-field" onChange={handleChange}/>
          <button type='submit' className="btn">Signup</button>
          </form>
          <p>
            Already a user?
          </p>
        </div>
  )
}

export default Signup