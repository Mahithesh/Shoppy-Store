// Write your code here
import {Component} from 'react'
import Cookies from 'js-cookie'
import {BsDashSquare, BsPlusSquare} from 'react-icons/bs'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import SimilarProduct from '../SimilarProductItem'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    quantity: 1,
    apiStatus: apiStatusConstants.initial,
    productDeatils: '',
    similarprts: [],
    errorMsg: '',
  }

  componentDidMount() {
    this.getDetails()
  }

  getDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')

    const url = `https://apis.ccbp.in/products/${id}`
    const options = {
      headers: {
        authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const rps = await fetch(url, options)
    if (rps.ok) {
      const data = await rps.json()
      console.log(data)
      this.setState({
        apiStatus: apiStatusConstants.success,
        productDeatils: {
          availability: data.availability,
          brand: data.brand,
          imageUrl: data.image_url,
          rating: data.rating,
          price: data.price,
          description: data.description,
          title: data.title,
          reviews: data.total_reviews,
        },
        similarprts: data.similar_products.map(i => ({
          id: i.id,
          title: i.title,
          brand: i.brand,
          imageUrl: i.image_url,
          rating: i.rating,
          price: i.price,
        })),
      })
    } else {
      const data = await rps.json()
      this.setState({
        apiStatus: apiStatusConstants.failure,
        errorMsg: data.error_msg,
      })
    }
  }

  renderSuccess = () => {
    const {productDeatils, similarprts, quantity} = this.state

    const {
      title,
      reviews,
      availability,
      imageUrl,
      rating,
      price,
      description,
      brand,
    } = productDeatils

    const onIncrement = () => {
      this.setState(prev => ({quantity: prev.quantity + 1}))
    }
    const onDecrement = () => {
      if (quantity > 1) {
        this.setState({quantity: quantity - 1})
      }
    }

    return (
      <div className="product-item-details-container">
        <div className="product-item-details">
          <div className="product-image-container">
            <img src={imageUrl} alt={title} className="product-image" />
          </div>
          <div className="product-info-container">
            <h1 className="product-title">{title}</h1>
            <p className="product-brand">{brand}</p>
            <div className="product-meta">
              <div className="rating-container">
                <p className="rating">{rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                  className="star"
                />
              </div>
              <p className="reviews">{reviews} Reviews</p>
            </div>
            <p className="price">Rs {price}/-</p>
            <p className="description">{description}</p>
            <div className="availability-brand">
              <p>
                <span className="label">Available :</span> {availability}
              </p>
              <p>
                <span className="label">Brand :</span> {brand}
              </p>
            </div>
            <div className="quantity-cart-container">
              <div className="quantity-selector">
                <button
                  data-testid="minus"
                  type="button"
                  onClick={onDecrement}
                  className="quantity-btn"
                >
                  <BsDashSquare />
                </button>
                <p className="quantity">{quantity}</p>
                <button
                  data-testid="plus"
                  type="button"
                  onClick={onIncrement}
                  className="quantity-btn"
                >
                  <BsPlusSquare />
                </button>
              </div>
              <button type="button" className="add-to-cart-btn">
                ADD TO CART
              </button>
            </div>
          </div>
        </div>
        <div className="similar-products-section">
          <h1 className="similar-products-heading">Similar Products</h1>
          <ul className="similar-products-list">
            {similarprts.map(i => (
              <SimilarProduct key={i.id} productData={i} />
            ))}
          </ul>
        </div>
      </div>
    )
  }

  renderLoadingView = () => (
    <div data-testid="loader" className="products-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderFailuer = () => {
    const {errorMsg} = this.state
    const {history} = this.props
    const onClickMe = () => {
      history.push('/products')
    }

    return (
      <div>
        <img
          src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
          alt="failure view"
        />
        <h1>{errorMsg}</h1>
        <button type="button" onClick={onClickMe}>
          Continue Shopping
        </button>
      </div>
    )
  }

  renderView = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      case apiStatusConstants.success:
        return this.renderSuccess()
      case apiStatusConstants.failure:
        return this.renderFailuer()
      default:
        return null
    }
  }

  render() {
    return (
      <div>
        <Header />
        {this.renderView()}
      </div>
    )
  }
}

export default ProductItemDetails
