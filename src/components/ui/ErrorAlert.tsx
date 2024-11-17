import { Alert, AlertDescription, AlertIcon, AlertTitle, LayoutProps } from '@chakra-ui/react'
import {ErrorInfo} from "../../models/error/ErrorInfo";

interface ErrorAlertProps extends LayoutProps {
	info: ErrorInfo
}

export const ErrorAlert = ({ info, ...style }: ErrorAlertProps) => {
	return (
		<Alert status="error" {...style}>
			<AlertIcon />
			<AlertTitle>{info.label}</AlertTitle>
			<AlertDescription>{JSON.stringify(info.reason)}</AlertDescription>
		</Alert>
	)
}
