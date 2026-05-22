# Pandurang Pratishthan NGO Website

A production-ready static website for **Pandurang Pratishthan**, an NGO focused on education support, environment work, village cleaning, social awareness, and rural development.

The website uses the logo motto **तेजोमय भवितव्याकडे** as a subtle brand accent.

## Live Link

Add Vercel URL here:

`https://your-vercel-project.vercel.app/`

## Features

- Responsive mobile-first layout
- Sticky navigation with active section highlighting
- Emotional hero section and mission statement
- Marathi motto and selected Marathi value quotes
- About, vision, mission, founder/team, and trust details
- Causes/work area cards
- Donation form with amount selection and custom amount
- Secure Razorpay checkout through Vercel serverless API routes
- Razorpay order creation and payment signature verification
- UPI QR and bank transfer placeholders
- Volunteer and contact forms connected to FormSubmit
- Loading states and success/error messages
- localStorage backup when no form API is configured
- WhatsApp click-to-chat integration
- Gallery filters
- Impact timeline, before/after cards, and testimonials
- SEO meta tags and Open Graph tags
- Vercel and GitHub Pages friendly static files

## Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript
- Font Awesome icons via CDN

## Project Structure

```text
.
├── index.html
├── style.css
├── script.js
├── api/
│   ├── create-order.js
│   └── verify-payment.js
├── assets/
│   └── images/
│       ├── logo.png
│       ├── education.jpg
│       ├── environment.jpg
│       └── village-cleaning.jpg
├── README.md
├── package.json
├── vercel.json
├── .env.example
└── .gitignore
```

## Setup

1. Clone or download the repository.
2. Open `index.html` in a browser.
3. Update placeholders in `index.html` and `script.js`.
4. Deploy on Vercel with no build command, or deploy to GitHub Pages from the repository settings.

No build step is required.

## Required Placeholder Updates Before Launch

Update these values with verified organization details:

- NGO Registration No
- PAN
- 80G No
- FCRA status
- Founder/team names
- Phone number
- Email address
- Office address
- Social media links
- Bank transfer details
- UPI ID and QR image
- Google Maps iframe
- Testimonials
- Real impact numbers, if different from placeholders

## Razorpay Integration

This project uses Vercel serverless API routes so Razorpay secret keys are never exposed in browser code.

Required Vercel environment variables:

```bash
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

Files used:

- `api/create-order.js` creates the Razorpay order securely.
- `api/verify-payment.js` verifies the Razorpay payment signature.
- `script.js` opens Razorpay Checkout and calls the verification API.

For local payment testing with Vercel CLI:

```bash
npm i -g vercel
vercel dev
```

Create a local `.env` file using `.env.example` as a reference. Do not commit `.env`.

## Form Integration

Volunteer and contact forms submit to:

`akash.gita.bhagwat@gmail.com`

They use FormSubmit's AJAX endpoint:

```js
formEndpoint: "https://formsubmit.co/ajax/akash.gita.bhagwat@gmail.com"
```

Important: the first FormSubmit email may require inbox verification before submissions are delivered.

The JavaScript still keeps a local browser backup if the online submission fails.

To switch to Formspree or Google Apps Script later, replace `formEndpoint` in `script.js`.

EmailJS placeholders are still available in `script.js` if the project later moves to EmailJS:

```js
serviceId: "ADD_EMAILJS_SERVICE_ID"
templateId: "ADD_EMAILJS_TEMPLATE_ID"
publicKey: "ADD_EMAILJS_PUBLIC_KEY"
```

## WhatsApp Integration

In `script.js`, replace:

```js
whatsappNumber: "910000000000"
```

Use the country code and phone number without `+`, spaces, or dashes.

## Google Maps

In `index.html`, search for:

```html
GOOGLE MAPS PLACEHOLDER
```

Replace the placeholder block with the iframe embed copied from Google Maps.

## Vercel Deployment

### Option 1: Vercel Dashboard

1. Push this repository to GitHub.
2. Open [Vercel](https://vercel.com/).
3. Select `Add New Project`.
4. Import this repository.
5. Keep the framework preset as `Other`.
6. Leave the build command empty.
7. Leave the output directory empty.
8. Add `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` in project environment variables.
9. Deploy.

### Option 2: Vercel CLI

```bash
npm i -g vercel
vercel
vercel --prod
```

The included `vercel.json` sets clean URLs, static asset caching, and basic security headers.

## GitHub Pages Deployment

1. Push this repository to GitHub.
2. Go to repository `Settings`.
3. Open `Pages`.
4. Select the branch, usually `main`.
5. Select `/root` as the source folder.
6. Save and wait for the live URL.

## Legal Note

Donation, tax exemption, FCRA, and registration information must be verified by Pandurang Pratishthan before publishing or accepting donations.
