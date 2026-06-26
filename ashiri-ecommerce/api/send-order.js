import { Resend } from 'resend';
import fs from 'fs';
import path from 'path';

// Vercel loads environment variables from Settings automatically
const resend = new Resend(process.env.RESEND_API_KEY || 're_mock_key');

// Local storage helper (works during local development)
const saveOrderLocally = (orderData) => {
  try {
    const filePath = path.join(process.cwd(), 'orders.json');
    let orders = [];
    if (fs.existsSync(filePath)) {
      const fileData = fs.readFileSync(filePath, 'utf8');
      orders = JSON.parse(fileData || '[]');
    }
    orders.push({
      id: 'ASH-ORD-' + Math.floor(Math.random() * 10000000 + 1),
      createdAt: new Date().toISOString(),
      ...orderData
    });
    fs.writeFileSync(filePath, JSON.stringify(orders, null, 2), 'utf8');
    console.log('Order successfully saved locally to orders.json');
    return true;
  } catch (error) {
    console.error('Error saving order locally:', error);
    return false;
  }
};

export default async function handler(req, res) {
  // CORS configuration if needed
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { cartItems, customerEmail, customerName, customerAddress, subtotal, paymentMethod, paymentReference } = req.body;

    if (!customerEmail || !cartItems || cartItems.length === 0) {
      return res.status(400).json({ message: 'Missing required checkout information.' });
    }

    const method = paymentMethod || 'Pay on Delivery';
    const reference = paymentReference || 'N/A';
    let verificationStatus = 'Pending Verification';
    let isVerified = false;

    if (method === 'Paystack' && reference && reference !== 'N/A') {
      if (process.env.PAYSTACK_SECRET_KEY) {
        try {
          const paystackRes = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
            headers: {
              Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
              'Content-Type': 'application/json'
            }
          });
          const paystackData = await paystackRes.json();
          if (paystackData.status && paystackData.data && paystackData.data.status === 'success') {
            const paidAmountKobo = paystackData.data.amount;
            const expectedAmountKobo = subtotal * 100;
            if (Math.abs(paidAmountKobo - expectedAmountKobo) < 100) {
              verificationStatus = 'Paid & Confirmed (Verified on Server)';
              isVerified = true;
            } else {
              verificationStatus = `Unverified: Amount mismatch (Paid: ₦${(paidAmountKobo / 100).toLocaleString()}, Expected: ₦${subtotal.toLocaleString()})`;
            }
          } else {
            verificationStatus = `Unverified: Paystack status is '${paystackData.data?.status || 'unknown'}'`;
          }
        } catch (verifyError) {
          console.error('Paystack transaction verification failed:', verifyError);
          verificationStatus = 'Verified on client, server check failed';
        }
      } else {
        verificationStatus = 'Paid & Confirmed (Sandbox Mode)';
        isVerified = true;
      }
    } else {
      verificationStatus = 'Pending (Pay on Delivery)';
    }

    // Format products list into a clean HTML table
    const itemsHtml = cartItems.map(item => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
          <strong style="color: #111827; font-size: 0.9rem;">${item.name}</strong><br/>
          <span style="color: #6b7280; font-size: 0.8rem;">Size: ${item.selectedSize}</span>
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; color: #4b5563; font-size: 0.85rem;">x${item.quantity}</td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; color: #111827; font-weight: 600; text-align: right; font-size: 0.85rem;">₦${(item.price * item.quantity).toLocaleString()}</td>
      </tr>
    `).join('');

    // Dispatches order email via Resend
    // By default, before domain verification, Resend free accounts can only send to their own verified email.
    // However, it is fully configured to send to both.
    let emailSent = false;
    let emailId = null;
    let emailErrorMsg = null;

    try {
      const fromEmail = process.env.RESEND_FROM_EMAIL || 'Ashiri Atelier <onboarding@resend.dev>';
      const merchantEmail = process.env.MERCHANT_EMAIL || 'taiwoetti5@gmail.com';
      
      let recipient = customerEmail;
      let emailSubject = `Your Ashiri Order Confirmation - ₦${subtotal.toLocaleString()}`;
      let bccList = undefined;

      // If using Resend sandbox domain, restrict recipient to the verified merchant email to avoid Resend API errors
      if (fromEmail.includes('onboarding@resend.dev')) {
        recipient = merchantEmail;
        emailSubject = `[Sandbox - For: ${customerEmail}] Your Ashiri Order Confirmation - ₦${subtotal.toLocaleString()}`;
        console.log(`Resend in sandbox mode. Redirecting recipient from ${customerEmail} to verified email ${merchantEmail} for testing.`);
      } else if (process.env.MERCHANT_EMAIL) {
        bccList = [process.env.MERCHANT_EMAIL];
      }

      const emailResponse = await resend.emails.send({
        from: fromEmail,
        to: [recipient],
        bcc: bccList,
        subject: emailSubject,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 580px; margin: 0 auto; padding: 20px; color: #1f2937; line-height: 1.6;">
            <div style="text-align: center; padding: 20px 0; border-bottom: 1px solid #e5e7eb;">
              <h1 style="margin: 0; font-size: 1.8rem; letter-spacing: -0.03em; color: #111827;">ASHIRI</h1>
              <span style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; color: #6b7280;">Order Receipt</span>
            </div>

            <div style="padding: 24px 0;">
              <p style="font-size: 0.95rem; margin-bottom: 8px;">Hello <strong>${customerName}</strong>,</p>
              <p style="font-size: 0.95rem; color: #4b5563; margin-top: 0;">Thank you for shopping at Ashiri. Your order has been registered and is currently being processed at our atelier.</p>
            </div>

            <div style="background: #f9fafb; padding: 16px; border-radius: 8px; margin-bottom: 24px; display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
              <div style="padding-right: 12px; border-right: 1px solid #e5e7eb;">
                <h3 style="margin: 0 0 10px 0; font-size: 0.85rem; text-transform: uppercase; color: #111827;">Delivery Address</h3>
                <p style="margin: 0; font-size: 0.85rem; color: #4b5563; line-height: 1.4;">${customerAddress}</p>
              </div>
              <div style="padding-left: 12px;">
                <h3 style="margin: 0 0 10px 0; font-size: 0.85rem; text-transform: uppercase; color: #111827;">Payment Information</h3>
                <p style="margin: 0; font-size: 0.85rem; color: #4b5563; line-height: 1.4;">
                  <strong>Method:</strong> ${method}<br/>
                  <strong>Reference:</strong> ${reference}<br/>
                  <strong>Status:</strong> <span style="color: ${isVerified ? '#10b981' : '#f59e0b'}; font-weight: 600;">${verificationStatus}</span>
                </p>
              </div>
            </div>

            <h3 style="font-size: 0.85rem; text-transform: uppercase; color: #111827; margin: 0 0 10px 0; border-bottom: 1px solid #e5e7eb; padding-bottom: 6px;">Order Summary</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>

            <div style="padding-top: 20px; border-top: 2px solid #111827; margin-top: 10px;">
              <div style="display: flex; justify-content: space-between; font-weight: 700; font-size: 1rem; color: #111827; text-align: right;">
                <span style="margin-right: 20px;">Total:</span>
                <span>₦${subtotal.toLocaleString()}</span>
              </div>
            </div>

            <div style="text-align: center; padding-top: 40px; border-top: 1px solid #e5e7eb; margin-top: 40px; color: #9ca3af; font-size: 0.75rem;">
              <p>&copy; ${new Date().getFullYear()} ASHIRI. All rights reserved.</p>
              <p style="font-style: italic;">Complimentary luxury gift wrapping included.</p>
            </div>
          </div>
        `
      });

      if (emailResponse && emailResponse.error) {
        console.error('Resend API returned error:', emailResponse.error);
        emailErrorMsg = typeof emailResponse.error === 'object' ? JSON.stringify(emailResponse.error) : emailResponse.error.message || String(emailResponse.error);
      } else {
        emailSent = true;
        emailId = emailResponse?.data?.id || emailResponse?.id || 'ok';
      }
    } catch (err) {
      console.error('Failed to send email via Resend:', err);
      emailErrorMsg = err.message || String(err);
    }

    // 1. Save locally to orders.json in local development mode
    if (process.env.NODE_ENV === 'development' || !process.env.VERCEL) {
      saveOrderLocally({
        customerName,
        customerEmail,
        customerAddress,
        subtotal,
        paymentMethod: method,
        paymentReference: reference,
        verificationStatus,
        cartItems
      });
    }

    // 2. Post to Supabase REST endpoint if configured
    if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
      try {
        await fetch(`${process.env.SUPABASE_URL}/rest/v1/orders`, {
          method: 'POST',
          headers: {
            apikey: process.env.SUPABASE_ANON_KEY,
            Authorization: `Bearer ${process.env.SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
            Prefer: 'return=minimal'
          },
          body: JSON.stringify({
            customer_name: customerName,
            customer_email: customerEmail,
            customer_address: customerAddress,
            subtotal: subtotal,
            payment_method: method,
            payment_reference: reference,
            cart_items: JSON.stringify(cartItems),
            created_at: new Date().toISOString()
          })
        });
        console.log('Order successfully synced to Supabase database.');
      } catch (dbErr) {
        console.error('Failed to post order to Supabase:', dbErr);
      }
    }

    return res.status(200).json({ 
      success: true, 
      emailSent, 
      id: emailId, 
      warning: emailErrorMsg ? `Order registered, email not sent: ${emailErrorMsg}` : null 
    });
  } catch (error) {
    console.error('Serverless order mail error:', error);
    return res.status(500).json({ success: false, message: 'Failed to process order.', error: error.message });
  }
}
