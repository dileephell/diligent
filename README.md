# diligent

Clone the Repo to local directory.
Check whether NodeJS and MongoDB is running.
Cd to Folder and run  `npm install`
After successfully installing all the modules.
Run `npm run watch` to see the server running with the changes if any are there too in future.

Go to Postman to check for the endpoints.

Method: POST http://localhost:3000/api/products
Body  : `{
    "name": "Product 100",
    "price": 60,
    "description": "This is a sample product",
    "views" : 0
}`

Header: application/json

2. GET http://localhost:3000/api/products/63ff38256aadbd2ff642b145?currency=CAD

3. GET http://localhost:3000/api/products/most-viewed?limit=5

4. DELETE http://localhost:3000/api/products/63ff2aa301335bc417027d69
