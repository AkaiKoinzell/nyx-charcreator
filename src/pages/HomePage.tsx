import { Button, Container } from '@chakra-ui/react'
import axios from 'axios'
import { LoaderFunctionArgs, json, useLoaderData, useSearchParams } from 'react-router-dom'
import { JwtResponse } from '../models/auth/JwtResponse'
import { TokenProvider } from '../utils/TokenProvider'
import { useEffect } from 'react'

export function HomePage() {
    const userDetails = useLoaderData() as string | null
    const [, setSearchParams] = useSearchParams()

    useEffect(() => {
        setSearchParams({})
    }, [setSearchParams])

    return (
        <Container>
            {!userDetails && <Button onClick={openDiscordAuthWindow}>Login with discord</Button>}
            {userDetails && <p>{userDetails}</p>}
        </Container>
    )
}

export async function loader({ request }: LoaderFunctionArgs): Promise<Response> {
    const code = new URL(request.url).searchParams.get("code")
    if(!!code) {
        const response = await axios.post(
            `${process.env.REACT_APP_KAIRON_API_URL}/login/discord`,
            { code },
            { headers : { "Content-Type": "application/json" } }
        )
        if(response.status !== 200) {
            return json(null, {status: response.status})
        }
        const data = response.data as JwtResponse
        TokenProvider.getInstance(data)
    } 
    const token = await TokenProvider.getToken()
    if(!!token) {
        const response = await axios.get(
            `${process.env.REACT_APP_KAIRON_API_URL}/guild/current/member`,
            { headers: 
                {"Authorization": `Bearer ${token}` }
            } 
        )
        if (response.status === 200) {
            return json(JSON.stringify(response.data), {status: 200})
        }
        return json(null, {status: response.status})
    }
    return json(null, {status: 200})
}



function openDiscordAuthWindow() {
    window.open(
        "https://discord.com/api/oauth2/authorize?client_id=1049036547405647922&redirect_uri=http%3A%2F%2Flocalhost%3A3000&response_type=code&scope=identify%20guilds%20guilds.members.read",
        "_parent"
    )
}