import React from 'react'
import Card from '../../components/ui/Card'

const UsersPage = () => {
    return (
        <div>
            <Card>
                <h1 className="text-2xl font-semibold">Users</h1>
                <p className="text-sm text-[var(--muted)] mt-2">
                    Пользователи платформы: статус, подписка, устройства.
                </p>
            </Card>
        </div>
    )
}

export default UsersPage
