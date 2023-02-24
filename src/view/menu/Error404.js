import React, { Component } from 'react'
import {Redirect} from 'react-router-dom'

export default class Error404 extends Component {
   
    render() {
        return (
            <Redirect to="/"/>
        )
    }
}