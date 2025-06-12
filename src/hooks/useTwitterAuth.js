import pkceChallenge from "pkce-challenge"
const twitterClientId = import.meta.env.VITE_TWITTER_CLIENT_ID

export default function useTwitterAuth() {
    const authenticate = async () => {
        const { code_verifier, code_challenge } =  await pkceChallenge()
        localStorage.setItem('code_verifier', code_verifier)

        const params = new URLSearchParams({
            response_type: 'code',
            client_id: twitterClientId,
            redirect_uri: 'https://nefrodzv23.ngrok.io/twitter/callback',
            scope: 'tweet.read users.read offline.access',
            state: 'Some random state',
            code_challenge: code_challenge,
            code_challenge_method: 'S256'
        })

        window.location.href  = `https://twitter.com/i/oauth2/authorize?${params.toString()}`
    }   

    return {
        authenticate
    }
}