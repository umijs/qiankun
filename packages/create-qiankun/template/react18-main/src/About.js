import { Link } from 'react-router-dom';
import './App.css';

function About() {
  return (
    <div className="App">
      <h2>About</h2>
      <Link to="/">Link to home</Link>
    </div>
  );
}

export default About;
