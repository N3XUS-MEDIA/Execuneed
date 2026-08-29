# QA checklist

Support completes P1-S-032 against this list.

## Public

- [ ] Mobile 375 width: hero CTA visible without pinch
- [ ] Sticky WhatsApp does not cover submit on the form
- [ ] Keyboard can complete the lead form
- [ ] Enquiry checkbox required
- [ ] Marketing checkbox optional
- [ ] Footer disclaimer present
- [ ] Legal pages noindex while ALLOW_INDEXING=false
- [ ] No Discovery discount percentages on crawlable pages

## Admin

- [ ] Anonymous /admin redirects
- [ ] Lead created from form appears without refresh issues
- [ ] Marketing false still shows the lead
- [ ] Score badge matches CONTRACTS weights on sample fixtures

## Performance

- [ ] Public home LCP reasonable on simulated 4G
- [ ] No client financial sample data in analytics events
