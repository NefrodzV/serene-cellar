export default function useGoogleAuth() {
    const onSuccess = async ({credential}) => {

        try {
            const response  = await fetch(sereneCellarApiUrl + "/auth/google", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }, 
                body: JSON.stringify({idToken: credential})
            })

            if(!response.ok) {
                console.error('Network response not ok')
                return await response.json()
            }

            const data = await response.json()
            console.log('Google user authenticated :', data)

            
        } catch(error) {
             console.error(error)
        }

    }

    const onError = error => {
        console.error('Google login failed: ', error)
    }

    return {
        onSuccess,
        onError
    }
}