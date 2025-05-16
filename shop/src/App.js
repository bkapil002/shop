
import './App.css';
import { Toaster } from 'react-hot-toast';
import Navbar from './Components/Navbar/Navbar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Shop from './Pages/Shop'
import Login from './Pages/Login'
import Signup from './Pages/Signup'
import {AuthProvider} from './Context/AuthContext'
import Footer from './Components/Footer/Footer';
import AddressForm from './Components/AddressForm/AddressForm';


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
        <Route path='/address' element = {<AddressForm/>}/>
      </Routes>
       <Footer/>
       </AuthProvider>
          <Toaster position="top-right" />

      </Router>
  
     
     
    </div>
  );
}

export default App;
