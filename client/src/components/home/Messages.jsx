import React, { Fragment, useState, useEffect } from 'react'
import { gql, useLazyQuery, useMutation } from '@apollo/client'
import { Col, Form, Button } from 'react-bootstrap';
import TelegramIcon from '@material-ui/icons/Telegram';
import InputEmoji from 'react-input-emoji';

import { useMessageDispatch, useMessageState } from '../../context/message'
import Message from './Message'

const GET_MESSAGES = gql`
  query getMessages($from: String!) {
    getMessages(from: $from) {
      uuid
      from
      to
      content
      createdAt
    }
  }
`;

const SEND_MESSAGE = gql`
    mutation sendMessage($to:String!, $content: String! ){
        sendMessage(to: $to, content: $content){
            uuid from to content createdAt
        }
    }
`

const Messages = () => {
    const { users } = useMessageState()
    const dispatch = useMessageDispatch()
    const [content, setContent] = useState('')

    const selectedUser = users?.find((u) => u.selected === true)
    const messages = selectedUser?.messages

    const [
        getMessages,
        { loading: messagesLoading, data: messagesData },
    ] = useLazyQuery(GET_MESSAGES)

    const [sendMessage] = useMutation(SEND_MESSAGE, {
        onError: err => console.log(err)
    })

    useEffect(() => {
        if (selectedUser && !selectedUser.messages) {
            getMessages({ variables: { from: selectedUser.username } })
        }
    }, [selectedUser])

    useEffect(() => {
        if (messagesData) {
            dispatch({
                type: 'SET_USER_MESSAGES',
                payload: {
                    username: selectedUser.username,
                    messages: messagesData.getMessages,
                },
            })
        }
    }, [messagesData])

    const submitMessage = e => {
        e.preventDefault()

        if (content.trim() === '' || !selectedUser) return

        setContent('')

        // mutation for sending the message
        sendMessage({ variables: { to: selectedUser.username, content } })
    }


    let selectedChatMarkup
    if (!messages && !messagesLoading) {
        selectedChatMarkup = <p className="info-text">Select a friend</p>
    } else if (messagesLoading) {
        selectedChatMarkup = <p className="info-text">Loading..</p>
    } else if (messages.length > 0) {
        selectedChatMarkup = messages.map((message, index) => (
            <Fragment key={message.uuid}>
                <Message message={message} />
                {index === messages.length - 1 && (
                    <div className="invisible">
                        <hr className="m-0" />
                    </div>
                )}
            </Fragment>
        ))
    } else if (messages.length === 0) {
        selectedChatMarkup = <p className="info-text">You are now connected! send your first message!</p>
    }


    return (
        <Col xs={8}>
            <div style={{ padding: '0 1vw', height: '80vh' }} className="messages-box d-flex flex-column-reverse justify-content-end">
                {selectedChatMarkup}
            </div>
            <div style={{ bottom: 0, position: 'relative', backgroundImage: "linear-gradient(90deg, rgba(54,25,153,1) 0%, rgba(54,25,153,0.5) 50%, rgba(54,25,153,0.5) 60%, rgba(54,25,153,1) 100%)", padding: '2vh' }}>
                <Form>
                    <Form.Group className="d-flex align-items-center">
                        {/* <Form.Control
                            type="text"
                            className="message-input rounded-pill bg-secondary border-0 p-3"
                            placeholder="Type a message.."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        /> */}
                        {/* <div className="send-bar"> */}
                        <InputEmoji
                            value={content}
                            onChange={setContent}
                            cleanOnEnter
                            // onEnter={handleOnEnter}
                            placeholder="Type a message"
                        // className={classes.smaileEmoji}
                        />
                        <Button type="submit" onClick={submitMessage} className="send-btn">
                            <TelegramIcon
                                role="button" style={{ fontSize: '2rem' }} /></Button>
                        {/* </div> */}
                    </Form.Group>

                </Form>
            </div>
        </Col>
    )
}

export default Messages
