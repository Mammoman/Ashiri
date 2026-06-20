import { Resend } from 'resend';

// Vercel loads environment variables from Settings automatically
const resend = new Resend(process.env.RESEND_API_KEY || 're_mock_key');

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
    const { cartItems, customerEmail, customerName, customerAddress, subtotal } = req.body;

    if (!customerEmail || !cartItems || cartItems.length === 0) {
      return res.status(400).json({ message: 'Missing required checkout information.' });
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
    const emailResponse = await resend.emails.send({
      from: 'Ashiri Atelier <onboarding@resend.dev>', // Free default sandbox email
      to: [customerEmail],
      subject: `Your Ashiri Order Confirmation - ₦${subtotal.toLocaleString()}`,
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

          <div style="background: #f9fafb; padding: 16px; border-radius: 8px; margin-bottom: 24px;">
            <h3 style="margin: 0 0 10px 0; font-size: 0.85rem; text-transform: uppercase; color: #111827;">Delivery Address</h3>
            <p style="margin: 0; font-size: 0.85rem; color: #4b5563; line-height: 1.4;">${customerAddress}</p>
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

    return res.status(200).json({ success: true, id: emailResponse.id });
  } catch (error) {
    console.error('Serverless order mail error:', error);
    return res.status(500).json({ success: false, message: 'Failed to send checkout email.', error: error.message });
  }
}
