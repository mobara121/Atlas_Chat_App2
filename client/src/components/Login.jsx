import React, { useState } from 'react';
import { Row, Col, Form } from 'react-bootstrap';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import { gql, useQuery, useLazyQuery } from '@apollo/client';
import { Link } from 'react-router-dom';

import { useAuthDispatch } from '../context/auth';

const LOGIN_USER = gql`
  query login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      username
      email
      createdAt
      token
    }
  }
`;

const Login = (props) => {
    const [variables, setVariables] = useState({
        username: '',
        password: '',
    })

    const [errors, setErrors] = useState({})

    const dispatch = useAuthDispatch()

    const [loginUser, { loading }] = useLazyQuery(LOGIN_USER, {
        onError: (err) =>
            // console.log(err.graphQLErrors[0].extensions.errors)
            setErrors(err.graphQLErrors[0].extensions.errors),
        onCompleted(data) {
            localStorage.setItem('token', data.login.token)
            dispatch({ type: 'LOGIN', payload: data.login })
            props.history.push('/')
        }
    })

    const submitLoginForm = (e) => {
        e.preventDefault()

        loginUser({ variables })
    }
    return (
        <div>
            <Row className="py-5">
                <Card style={{ width: "40vw", margin: "8vh auto", minWidth: "350px", padding: "30px" }}>
                    <Col>
                        <h2 style={{ textAlign: "center", fontWeight: "bold", paddingBottom: '2vh' }}>Login to chat</h2>
                        <Form onSubmit={submitLoginForm}>
                            <Form.Group className="mb-3">
                                <Form.Label className={errors.username && 'text-danger'}>
                                    {errors.username ?? 'Username'}
                                </Form.Label>
                                <Form.Control
                                    type="text" value={variables.username}
                                    className={errors.username && 'is-invalid'}
                                    onChange={e => setVariables({ ...variables, username: e.target.value })}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label className={errors.password && 'text-danger'}>
                                    {errors.password ?? 'Password'}
                                </Form.Label>
                                <Form.Control
                                    type="password"
                                    value={variables.password}
                                    className={errors.password && 'is-invalid'}
                                    onChange={e => setVariables({ ...variables, password: e.target.value })}
                                />
                            </Form.Group>
                            <div className="text-center">
                                <Button variant="contained" color="primary" type="submit" disabled={loading}>
                                    {loading ? 'loading..' : 'LOGIN'}
                                </Button>
                                <div style={{ marginTop: '5vh' }}>
                                    <p>Don't have account ? <Link to="/register">Go to Register</Link></p>
                                </div>
                            </div>
                        </Form>
                    </Col>
                </Card>
            </Row>
        </div>
    )
}

export default Login
