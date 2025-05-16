
import './App.css';
import Navbar from './Components/Navbar/Navbar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Shop from './Pages/Shop'
import Login from './Pages/Login'
import Signup from './Pages/Signup'
import {AuthProvider} from './Context/AuthContext'
import Footer from './Components/Footer/Footer';


function App() {
  return (
    <div>
      <Router>
      <AuthProvider>
      <Navbar/>
      <Routes>
        <Route path='/' element = {<Shop/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/signup' element ={<Signup/>}/>

      </Routes>
       <Footer/>
       </AuthProvider>
      </Router>
  
     
     
    </div>
  );
}

export default App;
