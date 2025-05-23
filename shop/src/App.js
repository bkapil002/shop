
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
import UserAddressForm from './Components/UserAddress/UserAddressForm'
import Profile from './Components/Profile/Profile';
import Kids from './Components/Kids.js/Kids';
import Men from './Components/Men/Men';
import Women from './Components/Women/Women';
import ProductPage from './Components/ProductPage/ProductPage';
import CartPage from './Components/Cart/CartPage';
import Checkout from './Components/Checkout/Checkout';
import Orders from './Components/Orders/Orders';


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
        <Route path='/AddressDetails'element={<UserAddressForm/>}/>
        <Route path='/profile'  element = {<Profile/>}/>
        <Route path='/kids' element={<Kids/>}/>
        <Route path='/women' element={<Women/>}/>
        <Route path='/men' element={<Men/>}/>
        <Route path='/product/:id' element={<ProductPage/>}/>
        <Route path= '/cart' element={<CartPage/>}/>
        <Route path='/Checkout' element={<Checkout/>}/>
        <Route path='/orders'element={<Orders/>}/>
        </Routes>
       <Footer/>
       </AuthProvider>
          <Toaster position="top-right" />

      </Router>
  
     
     
    </div>
  );
}

export default App;
