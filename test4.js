firebase/index
/**
 * A simple entry point to the firebase module.
 * Groups and exposes all functionalities from the module to other modules in one file.
 *
 * {@description IMPORTANT
 *      As this is an interface,
 *      Modules outside of {@link "/firebase"} should not need to
 *      access other files other than this to use firebase.
 * }
 */
import * as auth from './auth';
import * as dbase from './dbase';
import * as firebase from './firebase';

export {
    auth,
    dbase,
    firebase
};

OrderPage
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView
} from 'react-native';
import {pushCurrentUserOrder} from "../../firebase/dbase";

const INITIAL_STATE = {
    order: {
        title: '',
        address: '',
        food: '',
        time: '',
        date: '',
    },
    successMessage: '',
    error: ''
};

export default class Order extends Component {
    state = {
        ...INITIAL_STATE
    };

    onSubmit = () => {
        // TODO(alex): Might want to upload an order and not just a string. Stripe requires other stuff. I'm still waiting on Stripe approval.
        const {order} = this.state;
        pushCurrentUserOrder(order)
            .then(() => {
                // Set Success message
                this.setState(() => ({successMessage: `Successfully added ${order.title}`}));
                // Reset error state
                this.setState(() => ({error: INITIAL_STATE.error}));

                setTimeout(() => {
                  this.props.navigation.navigate('Food');
                }, 1000);
            })
            .catch(error => {
                // Set error message
                this.setState(() => ({error: error.message}));
                // Reset success state
                this.setState(() => ({error: INITIAL_STATE.successMessage}));
            });
    };

    render () {
        return(
            <KeyboardAvoidingView style={styles.container} behaviour = "padding" enabled>
              <ScrollView>

                <Text style={styles.title}>
                    Area of Delivery
                </Text>
                <TextInput
                    style={styles.orderInput}
                    onChangeText={orderArea => this.setState(() => ({order: {...this.state.order, title: orderArea}}))}
                />

                <Text style={styles.title}>
                    Your Order
                </Text>
                <TextInput
                    style={styles.orderInput}
                    onChangeText={orderFood => this.setState(() => ({order: {...this.state.order, food: orderFood}}))}
                />

                <Text style={styles.title}>
                    Delivery Address
                </Text>
                <TextInput
                    style={styles.orderInput}
                    onChangeText={orderAddress => this.setState(() => ({order: {...this.state.order, address: orderAddress}}))}
                />

                <Text style={styles.title}>
                    Date of Delivery
                </Text>
                <TextInput
                    style={styles.orderInput}
                    onChangeText={orderDate => this.setState(() => ({order: {...this.state.order, date: orderDate}}))}
                />

                <Text style={styles.title}>
                    Time of Delivery
                </Text>
                <TextInput
                    style={styles.orderInput}
                    onChangeText={orderTime => this.setState(() => ({order: {...this.state.order, time: orderTime}}))}
                />
              <TouchableOpacity onPress={this.onSubmit} style = {styles.button}>
                    <Text style={styles.buttonText}>Confirm Order</Text>
                </TouchableOpacity>
                <Text style={styles.success}>
                    {this.state.successMessage}
                </Text>
                <Text style={styles.error}>
                    {this.state.error}
                </Text>
              </ScrollView>
            </KeyboardAvoidingView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 30,
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundColor: '#ffffff'
    },
    title: {
        marginBottom: 10,
        fontSize: 20,
        textAlign: 'center'
    },
    orderInput: {
        height: 50,
        padding: 4,
        marginRight: 2,
        marginBottom: 15,
        fontSize: 15,
        borderWidth: 1,
        borderColor: '#ff6f00',
        borderRadius: 8,
        color: '#ffa726',
        multiline: true
    },
    button: {
        height: 50,
        flexDirection: 'row',
        backgroundColor: '#ff6f00',
        borderRadius: 8,
        borderWidth: 1,
        marginBottom: 10,
        marginTop: 10,
        alignSelf: 'stretch',
        justifyContent: 'center'
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#ffffff',
        textAlign: 'center',
    },
    success: {
        fontSize: 15,
        color: '#54d254',
        textAlign: 'center'
    },
    error: {
        fontSize: 15,
        color: '#f00',
        textAlign: 'center'
    }
});
