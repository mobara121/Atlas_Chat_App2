import React from 'react'
import classNames from 'classnames'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import moment from 'moment'

import { useAuthState } from '../../context/auth'

const Message = ({ message }) => {
    const { user } = useAuthState()
    const sent = message.from === user.username
    const received = !sent
    return (
        <OverlayTrigger
            placement={sent ? 'right-start' : 'left-start'}
            overlay={
                <Tooltip>
                    {moment(message.createAt).format('MMMM DD, YYYY @ h:mm a')}
                </Tooltip>
            }
            translation={false}>
            <div className={classNames('d-flex my-3', {
                'ms-auto': sent,
                'me-auto': received
            })} >
                <div className={classNames('py-2 px-3 rounded-pill', {
                    'bg-primary': sent,
                    'bg-secondary': received
                })} >
                    <p className={classNames({ "text-white": sent })} key={message.uuid}>{message.content}</p>
                </div>
            </div >
        </OverlayTrigger>
    )
}

export default Message
