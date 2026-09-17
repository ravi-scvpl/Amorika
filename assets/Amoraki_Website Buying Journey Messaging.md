**amoraki \- Website Buying Journey & Customer-Facing Copy**

# **Buying Journey Overview**

| Step | Stage | Purpose |
| :---- | :---- | :---- |
| 01 | Select delivery location | Prompt the customer to choose the delivery region before purchase. |
| 02 | Validate delivery eligibility | Allow the journey to continue for Delhi NCR; show a warm, positive message for other locations. |
| 03 | Move directly to cart / checkout | The “Send a Moment of Care” CTA should take the customer straight to the purchase journey. |
| 04 | Sign up or continue with mobile OTP | Prompt the customer to verify their mobile number before proceeding. |
| 05 | Add delivery and order details | Collect the required buyer and recipient information. |
| 06 | Complete payment | Take the customer to Razorpay through the Shopify payment flow. |
| 07 | Show confirmation | Return the customer to a thank-you page with order confirmation and next steps. |
| 08 | Send updates | Inform the customer that updates will be shared via email and WhatsApp. |

# **2\. Delivery Location Prompt**

**Message Copy:** 

Where would you like this Moment Hamper to be delivered?

(Suggested shopify flow below)

**Dropdown label:** Select delivery location

**Dropdown options:** Delhi/Noida/Faridabad/Gurgaon/ Others

**Primary CTA:** Continue

# **3\. Message for Locations Outside the Delivery Area**

**Message Copy:**

We’re starting close to home, with Delhi NCR.

Moment of Care isn’t available for delivery to this location just yet. We’d love to bring it your way soon.

Thank you for thinking of amoraki.

# **4\. Cart / Checkout**

**Page Copy and flow:**

**Heading:** Your Moment Hamper

**Sub-heading line:** A few details, and your moment is on its way.

**Order summary**

Collection selected: Moment of Care 

Price: 5490 inclusive of taxes

\+200 hand delivery fee, within Delhi NCR

Total amount: 5690 

**CTA: Continue to pay**

# **5\. Sign Up / Mobile OTP**

***Standard flow of Shopify.*** 

**Heading:** A few details, then we’re on our way

# **6\. Delivery Details**

**Heading:** Where should we send it?

Suggested fields:

* Buyer’s full name  
* Buyer’s mobile number  
* Buyer’s email address  
* Recipient’s full name  
* Recipient’s mobile number  
* Complete delivery address  
* City  
* State  
* PIN code

Add a checkbox: 

**“Billing and shipping details are different.”**

# **7\. Payment Stage**

**Message Copy:**

**Heading:** Almost there.

**Supporting line:** Your Moment Hamper is ready to make its way to someone special.

**Payment reassurance:** Your details are in place. Let’s complete your order securely.

# **8\. Thank-You / Order Confirmation**

**Page Copy:**

**Heading:** A Moment of Care is on its way.

Thank you for choosing Amoraki.

Your order has been received and will be hand-delivered in 2-3 business days. We’ll soon send an intimation to your email and WhatsApp with the details..

**Show on page:** Order number

**Show on page:** Collection name: Moment of Care

Thoughtfully yours,

amoraki (use logo)

# **9\. Email Confirmation Copy**

Your Moment of Care is now in motion. 🤍

Thank you for choosing amoraki.

We’ll be in touch shortly with your order updates over WhatsApp.

Thoughtfully yours,

amoraki (use logo)

# **10\. Payment Failure & Retry Payments**

### **Payment failed Message Copy:**

**A little pause. Nothing lost.**  
Your payment didn’t go through. Your order is still waiting.

**CTA 1:  Retry Payment		CTA 2: Try Another Method**  

### **When payment is successful after retry, t*ake to thank you page \- POINT number 8 in this document***

# **Implementation Checklist**

☐ Add a delivery-location prompt before the customer begins the purchase journey.

☐ Define the exact Delhi NCR delivery PIN-code list.

☐ Validate the customer’s location against the approved PIN-code list.

☐ Show the out-of-area message when the selected location is not serviceable.

☐ Route the “Send a Moment of Care” CTA directly to cart / checkout.

☐ Enable mobile-number sign-up or login with OTP validation.

☐ Confirm whether OTP verification is handled by Shopify, an app or another service.

☐ Collect buyer and recipient details separately where required.

☐ Display the delivery fee separately and clearly.

☐ Integrate Razorpay through the Shopify payment flow.

☐ Configure successful-payment return to the amoraki thank-you page.

☐ Configure failed-payment, cancelled-payment and retry states.

☐ Show order number and confirmation details after successful payment.

☐ Trigger order confirmation through email.

