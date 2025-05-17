
import './Men.css'
import dropdown_icon from '../Components/Assets/dropdown_icon.png'
import top from '../image/topImage (2).png'

const Kids = () => {
  return (
    <div className='shop-category'>
      <img className='shopcategory-banner' src={top} alt="" />
      <div className="shopcategory-indexSort">
        <p>
          <span>Showing 1-12</span> out of 36 products
        </p>
        <div className="shopcategory-sort">
          Sort by <img src={dropdown_icon} alt="" />
        </div>
      </div>
      <div className="shopcategory-products">
       <div className='item'>
       <Link to={`/product/${props.id}`}><img onClick={window.scrollTo(0,0)} src={props.image} alt="" /></Link>
       <p>{props.name}</p>
        < div className="item-prices">
         <div className="item-price-new">
            ${props.new_price}
        </div>
        <div className="item-price-old">
            ${props.old_price}
        </div>
      </div>
    </div>
      </div>
      <div className="shopcategory-loadmore">
        Explore More
      </div>
    </div>
  )
}

export default Kids
