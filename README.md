# Pandurang Pratishthan NGO Website

A production-ready static website for **Pandurang Pratishthan**, an NGO focused on education support, environment work, village cleaning, social awareness, and rural development.

## Live Link

Add Vercel URL here:

`https://your-vercel-project.vercel.app/`

## Features

- Responsive mobile-first layout
- Sticky navigation with active section highlighting
- Emotional hero section and mission statement
- About, vision, mission, founder/team, and trust details
- Causes/work area cards
- Donation form with amount selection and custom amount
- Razorpay payment link/button placeholder
- UPI QR and bank transfer placeholders
- Volunteer and contact forms with validation
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
├── assets/
│   └── images/
│       ├── logo.png
│       ├── education.jpg
│       ├── environment.jpg
│       └── village-cleaning.jpg
├── README.md
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

In `index.html`, search for:

```html
RAZORPAY INTEGRATION PLACEHOLDER
```

You can either:

- Paste the official Razorpay Payment Button script there.
- Replace the placeholder link with a Razorpay Payment Link.

In `script.js`, update:

```js
razorpayPaymentLink: "ADD_RAZORPAY_PAYMENT_LINK"
```

## Form Integration

The forms currently validate data and save a local browser backup if no API endpoint is configured.

To connect Formspree or Google Apps Script, update this value in `script.js`:

```js
formEndpoint: "ADD_FORMSPREE_OR_GOOGLE_APPS_SCRIPT_ENDPOINT"
```

To connect EmailJS, add the EmailJS browser SDK to `index.html`, then update:

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
8. Deploy.

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
