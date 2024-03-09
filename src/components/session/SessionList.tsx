import { useState } from "react";
import { useGetPaginatedSessionsQuery } from "../../services/session";
import { StackedSkeleton } from "../ui/StackedSkeleton";
import { ErrorAlertWithNavigation } from "../ui/ErrorAlertWithNavigation";
import { SessionDisplay } from "./SessionDisplay";
import { VStack } from "@chakra-ui/react";
import { Role } from "../../utils/jwt-utils";
import { PageControls } from "../form/controls/PageControls";

interface SessionListProps {
    totalCount: number;
    roles: Role[];
}

export const SessionList = ({ totalCount, roles }: SessionListProps) => {
    const [pageSize, _] = useState(10)
    const [nextAt, setNextAt] = useState<number | undefined>(undefined)
    const {data: sessions, error: sessionsError} = useGetPaginatedSessionsQuery({ limit: pageSize, nextAt });

    const onPageChange = (newPage: number, totalPages: number) => {
        if(newPage <= 1) {
            setNextAt(undefined);
        } else if (newPage >= totalPages) {
            setNextAt((newPage-1)*pageSize);
        } else {
            setNextAt((newPage-1)*pageSize);
        }
    }

    return <>
        <ErrorAlertWithNavigation
            show={!!sessionsError}
            navigateTo="/user"
            description={`Cannot load sessions: ${JSON.stringify(sessionsError)}`}
        />
        {!sessions && <StackedSkeleton quantity={5} height="5vh"/>}
        {!!sessions && <>
            { sessions.entities.map( it => <SessionDisplay key={it.id} session={it} roles={roles}/>) }
            <PageControls pageSize={pageSize} totalCount={totalCount} onPageChange={onPageChange}/>
        </>
        }
    </>
}