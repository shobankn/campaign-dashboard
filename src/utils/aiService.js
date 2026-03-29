export async function generateCreativeBrief(formData) {
  await new Promise(r => setTimeout(r, 2200))

  const { client, campaign, creative } = formData

  return {
    campaignTitle: `${client.name} — ${campaign.objective === 'awareness' ? 'Breakthrough' : campaign.objective === 'consideration' ? 'Engage & Convert' : 'Performance Max'} ${new Date().getFullYear()}`,
    headlines: [
      `${client.name}: Where ${client.industry} Meets Innovation`,
      `Experience the Future of ${client.industry} — Only with ${client.name}`,
      `Don't Just Browse. Transform. ${client.name} Starts Here.`,
    ],
    toneGuide: `${creative.tone.charAt(0).toUpperCase() + creative.tone.slice(1)} and ${
      creative.tone === 'professional' ? 'authoritative, conveying trust and expertise' :
      creative.tone === 'playful' ? 'energetic, using humor to disarm and delight' :
      creative.tone === 'bold' ? 'direct and confident, never apologising for ambition' :
      'warm and approachable, focusing on human connection'
    }. All copy should reinforce the brand's core promise without relying on superlatives.`,
    channels: [
      { name: 'Meta (Instagram + Facebook)', allocation: 35, reason: 'Highest CPM efficiency for visual storytelling' },
      { name: 'Google Search', allocation: 25, reason: 'Captures high-intent demand at the bottom of funnel' },
      { name: 'YouTube / Connected TV', allocation: 20, reason: 'Premium video placement for brand-building' },
      { name: 'TikTok', allocation: 12, reason: 'Audience-native short-form for awareness lift' },
      { name: 'Programmatic Display', allocation: 8, reason: 'Retargeting and reach extension' },
    ],
    visualDirection: `Hero imagery should lead with ${creative.imageryStyle || 'clean, lifestyle-driven'} photography — ${
      creative.colorDirection ? `using a palette anchored in ${creative.colorDirection}` : 'high contrast with brand color as accent'
    }. Avoid stock-photo clichés. Prioritise authentic human moments that reflect the target audience's aspirations, not their demographics. Motion assets should use a 1.2s reveal with subtle scale animation.`,
    dosAndDonts: {
      dos: creative.dos ? creative.dos.split(',').map(s => s.trim()).filter(Boolean) : ['Use aspirational, outcome-driven language', 'Keep headlines under 8 words', 'Lead with the benefit, not the feature'],
      donts: creative.donts ? creative.donts.split(',').map(s => s.trim()).filter(Boolean) : ['Avoid jargon or technical claims', 'Do not use fear-based messaging', 'Never crowd the visual with copy'],
    },
  }
}
