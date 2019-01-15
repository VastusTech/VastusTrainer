import React, { Component } from "react";
import { StripeProvider, injectStripe, CardElement } from "react-stripe-elements";

type Props = {

};

class PaymentScreen extends Component<Props> {
    render() {
        return(
            <StripeProvider apiKey="pk_test_CbE2Whxj7u2M2utQ407MOCnH">
                <div>
                    <CardElement/>
                </div>
            </StripeProvider>
        );
    }
}

export default injectStripe(PaymentScreen);