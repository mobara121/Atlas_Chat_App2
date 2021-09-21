import React, { useEffect, useState, Fragment } from 'react'
import { Row, Col, Button, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { gql, useSubscription } from '@apollo/client'

import { useAuthDispatch, useAuthState } from '../../context/auth'
import { useMessageDispatch } from '../../context/message'

import Users from './Users';
import Messages from './Messages'

const NEW_MESSAGE = gql`
    subscription newMessage{
        newMessage{
            uuid
            from
            to
            content
            createdAt
        }
    }
`;

const Home = ({ history }) => {
    const authDispatch = useAuthDispatch()
    const messageDispatch = useMessageDispatch()

    const { user } = useAuthState()
    // const [selectedUser, setSelectedUser] = useState(null)

    const { data: messageData, error: messageError } = useSubscription(NEW_MESSAGE);


    useEffect(() => {
        if (messageError) console.log(messageError)

        if (messageData) {
            const message = messageData.newMessage
            const otherUser = user.username === message.to ? message.from : message.to
            messageDispatch({
                type: 'ADD_MESSAGE',
                payload: {
                    username: otherUser,
                    message
                }
            })
        }
    }, [messageData, messageError])

    const logout = () => {
        authDispatch({ type: 'LOGOUT' })
        window.location.href = './login'
    }

    return (
        <Fragment>
            <Row style={{ margin: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'flex-end', height: '10vh', backgroundImage: "linear-gradient(90deg, rgba(54,25,153,1) 0%, rgba(54,25,153,0.5) 50%, rgba(54,25,153,0.5) 60%, rgba(54,25,153,1) 100%)", padding: '2vh' }} >
                    <Link to="/login">
                        {/* <Button variant="link">Login</Button> */}
                    </Link>
                    <Link to="/register">
                        {/* <Button variant="link">Register</Button> */}
                    </Link>
                    <Button variant="link" style={{ backgroundColor: '#FF6495', color: "white", textDecoration: 'none', borderRadius: '5px', fontWeight: 'bold' }} onClick={logout}>LOGOUT</Button>
                </div>
            </Row>
            <div style={{ display: 'flex', height: '90vh', margin: 0 }}>
                <Users />
                <Messages />

            </div>
        </Fragment>
    )
}

export default Home
