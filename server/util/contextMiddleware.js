const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/env.json');


// const { PubSub } = require('graphql-subscriptions');

// const pubsub = new PubSub();

module.exports = (context) => {
    // let token
    // if (context.req && context.req.headers.authorization) {
    //     token = context.req.headers.authorization.split('Bearer ')[1]
    // } else if (context.connection && context.connection.context.Authrization) {
    //     token = context.connection.context.Authrization.split('Bearer ')[1]
    // }

    // if (token) {
    //     jwt.verify(token, JWT_SECRET, (err, decordedToken) => {

    //         context.user = decordedToken
    //     })
    // }

    // context.pubsub = pubsub
    if (context.req && context.req.headers.authorization) {
        const token = context.req.headers.authorization.split('Bearer ')[1]
        jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
            context.user = decodedToken
        })
    }

    return context
}