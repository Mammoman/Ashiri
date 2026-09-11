import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const data = req.body;
    // data contains: email, order_id, status, customer_name

    let title, message, footerMessage;
    if (data.status === 'shipped') {
      title = 'Your order is on the way!';
      message = `Great news! We are writing to let you know that your order <strong>${data.order_id}</strong> has been shipped and is on its way to you.`;
      footerMessage = 'Our logistics partner will contact you shortly if they require further details. Thank you for shopping with Ashiri!';
    } else {
      title = 'Your order has been delivered!';
      message = `Great news! We are writing to let you know that the status of your order <strong>${data.order_id}</strong> has been updated to <strong>delivered</strong>.`;
      footerMessage = 'Thank you, and we hope you love Ashiri!';
    }

    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fbfbfb;">
        <div style="background-color: #111827; padding: 24px; border-radius: 8px 8px 0 0; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 2px;">ÀṢHÍRÍ</h1>
        </div>
        
        <div style="background-color: #ffffff; padding: 32px; border-radius: 0 0 8px 8px; border: 1px solid #eaeaea; border-top: none;">
          <h2 style="margin-top: 0; color: #111827; font-size: 20px;">Order Update</h2>
          <p style="color: #4b5563; font-size: 15px; line-height: 1.6;">
            Hello <strong>${data.customer_name}</strong>,<br><br>
            ${message}
          </p>

          <div style="margin: 32px 0; padding: 20px; background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 6px; text-align: center;">
            <strong style="color: #166534; font-size: 16px;">${title}</strong>
          </div>
          
          <p style="color: #4b5563; font-size: 15px; line-height: 1.6;">
            ${footerMessage}
          </p>
        </div>
      </div>
    `;

    const { data: resendData, error } = await resend.emails.send({
      from: 'Ashiri Updates <orders@contact.ashiri.store>',
      to: [data.email],
      subject: `Update on your Ashiri Order ${data.order_id}!`,
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
