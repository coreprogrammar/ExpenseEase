import './App.css'
import Navbar from "./components/navbar/Navbar.jsx";
import Home from './components/pages/Home.jsx';


function App() {
  return (
      <>
          <Navbar/>
          <Home/>
          <h1 className="text-3xl font-bold text-center">
              Hello world!
          </h1>
      </>
  )
}

export default App
