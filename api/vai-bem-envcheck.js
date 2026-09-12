export default function handler(req, res) {
  return res.status(200).json({
    ai_gateway_key_present: Boolean(process.env.AI_GATEWAY_API_KEY),
    vercel_oidc_present: Boolean(process.env.VERCEL_OIDC_TOKEN),
    environment: process.env.VERCEL_ENV || null,
    branch: process.env.VERCEL_GIT_COMMIT_REF || null
  });
}
