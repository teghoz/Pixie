function initPayPal(){
    paypal.Buttons({
      createOrder: function(data, actions) {
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
        }).then(function(res) {
          return res.json();
        }).then(function(data) {
            console.log("data: ", data);
          return data;
        });
      },
      onApprove: function(data, actions) {
        return fetch('/dashboardPayPal/handle-approve/' + data.orderID, {
          method: 'POST'
        }).then(function(res){
          if (!res.ok) {
            alert('Something went wrong');
          }
        });
      }
    }).render('#paypal-button-container');
}
initPayPal();