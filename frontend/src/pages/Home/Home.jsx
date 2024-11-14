import React from 'react'
import './Home.css'
import { useDispatch, useSelector } from 'react-redux'

const Home = () => {
  const dispatch = useDispatch();
  const text = useSelector(state => state.videoContent.plainText);
  const videoContent = useSelector(state => state.videoContent.textContent);
  return (
    <div>
      <h1>Home</h1>
      {text === "" ? <p></p> : <p>{text}</p>}
    </div>
  )
}

export default Home
