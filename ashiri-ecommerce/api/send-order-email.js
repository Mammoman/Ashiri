import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const data = req.body;
    // data contains: email, order_id, orders (array), cost (shipping, tax, total), customer_name, customer_phone, delivery_address, gift_note

    // Build the HTML email
    const orderItemsHtml = data.orders.map(item => `
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 16px; padding-bottom: 16px; border-bottom: 1px solid #eaeaea;">
        <tr>
          <td width="70" valign="top">
            <img src="${item.image_url}" alt="${item.name}" width="60" style="border-radius: 6px; display: block;" />
          </td>
          <td valign="top" style="padding-left: 16px;">
            <h4 style="margin: 0 0 6px 0; font-size: 15px; color: #111827; line-height: 1.4;">${item.name}</h4>
            <p style="margin: 0 0 6px 0; font-size: 13px; color: #6b7280; line-height: 1.4;">Quantity: ${item.units}</p>
            <p style="margin: 0; font-size: 14px; font-weight: 600; color: #111827; line-height: 1.4;">₦${item.price}</p>
          </td>
        </tr>
      </table>
    `).join('');

    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; width: 100%; background-color: #fbfbfb;">
        <div style="background-color: #111827; padding: 24px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 2px;">ÀṢHÍRÍ</h1>
        </div>
        
        <div style="background-color: #ffffff; padding: 24px 16px; border: 1px solid #eaeaea; border-top: none;">
          <h2 style="margin: 0 0 20px 0; color: #111827; font-size: 22px;">Thank You for Your Order!</h2>
          <p style="color: #4b5563; font-size: 15px; line-height: 1.6;">
            Hello <strong>${data.customer_name}</strong>,<br><br>
            Your order <strong>${data.order_id}</strong> has been confirmed and is currently being prepared. We will send you tracking information as soon as it ships.
          </p>

          ${data.gift_note ? `
          <div style="background-color: #f5f3ff; border: 1px solid #ddd6fe; padding: 12px; border-radius: 6px; margin: 24px 0;">
            <p style="margin: 0; color: #5b21b6; font-size: 14px; font-weight: 500;">
              ${data.gift_note}
            </p>
          </div>
          ` : ''}

          <div style="margin: 32px 0;">
            <h3 style="color: #111827; font-size: 16px; border-bottom: 2px solid #f3f4f6; padding-bottom: 8px;">Order Summary</h3>
            ${orderItemsHtml}
          </div>

          <div style="display: flex; justify-content: space-between; border-top: 2px solid #111827; padding-top: 16px; margin-top: 16px;">
            <strong style="color: #111827; font-size: 16px;">Order Total</strong>
            <strong style="color: #111827; font-size: 16px;">${data.cost.total}</strong>
          </div>

          <div style="margin-top: 32px; padding: 16px; background-color: #f9fafb; border-radius: 6px;">
            <h3 style="color: #111827; font-size: 14px; margin-top: 0;">Delivery Details</h3>
            <p style="margin: 0 0 4px 0; color: #4b5563; font-size: 14px;"><strong>Address:</strong> ${data.delivery_address}</p>
            <p style="margin: 0; color: #4b5563; font-size: 14px;"><strong>Phone:</strong> ${data.customer_phone}</p>
          </div>
          
          <p style="color: #6b7280; font-size: 13px; text-align: center; margin-top: 32px;">
            If you have any questions, reply to this email or contact us on WhatsApp.
          </p>
        </div>
      </div>
    `;

    const { data: resendData, error } = await resend.emails.send({
      from: 'Ashiri Orders <orders@contact.ashiri.store>',
      to: [data.email],
      bcc: ['ashirilifestyle.ng@gmail.com'],
      subject: `Order Confirmed ${data.order_id}!`,
      html: html,
    });

    if (error) {
      return res.status(400).json(error);
    }

    res.status(200).json(resendData);
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: error.message });
  }
}
