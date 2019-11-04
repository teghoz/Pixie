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
        this.getFinalOnBoardDetailsFromUrl();
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
        
        if(this.checkifSellerisAlreadyOnBoarded() === false){
            const baseUrl = `${window.location.protocol}//${window.location.host}`;
            const returnUrl = window.location; 
            const response = await this.partnerReferral("EX12345", returnUrl, baseUrl);
            button.attr("href", response.links[1].href);
        } 
        else{
            //show different button
            button.html("Connected!");
        }     
        
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
    async partnerReferral(trackingId, returnUrl, baseUrl){
        const token = await this.getAccessToken(this.clientId, this.secret);
        console.log("token: ", token.access_token);

        var obj = {
            "tracking_id": trackingId,
            "partner_config_override": {
                "partner_logo_url": "https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_111x69.jpg",
                "return_url": returnUrl.toString(),
                "return_url_description": "the url to return the merchant after the paypal onboarding process.",
                "action_renewal_url": baseUrl + "/renew-exprired-url",
                "show_add_credit_card": true
            },
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
    getUrlParams(url){
        var queryString = url ? url.split('?')[1] : window.location.search.slice(1);
        var obj = {};

        if (queryString) {
            queryString = queryString.split('#')[0];
            var arr = queryString.split('&');

            for (var i = 0; i < arr.length; i++) {
                var a = arr[i].split('=');
                var paramName = a[0];
                var paramValue = typeof a[1] === 'undefined' ? true : a[1];

                paramName = paramName.toLowerCase();
                if (typeof paramValue === 'string') paramValue = paramValue.toLowerCase();

                if (paramName.match(/\[(\d+)?\]$/)) {
                    var key = paramName.replace(/\[(\d+)?\]/, '');
                    if (!obj[key]) obj[key] = [];

                    if (paramName.match(/\[\d+\]$/)) {
                        var index = /\[(\d+)\]/.exec(paramName)[1];
                        obj[key][index] = paramValue;
                    } else {
                        obj[key].push(paramValue);
                    }
                } 
                else {
                    if (!obj[paramName]) {
                        obj[paramName] = paramValue;
                    } else if (obj[paramName] && typeof obj[paramName] === 'string') {
                        obj[paramName] = [obj[paramName]];
                        obj[paramName].push(paramValue);
                    } else {
                        obj[paramName].push(paramValue);
                    }
                }
            }
        }

	    return obj;
    }
    checkifSellerisAlreadyOnBoarded(){
        return false;
    }
    getFinalOnBoardDetailsFromUrl(){
        const params = this.getUrlParams(window.location.href);
        console.log("params: "+ params);
        console.log("params str: "+ JSON.stringify(params));
    }  
    saveOnBoardingDetails(obj){
        //handle the saving login
    }
    async trackSellerStatus(partner_merchant_id, seller_merchant_id){
        const token = await this.getAccessToken(this.clientId, this.secret);
        const response = await fetch(`https://api.sandbox.paypal.com/v1/customer/partners/${partner_merchant_id}/merchant-integrations/${seller_merchant_id}`, {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            },
            method: "GET"
        });

        return await response.json();
    }
}


var paypalHandler = new PayPalHandler();
paypalHandler.init();