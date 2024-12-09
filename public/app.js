
const stripe = Stripe("pk_test_51QOUxpLd6ro9Gi66wQwwWRe7aAiMSQEbUZgxOxbw50OUHACAVQSgXpKNUGncZisJyEUzwLfADBB1ym1WtHELXepk00AKyj6rIs"); 
const elements = stripe.elements();

const card = elements.create("card");
card.mount("#card-element");


const form = document.getElementById("donation-form");
form.addEventListener("submit", async (event) => 
  {
  event.preventDefault(); 

  const amtInput = document.getElementById("amount");
  const amt = parseFloat(amtInput.value) * 100; 

  if (!amt || amt <= 0) 
  {
    alert("Please enter a valid donation amount.");
    return;
  }

  try 
  {
    // Send a request to create a Payment Intent
    const res = await fetch("http://localhost:3000/create-payment-intent", 
      {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amt }), 
    });

    const { clientSecret, error } = await res.json();
    if (error) 
    {
      console.error("Error from server:", error);
      alert("An error occurred: " + error);
      return;
    }

    const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card,
      },
    });

    if (stripeError) 
    {
      console.error("Payment failed:", stripeError.message);
      alert("Payment failed: " + stripeError.message);
    } else if (paymentIntent) {
      console.log("Payment successful:", paymentIntent);
      alert("Thank you for your donation!");
      window.location.href = "/success.html "; 
    }
  } catch (err) {
    console.error("An unexpected error occurred:", err);
    alert("An unexpected error occurred. Please try again.");
  }
});
