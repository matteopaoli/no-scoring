'use client'

import { Button } from "@chakra-ui/react"

export default function TempMigrateButton() {
    const trigger = () => {
        fetch('/api/temp', { method: 'POST' })
    }
    
    return (
        <>
        <Button onClick={trigger}>NON CLICCARE</Button>
        </>
    )
}