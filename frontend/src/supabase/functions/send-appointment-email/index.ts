import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get the appointment data from the request
    const { record } = await req.json()

    // Create email content with HTML formatting
    const htmlContent = `
      <h2>New Appointment Request</h2>

      <h3>Patient Details:</h3>
      <ul>
        <li><strong>Name:</strong> ${record.patient_name}</li>
        <li><strong>Email:</strong> ${record.email}</li>
        <li><strong>Phone:</strong> ${record.phone}</li>
      </ul>

      <h3>Appointment Details:</h3>
      <ul>
        <li><strong>Service:</strong> ${record.service}</li>
        <li><strong>Preferred Date:</strong> ${record.preferred_date}</li>
        <li><strong>Preferred Time:</strong> ${record.preferred_time}</li>
      </ul>

      <h3>Payment Details:</h3>
      <ul>
        <li><strong>Reference Number:</strong> ${record.payment_reference}</li>
        <li><strong>Payment Proof:</strong> <a href="${record.payment_proof}">View Payment Proof</a></li>
      </ul>

      <h3>Additional Message:</h3>
      <p>${record.message || 'No message provided'}</p>
    `

    // Send email using Resend
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer re_MsNA5E2S_AXwezfYZAsZxxxEF6BV9Sduc',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Appointment System <appointments@slimexpert.pk>',
        to: ['drmaaz@hotmail.com'],
        subject: `New Appointment Request - ${record.patient_name}`,
        html: htmlContent,
        text: htmlContent.replace(/<[^>]*>/g, ''), // Strip HTML for plain text version
        reply_to: record.email, // Add reply-to field with patient's email
      }),
    })

    if (!emailResponse.ok) {
      const errorData = await emailResponse.json()
      throw new Error(`Failed to send email: ${JSON.stringify(errorData)}`)
    }

    // Send confirmation email to patient
    const confirmationHtml = `
      <h2>Appointment Request Received</h2>
      <p>Dear ${record.patient_name},</p>
      
      <p>We have received your appointment request. Here are the details:</p>
      
      <h3>Appointment Details:</h3>
      <ul>
        <li><strong>Service:</strong> ${record.service}</li>
        <li><strong>Preferred Date:</strong> ${record.preferred_date}</li>
        <li><strong>Preferred Time:</strong> ${record.preferred_time}</li>
      </ul>
      
      <p>We will review your payment proof and contact you shortly to confirm your appointment.</p>
      
      <p>Best regards,<br>Prof Dr. Maaz Ul Hassan's Office</p>
    `

    const confirmationResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer re_MsNA5E2S_AXwezfYZAsZxxxEF6BV9Sduc',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Appointment System <appointments@slimexpert.pk>',
        to: [record.email],
        subject: 'Appointment Request Received - Prof Dr. Maaz Ul Hassan',
        html: confirmationHtml,
        text: confirmationHtml.replace(/<[^>]*>/g, ''),
      }),
    })

    if (!confirmationResponse.ok) {
      console.error('Failed to send confirmation email to patient')
    }

    return new Response(
      JSON.stringify({ message: 'Email sent successfully' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error sending email:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})