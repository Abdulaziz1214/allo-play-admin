import React from 'react'
import Card from '../../components/ui/Card'

const SeriesPage = () => {
    return (
        <div>
            <Card>
                <h1 className="text-2xl font-semibold">Series</h1>
                <p className="text-sm text-[var(--muted)] mt-2">
                    Управление сериалами, сезонами и эпизодами.
                </p>
            </Card>
        </div>
    )
}

export default SeriesPage
