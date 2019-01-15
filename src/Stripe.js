import Lambda from "./Lambda";

class Stripe {
    static createCharge(token) {
        Lambda.invokePaymentLambda({
            token
        });
    }

    static create
}

export default Stripe;
