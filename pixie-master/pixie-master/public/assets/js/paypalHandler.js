class PayPalHandler{
    //define jquery objects et al
    setElements(){
        this.btnConnectPayPal = $("#payPalConnect");
    }
    //set all properties
    setProperties(){
        //injected from a setting or wherever
        //not to be added here in production
        this.clientId = "AUwU6WMN2a0ht5sLrUSkeSI0dSWnM4m11ERLZrBR0SXXYc44sOxwGOFH3mcU3D2F0mNNG4Oh5ytdTf1q";
        this.secret = "EMaTBwFThJUCTKV18kaYWol9qv1uMuoO0LZ2vH0V-2SSnDwcJNTGHHvgvJnsjH_nXAuAHTV-RfPpyPfM";
    }
    //entry point of class
    init(){
        this.setProperties();
        this.setElements();              
        this.bindUIActions();
        this.preparePayPalConnectButton(this.btnConnectPayPal);
    }
    //binds all UI events
    bindUIActions(){
        this.payPalClickHandler(this.btnConnectPayPal);
    }
    payPalClickHandler(element) {
        element.click((e) => {
            console.log("i clicked");
            //this.PartnerReferral("EX12345");
        });
    }
    async preparePayPalConnectButton(button){
        const response = await this.PartnerReferral("EX12345");
        button.attr("href", response.links[1].href);
    }
    async getAccessToken(clientId, secret){
        const keyCombination = `${clientId}:${secret}`;

        const response = await fetch("https://api.sandbox.paypal.com/v1/oauth2/token", {
            // body: JSON.stringify({
            //     grant_type: "client_credentials"
            // }),
            body: "grant_type=client_credentials",
            headers: {
              Accept: "application/json",
              Authorization: `Basic ${btoa(keyCombination)}`,
              "Accept-Language": "en_US",
              "Content-Type": "application/x-www-form-urlencoded"
            },
            method: "POST"
        });

        return await response.json();
    }
    async PartnerReferral(trackingId){
        const token = await this.getAccessToken(this.clientId, this.secret);
        console.log("token: ", token.access_token);

        var obj = {
            "tracking_id": trackingId,
            "operations": [
                {
                    "operation": "API_INTEGRATION",
                    "api_integration_preference": {
                    "rest_api_integration": {
                        "integration_method": "PAYPAL",
                        "integration_type": "THIRD_PARTY",
                        "third_party_details": {
                        "features": [
                            "PAYMENT",
                            "REFUND",
                            "PARTNER_FEE",
                            "DELAY_FUNDS_DISBURSEMENT"
                        ]
                        }
                    }
                    }
                }
            ],
            "products": [
                "EXPRESS_CHECKOUT"
            ],
            "legal_consents": [
                {
                    "type": "SHARE_DATA_CONSENT",
                    "granted": true
                }
            ]
        };

        const response = await fetch("https://api.sandbox.paypal.com/v2/customer/partner-referrals", {
            body: JSON.stringify(obj),
            headers: {
                Authorization: `Bearer ${token.access_token}`,
                "Content-Type": "application/json"
            },
            method: "POST"
        });

        return await response.json();
    }
    async TrackSellerStatus(){

    }
}


var paypalHandler = new PayPalHandler();
paypalHandler.init();