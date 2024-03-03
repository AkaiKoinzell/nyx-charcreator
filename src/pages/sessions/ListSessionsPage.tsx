import { Center, Text, VStack } from "@chakra-ui/react"
import { useGetSessionsCountQuery } from "../../services/session"
import { ErrorAlertWithNavigation } from "../../components/ui/ErrorAlertWithNavigation"
import { SessionList } from "../../components/session/SessionList"
import { useAppSelector } from "../../hooks/redux"
import { roleSelector } from "../../store/auth/auth-slice"

export const ListSessionsPage = () => {
    const roles = useAppSelector(roleSelector);
    const { data: count, error: countError } = useGetSessionsCountQuery() 
    return <Center>
        <ErrorAlertWithNavigation
            show={!!countError}
            navigateTo="/user"
        />
        <VStack>
            <Text fontSize='5xl'>Registered Sessions</Text>
            {!!count && count.count > 0 && <SessionList totalCount={count.count} roles={roles}/>}
            {!!count && count.count === 0 && <Text fontSize='3xl'>No session registered in this server... yet.</Text>}
        </VStack>
    </Center>
}