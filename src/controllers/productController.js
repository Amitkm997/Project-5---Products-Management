const productModel = require('../models/productModel');
const uploadFile = require("../aws/aws")

const {isValid, isValidRequestBody, isValidEnum } = require('../validator/validator')

const createProduct = async (req, res)=>{
    try{
        const files = req.files
        const data = req.body
        const {title, description, price, isFreeShipping, productImage, style,
             availableSizes, installments} = data

    if(!isValid(title)) {return res.status(400).send({status:false, message: "title required"})}
    if(!isValid(description)) {return res.status(400).send({status:false, message: "description required"})}
    if(!isValid(price)) {return res.status(400).send({status:false, message: "price required"})}
    //  if(!isValid(currencyId)) {return res.status(400).send({status:false, message: "currencyId required"})}
    //    if(!isValid(currencyFormat)) {return res.status(400).send({status:false, message: "currencyFormat required"})}
    if(!isValid(isFreeShipping)) {return res.status(400).send({status:false, message: "isFreeShipping required"})}
  //  if(!isValid(productImage)) {return res.status(400).send({status:false, message: "productImage required"})}
    if(!isValid(style)) {return res.status(400).send({status:false, message: "style required"})}
    if(!isValid(availableSizes)) {return res.status(400).send({status:false, message: "availableSizes required"})}
    if(!isValid(installments)) {return res.status(400).send({status:false, message: "installments required"})}

    data.currencyFormat = "₹"
    data.currencyId = "INR"

    if(!isValidRequestBody(data)) {return res.status(400).send({ status: false, Message: 
        "Invalid request parameters, Please provide product details" })}

    if(files.length > 0) {data.productImage = await uploadFile(files[0]);
        } else {return res.status(400).send({ status: false, message: "ProductImage  is required" });}

   const uniqueTitle = await productModel.findOne({title:title})
    if(uniqueTitle){return res.status(400).send({status:false, message: "title must be unique"})}

    if (isValidEnum(availableSizes))
      return res.status(400).send({ status: false, msg: "availableSizes should be of (S,XS,M,X,L,XXL,XL)" });

      const saveData = await productModel.create(data)
      res.status(201).send({ status: true, message: 'product created successfully', data: saveData })
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message });
    }
}
 module.exports = {createProduct}