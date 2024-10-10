import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import "dotenv/config"
import {logger} from 'hono/logger'
import {csrf} from 'hono/csrf'
import {trimTrailingSlash} from 'hono/trailing-slash'
import { timeout} from 'hono/timeout'
import { userRouter } from './users/user.router'
import { vehiclesRouter } from './Vehicles/Vehicles.router'
import { bookingsRouter } from './Bookings/Bookings.router'
import { paymentsRouter } from './Payments/Payments.router'
import { locationsRouter } from './Location/Location.router'
import { fleetRouter } from './Fleet/Fleet.router'
import { customerSupportRouter } from './CustomerSupport/CustomerSupport.router'
import { vehicleSpecificationsRouter } from './VehicleSpecicifations/VehicleSpecifications.router'
import { authRouter } from './auth/auth.router'
import { cors} from 'hono/cors'
import { handleStripeWebhook } from './Payments/Payments.controller';




const app = new Hono()
app.use (cors());

///  in built middleware     
app.use(logger())     //----time counter
app.use(csrf())      //----csrf protection
app.use(trimTrailingSlash())  //----remove trailing slash
app.use('/api/time',timeout(5000))


app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.get('/api/time', (c) => {
    setTimeout(()=> {
    console.log("data after 5 seconds")
  },5000 )
  return c.text("return data after 5 seconds")
})

//this is for custom routers 
app.route('/',userRouter)  //user
app.route('/',vehiclesRouter) // vehicle)
app.route('/',bookingsRouter) // bookings
app.route('/',paymentsRouter) // payments
app.route('/',locationsRouter) // location router)
app.route('/',fleetRouter) // fleet router)
app.route('/',customerSupportRouter) // customer support router
app.route('/',vehicleSpecificationsRouter) // vehicle specification router router
app.route('/',authRouter) // authorization////register///login////)

//stripe webhook
app.post('/webhook', handleStripeWebhook)


console.log(`Server is running on port ${process.env.PORT}`)

serve({
  fetch: app.fetch,
  port: Number(process.env.PORT)|| 3000
});

