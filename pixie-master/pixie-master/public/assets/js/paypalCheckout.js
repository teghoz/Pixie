var settings = {
    client : "AUwU6WMN2a0ht5sLrUSkeSI0dSWnM4m11ERLZrBR0SXXYc44sOxwGOFH3mcU3D2F0mNNG4Oh5ytdTf1q",
    secret : "EMaTBwFThJUCTKV18kaYWol9qv1uMuoO0LZ2vH0V-2SSnDwcJNTGHHvgvJnsjH_nXAuAHTV-RfPpyPfM",
    payPalPartnerMerchantId : "KW3M9R5XA3L3G"
};

const getAccessToken = async (clientId, secret) => {
    const keyCombination = `${clientId}:${secret}`;

    const response = await fetch("https://api.sandbox.paypal.com/v1/oauth2/token", {
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

const createOrderRecord = () => {
    return fetch('/dashboardPayPal/create-order', {
        body: JSON.stringify({
            quantity: $('#quantity').val(),
            customer: "12345",
            productid: $('#quantity').data("productid"),
            seller: $('#quantity').data("seller")
        }),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: 'POST'
    });
}

const initPayPal = (token, payload) => {
    paypal.Buttons({
      createOrder: function(data, actions) {
        return fetch("https://api.sandbox.paypal.com/v2/checkout/orders", {
            body: payload,
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            method: "POST"
        }).then((res) => {
          return res.json();
        }).then((data) => {
          return data.id;
        });
      },
      onApprove: function(data, actions) {
        console.log("data: "+ data + " actions: "+ actions);
        console.log("data: "+ JSON.stringify(data) + " actions: "+ JSON.stringify(actions));
        return fetch(`https://api.sandbox.paypal.com/v2/checkout/orders/${data.orderID}/capture`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            method: "POST"
        })
        .then((res) => {           
          if (!res.ok) {
            alert('Something went wrong');
          }
          else{
              console.log("res: ", res);
              alert(`Checkout Complete: Check console for response object`);
              createOrderRecord();
          }
        });
      }
    }).render('#paypal-button-container');
}

const payload = () => {
    return {
        "intent": "CAPTURE",
        "purchase_units": [
          {
            "amount": {
              "currency_code": "USD",
              "value": $("#paypal-button-container").data("price").replace('$','')
            }
          }
        ]
      }
}

const init = async () => {
    const token = await getAccessToken(settings.client, settings.secret);
    initPayPal(token.access_token, JSON.stringify(payload()));
}

init();

