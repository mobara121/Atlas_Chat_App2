import React from 'react'
import { gql, useLazyQuery, useQuery } from '@apollo/client'
import { Row, Col, Button, Image } from 'react-bootstrap';
import classNames from 'classnames'

import { useMessageDispatch, useMessageState } from '../../context/message';

const GET_USERS = gql`
  query getUsers {
    getUsers {
        username
        createdAt
        imageUrl
        latestMessage {
            uuid
            from
            to
            content
            createdAt
      }
    }
  }
`
const Users = () => {
    const dispatch = useMessageDispatch()
    const { users } = useMessageState()
    const selectedUser = users?.find((u) => u.selected === true)?.username

    const { loading } = useQuery(GET_USERS, {
        onCompleted: data => dispatch({ type: 'SET_USERS', payload: data.getUsers }),
        onError: err => console.log(err)
    })
    // const [selectedUser, setSelectedUser] = useState(null)

    let usersMarkup
    if (!users || loading) {
        usersMarkup = <p>Loading..</p>
    } else if (users.length === 0) {
        usersMarkup = <p>No users have joined yet</p>
    } else if (users.length > 0) {
        usersMarkup = users.map((user) => {
            const selected = selectedUser === user.username
            return (<div
                role="button"
                className={classNames("user-div d-flex p-3", { 'bg-white': selected })}
                key={user.username}
                onClick={() => dispatch({ type: 'SET_SELECTED_USER', payload: user.username })
                }
            >
                <Image
                    src={user.imageUrl || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'}
                    roundedCircle
                    className="mr-2 p-1"
                    style={{ width: 50, height: 50, objectFit: 'cover' }}
                />
                <div style={{ marginLeft: '1vw' }}>
                    <p className="text-success">{user.username}</p>
                    <p style={{ fontSize: '0.7em' }}>
                        {user.latestMessage
                            ? user.latestMessage.content
                            : 'You are now connected!'}
                    </p>
                </div>
            </div>
            )
        })
    }

    return (
        <Col xs={4} className="p-0 bg-secondary">
            {usersMarkup}
        </Col>

    )
}

export default Users
