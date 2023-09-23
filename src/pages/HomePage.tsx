import { Button, Container } from "@chakra-ui/react";

export const HomePage = () => {
    return (
        <Container>
            {!false && (
                <Button onClick={openDiscordAuthWindow}>
                    Login with discord
                </Button>
            )}
            {false && <p>{"test"}</p>}
        </Container>
    );
};

function openDiscordAuthWindow() {
    window.open(
        "https://discord.com/api/oauth2/authorize?client_id=1049036547405647922&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth&response_type=code&scope=identify%20guilds.members.read",
        "_parent"
    );
}
