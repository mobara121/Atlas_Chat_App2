import React, { useState } from 'react';
import { Row, Col, Form } from 'react-bootstrap';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import { gql, useMutation } from '@apollo/client';
import { Link } from 'react-router-dom';

const REGISTER_USER = gql`
  mutation register($username: String! $email: String! $password: String! $confirmPassword: String!) {
    register(username: $username email: $email password: $password confirmPassword: $confirmPassword) {
      username
      email
      createdAt
    }
  }
`;

const Register = (props) => {
    const [variables, setVariables] = useState({
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
    })

    const [errors, setErrors] = useState({})

    const [registerUser, { loading }] = useMutation(REGISTER_USER, {
        update: (_, __) => props.history.push('/login'),
        onError: (err) =>
            // console.log(err.graphQLErrors[0].extensions.errors)
            setErrors(err.graphQLErrors[0].extensions.errors)
    })

    const submitRegisterForm = (e) => {
        e.preventDefault()

        registerUser({ variables })
    }
    return (
        <div>
            <Row className="py-5">
                <Card style={{ width: "40vw", margin: "8vh auto", minWidth: "350px", padding: "30px" }}>
                    <Col>
                        <h2 style={{ textAlign: "center", fontWeight: "bold", paddingBottom: '2vh' }}>Register to start chat</h2>
                        <Form onSubmit={submitRegisterForm}>
                            <Form.Group className="mb-3">
                                <Form.Label className={errors.email && 'text-danger'}>
                                    {errors.email ?? 'Email address'}
                                </Form.Label>
                                <Form.Control
                                    type="email"
                                    value={variables.email}
                                    className={errors.email && 'is-invalid'}
                                    onChange={e => setVariables({ ...variables, email: e.target.value })}
                                />
                            </Form.Group>
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
                            <Form.Group className="mb-3">
                                <Form.Label className={errors.confirmPassword && 'text-danger'}>
                                    {errors.confirmPassword ?? 'Confirm Password'}
                                </Form.Label>
                                <Form.Control
                                    type="password"
                                    value={variables.confirmPassword}
                                    className={errors.confirmPassword && 'is-invalid'}
                                    onChange={e => setVariables({ ...variables, confirmPassword: e.target.value })}
                                />
                            </Form.Group>
                            <div className="text-center">
                                <Button variant="contained" color="primary" type="submit" disabled={loading}>
                                    {loading ? 'loading..' : 'JOIN CHAT APP'}
                                </Button>
                                <div style={{ marginTop: '5vh' }}>
                                    <p>Already have an account ? <Link to="/login">Go to Login</Link></p>
                                </div>
                            </div>
                        </Form>
                    </Col>
                </Card>
            </Row>
        </div>
    )
}

export default Register
