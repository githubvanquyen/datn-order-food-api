import { Request, Response } from "express"
import { IRequestProduct, IResponse, productReq } from "../ultil/type";
import { Product } from "../model/product";
import { AppDataSource } from "../config/database";
import { Variant } from "../model/variant";
import { Collection } from "../model/collection";
import { In, Like } from "typeorm";
import { Order } from "../model/order";
import { User } from "../model/user";
const https = require('https');

interface dataReq{
    methodPayment: string,
    products: productReq[],
    username: string,
    address: string,
    user: string
}

class paymentController{
    create = async (req: Request, res: Response)=>{
        let result = {
            success: false,
            data: {},
            error: {
                field: "",
                message:""
            },
            dataPayment: {},
            message: "could not create payment order",
        }
        const {
            methodPayment,
            products,
            username,
            address,
            user
        }: dataReq = req.body;

        console.log("data", req.body);

        try {
            const order = new Order();
            const productId =  products.map((product) => product.productId)
            console.log(productId);
            const productList =  await AppDataSource.manager.find(Product, {
                where:{
                    id: In(productId),
                }
            })

            let userFind = await AppDataSource.manager.findOne(User, {
                where:{
                    token: user,
                }
            }) || undefined;

            let total = 0;
            products.map((product) =>{
                total += product.quantity * product.productPrice
            })

            order.addressShiping =  address;
            order.note = "";
            order.methodPayment= methodPayment;
            order.products = productList;
            order.user = userFind;
            order.status = "-1";
            order.totalPrice = total;
            const resultSave = await AppDataSource.manager.save(Order, order);
            if(resultSave){
                result.success =  true;
                result.data = resultSave;
                result.message = "create payment successfully";
            }
            if(methodPayment === "1"){
                let accessKey = 'F8BBA842ECF85';
                let secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
                let orderInfo = 'pay with MoMo';
                let partnerCode = 'MOMO';
                let redirectUrl = 'https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b';
                let ipnUrl = 'https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b';
                let requestType = "payWithMethod";
                let amount = `${total}`;
                let orderId = partnerCode + new Date().getTime();
                let requestId = orderId;
                let extraData ='';
                let paymentCode = 'T8Qii53fAXyUftPV3m9ysyRhEanUs9KlOPfHgpMR0ON50U10Bh+vZdpJU7VY4z+Z2y77fJHkoDc69scwwzLuW5MzeUKTwPo3ZMaB29imm6YulqnWfTkgzqRaion+EuD7FN9wZ4aXE1+mRt0gHsU193y+yxtRgpmY7SDMU9hCKoQtYyHsfFR5FUAOAKMdw2fzQqpToei3rnaYvZuYaxolprm9+/+WIETnPUDlxCYOiw7vPeaaYQQH0BF0TxyU3zu36ODx980rJvPAgtJzH1gUrlxcSS1HQeQ9ZaVM1eOK/jl8KJm6ijOwErHGbgf/hVymUQG65rHU2MWz9U8QUjvDWA==';
                let orderGroupId ='';
                let autoCapture =true;
                let lang = 'vi';
        
                //before sign HMAC SHA256 with format
                //accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
                let rawSignature = "accessKey=" + accessKey + "&amount=" + amount + "&extraData=" + extraData + "&ipnUrl=" + ipnUrl + "&orderId=" + orderId + "&orderInfo=" + orderInfo + "&partnerCode=" + partnerCode + "&redirectUrl=" + redirectUrl + "&requestId=" + requestId + "&requestType=" + requestType;
                
                const crypto = require('crypto');
                let signature = crypto.createHmac('sha256', secretKey)
                    .update(rawSignature)
                    .digest('hex');
                
        
                //json object send to MoMo endpoint
                const requestBody = JSON.stringify({
                    partnerCode : partnerCode,
                    partnerName : "Test",
                    storeId : "MomoTestStore",
                    requestId : requestId,
                    amount : amount,
                    orderId : orderId,
                    orderInfo : orderInfo,
                    redirectUrl : redirectUrl,
                    ipnUrl : ipnUrl,
                    lang : lang,
                    requestType: requestType,
                    autoCapture: autoCapture,
                    extraData : extraData,
                    orderGroupId: orderGroupId,
                    signature : signature
                });
                //Create the HTTPS objects
                const options = {
                    hostname: 'test-payment.momo.vn',
                    port: 443,
                    path: '/v2/gateway/api/create',
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Content-Length': Buffer.byteLength(requestBody)
                    }
                }
                //Send the request and get the response
                const request = https.request(options, (response: any) => {
                    response.setEncoding('utf8');
                    response.on('data', (body: any) => {
                        console.log(body);
                        console.log(JSON.parse(body).resultCode);
                        result.dataPayment = JSON.parse(body)
                        res.status(200).json(result)
                    });
                    response.on('end', () => {
                        console.log('payment order successfully.');
                    });
                })
        
                request.on('error', (e: any) => {
                    console.log(`problem with request: ${e.message}`);
                });
                // write data to request body
                console.log("Sending....")
                request.write(requestBody);
                request.end();
            }else{
                res.status(200).json(result);
            }
        } catch (error) {
            result.message = "create payment order have error"
            res.status(400).json(result);
        }
    }
}

export default new paymentController