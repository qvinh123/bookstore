import { useEffect, useState } from 'react';

import { useHistory } from "react-router"

import { useDispatch, useSelector } from 'react-redux';

import { getCartAction } from './redux/actions/cartAction';
import { getWishlist } from './redux/actions/wishlistAction';

import { authSelector } from "./redux/selectors/authSelector"

import * as AuthAPI from "./api/authAPI.js"

import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'

import Routes from "./screens"
import { getCategories } from './redux/actions/categoriesAction';
import { userSelector } from './redux/selectors/userSelector';

import { getTokenUser } from './redux/actions/tokenAction';

import ProtectRoutes from './routes/ProtectRoutes';

import Payment from './screens/Shop/payment/Payment';

function App() {
  const [stripeApiKey, setStripeApiKey] = useState('');

  const { isAuthenticated } = useSelector(authSelector)
  const { user } = useSelector(userSelector)

  const dispatch = useDispatch()
  const history = useHistory()

  useEffect(() => {
    dispatch(getCategories())
  }, [dispatch])


  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getTokenUser(history))
    }
  }, [isAuthenticated, dispatch, history])


  useEffect(() => {
    if (user) {
      dispatch(getCartAction())
      dispatch(getWishlist())

      async function getStripApiKey() {
        const { data } = await AuthAPI.getStripe()
        setStripeApiKey(data.stripeApiKey)
      }

      getStripApiKey()
    }
  }, [dispatch, user])

  return (
    <div className="App">
      {
        stripeApiKey &&
        <Elements stripe={loadStripe(stripeApiKey)}>
          <ProtectRoutes path="/payment" component={Payment} exact />
        </Elements>
      }
      <Routes />
    </div>
  )
}

export default App
