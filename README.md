# grace-shopper
Grace shopper project
<<<<<<< .merge_file_jY3Ixf
Selling Bikes
https://www.bikesonline.com
# Endpoints
https://github.com/eludadev/bikes-api
https://docs.cyclic.sh/tutorials/rest-api-and-dynamodb/part-2
    https://bikes.cyclic.app
    Fetch All Bikes
    https://bikes.cyclic.app/bikes/all
    GET bike by ID
    https://bikes.cyclic.app/bikes/${ID}
    or
    https://bikes.cyclic.app/bikes/<ID>
    GET by Handle
    https://bikes.cyclic.app/bikes/by-handloe/${HANDLE}
    or
    https://bikes.cyclic.app/bikes/by-handloe/${HANDLE}
    Search bikes by title
    http://localhost:3000/bikes/search/by-title\?query\=Bicycle
# DATABASE
RESEARCH AI TO AUTO GENERATE PRODUCT DATA!
- Design schema for:
    bikeCatalog
        - productId
        - category
        - name
        - description
        - Price
        - avalableForSale (true/false)
        - brand

    Users
        - localStorage token
        - UserId
        - username
        - Password
        - Email
        - Admin (yes/no)
        - Shipping Address
        - user profile
        - access to Cart
        - order history

    order
        * merge with products table
        - orderid
        - order date
        - delivery status
        - estimated delivery date
        - *productid
        - *name
        - *userid
        - *photo

    Admin
    * research looking into special JWT tokens for ADMIN
        - add edit and delete product
        - view user info
        - create/edit name, description, price and one or more photos
        - create categories for items
        - manage the avail
        - view a list of all orders and be able to filter a list of order status
            - created
            - processing
            - cancelled
            - completed
        - Change the status of the order so that others will know what status the order is in
            - Created to Processing
            - Processing to cancelled or completed
        - Promote other user accounts to have admin status
        - delete users
    Guests
        - session token
        - Browse products
        - View specific products
        - Create an account

    Reviews
        - productId
        - productName
        - userId
        - username
        - title
        - comment
        - rating
        - timestamp

    Cart
        Store in localstorage
        - (have to be logged in) Should be able to persist across multi devices/browser
        - Add Remove items change quanity
        - details of specific item
        - access to checkout functionality
        - Guest-only: I don't want to create an account, but I want my cart to persist between browser refreshes.
        - Guest-to-logged-in-user: Initially, I'm not logged in, and I add items to my cart. When I eventually log in, I want to see those same items I added when I was logged in still in my cart, in addition to the items I may have had in my cart from a previous logged in session.
    CHECKOUT
        - utalize stripe tech from directions
- Initialize database for starting application
Users
# Research
    - Backend API *
# GIT CHEATSHEET
 git push --force origin
 git branch
 git checkout -b <branchName>
